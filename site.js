import Colour from "/node_modules/colorjs.io/dist/color.js";
import { bridgeRatio as getBPCARatio, sRGBtoY } from "/node_modules/bridge-pca/src/bridge-pca.js";


const inputColourForeground = document.querySelector('#input-colour-foreground');
const inputColourBackground = document.querySelector('#input-colour-background');
const inputColourPickerForeground = document.querySelector('#input-colour-picker-foreground');
const inputColourPickerBackground = document.querySelector('#input-colour-picker-background');
const buttonColourPickerForeground = document.querySelector('#button-colour-picker-foreground');
const buttonColourPickerBackground = document.querySelector('#button-colour-picker-background');
const inputsFontSize = document.querySelectorAll('[id|=input-font-size]');
const inputFontWeight = document.querySelector('#input-font-weight');
const outputResult = document.querySelector('#output-result');

const symbolDisplayedValue = Symbol('displayedValue');
const WCAGfontSizeLarge = 24; /*18pt*/
const WCAGfontSizeMedium = 18.666666666666668; /*14pt*/

const State = {
	_colourForeground: null,
	_colourBackground: null,
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
		inputColourForeground.value = new Colour('#333');
		inputColourBackground.value = new Colour('#eee');
	}

	updateUI(state);
	initInputListeners(state)
}

function initInputListeners(state) {
	inputColourForeground.addEventListener('input', handleColourInputEvent(state));
	inputColourBackground.addEventListener('input', handleColourInputEvent(state));
	inputColourPickerForeground.addEventListener('input', handleColourInputEvent(state));
	inputColourPickerBackground.addEventListener('input', handleColourInputEvent(state));

	if('showPicker' in HTMLInputElement.prototype) {
		buttonColourPickerForeground.addEventListener('click', () => inputColourPickerForeground.showPicker());
		buttonColourPickerBackground.addEventListener('click', () => inputColourPickerBackground.showPicker());
	}
	else {
		buttonColourPickerForeground.setAttribute('hidden', '');
		buttonColourPickerBackground.setAttribute('hidden', '');
	}

	for(const inputFontSize of inputsFontSize) {
		inputFontSize.addEventListener('input', handleFontSizeInputEvent(state));
	}

	inputFontWeight.addEventListener('change', handleFontWeightInputEvent(state));
}

