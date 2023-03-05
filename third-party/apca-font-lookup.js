// https://github.com/Myndex/SAPC-APCA/blob/master/data/LUT-GseriesMay28-2022.js

////////////////////////////////////////////////////////////////////////////////
/////  ——————————————————————————————————————————————————————————————————  /////
////////////////////////////////////////////////////////////////////////////////
/////     APCA FONT LOOKUP TABLES  •  May 28 2022 Edition   ////////////////////
////////////////////////////////////////////////////////////////////////////////
/////  ——————————————————————————————————————————————————————————————————  /////
////////////////////////////////////////////////////////////////////////////////


// APCA CONTRAST FONT LOOKUP TABLES
// Copyright © 2022 by Myndex Research and Andrew Somers. All Rights Reserved

// Public Beta 0.1.7 (G) • MAY 28 2022

/*        NOTES: These new arrays have a few more elements in them, to
/////     facilitate the new multi-use-case conformance concept, wherein
/////     different use cases have (essentially) different lookups.
/////
/////     On the SAPC site, this is demonstrated: the score array provides the
/////     adjustment factor, applied to the base font lookup table, as needed
/////     for different use cases.
// */

// A few additional elements were added to accommodate a new use-case
// conformance method.

// These arrays are in their natural sort order.
// The natural sort order then is ascending for font size and weight,
// And that then correlates with a descending contrast array.

/////    However, if sorted to ascending, then
////        Lc 45 * 0.2 = 9
///      and 9 is the index for the row for Lc 45



/////     TABLE OF CONTENTS     /////
//
//   A) Prepared Javascript Arrays
//     1) Index arrays - just 1D prototypes of the Y or X axis
//     2) Font Lookup Sorted by font size
//     3) Font Lookup Sorted by Contrast Lc
//     4) 'MAX' Font Lookup Sorted by Contrast Lc
//     5) Use Case Score Adjust array sorted by Contrast Lc
//     6) Font Lookup ASCENDING SORT by Contrast, as needed for APCA-W3
//        a) This includes the font interpolator function from APCA-W3
//
//   B) Prepared HTML Visual Tables
//     1) Font Lookup Sorted by font size
//     2) Font Lookup Sorted by Contrast Lc
//
//   C) Raw tab-delimited data from the development tool
//     1) Font Lookup Sorted by font size
//     2) Font Lookup Sorted by Contrast Lc
//     3) 'MAX' Font Lookup
//     4) Use Case Score Adjust
//
//



////////////////////////////////////////////////////////////////////////////////
/////     PREPARED JAVASCRIPT ARRAYS      //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
/////
/////  For all of the 2D arrays, element[0][0] is a terse identity string.
/////
/////  'px' - sorted by font size in px, first column is font size, Ascending
/////  'Lc' - sorted by contrast in Lc, first column is Lc, Descending
/////  'LcMax' - "Maximum Contrast Guideline" sorted by Lc, Descending
/////  'LcScr' - "Score Adjust Matrix" sorted by Lc, Descending
/////             See the demo at myndex.com/APCA/
/////  '∆...'  - This indicates the delta version of the array
/////
////////////////////////////////////////////////////////////////////////////////


// INDEX ARRAYS
// For the following arrays, the Y axis is contrastArrayLen
// The two x axis are weightArrayLen and scoreArrayLen


// MAY 25 2022 EXPANDED  //

const contrastArrayG = [0,125,120,115,110,105,100,95,90,85,80,75,70,65,60,55,50,45,40,35,30,25,20,15,10,0,];
const contrastArrayLenG = contrastArrayG.length; // Y azis

const weightArray = [0,100,200,300,400,500,600,700,800,900];
const weightArrayLen = weightArray.length;

const scoreArray = [0,1,2,3,4,5];
const scoreArrayLen = 6;

