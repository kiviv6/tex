var subtitles = {
    T_192669_video_opg1: {
		lang: "en",
		name: "English",
        tracks: [
			//from		To			Text
			T(TTime("00:00:00:01"), TTime("00:00:32:00"), "Bromvand, 1-2-3-4, 1-2-3-4"),
			T(TTime("00:00:32:00"), TTime("00:00:36:00"), "1-2-3-4"),
			T(TTime("00:00:36:00"), TTime("00:01:05:00"), "Fehlings reagens 1, Fehlings reagens 2, 1-2-3-4, 1-2-3-4"),
			T(TTime("00:01:06:00"), TTime("00:01:19:00"), "1-2-3-4, 1-2-3-4"),
			T(TTime("00:01:19:00"), TTime("00:01:21:00"), "1-2-3-4"),
			T(TTime("00:01:27:00"), TTime("00:01:33:00"), "H<sub>2</sub>O"),
			T(TTime("00:01:41:00"), TTime("00:01:47:00"), "1"),
			T(TTime("00:01:52:00"), TTime("00:01:59:00"), "2"),
			T(TTime("00:02:07:00"), TTime("00:02:13:00"), "3"),
			T(TTime("00:02:19:00"), TTime("00:02:26:00"), "4"),
			T(TTime("00:02:32:00"), TTime("00:02:36:00"), "1-2-3-4")
        ]
    },

	T_192669_titretning_opg4: {
		lang: "en",
		name: "English",
        tracks: [
			//from		To			Text
			T(TTime("00:00:00:01"), TTime("00:00:02:15"), "Demineraliseret vand, Algefri"),
			T(TTime("00:00:02:15"), TTime("00:00:11:00"), "0,0940 <span style='font-variant: small-caps;'>m</span> HCl"),
			T(TTime("00:00:12:00"), TTime("00:00:25:30"), "Algefri 1000 µL"),
			T(TTime("00:00:25:30"), TTime("00:00:27:30"), "Algefri"),
			T(TTime("00:00:27:30"), TTime("00:00:33:15"), "Demineraliseret vand tilsættes det afpipetterede Algefri")
        ]
    },
	
	T_192669_video2_opg4_v3: {
		lang: "en",
		name: "English",
        tracks: [
			//from		To			Text
			T(TTime("00:00:00:01"), TTime("00:00:03:00"), "Kun tekst, der er relevant for opgavebesvarelsen, er tekstet til talesyntese"),
			T(TTime("00:00:03:00"), TTime("00:00:37:15"), "Heptan  25 mL, Saltsyre  4 M HCl, Algefri 5,00 mL"),
			T(TTime("00:00:48:15"), TTime("00:00:52:15"), "Efter 10 minutter er faserne helt adskilt"),
			T(TTime("00:01:14:00"), TTime("00:01:16:00"), "0,000 g"),
			T(TTime("00:01:16:00"), TTime("00:01:20:22"), "22,754 g"),
			T(TTime("00:01:31:20"), TTime("00:01:36:00"), "Efter en time er alt heptan fordampet"),
			T(TTime("00:01:36:00"), TTime("00:01:38:30"), "0,000 g"),
			T(TTime("00:01:38:30"), TTime("00:01:43:00"), "23,688 g")
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