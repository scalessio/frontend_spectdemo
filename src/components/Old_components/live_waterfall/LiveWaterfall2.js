import * as chroma from "chroma-js/chroma";
import {printHzUnit} from "../../lib/esutil";

class LiveWaterfallController {
    constructor($scope, $interval) {
        this.$scope = $scope;

        this.canvas = document.getElementById("es-streaming-waterfall-1");
        this.tooltip = document.getElementById("es-waterfall-tooltip");
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.legendCanvas = document.getElementById("es-waterfall-legend-1");
        this.legendCtx = this.legendCanvas.getContext("2d");
        this.ctx = this.canvas.getContext("2d");


        let colorLegendContainer = "es-color-legend-container";
        this.colorLegendCanvas = document.getElementById(colorLegendContainer);

        // current line within the waterfall canvas
        this.currentLine = 0;

        // color schema depends on quantiles of values shown
        this.colorProp = -50;
        this.colorPropHigh = 0;
        this.updateColor();

        // min and max freq shown in waterfall plot
        this.minFreq = 101e6 - 1.2e6;
        this.maxFreq = 101e6 + 1.2e6;
        this.stretch = 1;
        this.dataLength = this.width;
        // will be computed after first data has arrived
        this.res = null;

        // mouse selected freqency
        this.hoverFreq = null;
        this.clickFreq = null;

        // Highlight frequency
        this.highlightFreqs = [];

        // clear waterfall if full
        this.clearFull = false;

        // if clicking on waterfall has any effect
        this.enableInteraction = true;

        this.noData = true;
        this.lastDataTime = new Date(0);
        this.timer = $interval(() => {
            this.noData = new Date() - this.lastDataTime > 100;
        }, 1000);

        this.onResize();
        this.canvas.addEventListener("mousemove", event => this.onMouseMove(event));
        this.canvas.addEventListener("mouseup", event => this.onMouseClick(event));
        this.canvas.addEventListener("mouseout", () => this.tooltip.style.display = "none");
        window.addEventListener("resize", () => this.onResize());

        // XXX add some random data for testing
        /*let ctr = 0;
        setInterval(() => {
            this.addLine(TEST_PSD[ctr++]);
            if (ctr === TEST_PSD.length) ctr = 0;
        }, 50);*/

        $scope.$on('psdData', (e, d) => {

            // resize after waterfall was resized in hidden state
            const cs = getComputedStyle(this.canvas.parentNode);
            if (this.width !== parseInt(cs.getPropertyValue('width'))) {
                this.onResize();
            }

            this.lastDataTime = new Date();
            this.noData = false;

            this.addLine(d.data.payload.data);

            if (d.data.payload.minFreq !== this.minFreq ||
                d.data.payload.minFreq !== this.maxFreq ||
                d.data.payload.data !== this.dataLength) {

                this.minFreq = d.data.payload.minFreq;
                this.maxFreq = d.data.payload.maxFreq;
                this.dataLength = d.data.payload.data.length;
                this.updateLegend();
            }
        });

        $scope.$on('clearWaterfall', () => this.onResize());

        $scope.$watch('$ctrl.colorProp', () => this.updateColor());
        $scope.$watch('$ctrl.colorPropHigh', () => this.updateColor());
        $scope.$watch('$ctrl.highlightFreqs', () => this.drawLegend());
    }

    onResize() {
        const cs = getComputedStyle(this.canvas.parentNode);

        this.width = parseInt(cs.getPropertyValue('width'));

        this.canvas.setAttribute("width", this.width);
        this.legendCanvas.setAttribute("width", this.width);

        // reset canvas
        this.currentLine = 0;

        this.updateLegend();
    }

    updateLegend() {
        // 1px = res [Hz]
        this.stretch = this.width / this.dataLength;
        this.res = (1/this.stretch)*(this.maxFreq - this.minFreq) / this.dataLength;

        this.drawLegend();
    }

