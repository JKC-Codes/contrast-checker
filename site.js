import Colour from "/colorjs.js";


const inputColourForeground = document.querySelector('#input-colour-foreground');
const inputColourBackground = document.querySelector('#input-colour-background');
const inputFontSize = document.querySelector('#input-font-size');
const inputFontWeight = document.querySelector('#input-font-weight');
const outputResult = document.querySelector('#output-result');

const regexNumber = String.raw`(?:[+-]?\d+(?:\.\d+)?|\.\d+)`;


const State = {
	_colourForeground: null,
	_colourBackground: new Colour('white'),
	_fontSize: 16,
	_fontWeight: 400,
	_history: [],

	set colourForeground(value) {
		console.log(value);
		this._colourForeground = value;
	},

	set colourBackground(value) {
		console.log(value);
		this._colourBackground = value;
	},

	set fontSize(value) {
		console.log(value);
		this._fontSize = value;
	},

	set fontWeight(value) {
		console.log(value);
		this._fontWeight = value;
	}
}


init();


function init() {
	// TODO: update state with stored history

	inputColourForeground.addEventListener('input', handleColourInputEvent(State));
	inputColourBackground.addEventListener('input', handleColourInputEvent(State));
	inputFontSize.addEventListener('input', handleFontSizeInputEvent(State));
	inputFontWeight.addEventListener('change', handleFontWeightInputEvent(State));
}

function handleColourInputEvent(state) {
	return function(event) {
		let field;

		if(event.target.id === 'input-colour-foreground') {
			field = 'colourForeground';
		}
		else if(event.target.id === 'input-colour-background') {
			field = 'colourBackground';
		}
		else {
			throw new Error('Field input ID not recognised');
		}

		handleColourInput(event.target.value, field, state);
	}
}

function handleColourInput(value, field, state) {
	const {colourString} = parseColour(value);
	let colour = validateColour(colourString);

	if(colour !== null) {
		colour = new Colour(colour);
	}

	state[field] = colour;
}

function handleFontSizeInputEvent(state) {
	return function(event) {
		handleFontSizeInput(event.target.value, state);
	}
}

function handleFontSizeInput(value, state) {
	const {number} = parseNumber(value);
	const size = validateFontSize(number);

	state.fontSize = size;
}

function handleFontWeightInputEvent(state) {
	return function(event) {
		handleFontWeightInput(event.target.value, state);
	}
}

function handleFontWeightInput(value, state) {
	const {number} = parseNumber(value);
	const weight = validateFontWeight(number);

	state.fontWeight = weight;
}

function parseColour(colourString) {
	colourString = colourString.trim();
	const colourLength = colourString.length;

	// If short hex code
	if(colourString.startsWith('#') && colourLength < 4) {
		// Expand 1 or 2 digit hex codes into full
		colourString = '#' + colourString.slice(1).repeat(3);
	}
	// If hex code without a #
	else if(new RegExp(`^[0-9a-f]{${colourLength}}$`, 'i').test(colourString)) {
		switch(colourLength) {
			// Expand 1 or 2 digit hex codes into full
			case 1:
			case 2:
				colourString = colourString.repeat(3);

			// Add # to start
			case 3:
			case 4:
			case 6:
			case 8:
				colourString = '#' + colourString;
		}
	}

	return {colourString};
}

function validateColour(colourString) {
	try {
		Colour.parse(colourString);

		// Account for bug in ColorJS which accepts 7 digit hex codes
		if(colourString.length === 8 && colourString.startsWith('#')) {
			throw new Error();
		}

		return colourString;
	}
	catch(error) {
		return null;
	}
}

function parseNumber(numberString) {
	numberString = numberString.trim();
	const regexNumberString = new RegExp(`((?<!${regexNumber}))(${regexNumber})([^]*)`);
	const resultArray = regexNumberString.exec(numberString) || ['', '', null, ''];
	let number = Number.parseFloat(resultArray[2]);

	if(isNaN(number)) {
		number = null;
	}

	return {
		number: number,
		before: resultArray[1],
		after: resultArray[3]
	}
}

function validateFontSize(number) {
	if(!Number.isInteger(number) || number < 1) {
		number = null;
	}

	return number;
}

function validateFontWeight(number) {
	if(Number.isNaN(number) || number < 1 || number > 1000) {
		number = null;
	}

	return number;
}










// function temp(colourForeground, colourBackground) {
// 	const contrastWCAG = colourBackground.contrast(colourForeground, 'WCAG21');
// 	const contrastAPCA = Math.abs(colourBackground.contrast(colourForeground, 'APCA'));
// 	outputResult.textContent = `WCAG: ${contrastWCAG} APCA: ${contrastAPCA}`;
// }

// temp(ContrastCheck.colourForeground, ContrastCheck.colourBackground);