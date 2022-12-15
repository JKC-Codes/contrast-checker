import Colour from "https://colorjs.io/dist/color.js";

const inputForeground = document.querySelector('#input-foreground');
const inputBackground = document.querySelector('#input-background');
const output = document.querySelector('#output');

inputForeground.addEventListener('input', handleColourInput);
inputBackground.addEventListener('input', handleColourInput);

function handleColourInput(event) {
	const parsedString = parseColour(event.target.value);
	const colourString = validateColour(parsedString);
	const field = event.target.id;

	if(colourString === null) {
		return;
	}


	// Temp
	console.log({colourString, field});
	if(field === 'input-foreground') {
		temp(new Colour(colourString), new Colour(parseColour(inputBackground.value) || '#eee'));
	}
	else if(field === 'input-background') {
		temp(new Colour(parseColour(inputForeground.value) || '#111'), new Colour(colourString));
	}
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
		return colourString;
	}
	catch(error) {
		return null;
	}
}







function temp(colourForeground, colourBackground) {
	const contrastWCAG = colourBackground.contrast(colourForeground, 'WCAG21');
	const contrastAPCA = Math.abs(colourBackground.contrast(colourForeground, 'APCA'));
	output.textContent = `WCAG: ${contrastWCAG} APCA: ${contrastAPCA}`;
}