    drawLegend() {
        // reset
        this.legendCtx.fillStyle = "#ffffff";
        this.legendCtx.fillRect(0, 0, this.width, 100);

        let spacer = 5;
        let fontSize = 11;
        this.legendCtx.font = fontSize + "px monospace";
        this.legendCtx.strokeStyle = "rgba(0, 0, 0)";
        this.legendCtx.lineWidth = 1;
        this.legendCtx.fillStyle = "#000000";

        let lastX = null;
        for (let i = 0; i < this.width; i++) {
            // unit prefix kHz, MHz, not GHz
            let cFreq = printHzUnit(this.minFreq + i*this.res, 6);
            let ts = this.legendCtx.measureText(cFreq);
            let xPos = i;
            if (lastX != null && (lastX + 2*spacer > xPos || xPos + ts.width > this.width))
                continue;

            // draw small vertical line
            this.legendCtx.fillText(cFreq, xPos - 1, fontSize + 2);

            this.legendCtx.beginPath();
            this.legendCtx.moveTo(i, fontSize + spacer + 1);
            this.legendCtx.lineTo(i, fontSize + 2*spacer + 2);
            this.legendCtx.stroke();

            lastX = xPos + ts.width;
        }

        for(let i = 0; i < this.highlightFreqs.length; i++) {
            let x = (this.highlightFreqs[i] - this.minFreq) / this.res;
            this.legendCtx.strokeStyle = '#ff0000';
            this.legendCtx.fillStyle = '#ff0000';
            if (this.highlightFreqs.length % 2 == 0) {
                this.legendCtx.lineWidth = 1;
                this.legendCtx.beginPath();
                if (i % 2 == 0) {
                    this.legendCtx.moveTo(x, fontSize + spacer + 1);
                    this.legendCtx.lineTo(x, fontSize + 2*spacer + 3);
                    this.legendCtx.lineTo(x+8, fontSize + spacer + 1);
                    this.legendCtx.lineTo(x, fontSize + spacer + 1);
                } else {
                    this.legendCtx.moveTo(x, fontSize + spacer + 1);
                    this.legendCtx.lineTo(x, fontSize + 2*spacer + 3);
                    this.legendCtx.lineTo(x-8, fontSize + spacer + 1);
                    this.legendCtx.lineTo(x, fontSize + spacer + 1);
                }
            } else {
                this.legendCtx.lineWidth = 5;
                this.legendCtx.beginPath();
                this.legendCtx.moveTo(x, fontSize + spacer + 1);
                this.legendCtx.lineTo(x, fontSize + 2*spacer + 3);
            }
            this.legendCtx.closePath();
            this.legendCtx.stroke();
            this.legendCtx.fill();
        }

    }

    addLine(data) {
        const c = this.colorScheme();

        // stretch in case data length smaller than width or data size changes
        if (data.length !== this.dataLength) {
            this.dataLength = data.length;
            this.onResize();
        }

        const draw = y => {
            data.map(di => c(di).hex()).forEach((col, i) => {
                this.ctx.fillStyle = col;
                this.ctx.fillRect((i-1)*this.stretch, y, i*this.stretch, 1);
            });
        };

        if (this.currentLine < this.height) {
            // add line below
            draw(this.currentLine++);
        } else if (this.clearFull) {
            this.ctx.fillStyle = "#ffffff";
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.currentLine = -1;
            draw(this.currentLine++);
        } else {
            // shift all up and add line below
            let current = this.ctx.getImageData(0, 0, this.width, this.height);
            this.ctx.putImageData(current, 0, -1);
            draw(this.height - 1);
        }

    }

    onMouseMove(event) {
        let mousePos = this.getMousePos(event);

        this.tooltip.style.display = "block";
        this.tooltip.style.left = event.clientX + 15 + "px";
        this.tooltip.style.top = event.clientY + "px";

        this.$scope.$apply(() => {
            this.hoverFreq = Math.floor(this.minFreq + this.res*mousePos.x);
        });
        //console.log(this.hoverFreq, printHzUnit(this.hoverFreq, 6));
    }

    onMouseClick(event) {
        if (!this.enableInteraction) return;

        let mousePos = this.getMousePos(event);

        // move current spectrum based on mouse click
        let newX = this.width/2 - mousePos.x;
        let cdata = this.ctx.getImageData(0, 0, this.width, this.height);
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(0, 0, this.width, this.currentLine);
        this.ctx.putImageData(cdata, newX-1, 0);

        let newFreq = Math.floor(this.minFreq + this.res*mousePos.x);
        this.minFreq = newFreq - this.res*this.width/2;
        this.maxFreq = newFreq + this.res*this.width/2;
        this.drawLegend();

        // notify callee
        this.onFreqClick({event: newFreq});
    }