// Lc contrast minimums per master level and score level
// Lc, Spot, SubFluent, Fluent, BodyText, MAX
const fontScoreGmin = [         // CONTRAST LEVELS in Lc
	[90,60,67,78,90,90], // 0 MAX Large Headlines (> 36px & 700)
	[75,52,60,68,80,75], // 1 Min Cols of Body Text (manually set)
	[60,45,52,60,72,60], // 2 Min Content Text
	[45,36,42,50,60,45], // 3 Min Large content text
	[30,25,30,35,42,30], // 4 Min non-content text, min large icons
	[15,14,15,20,25,15], // 5 Min for all (invisibility level)
];

const minScoreG = fontScoreGmin[5][1]; // Hard minimum contrast, all levels.

const nonTextScoreG = fontScoreGmin[4][2];  // level to break to non-text only




////////////////////////////////////////////////////////////////////////////////
/////     SORTED BY FONT SIZE         /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

/////   GENERAL PURPOSE TEXT LOOKUP           /////
////  As used for printable/visual tables     ////
///   MAIN FONT LOOKUP May 25  2022 EXPANDED  ///
//    Sorted by Font Size WITH SYMBOLS        //


const byFontSizeSymbols = [
	['px',100,200,300,400,500,600,700,800,900],
	[10,'⊘','⊘','⊘','⊘','⊘','⊘','⊘','⊘','⊘'],
	[12,'⊘','⊘','⊘','®©','®©','®©','®©','⊘','⊘'],
	[14,'⊘','⊘','®©',100,100,90,75,'⊘','⊘'],
	[15,'⊘','⊘','®©',100,90,75,70,'⊘','⊘'],
	[16,'⊘','⊘','®©',90,75,70,60,60,'⊘'],
	[18,'⊘','®©',100,75,70,60,55,55,55],
	[21,'⊘','®©',90,70,60,55,50,50,50],
	[24,'⊘','®©',75,60,55,50,45,45,45],
	[28,'⊘',100,70,55,50,45,43,43,43],
	[32,'⊘',90,65,50,45,43,40,40,40],
	[36,'⊘',75,60,45,43,40,38,38,38],
	[42,100,70,55,43,40,38,35,35,35],
	[48,90,60,50,40,38,35,33,33,33],
	[60,75,55,45,38,35,33,30,30,30],
	[72,60,50,40,35,33,30,30,30,30],
	[96,50,45,35,33,30,30,30,30,30],
];


// MAIN FONT LOOKUP May 25, 2022
// Sorted by Font Size
// First row is standard weights 100-900
// First column is font size in px
// All other values are the Lc contrast
// 999 = too low. 777 = non-text and spot text only


const byFontSize = [
	['px',100,200,300,400,500,600,700,800,900],
	[10,999,999,999,999,999,999,999,999,999],
	[12,999,999,999,777,777,777,777,999,999],
	[14,999,999,777,100,100,90,75,999,999],
	[15,999,999,777,100,90,75,70,999,999],
	[16,999,999,777,90,75,70,60,60,999],
	[18,999,777,100,75,70,60,55,55,55],
	[21,999,777,90,70,60,55,50,50,50],
	[24,999,777,75,60,55,50,45,45,45],
	[28,999,100,70,55,50,45,43,43,43],
	[32,999,90,65,50,45,43,40,40,40],
	[36,999,75,60,45,43,40,38,38,38],
	[42,100,70,55,43,40,38,35,35,35],
	[48,90,60,50,40,38,35,33,33,33],
	[60,75,55,45,38,35,33,30,30,30],
	[72,60,50,40,35,33,30,30,30,30],
	[96,50,45,35,33,30,30,30,30,30],
];


// DELTA - MAIN FONT LOOKUP May 25 2022  -- EXPANDED
// Sorted by Font Size  –  Delta
// The pre-calculated deltas of the above array


