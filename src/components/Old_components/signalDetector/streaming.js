import {printHzUnit} from "../../lib/esutil";
import {encodeData, decodeData, encodeCmd, decodeCmd} from "./deser";
import EsAuth from '../auth/auth';

import { WebRTCConnection } from './webrtc'
import { Signaling } from './signaling'
import * as _ from "lodash/lodash";

import EsLeafletMap from '../es-leaflet-map/es-leaflet-map';

import { SignalDetector } from './signalDetector'

import tabs from 'angular-ui-bootstrap/src/tabs';

import './streaming.css';

// polyfills and compatibility for WebRTC
import adapter from 'webrtc-adapter';

/**
 * Manages spectrum decoding interface
 */
class StreamingController {
    constructor($scope, $window, esAuth, esApiService) {
        console.log("WebRTC compatibility adapter", adapter.browserDetails.browser);

        this.$scope = $scope;
        this.$window = $window;
        this.esApiService = esApiService;
        this.hoverFreq = null;
        this.selectedFreq = 101000000;
        this.antennaGain = 44;
        this.esAuth = esAuth;
        // count number of failed auth retries
        this.authRetries = 0;

        this.error = null;

        this.showWaterfall = true;
        this.selectedSensor = null;

        // Signaling server states
        this.signalingStatus = "connecting";

        // WebRTC/Sensor connection states
        this.webrtcStatus = "disconnected";

        // Stores a list of all sensor ids
        this.sensors = [];
        // Stores a map of sensorId -> sensorStatus
        // sensorStatus: [offline, ready, clientConnected, campaignRunning]
        this.sensorStates = new Map();
        this.coins = 1;
        this.joinedSensorInfo = null;

        this.selectedDecoder = 1;
        this.decoderSettings = null;

        this.fmDecoderSettings = {gain: 8000};
        this.amDecoderSettings = {gain: 8000};
        this.volumeSliderVal = 8;
        $scope.$watch("$ctrl.volumeSliderVal", () => {
            this.fmDecoderSettings.gain = this.volumeSliderVal === 0 ? 0 : 12 * Math.exp(0.69077 * this.volumeSliderVal);
            this.amDecoderSettings.gain = this.volumeSliderVal === 0 ? 0 : 12 * Math.exp(0.69077 * this.volumeSliderVal);
        });

        this.controlsEnabled = true;

        this.searchValue = null;

        $scope.$watch('$ctrl.selectedFreq', () => {
            this.retune()
        });

        this.acarsMsgs = [];
        this.lteMsgs = [];
        this.lteResults = [];

        // debounced retune to prevent too many commands being sent to the server
        this.retune = _.debounce(() => {
            // console.log("Tuning to " + printHzUnit(this.selectedFreq, 6));

            this.signalDetector.emptyData();

            if (!this.webrtcconnection) return;

            // send cmd to sensor directly and signaling server for analysis
            let cmd = {
                "target": "es_sensor",
                "gain": this.antennaGain,
                "decoder": this.selectedDecoder,
                "decoder_settings": this.decoderSettings,
                fs: 2400000,
                fc: this.selectedFreq
            };
            this.webrtcconnection.send(encodeCmd(cmd));
            this.signaling.send({"fn": "clientEvent", "sensorId": this.webrtcconnection.sensorId, "data": cmd});
        }, 10);

        // Load list of sensors and start signaling
        this.esApiService.getSensors().then(sensors => {
            this.sensorInfo = {};
            sensors.data.forEach(si => this.sensorInfo[si.serial] = si);
            this.initializeSignaling()
        });

        // Initialize SignalDetector
        this.signalDetector = new SignalDetector();
        this.detectedSignals = [];
        this.detectedSignalsBoxes = [];

        this.sliderWidth = 0;
        // this.adjustChartWidth();
        this.onResize();
        window.addEventListener("resize", () => this.onResize());
    }

    onResize() {
        // this.chart.reflow();
        this.adjustChartWidth();
    }

    adjustChartWidth() {
        this.waterfallPlotSliderContainer = document.getElementById("es-waterfall-slider-container");
        if (this.waterfallPlotSliderContainer) {
            this.sliderWidth = this.waterfallPlotSliderContainer.offsetWidth;
            console.log('sliderWidth', this.sliderWidth);
        }
    }

    joinSensorInfo() {
        Object.keys(this.sensorInfo).forEach(serial => {
            this.sensorInfo[serial].rtcStatus = this.sensorStates.get(String(serial));
        });

        // console.log("Updating");
        this.$scope.$apply(() => this.joinedSensorInfo = Object.values(this.sensorInfo));
    }

