import React, {Component, useState, useEffect, useRef} from 'react'


export default class LiveWaterfall extends Component{
    constructor(){
        super()
        // color schema depends on quantiles of values shown
        this.colorProp = -50;
        this.colorPropHigh = 0;

        // current line within the waterfall canvas
        this.currentLine = 0;
        // min and max freq shown in waterfall plot
        this.minFreq = 101e6 - 1.2e6;
        this.maxFreq = 101e6 + 1.2e6;
        this.stretch = 1;

        this.width = 1340
        this.height = 350
    }


    render(){
        return(
            <div className='LiveWaterfall'>
                    <header class="section-heading">
                        <h2 class="section-title">Waterfall Plot component</h2>
                    </header>
                    <canvas ref='canvas'
                            id="es-streaming-waterfall-1"
                            width="1340"
                            height="350"
                            style={{ border: "4px solid #d3d3a3" }}>
                    </canvas>
                    
                    <p></p>
                    <button type="button" class="btn btn-primary" onClick={this.draw_waterfall}>Draw</button> 
            </div>
        )
    }

    draw_waterfall(){
        var canvas =  document.getElementById('es-streaming-waterfall-1');
        var ctx = canvas.getContext('2d');
        
        //ctx.StrokeStyle = 'blue';
        //ctx.lineWidth = 5;
        //ctx.beginPath();
        //ctx.moveTo(0, 0);
        //ctx.lineTo(1340, 350);
        //ctx.stroke()

        // qui bisogna chiamare il ciclo for e mandare in scrittura i dati
        for (let i = 0; i < 250; i++) {
            //this.addLine(PSD_data, ctx)
            }
        }

    addLine(data,ctx) {
        // stretch in case data length smaller than width or data size changes
        if (data.length !== this.dataLength) {
            this.dataLength = data.length;
            this.onResize();
        }

        /*const draw = y => {
            data.map(di => c(di).hex()).forEach((col, i) => {
                this.ctx.fillStyle = col;
                this.ctx.fillRect((i-1)*this.stretch, y, i*this.stretch, 1);
            });
        };*/

        if (this.currentLine < this.height) {
            // add line below
            //draw(this.currentLine++);
        } else if (this.clearFull) {
            this.ctx.fillStyle = "#ffffff";
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.currentLine = -1;
            //draw(this.currentLine++);
        } else {
            // shift all up and add line below
            let current = this.ctx.getImageData(0, 0, this.width, this.height);
            this.ctx.putImageData(current, 0, -1);
            //draw(this.height - 1);
        }

    }

}

/*<live-waterfall hover-freq="$ctrl.hoverFreq"
highlight-freqs="$ctrl.detectedSignals"
on-freq-click="$ctrl.waterfallClick(event)"
ng-show="$ctrl.showWaterfall"
enable-interaction="$ctrl.controlsEnabled"
show-slider="true"
hide-tooltip="false"
upper-threshold="$ctrl.upperThreshold"
lower-threshold="$ctrl.lowerThreshold"
></live-waterfall>*/