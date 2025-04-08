var subtitles = {
    T_194196_opg3_v3: {
		lang: "en",
		name: "English",
        tracks: [
			//from		To			Text
			T(TTime("00:00:00:01"), TTime("00:00:09:00"), "Ca(IO<sub>3</sub>)<sub>2</sub>"),
			T(TTime("00:00:09:00"), TTime("00:00:16:00"), "Ca(IO<sub>3</sub>)<sub>2</sub> Demineraliseret Vand"),
			T(TTime("00:00:16:00"), TTime("00:00:20:00"), "Ca(IO<sub>3</sub>)<sub>2</sub>"),
			T(TTime("00:00:20:00"), TTime("00:00:23:00"), "Omrøring i et døgn"),
			T(TTime("00:00:24:00"), TTime("00:00:31:00"), "Ca(IO<sub>3</sub>)<sub>2</sub> mættet opløsning"),
			T(TTime("00:00:31:00"), TTime("00:00:40:00"), "Ca(IO<sub>3</sub>)<sub>2</sub> mættet opløsning Na<sub>2</sub>S<sub>2</sub>O<sub>3</sub>  0,102 <span style='font-variant: small-caps;'>m</span>"),
			T(TTime("00:00:44:00"), TTime("00:00:47:00"), "Ca(IO<sub>3</sub>)<sub>2</sub> mættet opløsning"),
			T(TTime("00:00:47:00"), TTime("00:00:51:00"), "20 ml Ca(IO<sub>3</sub>)<sub>2</sub> mættet opløsning"),
			T(TTime("00:00:51:00"), TTime("00:01:02:15"), "Ca(IO<sub>3</sub>)<sub>2</sub> mættet opløsning"),
			T(TTime("00:01:02:15"), TTime("00:01:09:00"), "Ca(IO<sub>3</sub>)<sub>2</sub> mættet opløsning 1 <span style='font-variant: small-caps;'>m</span> HCl"),
			T(TTime("00:01:11:15"), TTime("00:01:23:00"), "Ca(IO<sub>3</sub>)<sub>2</sub> mættet opløsning 10 % KI"),
			T(TTime("00:01:26:00"), TTime("00:01:41:15"), "Ca(IO<sub>3</sub>)<sub>2</sub> mættet opløsning 1 % stivelse")
		]
    },

	
	T_194196_opg4: {
		lang: "en",
		name: "English",
        tracks: [
			//from		To			Text
			T(TTime("00:00:00:01"), TTime("00:00:10:00"), "Husholdnings-SPRIT"),
			T(TTime("00:00:22:30"), TTime("00:00:32:30"), "Forlag"),
			T(TTime("00:00:32:30"), TTime("00:00:37:15"), "Q  Forlag"),
			T(TTime("00:00:37:15"), TTime("00:00:40:15"), "Kontrolblandingen P destilleres på samme måde"),
			T(TTime("00:00:40:15"), TTime("00:00:55:45"), "Q P - Q P - 2,4-dinitrophenylhydrazin"),
			T(TTime("00:00:57:00"), TTime("00:01:20:00"), "Q P - Q P - Fehlings reagens 1 - Fehlings reagens 2"),
			T(TTime("00:01:21:00"), TTime("00:01:23:00"), "Q P")
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