    initializeSignaling() {
        this.signaling = new Signaling(this.esAuth.jwt, this.esApiService);
        this.signaling.onAuthenticationFailed = () => {
            if (++this.authRetries > 3) {
                if (this.authRetries === 4) console.error("Maximum auth retries reached, giving up");
                return;
            }
            // FIXME alert user if max retries reached
            console.warn(`Authentication failed, fetching token and retrying (${this.authRetries}/3)`);
            this.esAuth.refresh().then((t) => this.signaling.authenticate(this.esAuth.jwt));
        };

        this.signaling.onSensors = (sensors) => {
            this.sensors = Object.keys(sensors);
            this.sensorStates = new Map(Object.entries(sensors));
            this.joinSensorInfo();
            this.$scope.$apply()
        };
        this.signaling.onSensorStatus = (msg) => {
            if(this.sensors.indexOf(msg['sensorId']) < 0) {
                this.sensors.push(msg['sensorId']);
            }
            this.sensorStates.set(msg['sensorId'], msg['status']);
            this.joinSensorInfo();
            this.$scope.$apply();
        };
        this.signaling.onCoinsReport = (coins) => {
            this.coins = coins;
            this.$scope.$apply();
        };
        this.signaling.onConnected = () => {
            this.signalingStatus = "connected";
            this.$scope.$apply();
        };
        this.signaling.onDisconnected = () => {
            this.signalingStatus = "disconnected";
            this.sensors = [];
            this.sensorStates = new Map();
            this.joinSensorInfo();
            this.$scope.$apply();
        };
        this.signaling.onConnectionClose = () => {
            this.error = "Session has been closed by server";
            this.webrtcconnection.closeDataChannel();
            this.webrtcStatus = "disconnected";
        };
        this.signaling.onConnectionDeclined = () => {
            this.webrtcStatus = "disconnected";
            this.error ="Could not connect to sensor";
            this.$scope.$apply();
        };
        this.signalingStatus = "connecting";

        this.$window.onbeforeunload = () => this.close();
        this.$scope.$on('$destroy', () => this.close());

        this.signaling.connect();
        this.webrtcconnection = new WebRTCConnection(this.signaling);
        this.webrtcconnection.onDataChannelMessage = (msg) => this.dataMsg(msg);
        this.webrtcconnection.onDataChannelOpen = () => {
            this.webrtcStatus = "connected";
            this.retune();
            this.$scope.$apply();
            this.onResize();
        };
        this.webrtcconnection.onDataChannelClosed = () => {
            this.webrtcStatus = "disconnected";
        };
        this.webrtcconnection.onError = err => {
            // ignore DNS lookup error/warning
            if (err != null && (
                (err.errorText != null && err.errorText === "TURN host lookup received error.") ||
                (err.error != null && err.error.code === 0)
            )) {
                return;
            }

            this.error ="Error in sensor connection";
            console.log("WebRTC connection error", err);
            this.webrtcStatus = "disconnected";
        };
        // Set the audio element once the tab is loaded
        this.setAudioElement('audio')
    }

    connectToSignalingServer() {
        this.signaling.connect();
    }

    connectToSensor(sensorId) {
        this.error = null;
        sensorId = String(sensorId);

        // console.log("Connecting to sensor", sensorId);
        if (this.selectedSensor !== sensorId) {
            // clear plot
            this.$scope.$broadcast('clearWaterfall');
        }
        this.selectedSensor = sensorId;
        this.webrtcStatus = "connecting";
        this.connectTs = new Date();
        this.webrtcconnection.connectToSensor(sensorId);

        let si = this.joinedSensorInfo.find(si => String(si.serial) === sensorId);
        if (si != null && si.position != null) {
            this.$scope.$broadcast('panTo', [si.position.latitude, si.position.longitude]);
        }
    }

    connectToSensorName(name) {
        let serials = this.joinedSensorInfo.filter(i => i.name === name).map(i => i.serial);
        if (serials.length === 0) {
            return;
        }

        this.connectToSensor(serials[0])
    }

    // store(d) {
    //     var s = window.localStorage.getItem("data");
    //     if (!s) {
    //         s = [];
    //     } else {
    //         s = JSON.parse(s);
    //     }
    //     if (s.length < 100) {
    //         s.push(d);
    //         window.localStorage.setItem("data", JSON.stringify(s));
    //     }
    // }