function handleColourInputEvent(state) {
	return function(event) {
		let field;

		if(event.target.id === 'input-colour-foreground' || event.target.id === 'input-colour-picker-foreground') {
			field = 'colourForeground';
		}
		else if(event.target.id === 'input-colour-background' || event.target.id === 'input-colour-picker-background') {
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
		colour[symbolDisplayedValue] = value;
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
	const isHex = colourString.startsWith('#') || new RegExp(`^[0-9a-f]{${colourString.length}}$`, 'i').test(colourString);

	if(isHex) {
		if(colourString.startsWith('#')) {
			colourString = colourString.slice(1);
		}

		if(colourString.length === 1 || colourString.length === 2) {
			colourString = colourString.repeat(3);
		}

		if(colourString.length === 3 || colourString.length === 4) {
			const r = colourString[0].repeat(2);
			const g = colourString[1].repeat(2);
			const b = colourString[2].repeat(2);
			const a = colourString[3]?.repeat(2) ?? '';

			colourString = r + g + b + a;
		}

		colourString = '#' + colourString;
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

function updateUI(state) {
	const contrastDetails = getContrastDetails(state);

	updateContrastBooleanText(contrastDetails.colourPasses);
	updateColourInputValues(state);
	temp(contrastDetails);
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
	foreground = foreground.toGamut({space: 'srgb'});
	background = background.toGamut({space: 'srgb'});

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
	function getAlternativeContrasts(subject) {
		if(target === 'foreground') {
			return getContrasts(subject, background);
		}
		else if(target === 'background') {
			return getContrasts(foreground, subject);
		}
	}

	function getAdjustedColour(subject, lightness) {
		const newColour = new Colour(subject);

		newColour.oklch.l = lightness;

		// Using hex ensures that we stay with 256 possible values
		return new Colour(newColour.to('srgb').toString({format: 'hex'}));
	}

	const targetColour = target === 'foreground' ? foreground : background;
	let colourLow = new Colour(targetColour);
	let colourHigh = new Colour(targetColour);

	if(direction === 'lighter') {
		colourHigh = getAdjustedColour(colourHigh, 100);
	}
	else if(direction === 'darker') {
		colourLow = getAdjustedColour(colourLow, -100);
	}

	const scoreLow = getAlternativeContrasts(colourLow).score;
	const scoreHigh = getAlternativeContrasts(colourHigh).score;

	if(scoreLow < requiredScore && scoreHigh < requiredScore) {
		return null;
	}
	else if(scoreLow > scoreHigh) {
		const temporary = colourLow;
		colourLow = colourHigh;
		colourHigh = temporary;
	}

	let scorePrevious = null;
	let colourMiddle;
	let scoreMiddle;

	while(scorePrevious !== scoreMiddle) {
		const newLightness = (colourLow.oklch.l + colourHigh.oklch.l) / 2;

		scorePrevious = scoreMiddle;
		colourMiddle = getAdjustedColour(targetColour, newLightness);
		scoreMiddle = getAlternativeContrasts(colourMiddle).score;

		if(scoreMiddle < requiredScore) {
			colourLow = colourMiddle;
		}
		else if(scoreMiddle > requiredScore) {
			colourHigh = colourMiddle;
		}
	}

	return colourHigh;
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

function updateColourInputValues(state) {
	if(state.colourForeground !== null) {
		inputColourForeground.value = state.colourForeground[symbolDisplayedValue] ?? state.colourForeground.toString();
		inputColourPickerForeground.value = parseColour(state.colourForeground.to('srgb').toString({format: 'hex'}));
	}

	if(state.colourBackground !== null) {
		inputColourBackground.value = state.colourBackground[symbolDisplayedValue] ?? state.colourBackground.toString();
		inputColourPickerBackground.value = parseColour(state.colourBackground.to('srgb').toString({format: 'hex'}));
	}
}










function temp(contrastDetails) {
	const states = new Set([
		State.colourForeground,
		State.colourBackground,
		State.fontSize,
		State.fontWeight
	]);

	if(states.has(null)) {
		return;
	}

	const contrasts = getContrastDetails(State);
	const footer = document.querySelector('footer');

	footer.insertAdjacentHTML('afterend', `<br><br>WCAG: ${contrasts.contrastWCAG}<br>BPCA: ${contrasts.contrastBPCA}<br>APCA: ${contrasts.contrastAPCA}<br>${JSON.stringify(contrastDetails, null, '\t').replaceAll(/[{}]/g, '<br>&emsp;').replaceAll(',', '<br>&emsp;')}`);


	const boxCurrent = document.querySelector('.show-colour-current');
	const colourCurrentForeground = State.colourForeground.toString({format: 'hex'});
	const colourCurrentBackground = State.colourBackground.toString({format: 'hex'});
	boxCurrent.style.color = colourCurrentForeground;
	boxCurrent.style.background = colourCurrentBackground;
	boxCurrent.textContent = contrastDetails.contrastWCAG;

	if(contrastDetails.alternative !== null) {
		const alternatives = contrastDetails.alternative.colour;
		let colourForegroundLighter = alternatives.foreground.lighter;
		let colourBackgroundLighter = alternatives.background.lighter;
		let colourForegroundDarker = alternatives.foreground.darker;
		let colourBackgroundDarker = alternatives.background.darker;
		const boxForegroundLighter = document.querySelector('.show-colour-lighter-foreground');
		const boxBackgroundLighter = document.querySelector('.show-colour-lighter-background');
		const boxForegroundDarker = document.querySelector('.show-colour-darker-foreground');
		const boxBackgroundDarker = document.querySelector('.show-colour-darker-background');

		if(colourForegroundLighter) {
			colourForegroundLighter = colourForegroundLighter.toString({format: 'hex'});
			boxForegroundLighter.style.color = colourForegroundLighter;
			boxForegroundLighter.style.background = colourCurrentBackground;
			boxForegroundLighter.textContent = 'foreground: ' + colourForegroundLighter;
		}
		else {
			boxForegroundLighter.style.color = 'transparent';
			boxForegroundLighter.style.background = 'transparent';
		}

		if(colourBackgroundLighter) {
			colourBackgroundLighter =colourBackgroundLighter.toString({format: 'hex'});
			boxBackgroundLighter.style.color = colourCurrentForeground;
			boxBackgroundLighter.style.background = colourBackgroundLighter;
			boxBackgroundLighter.textContent = 'background: ' + colourBackgroundLighter;
		}
		else {
			boxBackgroundLighter.style.color = 'transparent';
			boxBackgroundLighter.style.background = 'transparent';
		}

		if(colourForegroundDarker) {
			colourForegroundDarker = colourForegroundDarker.toString({format: 'hex'});
			boxForegroundDarker.style.color = colourForegroundDarker;
			boxForegroundDarker.style.background = colourCurrentBackground;
			boxForegroundDarker.textContent = 'foreground: ' + colourForegroundDarker;
		}
		else {
			boxForegroundDarker.style.color = 'transparent';
			boxForegroundDarker.style.background = 'transparent';
		}

		if(colourBackgroundDarker) {
			colourBackgroundDarker = colourBackgroundDarker.toString({format: 'hex'});
			boxBackgroundDarker.style.color = colourCurrentForeground;
			boxBackgroundDarker.style.background = colourBackgroundDarker;
			boxBackgroundDarker.textContent = 'background: ' + colourBackgroundDarker;
		}
		else {
			boxBackgroundDarker.style.color = 'transparent';
			boxBackgroundDarker.style.background = 'transparent';
		}
	}
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