const byFontSizeDelta = [
	['∆px',100,200,300,400,500,600,700,800,900],
	[10,0,0,0,0,0,0,0,0,0],
	[12,0,0,0,0,0,0,0,0,0],
	[14,0,0,0,0,10,15,5,0,0],
	[15,0,0,0,10,15,5,10,0,0],
	[16,0,0,0,15,5,10,5,5,0],
	[18,0,0,10,5,10,5,5,5,5],
	[21,0,0,15,10,5,5,5,5,5],
	[24,0,0,5,5,5,5,2,2,2],
	[28,0,10,5,5,5,2,3,3,3],
	[32,0,15,5,5,2,3,2,2,2],
	[36,0,5,5,2,3,2,3,3,3],
	[42,10,10,5,3,2,3,2,2,2],
	[48,15,5,5,2,3,2,3,3,3],
	[60,15,5,5,3,2,3,0,0,0],
	[72,10,5,5,2,3,0,0,0,0],
	[96,0,0,0,0,0,0,0,0,0],
];




////////////////////////////////////////////////////////////////////////////////
/////     SORTED BY LC VALUE     //////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
/////  CONTRAST * FONT WEIGHT & SIZE  ///////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

// Font size interpolations. Here the chart was re-ordered to put
// the main contrast levels each on one line, instead of font size per line.
// First column is LC value, then each following column is font size by weight

// G G G G G G

// Lc values under 70 should have Lc 15 ADDED if used for body text
// All font sizes are in px and reference font is Barlow

// 999: prohibited - too low contrast
// 777: NON TEXT at this minimum weight stroke
// 666 - this is for spot text, not fluent. Things like copyright or placeholder.
// 5xx - minimum font at this weight for content, 5xx % 500 for font-size
// 4xx - minimum font at this weight for any purpose], 4xx % 400 for font-size

////////////////////////////////////////////////////////////////////////////////

// MAIN FONT LOOKUP May 25 2022 EXPANDED
// Sorted by Lc Value
// First row is standard weights 100-900
// First column is font size in px
// All other values are the Lc contrast
// 999 = too low. 777 = non-text and spot text only


const fontMatrixG = [
	['Lc',100,200,300,400,500,600,700,800,900],
	[125,32,20,16,10,10,10,10,12,14],
	[120,33,21,16.5,11,10.75,10.5,10.25,13,15],
	[115,34.5,22.5,17.25,12.5,11.875,11.25,10.625,14.5,16.5],
	[110,36,24,18,14,13,12,11,16,18],
	[105,39,25,18,14.5,14,13,12,16,18],
	[100,42,26.5,18.5,15,14.5,13.5,13,16,18],
	[95,45,28,19.5,15.5,15,14,13.5,16,18],
	[90,48,32,21,16,15.5,14.5,14,16,18],
	[85,52,34.5,22,16.5,15.625,14.625,14,16,18],
	[80,56,38.25,23,17.25,15.81,14.81,14,16,18],
	[75,60,42,24,18,16,15,14,16,18],
	[70,64,44,28,19.5,18,16,14.5,16,18],
	[65,68,46,32,21.75,19,17,15,16,18],
	[60,72,48,42,24,21,18,16,16,18],
	[55,80,60,48,28,24,21,18,18,18],
	[50,96,72,60,32,28,24,21,21,21],
	[45,108,96,72,42,32,28,24,24,24],
	[40,120,108,96,60,48,42,32,32,32],
	[35,777,120,108,96,72,60,48,48,48],
	[30,777,777,120,108,108,96,72,72,72],
	[25,777,777,777,120,120,108,96,96,96],
	[20,777,777,777,777,777,777,777,777,777],
	[15,777,777,777,777,777,777,777,777,777],
	[10,999,999,999,999,999,999,999,999,999],
	[0,999,999,999,999,999,999,999,999,999],
];




// DELTA - MAIN FONT LOOKUP May 25 2022 EXPANDED],
//  EXPANDED  Sorted by Lc Value ••  DELTA
// The pre-calculated deltas of the above array


