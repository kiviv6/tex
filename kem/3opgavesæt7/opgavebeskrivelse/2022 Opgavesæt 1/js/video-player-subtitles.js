var subtitles = {
    T_194096_opg1: {
		lang: "en",
		name: "English",
        tracks: [
			//from		To			Text
			T(TTime("00:00:00:01"), TTime("00:00:15:00"), "Ref. -1-2-3-4, 2,4-dinitrophenylhydrazin"),
			T(TTime("00:00:15:00"), TTime("00:00:32:00"), "Ref. -1-2-3-4, 1-2-3-4"),
			T(TTime("00:00:32:00"), TTime("00:00:34:00"), "Ref.-1-2-3-4"),
			T(TTime("00:00:35:00"), TTime("00:01:07:00"), "Fehlings reagens 1, Fehlings reagens 2, ref.-1-2-3-4"),
			T(TTime("00:01:08:00"), TTime("00:01:10:00"), "Ref.-1-2-3-4"),
			T(TTime("00:01:12:00"), TTime("00:01:23:00"), "1-2-3-4, Ref.-1-2-3-4"),
			T(TTime("00:01:24:00"), TTime("00:01:27:00"), "Ref.-1-2-3-4"),
			T(TTime("00:01:27:00"), TTime("00:01:53:00"), "Ref.-1-2-3-4, vandbad"),
			T(TTime("00:01:53:00"), TTime("00:01:56½:00"), "Ref.-1-2-3-4")
		]
    },

	
	T_194096_opg2_1: {
		lang: "en",
		name: "English",
        tracks: [
			//from		To			Text
			T(TTime("00:00:00:01"), TTime("00:00:29:00"), "1 µ<span style='font-variant: small-caps;'>m</span> - 2 µ<span style='font-variant: small-caps;'>m</span> - 4 µ<span style='font-variant: small-caps;'>m</span> - 6 µ<span style='font-variant: small-caps;'>m</span> - 8 µ<span style='font-variant: small-caps;'>m</span> - 10 µ<span style='font-variant: small-caps;'>m</span>")
		]
    },


	T_194096_opg2_2: {
		lang: "en",
		name: "English",
        tracks: [
			//from		To			Text
			T(TTime("00:00:00:01"), TTime("00:00:35:00"), "Brilliant blue, Hypochlorit")
		]
    }
};

/**
 * Takes up to 4 values 
 * 4 values: [0]hours[1]minutes[2]seconds[3]frames
 * 3 values: [0]minutes[1]seconds[2]frames
 * 2 values: [0]seconds[1]frames
 * 1 value : [0]frames
 */
function ATime() {
	var frames = 0;
	var seconds = 0;
	var minutes = 0;
	var hours = 0;
	if(arguments.length == 1) {
		frames = (arguments[0]*1)/24;
	}
	else if(arguments.length == 2) {
		frames = (arguments[1]*1)/24;
		seconds = arguments[0]*1;
	}
	else if(arguments.length == 3) {
		frames = (arguments[2]*1)/24;
		seconds = arguments[1]*1;
		minutes = (arguments[0]*1)*60;
	}
	else if(arguments.length == 4) {
		frames = (arguments[3]*1)/24;
		seconds = arguments[2]*1;
		minutes = (arguments[1]*1)*60;
		hours = (arguments[0]*1)*3600;
	}
	else {
		return 0;
	}
	return hours + minutes + seconds + frames;
}

/**
 * If value is undefined returns 0
 * @param {*} value 
 */
function UndefinedToZero(value) {
	if(typeof value === "undefined") {
		return 0;
	}
	return value;
}

/**
 * Convert input to seconds
 * @param {numeric} frames Not Required
 * @param {numeric} seconds Not Required
 * @param {numeric} minutes Not Required
 * @param {numeric} hours Not Required
 */
function _Time(frames, seconds, minutes, hours) {
	frames = UndefinedToZero(frames) / 24;
	seconds = UndefinedToZero(seconds);
	minutes = UndefinedToZero(minutes) * 60;
	hours = UndefinedToZero(hours) * 3600;
	return hours + minutes + seconds + frames;
}

/**
 * Convert string input "00:00:00:00" to seconds
 * @param {string} value Required
 */
function TTime(value) {
	if(typeof value === "undefined") {
		value = "00:00:00:00";
	}
	var split = value.split(":");
	var frames = (split[3]*1)/24;
	var seconds = split[2]*1;
	var minutes = (split[1]*1)*60;
	var hours = (split[0]*1)*3600;
	var output = hours + minutes + seconds + frames;
	return output;
}

function T(start, end, text) {
	return {
		start: start,
		end: end,
		text: text
	};
}