    /**
     * Extract relative mouse position withing the waterfall plot
     */
    getMousePos(event) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (event.clientX-(rect.left)),
            y: (event.clientY-(rect.top))
        };
    }

    updateColor() {
        // console.log('colorProp', this.colorProp);
        // console.log('colorPropHigh', this.colorPropHigh);
        const range = this.colorPropHigh - this.colorProp;


        this.valQ1 = this.colorProp;
        this.valQ2 = this.colorPropHigh - (2 * (range / 3));
        this.valQ3 = this.colorPropHigh - (range / 3);
        this.valMax = this.colorPropHigh //40;
        this.drawColorLegend();
        // console.log('updating color', {
        //     'valQ1': this.valQ1,
        //     'valQ2': this.valQ2,
        //     'valQ3': this.valQ3,
        //     'valMax': this.valMax,
        // })
    }

    colorScheme() {
        return chroma.scale(["#000000",
            "#0000ff",
            "#00ff00",
            "#ff0000"
        ]).domain([this.valQ1,
            this.valQ2,
            this.valQ3,
            this.valMax], "log");
    }

    drawColorLegend() {
        // let minPSize = colorLegendCtx.measureText("0.0dB").width;
        // let maxPSize = colorLegendCtx.measureText(dataMinMax[1].toFixed(1) + "dB").width;
        const colorLegendCtx = this.colorLegendCanvas.getContext('2d');
        // console.log('this.colorLegendCtx', colorLegendCtx);
        if (!colorLegendCtx) {
            return;
        }
        let legendHeight = this.colorLegendCanvas.offsetHeight;
        let legendWidth = this.colorLegendCanvas.offsetWidth;

        // console.log('legendHeight', legendHeight);
        // console.log('legendWidth', legendWidth);
        // console.log('this.valQ1', this.valQ1);
        // console.log('this.valMax', this.valMax);
        const colors = this.colorScheme();

        let upperLabelDrawn = false;
        let lowerLabelDrawn = false;

        colorLegendCtx.fillStyle = '#ffffff';
        colorLegendCtx.fillRect(0, 0, legendWidth, legendHeight);

        const textX = 35;

        // console.log('colors', colors);

        const txt = '0 dB/Hz';
        colorLegendCtx.fillStyle = '#999999';
        const m = colorLegendCtx.measureText(txt);
        // console.log('m', m);
        colorLegendCtx.fillText(txt, textX, m.fontBoundingBoxAscent);

        colorLegendCtx.fillText('-50 dB/Hz', textX, legendHeight);


        for (let i = 0; i < legendHeight; i++) {
            // colorLegendCtx.fillStyle = colors(this.valMax - (((1/legendHeight)*i) * (this.valMax - this.valQ1))).hex();
            const v = 0 - ((50 / legendHeight) * i);
            let xPos = 0;
            // console.log('v', v);
            // console.log('valQ1', this.valQ1);
            if (v < this.valMax && !upperLabelDrawn && this.valMax < 0) {
                colorLegendCtx.fillStyle = '#000000';
                colorLegendCtx.fillText(this.valMax + ' dB', textX, Math.max(m.fontBoundingBoxAscent * 2, i + (m.fontBoundingBoxAscent / 2)));
                upperLabelDrawn = true;
                this.upperThreshold = i / legendHeight;
            } else if (v < this.valQ1 && !lowerLabelDrawn) {
                colorLegendCtx.fillStyle = '#000000';
                colorLegendCtx.fillText(this.valQ1 + ' dB', textX, Math.min(legendHeight - m.fontBoundingBoxAscent, i + (m.fontBoundingBoxAscent / 2)));
                lowerLabelDrawn = true;
                colorLegendCtx.fillStyle = '#ffffff';
                this.lowerThreshold = i / legendHeight;
            } else {
                colorLegendCtx.fillStyle = colors(v).hex();
            }
            colorLegendCtx.fillRect(10, i, 20, 1);
            // if (i == 0) {
            //     colorLegendCtx.fillText("0.0dB", xPos - minPSize / 2, xLabY + spacer + 12 + fontSize);
            // } else if (i == legendWidth - 1) {
            //     colorLegendCtx.fillText(dataMinMax[1].toFixed(1) + "dB", xPos - maxPSize / 2, xLabY + spacer + 12 + fontSize);
            // } else if (i == Math.ceil(legendWidth/2)) {
            //     colorLegendCtx.beginPath();
            //     colorLegendCtx.moveTo(xPos, xLabY + spacer);
            //     colorLegendCtx.lineTo(xPos, xLabY + spacer + 10);
            //     colorLegendCtx.stroke();
            //     colorLegendCtx.fillText(((dataMinMax[1] / 2).toFixed(1)) + "dB",
            //         xPos - minPSize / 2, xLabY + spacer + 12 + fontSize);
            // }
        }
        if (!upperLabelDrawn) {
            this.upperThreshold = 0;
        }

        if (!lowerLabelDrawn) {
            this.lowerThreshold = 1;
        }
    }
}
LiveWaterfallController.$inject = ['$scope', '$interval'];


const module = angular.module('LiveWaterfall', []);

var EsLiveWaterfall = module;

module.component('liveWaterfall', {
    controller: LiveWaterfallController,
    template: require('raw-loader!./live-waterfall.html'),
    bindings: {
        hoverFreq: '=',
        highlightFreqs: '<',
        clickFreq: '=',
        clearFull: '=',
        onFreqClick: '&',
        enableInteraction: '=',
        showSlider: '<',
        hideTooltip: '<',
        upperThreshold: '=',
        lowerThreshold: '='
    },
});

module.filter('hzunit', function() {
    return function(value) {
        value = value || 0;
        return printHzUnit(value, 6);
    }
});


export default module;
