import { find_local_maxima, peak_prominences, peak_widths } from './peakutils'

export class SignalDetector {
    constructor() {
        this.data = [];
    }

    get_frequency(minFreq, maxFreq, maxtab, sampleLen, binWidth) {
        var frequencies = [];
        for (var i = 0; i < maxtab.length; i++) {
            frequencies.push(minFreq + (maxFreq - minFreq) * (Math.round(maxtab[i][0]-maxtab[i][2]/2) / sampleLen) - (maxFreq - minFreq) * binWidth / (sampleLen * 2.0))
            frequencies.push(minFreq + (maxFreq - minFreq) * (Math.round(maxtab[i][0]+maxtab[i][2]/2) / sampleLen) - (maxFreq - minFreq) * binWidth / (sampleLen * 2.0))
        }
        return frequencies;
    }

    peakdet(v, delta, threshold_amp = .5, threshold_bw = 6) {
        var maxtab = [];
        var mintab = [];
        var x = Array.apply(null, { length: v.length }).map(Number.call, Number);
        var mn = Infinity;
        var mx = -Infinity;
        var mn1 = Infinity;
        var mnpos = -1;
        var mxpos = -1;
        var mn1pos = -1;
        var lookformax = false;
        var i;
        for (i = 0; i < v.length; i++) {
            var this_val = v[i];
            if (this_val > mx) {
                mx = this_val;
                mxpos = x[i];
            }
            if (this_val < mn) {
                mn = this_val;
                mnpos = x[i];
            }
            if (lookformax == true) {
                if (this_val < mx - delta) {
                    if (mx - mn1 >= threshold_amp && i - mn1pos >= threshold_bw) {
                        var mxtab1 = [mxpos, mx];
                        maxtab.push(mxtab1);
                    }
                    mn = this_val;
                    mnpos = x[i];
                    lookformax = false;
                }
            }
            else {
                if (this_val > mn + delta) {
                    var mintab1 = [mnpos, mn];
                    mintab.push(mintab1);
                    mn1 = mn;
                    mn1pos = mnpos;
                    mx = this_val;
                    mxpos = x[i];
                    lookformax = true;
                }
            }
        }
        return maxtab;
    }

    find_peaks(values, threshold=0.1, min_width=6, min_prominence=5e-4) {
        // This function is analogous to peakdet but it calls the helper functions in peakutils.js
        // to compute the peaks and their widths 

        // Compute local maxima and filter the peaks that don't surpass the threshold
        var [peaks, left_bases, right_bases] = find_local_maxima(values);

        var peaksf = peaks.filter(function(peak) {
            return values[peak] > threshold;
        });

        // Get widths by first computing prominences of each peak
        var [prominences, left_edges, right_edges] = peak_prominences(values, peaksf, 30);
        var [widths, width_heights, left_ips, right_ips] = peak_widths(values, peaksf, prominences, left_edges, right_edges, 0.95);

        // For all the peaks that meet prominence and width threshold, just push them inside maxtab
        var maxtab = [];
        for (var i = 0; i < widths.length; i++) {
            if (widths[i] >= min_width && prominences[i] > min_prominence) {
                maxtab.push([peaksf[i], values[peaksf[i]], widths[i]]);
            }
        }

        return maxtab;
    }

    prepare_data(my_data) {
        var data = new Array(my_data.length);
        for (var i = 0; i < my_data.length; i++) {
            data[i] = new Array(my_data[i].length);
            for (var j = 0; j < my_data[i].length; j++) {
                data[i][j] = Math.pow(10, my_data[i][j] / 10);
            }
        }
        var avg_data = Array.apply(null, Array(my_data[1].length)).map(Number.prototype.valueOf, 0);
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].length; j++) {
                avg_data[j] = avg_data[j] + data[i][j];
            }
        }
        for (var i = 0; i < avg_data.length; i++) {
            avg_data[i] = avg_data[i] / data.length;
        }
        return avg_data;
    }

    movingWindowAvg(array, count, qualifier) {
        var avg = function (array, qualifier) {
            var sum = 0, count = 0, val;
            for (var i in array) {
                val = array[i];
                if (!qualifier || this.qualifier(val)) {
                    sum += val;
                    count++;
                }
            }
            return sum / count;
        };
        var result = [], val;
        for (var i = 0; i < count - 1; i++)
            result.push(null);
        for (var i = 0, len = array.length - count; i <= len; i++) {
            val = avg(array.slice(i, i + count), qualifier);
            if (isNaN(val))
                result.push(null);
            else
                result.push(val);
        }
        var normalized_data = Array.apply(null, Array(result.length)).map(Number.prototype.valueOf, 0);
        // var mx1=Math.max(...result);
        // var mn1=Math.min(...result);
        var mx1 = 1;
        var mn1 = 1e-11;
        // if(mx1>mn1){
        for(var i=0;i< result.length;i++){
            normalized_data[i]=(result[i]-mn1)/(mx1-mn1);
        }
        return normalized_data;
        // }

        // return result;
    }

    findMedian(values) {
        values.sort(function (a, b) { return a - b; });
        var half = Math.floor(values.length / 2);
        if (values.length % 2)
            return values[half];
        else
            return (values[half - 1] + values[half]) / 2.0;
    }

    findqxx(values, fraction) {
        values.sort(function (a, b) { return a - b; });
        var qxx = Math.floor(values.length * fraction);
        if (values.length % 2)
            return values[qxx];
        else
            return (values[qxx - 1] + values[qxx]) / 2.0;
    }

    emptyData(){
        this.data=[];
    }

    addData(data) {
        this.data.push(data);
    }

    setData(data) {
    	this.data = data;
    }

    canProcess() {
        return (this.data.length%18==0);
    }

    process(minFreq, maxFreq) {
        if(this.data.length>90){
            this.data= this.data.slice(this.data.length-90, this.data.length);
        }
        var my_data1 = this.prepare_data(this.data);
        var binWidth = 9;
        var rolling_mean = this.movingWindowAvg(my_data1, binWidth);
        // var maxtab = this.peakdet(rolling_mean, Math.abs(this.findMedian(rolling_mean.slice(0))));

        // The variable maxtab now returns an array list, where each element i is [peak[i], value[i], width[i]]
        var min_width = 4;
        const maxtab = this.find_peaks(rolling_mean, Math.abs(this.findqxx(rolling_mean.slice(0),0.25)), min_width);

        var channel = this.get_frequency(minFreq, maxFreq, maxtab, 512, binWidth);
        //console.log(JSON.stringify(channel));
        return channel;
    }
}
