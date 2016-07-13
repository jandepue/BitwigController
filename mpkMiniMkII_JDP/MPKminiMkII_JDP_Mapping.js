
// MIDI status channels
CCStatus = 176
PCStatus = 192
LEDStatus = 144

var LED=
{
	PAD01 : 9,
	PAD02 : 10,
	PAD03 : 11,
	PAD04 : 12,
	PAD05 : 13,
	PAD06 : 14,
	PAD07 : 15,
	PAD08 : 16,	
};


// List of CCs and PCs of the Pads:

// ===================== PROGRAM 1 ======================= //

var Joystick1 = 
{
	LR : 0
	UP : 1
	DOWN : 2
};

var Knobs1 =
{
	Knob01 : 3
	Knob02 : 4
	Knob03 : 5
	Knob04 : 6
	Knob05 : 7
	Knob06 : 8
	Knob07 : 9
	Knob08 : 10
};

var CC1 =
{
	PAD01 : 11,
	PAD02 : 12,
	PAD03 : 13,
	PAD04 : 14,
	PAD05 : 15,
	PAD06 : 16,
	PAD07 : 17,
	PAD08 : 18,
	PAD09 : 19,
	PAD10 : 20,
	PAD11 : 21,
	PAD12 : 22,
	PAD13 : 23,
	PAD14 : 24,
	PAD15 : 25,
	PAD16 : 26
};

var PC1 =
{
	PAD01 : 27,
	PAD02 : 28,
	PAD03 : 29,
	PAD04 : 30,
	PAD05 : 31,
	PAD06 : 32,
	PAD07 : 33,
	PAD08 : 34,
	PAD09 : 35,
	PAD10 : 36,
	PAD11 : 37,
	PAD12 : 38,
	PAD13 : 39,
	PAD14 : 40,
	PAD15 : 41,
	PAD16 : 42
};


// MAPPING

// Joystick
var panning=Joystick1.LR;
var pitchbendUP=Joystick1.UP;
var pitchbendDOWN=Joystick1.DOWN;

//Knobs: Device Macros
var macro1=Knobs1.Knob01
var macro2=Knobs1.Knob02
var macro3=Knobs1.Knob03
var macro4=Knobs1.Knob04
var macro5=Knobs1.Knob05
var macro6=Knobs1.Knob06
var macro7=Knobs1.Knob07
var macro8=Knobs1.Knob08


// CC & PB A - Transport and Track
var stop = CC1.PAD01;
var play = CC1.PAD02;
var rec = CC1.PAD03;
var od = CC1.PAD04;
var toggleArmCursorTrack = CC1.PAD05;
var toggleSoloCursorTrack = CC1.PAD06;
var toggleMuteCursorTrack = CC1.PAD07;
var clipOVR = CC1.PAD08;

// CC & PB B - Navigation and Transpose + Mapping
var cursorTrackUp = CC1.PAD13;
var cursorTrackDown = CC1.PAD09;
var devPageUp = CC1.PAD14;
var devPageDown = CC1.PAD10;
var shiftPadsUp = CC1.PAD15;
var shiftPadsDown = CC1.PAD11;
var toggleMacro = CC1.PAD16;
var nextMap = CC1.PAD12;


// PC & PB A - Preset Navigation
var previousPreset = PC1.PAD013;
var nextPreset = PC1.PAD09;
var previousPresetCategory = PC1.PAD014;
var nextPresetCategory = PC1.PAD10;
var previousPresetCreator = PC1.PAD015;
var nextPresetCreator = PC1.PAD11;
var toggleMacro2 = PC1.PAD016;
var nextMap2 = PC1.PAD12;

//var previousPreset = PC1.PAD05;
//var nextPreset = PC1.PAD01;
//var previousPresetCategory = PC1.PAD06;
//var nextPresetCategory = PC1.PAD02;
//var previousPresetCreator = PC1.PAD07;
//var nextPresetCreator = PC1.PAD03;
//var toggleMacro2 = PC1.PAD08;
//var nextMap2 = PC1.PAD04;

