import Colour from "/third-party/color-js.js";
import { bridgeRatio as getBPCARatio, sRGBtoY } from "/third-party/bridge-pca.js";


const inputColourForeground = document.querySelector('#input-colour-foreground');
const inputColourBackground = document.querySelector('#input-colour-background');
const inputsFontSize = document.querySelectorAll('[id|=input-font-size]');
const inputFontWeight = document.querySelector('#input-font-weight');
const outputResult = document.querySelector('#output-result');

const symbolDisplayedValue = Symbol('displayedValue');
const WCAGfontSizeLarge = 24; /*18pt*/
const WCAGfontSizeMedium = 18.666666666666668; /*14pt*/

const State = {
	_colourForeground: new Colour('#1a1a1a'),
	_colourBackground: new Colour('#fafafa'),
	_fontSize: 16,
	_fontWeight: 400,
	_history: [],

	pendingStateChange: false,

	criterionLevel: 'minimum',

	get colourForeground() {
		return this._colourForeground;
	},
	set colourForeground(value) {
		let oldValue = this._colourForeground;
		this._colourForeground = value;
		handleStateChange(oldValue, value, this);
	},

	get colourBackground() {
		return this._colourBackground;
	},
	set colourBackground(value) {
		let oldValue = this._colourBackground;
		this._colourBackground = value;
		handleStateChange(oldValue, value, this);
	},

	get fontSize() {
		return this._fontSize;
	},
	set fontSize(value) {
		let oldValue = this._fontSize;
		this._fontSize = value;
		handleStateChange(oldValue, value, this);
	},

	get fontWeight() {
		return this._fontWeight;
	},
	set fontWeight(value) {
		let oldValue = this._fontWeight;
		this._fontWeight = value;
		handleStateChange(oldValue, value, this);
	}
}


init(State);


function init(state) { // TODO
	if(false) {
		// TODO: update state with stored history
	}
	else {
		const hexForeground = state.colourForeground.toString({format: 'hex'});
		const hexBackground = state.colourBackground.toString({format: 'hex'});

		inputColourForeground.value = hexForeground;
		inputColourBackground.value = hexBackground;
		state.colourForeground[symbolDisplayedValue] = hexForeground;
		state.colourBackground[symbolDisplayedValue] = hexBackground;
	}

	updateUI(state);
	initInputListeners(state)
}

function initInputListeners(state) {
	inputColourForeground.addEventListener('input', handleColourInputEvent(state));
	inputColourBackground.addEventListener('input', handleColourInputEvent(state));
	for(const inputFontSize of inputsFontSize) {
		inputFontSize.addEventListener('input', handleFontSizeInputEvent(state));
	}
	inputFontWeight.addEventListener('change', handleFontWeightInputEvent(state));
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
			throw new Error(`Colour input's field ID not recognised`);
		}

		handleColourInput(event.target.value, field, state);
	}
}

function handleColourInput(value, field, state) {
	const colourString = parseColour(value);
	let colour = validateColour(colourString);

	if(colour !== null) {
		colour = new Colour(colour);
		colour[symbolDisplayedValue] = colourString;
	}

	state[field] = colour;
}

function handleFontSizeInputEvent(state) {
	if(inputsFontSize[0].type === 'radio') {
		return function(event) {
			handleFontSizeInput(Number.parseFloat(event.target.value), state);
		}
	}
	else if(inputsFontSize[0].type === 'number') {
		return function(event) {
			handleFontSizeInput(event.target.valueAsNumber, state);
		}
	}
	else {
		throw new Error('Font size input type not supported');
	}
}

function handleFontSizeInput(value, state) {
	state.fontSize = (Number.isNaN(value) || value <= 0) ? null : value;
}

function handleFontWeightInputEvent(state) {
	if(inputFontWeight.type === 'checkbox') {
		return function(event) {
			handleFontWeightInput(event.target.checked ? 700 : 400, state);
		}
	}
	else if(inputFontWeight.type === 'select-one') {
		return function(event) {
			handleFontWeightInput(Number.parseFloat(event.target.value), state);
		}
	}
	else {
		throw new Error('Font weight input type not supported');
	}
}

