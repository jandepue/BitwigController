
// MIDI status channels
CCStatus = 176
PCStatus = 192
//LEDStatus = 144
LEDStatus = null

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
	LEFT : 0,
	RIGHT : 1,
	UP : null,
	DOWN : null,
};

var Knobs1 =
{
	Knob01 : 3,
	Knob02 : 4,
	Knob03 : 5,
	Knob04 : 6,
	Knob05 : 7,
	Knob06 : 8,
	Knob07 : 9,
	Knob08 : 10,
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
var panningLEFT=Joystick1.LEFT;
var panningRIGHT=Joystick1.RIGHT;
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


// PC & PB B - GUI Navigation
var note = PC1.PAD01;
var automation = PC1.PAD02;
var mixer = PC1.PAD03;
var device = PC1.PAD04;
var inspector = PC1.PAD05;
var perspective = PC1.PAD06;
var project = PC1.PAD07;
var browser = PC1.PAD08;



// ===================== PROGRAM 2 ======================= //

var Joystick2 = 
{
	LEFT : 43,
	RIGHT : 44,
	UP : 45,
	DOWN : 46,
};

//var Knobs2 =
//{
	//Knob01 : 3,
	//Knob02 : 4,
	//Knob03 : 5,
	//Knob04 : 6,
	//Knob05 : 7,
	//Knob06 : 8,
	//Knob07 : 9,
	//Knob08 : 10,
//};

var CC2 =
{
	PAD01 : 47,
	PAD02 : 48,
	PAD03 : 49,
	PAD04 : 50,
	PAD05 : 51,
	PAD06 : 52,
	PAD07 : 53,
	PAD08 : 54,
	PAD09 : 55,
	PAD10 : 56,
	PAD11 : 57,
	PAD12 : 58,
	PAD13 : 59,
	PAD14 : 60,
	PAD15 : 61,
	PAD16 : 62,
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
var moveLEFT=Joystick2.LEFT;
var moveRIGHT=Joystick2.RIGHT;
var moveUP=Joystick2.UP;
var moveDOWN=Joystick2.DOWN;


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
var startSlot00 = CC2.PAD05;
var startSlot01 = CC2.PAD01;
var startSlot10 = CC2.PAD06;
var startSlot11 = CC2.PAD02;
var startSlot20 = CC2.PAD07;
var startSlot21 = CC2.PAD03;
var startSlot30 = CC2.PAD08;
var startSlot31 = CC2.PAD04;

// CC & PB B - Navigation and Transpose + Mapping
var delSlot00 = CC2.PAD13;
var delSlot01 = CC2.PAD09;
var delSlot10 = CC2.PAD14;
var delSlot11 = CC2.PAD10;
var delSlot20 = CC2.PAD15;
var delSlot21 = CC2.PAD11;
var delSlot30 = CC2.PAD16;
var delSlot31 = CC2.PAD12;

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


