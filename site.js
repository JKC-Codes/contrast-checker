import Colour from "/color.js";

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



	console.log({colourString, field});
	temp(colourString, field);
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







function temp(colourString, field) {
	let colourForeground = new Colour(parseColour(inputForeground.value) || '#111');
	let colourBackground = new Colour(parseColour(inputBackground.value) || '#eee');

	if(field === 'input-foreground') {
		colourForeground = new Colour(colourString);
	}
	else if(field === 'input-background') {
		colourBackground = new Colour(colourString);
	}

	const contrastWCAG = colourBackground.contrast(colourForeground, 'WCAG21');
	const contrastAPCA = Math.abs(colourBackground.contrast(colourForeground, 'APCA'));
	output.textContent = `WCAG: ${contrastWCAG} APCA: ${contrastAPCA}`;
}