function handleFontWeightInput(value, state) {
	state.fontWeight = (Number.isNaN(value) || value < 1 || value > 1000) ? null : value;
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

	return colourString;
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

function handleStateChange(oldValue, newValue, state) {
	if(isSameInputValue(oldValue, newValue)) {
		return;
	}

	if(state.pendingStateChange === false) {
		state.pendingStateChange = true;
		requestAnimationFrame(() => {
			updateUI(state);
			state.pendingStateChange = false;
		});
	}
}

function isSameInputValue(oldValue, newValue) {
	if(oldValue === newValue) {
		return true;
	}
	else if(oldValue === null || newValue === null) {
		return false;
	}
	else if(
		typeof oldValue === 'object' &&
		typeof newValue === 'object' &&
		'xyz_d65' in oldValue && 'xyz_d65' in newValue &&
		oldValue.xyz_d65.x === newValue.xyz_d65.x &&
		oldValue.xyz_d65.y === newValue.xyz_d65.y &&
		oldValue.xyz_d65.z === newValue.xyz_d65.z
	) {
		return true;
	}
	else {
		return false;
	}
}

function updateUI(state) { // TODO
	const contrastDetails = getContrastDetails(state);

	updateContrastBooleanText(contrastDetails.colourPasses);
	temp();
}

function getContrastDetails(state) {
	const foreground = state.colourForeground;
	const background = state.colourBackground;
	const size = state.fontSize;
	const weight = state.fontWeight;
	const level = state.criterionLevel;

	const contrastDetails = {
		contrastWCAG: null,
		contrastAPCA: null,
		contrastBPCA: null,
		colourPasses: null,
		alternative: null
	};

	if(foreground !== null && background !== null && size !== null && weight !== null) {
		const contrasts = getContrasts(foreground, background, size, weight, level);
		const isLargeText = size >= WCAGfontSizeLarge || (size >= WCAGfontSizeMedium && weight >= 700);
		const requiredScore = getRequiredWCAGScore(level, isLargeText);
		const passes = contrasts.score >= requiredScore;

		contrastDetails.contrastWCAG = contrasts.contrastWCAG;
		contrastDetails.contrastAPCA = contrasts.contrastAPCA;
		contrastDetails.contrastBPCA = contrasts.contrastBPCA;
		contrastDetails.colourPasses = passes;

		if(passes === false) {
			contrastDetails.alternative = getAlternativeContrasts(state, contrasts, requiredScore);
		}
	}

	return contrastDetails;
}

function getContrasts(foreground, background) {
	const contrastWCAG = background.contrast(foreground, 'WCAG21');
	const contrastAPCA = background.contrast(foreground, 'APCA');
	const contrastBPCA = getBPCAContrast(contrastAPCA, foreground, background);
	const score = Math.min(contrastWCAG, Math.abs(contrastBPCA));

	return {
		score,
		contrastWCAG,
		contrastAPCA,
		contrastBPCA,
	};
}

function getBPCAContrast(APCA, foreground, background) {
	const foregroundLuminance = sRGBtoY(foreground.coords.map(colour => colour * 255));
	const backgroundLuminance = sRGBtoY(background.coords.map(colour => colour * 255));
	const BPCARatio = getBPCARatio(APCA, foregroundLuminance, backgroundLuminance, '', 100);

	return Number.parseFloat(BPCARatio);
}

function getRequiredWCAGScore(level, isLargeText) {
	if(level === 'minimum' && isLargeText) {
		return 3;
	}
	else if(level === 'enhanced' && !isLargeText) {
		return 7;
	}
	else {
		return 4.5;
	}
}

function getAlternativeContrasts(state, contrasts, requiredScore) {
	const alternatives = {
		font: {},
		colour: {},
	}

	alternatives.font = getAlternativeFonts(state.criterionLevel, contrasts.score, state.fontSize, state.fontWeight);
	alternatives.colour = getAlternativeColours(state.colourForeground, state.colourBackground, requiredScore);

	return alternatives;
}

function getAlternativeFonts(level, score, size, weight) {
	const alternativeFonts = {
		size: null,
		weight: null,
		sizeAndWeight: {
			size: null,
			weight: null
		},
	}

	if(score >= getRequiredWCAGScore(level, true)) {
		alternativeFonts.size = WCAGfontSizeLarge

		if(weight < 700) {
			if(size < WCAGfontSizeMedium) {
				alternativeFonts.sizeAndWeight = {
					size: WCAGfontSizeMedium,
					weight: 700
				}
			}
			else {
				alternativeFonts.weight = 700;
			}
		}
		else {
			alternativeFonts.size = WCAGfontSizeMedium;
		}
	}

	return alternativeFonts;
}

function getAlternativeColours(foreground, background, requiredScore) {
	const alternativeColours = {
		foreground: {},
		background: {}
	};

	alternativeColours.foreground.lighter = getAlternativeColour(foreground, background, requiredScore, 'foreground', 'lighter');
	alternativeColours.foreground.darker = getAlternativeColour(foreground, background, requiredScore, 'foreground', 'darker');
	alternativeColours.background.lighter = getAlternativeColour(foreground, background, requiredScore, 'background', 'lighter');
	alternativeColours.background.darker = getAlternativeColour(foreground, background, requiredScore, 'background', 'darker');

	return alternativeColours;
}

function getAlternativeColour(foreground, background, requiredScore, target, direction) {
	let subject;
	let control;
	let lightnessMin = 0;
	let lightnessMax = 1;
	let contrastLightnessMin;
	let contrastLightnessMax;

	if(target === 'foreground') {
		subject = new Colour(foreground);
		control = background;
	}
	else if(target === 'background') {
		subject = new Colour(background);
		control = foreground;
	}

	if(direction === 'lighter') {
		lightnessMin = subject.oklch.l;
	}
	else if(direction === 'darker') {
		lightnessMax = subject.oklch.l;
	}

	function getAltContrasts(subject) {
		let contrasts;

		if(target === 'foreground') {
			contrasts = getContrasts(subject, control);
		}
		else if(target === 'background') {
			contrasts = getContrasts(control, subject);
		}

		contrasts.score = Number.parseFloat(contrasts.score.toFixed(10));

		return contrasts;
	}

	subject.oklch.l = lightnessMin;
	contrastLightnessMin = getAltContrasts(subject).score;
	subject.oklch.l = lightnessMax;
	contrastLightnessMax = getAltContrasts(subject).score;

	if(contrastLightnessMin < requiredScore && contrastLightnessMax < requiredScore) {
		return null;
	}

	while(contrastLightnessMin !== requiredScore && contrastLightnessMax !== requiredScore) {
		const lightnessMid = (lightnessMax + lightnessMin) / 2;
		subject.oklch.l = lightnessMid;
		const contrastLightnessMid = getAltContrasts(subject).score;

		if(contrastLightnessMid < requiredScore) {
			if(contrastLightnessMin < contrastLightnessMax) {
				lightnessMin = lightnessMid;
			}
			else if(contrastLightnessMin > contrastLightnessMax) {
				lightnessMax = lightnessMid;
			}
		}
		else if(contrastLightnessMid > requiredScore) {
			if(contrastLightnessMin < contrastLightnessMax) {
				lightnessMax = lightnessMid;
			}
			else if(contrastLightnessMin > contrastLightnessMax) {
				lightnessMin = lightnessMid;
			}
		}
		else {
			lightnessMin = lightnessMid;
			lightnessMax = lightnessMid;
			break;
		}

		subject.oklch.l = lightnessMin;
		contrastLightnessMin = getAltContrasts(subject).score;
		subject.oklch.l = lightnessMax;
		contrastLightnessMax = getAltContrasts(subject).score;
	}

	return subject;
}

function updateContrastBooleanText(colourPasses) {
	let contrastBooleanText = '';

	if(colourPasses === true) {
		contrastBooleanText = 'Passes';
	}
	else if(colourPasses === false) {
		contrastBooleanText = 'Fails';
	}

	outputResult.textContent = contrastBooleanText;
}










function temp() {
	const states = new Set([
		State.colourForeground,
		State.colourBackground,
		State.fontSize,
		State.fontWeight
	]);

	if(states.has(null)) {
		return;
	}

	const contrasts = getContrasts(State.colourForeground, State.colourBackground, State.fontSize, State.fontWeight, State.criterionLevel);

	outputResult.innerHTML += `<br><br>WCAG: ${contrasts.contrastWCAG}<br>BPCA: ${contrasts.contrastBPCA}<br>APCA: ${contrasts.contrastAPCA}`;
}

// const regexNumber = String.raw`(?:[+-]?\d+(?:\.\d+)?|\.\d+)`;

// function parseNumber(numberString) {
// 	numberString = numberString.trim();
// 	const regexNumberString = new RegExp(`((?<!${regexNumber}))(${regexNumber})([^]*)`);
// 	const resultArray = regexNumberString.exec(numberString) || ['', '', null, ''];
// 	let number = Number.parseFloat(resultArray[2]);

// 	if(isNaN(number)) {
// 		number = null;
// 	}

// 	return {
// 		number: number,
// 		before: resultArray[1],
// 		after: resultArray[3]
// 	}
// }