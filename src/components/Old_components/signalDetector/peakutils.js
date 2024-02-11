const find_local_maxima = (values) => {

    var midpoints = Array.apply(null, Array(values.length)).map(function() {});
    var left_edges = Array.apply(null, Array(values.length)).map(function() {});
    var right_edges = Array.apply(null, Array(values.length)).map(function() {});
    var m = 0; // Pointer to the end of valid area in allocated arrays

    var i = 1; // Pointer to current sample, first one can't be maxima
    var i_max = values.length - 1;  // Last sample can't be maxima
    while (i < i_max) {
        if (values[i - 1] < values[i]){
            var i_ahead = i + 1;  // Index to look ahead of current sample

            while (i_ahead < i_max && values[i_ahead] == values[i]) {
                i_ahead += 1;
            }

            //Maxima is found if next unequal sample is smaller than values[i]
            if (values[i_ahead] < values[i]) {
                left_edges[m] = i;
                right_edges[m] = i_ahead - 1;
                midpoints[m] = Math.round((left_edges[m] + right_edges[m]) / 2);
                m += 1;
                //Skip samples that can't be maximum
                i = i_ahead;
            }
        }
        i += 1;
    }

    // Keep only valid part of array memory.
    var mfilt = midpoints.filter(function(elem) { return elem; });
    var lfilt = left_edges.filter(function(elem) { return elem; });
    var rfilt = right_edges.filter(function(elem) { return elem; });

    return [mfilt, lfilt, rfilt];
};

const peak_prominences = (values, peaks, wlen=0) => {
    
    if (wlen < 0) {
        console.error("Window width cannot be lower than 0");
        wlen = 0;
    }

    var show_warning = false;
    var prominences = Array.apply(null, Array(peaks.length)).map(Number.prototype.valueOf, 0);
    var left_bases = Array.apply(null, Array(peaks.length)).map(Number.prototype.valueOf, 0);
    var right_bases = Array.apply(null, Array(peaks.length)).map(Number.prototype.valueOf, 0);

    for (var peak_nr = 0; peak_nr < peaks.length; peak_nr++) {
        var peak = peaks[peak_nr];
        var i_min = 0;
        var i_max = values.length - 1;

        if (!(i_min <= peak  && peak <= i_max)) {
            console.error(`Peak ${peak} is not a valid index for x`);
            return;
        }

        if (2 <= wlen) {
            // Adjust window around the evaluated peak (within bounds);
            // if wlen is even the resulting window length is is implicitly
            // rounded to next odd integer
            i_min = Math.max(Math.round(peak - wlen / 2), i_min);
            i_max = Math.min(Math.round(peak + wlen / 2), i_max);
        }

        // Find the left base in interval [i_min, peak]
        left_bases[peak_nr] = peak;
        var i = peak;
        var left_min = values[peak];
        while (i_min <= i && values[i] <= values[peak]) {
            if (values[i] < left_min) {
                left_min = values[i];
                left_bases[peak_nr] = i;
            }
            i -= 1;
        }

        // Find the right base in interval [peak, i_max]
        right_bases[peak_nr] = peak;
        i = peak;
        var right_min = values[peak];
        while (i <= i_max && values[i] <= values[peak])
        {
            if (values[i] < right_min) {
                right_min = values[i]
                right_bases[peak_nr] = i
            }
            i += 1;
        }

        prominences[peak_nr] = values[peak] - Math.max(left_min, right_min)
        if (prominences[peak_nr] === 0) {
            show_warning = true;
        }

    }
    if (show_warning) {
        console.warn("Some peaks have a prominence of 0");
    }

    return [prominences, left_bases, right_bases];
};

const peak_widths = (values, peaks, prominences, left_bases, right_bases, rel_height=0.5) => {

    // Some checks before the actual meat
    if (rel_height < 0) {
        console.error("rel_heigh must be greater or equal to 0.0");
        return;
    }

    if (!(peaks.length === prominences.length && peaks.length === left_bases.length && peaks.length === right_bases.length)) {
        console.error("Arrays in prominence_data must have the same length as peaks");
        return;
    }

    // Some preallocations
    var show_warning = false;
    var widths =  Array.apply(null, Array(peaks.length)).map(function() {});
    var width_heights =  Array.apply(null, Array(peaks.length)).map(function() {});
    var left_ips =  Array.apply(null, Array(peaks.length)).map(function() {});
    var right_ips =  Array.apply(null, Array(peaks.length)).map(function() {});

    for (var p = 0; p < peaks.length; p++) {
        var i_min = left_bases[p];
        var i_max = right_bases[p];
        var peak = peaks[p];
        // Validate bounds and order
        if (!(0 <= i_min && i_min <= peak && peak <= i_max && i_max < values.length)) {
            console.error(`prominence data is invalid for peak ${peak}`);
            return;
        }

        width_heights[p] = values[peak] - prominences[p] * rel_height;
        var height = width_heights[p];

        // Find intersection point on left side
        var i = peak;
        while (i_min < i && height < values[i]) {
            i -= 1;
        }
            
        var left_ip = i;
        if (values[i] < height) {
            // Interpolate if true intersection height is between samples
            left_ip += (height - values[i]) / (values[i + 1] - values[i]);
        }

        // Find intersection point on right side
        i = peak
        while (i < i_max && height < values[i]) {
            i += 1;
        }

        var right_ip = i;
        if  (values[i] < height) {
            right_ip -= (height - values[i]) / (values[i-1] - values[i]);
        }

        widths[p] = right_ip - left_ip
        if (widths[p] == 0) {
            show_warning = true;
        }

        left_ips[p] = left_ip;
        right_ips[p] = right_ip;
    }
        

    if (show_warning) {
        console.warn("some peaks have a width of 0");
    }

    return [widths, width_heights, left_ips, right_ips];
};

export { find_local_maxima, peak_prominences, peak_widths };
