import Colour from "https://colorjs.io/dist/color.js";

const inputForeground = document.querySelector('#input-foreground');
const inputBackground = document.querySelector('#input-background');
const output = document.querySelector('#output');

inputForeground.addEventListener('input', handleColourInput);
inputBackground.addEventListener('input', handleColourInput);

function handleColourInput(event) {
	const newColour = validateColour(event.target.value);
	const field = event.target.id;

	// foo
}

function validateColour(colourString) {
	colourString = colourString.trim();

	// Expand 1 or 2 digit hex codes into full
	const regexHexStart = String.raw`^(?:[0-9a-f]{2}|[0-9a-f]{1})$`;
	if(new RegExp(regexHexStart, 'i').test(colourString)) {
		colourString = colourString.repeat(3);
	}

	// Allow hex codes without a # at the start
	const regexHexFull = String.raw`^(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})$`;
	if(new RegExp(regexHexFull, 'i').test(colourString)) {
		colourString = '#' + colourString;
	}

	try {
		console.log(colourString);
	}
	catch(error) {
		console.warn(error);
	}
}







// function temp(colourForeground, colourBackground) {
// 	const contrastWCAG = colourBackground.contrast(colourForeground, 'WCAG21');
// 	const contrastAPCA = Math.abs(colourBackground.contrast(colourForeground, 'APCA'));
// 	output.textContent = `WCAG: ${contrastWCAG} APCA: ${contrastAPCA}`;
// }