const fontDeltaG = [
	['∆Lc',100,200,300,400,500,600,700,800,900],
	[125,0,0,0,0,0,0,0,0,0],
	[120,1,1,0.5,1,0.75,0.5,0.25,1,1],
	[115,1.5,1.5,0.75,1.5,1.125,0.75,0.375,1.5,1.5],
	[110,1.5,1.5,0.75,1.5,1.125,0.75,0.375,1.5,1.5],
	[105,3,1,0,0.5,1,1,1,0,0],
	[100,3,1.5,0.5,0.5,0.5,0.5,1,0,0],
	[95,3,1.5,1,0.5,0.5,0.5,0.5,0,0],
	[90,3,4,1.5,0.5,0.5,0.5,0.5,0,0],
	[85,4,2.5,1,0.5,0.125,0.125,0,0,0],
	[80,4,3.75,1,0.75,0.188,0.188,0,0,0],
	[75,4,3.75,1,0.75,0.188,0.188,0,0,0],
	[70,4,2,4,1.5,2,1,0.5,0,0],
	[65,4,2,4,2.25,1,1,0.5,0,0],
	[60,4,2,10,2.25,2,1,1,0,0],
	[55,8,12,6,4,3,3,2,2,0],
	[50,16,12,12,4,4,3,3,3,3],
	[45,12,24,12,10,4,4,3,3,3],
	[40,12,12,24,18,16,14,8,8,8],
	[35,0,12,12,36,24,18,16,16,16],
	[30,0,0,12,12,36,36,24,24,24],
	[25,0,0,0,12,12,12,24,24,24],
	[20,0,0,0,0,0,0,0,0,0],
	[15,0,0,0,0,0,0,0,0,0],
	[10,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
];


////////////////////////////////////////////////////////////////////////////////
/////     MAX CONTRAST  --  SORTED BY LC VALUE     /////////////////////////////
////////////////////////////////////////////////////////////////////////////////

//  MAXIMUM CONTRAST  LOOKUP May 25 2022],
//  EXPANDED – Sorted by Lc Value],

//  Indicates the maximum contrast Lc for a given size/weight.
//  Essentially Lc 90 for large/bold fonts.


const fontMatrixMax = [
	['LcMax',100,200,300,400,500,600,700,800,900],
	[125,1,1,96,72,48,36,27,21,21],
	[120,1,1,96,72,48,36,27,21,21],
	[115,1,1,96,72,48,36,27,21,21],
	[110,1,1,96,72,48,36,27,21,21],
	[105,1,1,96,72,48,36,27,21,21],
	[100,1,1,96,72,48,36,27,21,21],
	[95,1,1,96,72,48,36,27,21,21],
	[90,1,1,108,84,56,42,33,27,24],
	[85,1,1,108,84,56,42,33,27,24],
	[80,1,1,108,84,56,42,33,27,24],
	[75,1,1,108,84,56,42,33,27,24],
	[70,1,1,108,84,56,42,33,27,24],
	[65,1,1,108,84,56,42,33,27,24],
	[60,1,1,108,84,56,42,33,27,24],
	[55,1,1,108,84,56,42,33,27,24],
	[50,1,1,108,84,56,42,33,27,24],
	[45,1,1,108,84,56,42,33,27,24],
	[40,1,1,108,84,56,42,33,27,24],
	[35,1,1,108,84,56,42,33,27,24],
	[30,1,1,108,84,56,42,33,27,24],
	[25,1,1,108,84,56,42,33,27,24],
	[20,1,1,108,84,56,42,33,27,24],
	[15,1,1,108,84,56,42,33,27,24],
	[10,1,1,999,999,999,999,999,999,999],
	[0,1,1,999,999,999,999,999,999,999],
];




// DELTA - MAXIMUM CONTRAST  LOOKUP May 25 2022],
// EXPANDED   –   Sorted by Lc Value],
// The pre-calculated deltas of the above array


const fontDeltaMax = [
	['ΔLcMax',100,200,300,400,500,600,700,800,900],
	[125,0,0,0,0,0,0,0,0,0],
	[120,0,0,0,0,0,0,0,0,0],
	[115,0,0,0,0,0,0,0,0,0],
	[110,0,0,0,0,0,0,0,0,0],
	[105,0,0,0,0,0,0,0,0,0],
	[100,0,0,0,0,0,0,0,0,0],
	[95,0,0,0,0,0,0,0,0,0],
	[90,0,0,12,12,8,6,6,6,3],
	[85,0,0,0,0,0,0,0,0,0],
	[80,0,0,0,0,0,0,0,0,0],
	[75,0,0,0,0,0,0,0,0,0],
	[70,0,0,0,0,0,0,0,0,0],
	[65,0,0,0,0,0,0,0,0,0],
	[60,0,0,0,0,0,0,0,0,0],
	[55,0,0,0,0,0,0,0,0,0],
	[50,0,0,0,0,0,0,0,0,0],
	[45,0,0,0,0,0,0,0,0,0],
	[40,0,0,0,0,0,0,0,0,0],
	[35,0,0,0,0,0,0,0,0,0],
	[30,0,0,0,0,0,0,0,0,0],
	[25,0,0,0,0,0,0,0,0,0],
	[20,0,0,0,0,0,0,0,0,0],
	[15,0,0,0,0,0,0,0,0,0],
	[10,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
];


////////////////////////////////////////////////////////////////////////////////
/////     USE-CASE BASED ADJUSTMENTS  --  SORTED BY LC VALUE     ///////////////
////////////////////////////////////////////////////////////////////////////////

/*
These use case adjustments overlay on the font lookup tables above, adjusting
each use case above or below that shown on the lookup table.

For a live demo, see the research tool at https://www.myndex.com/SAPC/
*/

//  G series SCORE LOOKUP May 25 ‘22 7pm
//  EXPANDED – Sorted by Lc
// Creation arameters:
// factor,0.5000,0.5000,0.6000,0.6000,Manual
// Pre,-10,10,60,30,Manual
// Post,20,17.5,-12,18,Manual

// Score adjust for new use cases.


const scoreLevelsPreCalcG = [
	['LcScr','Spot','SubFluent','Fluent','BodyText','MAX'],
	[125,120,120,120,120,125],
	[120,75,82.5,96,108,125],
	[115,72.5,80,93,105,125],
	[110,70,77.5,90,102,125],
	[105,67.5,75,87,99,125],
	[100,65,72.5,84,96,125],
	[95,62.5,70,81,93,95],
	[90,60,67.5,78,90,90],
	[85,57.5,65,75,87,85],
	[80,55,62.5,72,84,10],
	[75,52.5,60,69,81,10],
	[70,50,57.5,66,78,10],
	[65,47.5,55,63,75,10],
	[60,45,52.5,60,72,10],
	[55,42.5,50,57,68.5,10],
	[50,40,46.5,54,64.8,10],
	[45,37.5,42.9,50,60.7,10],
	[40,35,39,45,56.1,10],
	[35,30,34.8,40,50.6,10],
	[30,25,30,35,43.8,10],
	[25,20,25,30,37,10],
	[20,15,20,25,30,10],
	[15,10,15,20,25,10],
	[10,5,10,15,20,5],
	[0,1,1,1,1,1],
];




//  G series SCORE LOOKUP May 25 ‘22 7pm],
//   EXPANDED – Sorted by Lc],
// The pre-calculated deltas of the above array

// UNLIKE the other arrays, this one never has 0, as this delta is used as a
// divisor to determine interpolation adjustment values, so any zero delta
// is clamped at 1.

const scoreDeltaG = [
	['∆LcScr','∆Spot','∆SubFluent','˙∆Fluent','∆BodyText','∆MAX'],
	[125,1,1,1,1,1],
	[120,1,1,1,1,1],
	[115,2.5,2.5,3,3,1],
	[110,2.5,2.5,3,3,1],
	[105,2.5,2.5,3,3,1],
	[100,2.5,2.5,3,3,1],
	[95,2.5,2.5,3,3,1],
	[90,2.5,2.5,3,3,5],
	[85,2.5,2.5,3,3,5],
	[80,2.5,2.5,3,3,1],
	[75,2.5,2.5,3,3,1],
	[70,2.5,2.5,3,3,1],
	[65,2.5,2.5,3,3,1],
	[60,2.5,2.5,3,3,1],
	[55,2.5,2.5,3,3.5,1],
	[50,2.5,3.5,3,3.7,1],
	[45,2.5,3.7,4,4.1,1],
	[40,2.5,3.9,5,4.6,1],
	[35,5,4.2,5,5.5,1],
	[30,5,4.8,5,6.8,1],
	[25,5,5,5,6.8,1],
	[20,5,5,5,7,1],
	[15,5,5,5,5,1],
	[10,1,1,1,1,1],
	[0,1,1,1,1,1],
];



///////////////////////////////////////////////////////////////////////////////
//////////  ƒ  fontLookupAPCA()  0.1.7 (G)  //////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

export function fontLookupAPCA (contrast) {

  // APCA CONTRAST FONT LOOKUP TABLES
  // Copyright © 2022 by Myndex Research and Andrew Somers. All Rights Reserved
  // Public Beta 0.1.7 (G) • MAY 28 2022
  // For the following arrays, the Y axis is contrastArrayLen
  // The two x axis are weightArrayLen and scoreArrayLen

  // MAY 28 2022


  const contrastArrayAscend = ['lc',0,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100,105,110,115,120,125,];
  const contrastArrayLenAsc = contrastArrayAscend.length; // Y azis

  const weightArray = [0,100,200,300,400,500,600,700,800,900];
  const weightArrayLen = weightArray.length; // X axis

  let returnArray = [contrast.toFixed(3),0,0,0,0,0,0,0,0,0,];
  const returnArrayLen = returnArray.length; // X axis

//// Lc 45 * 0.2 = 9, and 9 is the index for the row for Lc 45

  contrast = Math.abs(contrast);
  const factor = 0.2; // 1/5
  let index = (contrast * factor) | 0 ; // n|0 is bw floor


///////////////////////////////////////////////////////////////////////////////
/////  CONTRAST * FONT WEIGHT & SIZE  //////////////////////////////////////

// Font size interpolations. Here the chart was re-ordered to put
// the main contrast levels each on one line, instead of font size per line.
// First column is LC value, then each following column is font size by weight

// G G G G G G  Public Beta 0.1.7 (G) • MAY 28 2022

// Lc values under 70 should have Lc 15 ADDED if used for body text
// All font sizes are in px and reference font is Barlow

// 999: prohibited - too low contrast
// 777: NON TEXT at this minimum weight stroke
// 666 - this is for spot text, not fluent-Things like copyright or placeholder.
// 5xx - minimum font at this weight for content, 5xx % 500 for font-size
// 4xx - minimum font at this weight for any purpose], 4xx % 400 for font-size

// MAIN FONT SIZE LOOKUP

//// ASCENDING SORTED  Public Beta 0.1.7 (G) • MAY 28 2022  ////

//// Lc 45 * 0.2 = 9 which is the index for the row for Lc 45

// MAIN FONT LOOKUP May 25 2022 EXPANDED
// Sorted by Lc Value
// First row is standard weights 100-900
// First column is font size in px
// All other values are the Lc contrast
// 999 = too low. 777 = non-text and spot text only


  const fontMatrixAscend = [
    ['Lc',100,200,300,400,500,600,700,800,900],
    [0,999,999,999,999,999,999,999,999,999],
    [10,999,999,999,999,999,999,999,999,999],
    [15,777,777,777,777,777,777,777,777,777],
    [20,777,777,777,777,777,777,777,777,777],
    [25,777,777,777,120,120,108,96,96,96],
    [30,777,777,120,108,108,96,72,72,72],
    [35,777,120,108,96,72,60,48,48,48],
    [40,120,108,96,60,48,42,32,32,32],
    [45,108,96,72,42,32,28,24,24,24],
    [50,96,72,60,32,28,24,21,21,21],
    [55,80,60,48,28,24,21,18,18,18],
    [60,72,48,42,24,21,18,16,16,18],
    [65,68,46,32,21.75,19,17,15,16,18],
    [70,64,44,28,19.5,18,16,14.5,16,18],
    [75,60,42,24,18,16,15,14,16,18],
    [80,56,38.25,23,17.25,15.81,14.81,14,16,18],
    [85,52,34.5,22,16.5,15.625,14.625,14,16,18],
    [90,48,32,21,16,15.5,14.5,14,16,18],
    [95,45,28,19.5,15.5,15,14,13.5,16,18],
    [100,42,26.5,18.5,15,14.5,13.5,13,16,18],
    [105,39,25,18,14.5,14,13,12,16,18],
    [110,36,24,18,14,13,12,11,16,18],
    [115,34.5,22.5,17.25,12.5,11.875,11.25,10.625,14.5,16.5],
    [120,33,21,16.5,11,10.75,10.5,10.25,13,15],
    [125,32,20,16,10,10,10,10,12,14],
  ];



// ASCENDING SORTED  Public Beta 0.1.7 (G) • MAY 28 2022 ////

// DELTA - MAIN FONT LOOKUP May 25 2022 EXPANDED
//  EXPANDED  Sorted by Lc Value ••  DELTA
// The pre-calculated deltas of the above array

  const fontDeltaAscend = [
    ['∆Lc',100,200,300,400,500,600,700,800,900],
    [0,0,0,0,0,0,0,0,0,0],
    [10,0,0,0,0,0,0,0,0,0],
    [15,0,0,0,0,0,0,0,0,0],
    [20,0,0,0,0,0,0,0,0,0],
    [25,0,0,0,12,12,12,24,24,24],
    [30,0,0,12,12,36,36,24,24,24],
    [35,0,12,12,36,24,18,16,16,16],
    [40,12,12,24,18,16,14,8,8,8],
    [45,12,24,12,10,4,4,3,3,3],
    [50,16,12,12,4,4,3,3,3,3],
    [55,8,12,6,4,3,3,2,2,0],
    [60,4,2,10,2.25,2,1,1,0,0],
    [65,4,2,4,2.25,1,1,0.5,0,0],
    [70,4,2,4,1.5,2,1,0.5,0,0],
    [75,4,3.75,1,0.75,0.188,0.188,0,0,0],
    [80,4,3.75,1,0.75,0.188,0.188,0,0,0],
    [85,4,2.5,1,0.5,0.125,0.125,0,0,0],
    [90,3,4,1.5,0.5,0.5,0.5,0.5,0,0],
    [95,3,1.5,1,0.5,0.5,0.5,0.5,0,0],
    [100,3,1.5,0.5,0.5,0.5,0.5,1,0,0],
    [105,3,1,0,0.5,1,1,1,0,0],
    [110,1.5,1.5,0.75,1.5,1.125,0.75,0.375,1.5,1.5],
    [115,1.5,1.5,0.75,1.5,1.125,0.75,0.375,1.5,1.5],
    [120,1,1,0.5,1,0.75,0.5,0.25,1,1],
    [125,0,0,0,0,0,0,0,0,0],
  ];


///////////////////////////////////////////////////////////////////////////
/////////  Font and Score Interpolation  \////////////////////////////////

  let tempFont = 777;
  let scoreAdj = 0.1;
  let w = 0;

  // populate returnArray with interpolated values

  // returnArray[w] = contrast;
  scoreAdj = (contrast - fontMatrixAscend[index][w]) * factor;
  w++;

  for (; w < weightArrayLen; w++) {

    tempFont = fontMatrixAscend[index][w];

    if (tempFont > 400) {
        returnArray[w] = tempFont;
    } else if (contrast < 41.0 ) {
        returnArray[w] = 666;
    } else {
                // INTERPOLATION OF FONT SIZE
               // sets level for 0.5 size increments of smaller fonts
              // Note bitwise (n|0) instead of floor
      (tempFont > 24) ?
        returnArray[w] =
            Math.round(tempFont - (fontDeltaAscend[index][w] * scoreAdj)) :
        returnArray[w] =
            tempFont - ((2.0 * fontDeltaAscend[index][w] * scoreAdj) | 0) * 0.5;
                                                            // (n|0) is bw floor
    }
  }
/////////\  End Interpolation   ////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

  return returnArray
}

////////\                            ///////////////////////////////////////////
/////////\   End fontLookupAPCA()   ///////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////