// PC & PB B - GUI Navigation
var note = PC1.PAD01;
var automation = PC1.PAD02;
var mixer = PC1.PAD03;
var device = PC1.PAD04;
var inspector = PC1.PAD05;
var perspective = PC1.PAD06;
var project = PC1.PAD07;
var browser = PC1.PAD08;

//var note = PC1.PAD09;
//var automation = PC1.PAD10;
//var mixer = PC1.PAD11;
//var device = PC1.PAD12;
//var inspector = PC1.PAD13;
//var perspective = PC1.PAD14;
//var project = PC1.PAD15;
//var browser = PC1.PAD16;



// ===================== PROGRAM 2 ======================= //

var Joystick2 = 
{
	LR : 50
	UP : 51
	DOWN : 52
};

//var Knobs2 =
//{
	//Knob01 : 3
	//Knob02 : 4
	//Knob03 : 5
	//Knob04 : 6
	//Knob05 : 7
	//Knob06 : 8
	//Knob07 : 9
	//Knob08 : 10
//};

var CC2 =
{
	PAD01 : 61,
	PAD02 : 62,
	PAD03 : 63,
	PAD04 : 64,
	PAD05 : 65,
	PAD06 : 66,
	PAD07 : 67,
	PAD08 : 68,
	PAD09 : 69,
	PAD10 : 70,
	PAD11 : 71,
	PAD12 : 72,
	PAD13 : 73,
	PAD14 : 74,
	PAD15 : 75,
	PAD16 : 76
};

//var PC2 =
//{
	//PAD01 : 27,
	//PAD02 : 28,
	//PAD03 : 29,
	//PAD04 : 30,
	//PAD05 : 31,
	//PAD06 : 32,
	//PAD07 : 33,
	//PAD08 : 34,
	//PAD09 : 35,
	//PAD10 : 36,
	//PAD11 : 37,
	//PAD12 : 38,
	//PAD13 : 39,
	//PAD14 : 40,
	//PAD15 : 41,
	//PAD16 : 42
//};


// MAPPING

// Joystick
var panning=Joystick1.LR;
var pitchbendUP=Joystick1.UP;
var pitchbendDOWN=Joystick1.DOWN;

////Knobs: Device Macros
//var macro1=Knobs1.Knob01
//var macro2=Knobs1.Knob02
//var macro3=Knobs1.Knob03
//var macro4=Knobs1.Knob04
//var macro5=Knobs1.Knob05
//var macro6=Knobs1.Knob06
//var macro7=Knobs1.Knob07
//var macro8=Knobs1.Knob08


// CC & PB A - Transport and Track
var stop = CC1.PAD01;
var play = CC1.PAD02;
var rec = CC1.PAD03;
var od = CC1.PAD04;
var toggleArmCursorTrack = CC1.PAD05;
var toggleSoloCursorTrack = CC1.PAD06;
var toggleMuteCursorTrack = CC1.PAD07;
var clipOVR = CC1.PAD08;

//// CC & PB B - Navigation and Transpose + Mapping
//var cursorTrackUp = CC1.PAD13;
//var cursorTrackDown = CC1.PAD09;
//var devPageUp = CC1.PAD14;
//var devPageDown = CC1.PAD10;
//var shiftPadsUp = CC1.PAD15;
//var shiftPadsDown = CC1.PAD11;
//var toggleMacro = CC1.PAD16;
//var nextMap = CC1.PAD12;


//// PC & PB A - Preset Navigation
//var previousPreset = PC1.PAD05;
//var nextPreset = PC1.PAD01;
//var previousPresetCategory = PC1.PAD06;
//var nextPresetCategory = PC1.PAD02;
//var previousPresetCreator = PC1.PAD07;
//var nextPresetCreator = PC1.PAD03;
//var toggleMacro2 = PC1.PAD08;
//var nextMap2 = PC1.PAD04;

//// PC & PB B - GUI Navigation
//var note = PC1.PAD09;
//var automation = PC1.PAD10;
//var mixer = PC1.PAD11;
//var device = PC1.PAD12;
//var inspector = PC1.PAD13;
//var perspective = PC1.PAD14;
//var project = PC1.PAD15;
//var browser = PC1.PAD16;



// PC & PB 2 - GUI Navigation
var MagicLoop = 52;