    /**
     * Check message type and broadcast to components
     * TODO fix hacky design
     * @param msg
     */
    dataMsg(msg) {
        decodeData(msg).then(x => {
            switch (x.id) {
                case 1:
                    // catch time for first data arrival
                    if (this.connectTs != null) {
                        // console.log("Connection time", new Date() - this.connectTs);
                        this.connectTs = null;
                    }

                    this.$scope.$broadcast('psdData', { data: x });
                    // this.store({data: x});
                    // console.log(this.detectedSignals);
                    this.signalDetector.addData(x.payload.data);
                    if(this.signalDetector.canProcess()) {
                        this.detectedSignals = this.signalDetector.process(x.payload.minFreq, x.payload.maxFreq);
                        const width = x.payload.maxFreq - x.payload.minFreq;
                        const m = this.detectedSignals.map(s => {
                            return ((s - x.payload.minFreq) / width);
                        }).reduce((arr, v) => {
                            v = v * 100;
                            if (arr.length) {
                                if (arr[arr.length-1].length < 2) {
                                    const v1 = arr[arr.length-1][0];
                                    arr[arr.length-1].push(v - v1); // push the width in %
                                    const ghz = (Math.floor(((v - v1) * width) / 1000000000) / 100);
                                    if (ghz > 1) {
                                        arr[arr.length-1].push(ghz); // push the bandwidth for the box label
                                        arr[arr.length-1].push('GHz'); // push the unit for the box label
                                    } else {
                                        const mhz = (Math.floor(((v - v1) * width) / 1000000) / 100); // push percent of range to get bandwidth (box width in MHz)
                                        if (mhz > 1) {
                                            arr[arr.length-1].push(mhz); // push the bandwidth for the box label
                                            arr[arr.length-1].push('MHz'); // push the unit for the box label
                                        } else {
                                            const khz = (Math.floor(((v - v1) * width) / 1000) / 100);
                                            arr[arr.length-1].push(khz); // push the bandwidth for the box label
                                            arr[arr.length-1].push('kHz'); // push the unit for the box label
                                        }
                                    }
                                } else {
                                    arr.push([v]);
                                }
                            } else {
                                arr.push([v]);
                            }
                            return arr;
                        }, []);
                        this.detectedSignalsBoxes = m;
                    }
                    break;
                case 2:
                    // if (!this.firstAc) console.log("first aircraft message after", new Date() - this.acMessageTimer);
                    this.firstAc = true;

                    this.$scope.$broadcast('acState', { data: x });
                    break;
                case 3:
                    this.$scope.$broadcast('aisState', { data: x });
                    break;
                case 5:
                    this.addACARS(x.payload);
                    break;
                case 6:
                    this.addLTEStatus(x);
                    break;
                case 7:
                    this.addLTEResult(x);
                    break;
            }
        });
    }

    disconnect() {
        this.webrtcconnection.closeDataChannel();
    }

    close() {
        this.disconnect();
        this.signaling.close();
    }

    waterfallClick(event) {
        this.selectedFreq = event;
        this.$scope.$apply();
        this.retune();
    }

    makeid(idlength) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < idlength; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }

    changeTab(t) {
        switch (t) {
            case "fm":
                this.controlsEnabled = true;
                this.selectedDecoder = 1;
                this.selectedFreq = 103000000;
                this.decoderSettings = this.fmDecoderSettings;
                break;
            case "am":
                this.controlsEnabled = true;
                this.decoderSettings = this.amDecoderSettings;
                this.selectedDecoder = 2;
                break;
            case "adsb":
                this.controlsEnabled = false;
                this.selectedFreq = 1090000000;
                this.selectedDecoder = 3;
                this.decoderSettings = null;
                break;
            case "ais":
                this.controlsEnabled = false;
                this.selectedFreq = 162000000;
                this.selectedDecoder = 4;
                this.decoderSettings = null;
                break;
            case "acars":
                this.controlsEnabled = false;
                this.selectedFreq = 131750000;
                this.selectedDecoder = 5;
                this.decoderSettings = null;
                break;
            case "lte":
                this.controlsEnabled = true;
                this.selectedFreq = 806000000;
                this.selectedDecoder = 6;
                this.decoderSettings = null;
                break;
        }

        this.signalActiveChange = new Date();
        this.acMessageTimer = new Date();
        this.firstAc = false;
        this.resetMsgs();
        this.retune();
    }

    setAudioElement(elementId) {
        if(this.webrtcconnection) {
            let audioPlayer = angular.element(document.getElementById(elementId))[0];
            this.webrtcconnection.setAudioPlayer(audioPlayer);

            this.signalActiveChange = new Date();
            this.webrtcconnection.onAudioChangeActive = (isSignal) => {
                let now = new Date();
                isSignal && console.log("audio signal came back after", now - this.signalActiveChange);
                this.signalActiveChange = now;
            }
        }
    }

    addCoins() {
        this.signaling.chargeCoins()
    }

    addACARS(a) {
        this.acarsMsgs.unshift(a);
        this.acarsMsgs = this.acarsMsgs.slice(0, 100);
        this.$scope.$apply();
    }

    addLTEStatus(a) {
        this.lteMsgs.unshift(a);
        this.lteMsgs = this.lteMsgs.slice(0, 15);
        this.$scope.$apply();
    }

    addLTEResult(a) {
        a.payload.Cells.forEach(c => this.lteResults.push(c));
        this.$scope.$apply();
    }

    resetMsgs() {
        this.lteMsgs = [];
        this.lteResults = [];
        this.acarsMsgs = [];
    }
}

StreamingController.$inject = ['$scope', '$window', 'esAuth', 'esApiService'];

const module = angular.module('StreamingPage', [tabs, EsAuth.name, EsLeafletMap.name]);

module.component('streamingPage', {
    controller: StreamingController,
    template: require('raw-loader!./streaming.html'),
    controllerAs: '$ctrl'
});

module.filter('hzunit', function() {
    return function(value) {
        value = value || 0;
        return printHzUnit(value);
    }
});


export default module;
