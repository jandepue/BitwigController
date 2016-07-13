
// Program 1:
//	Joystick left/right: CC0
//	Joystick up/down: CC1/CC2
//	Knobs: CC3 - CC10
//	Pads CC : CC11 - CC26
//	Pads PC : CC27 - CC42

loadAPI(1);

host.defineController("JDP", "MPKminiMkII_JDP", "1.0", "FBE16610-F98F-11E4-B939-0800200C9A66","Jan De Pue");
host.defineSysexIdentityReply("F0 7E ?? 06 02 00 20 29 03 00 03 00 ?? ?? ?? ?? ?? F7");
host.addDeviceNameBasedDiscoveryPair(["MPKminiMkII_JDP1"], ["MPKminiMkII_JDP1"]);
host.defineMidiPorts(1, 1);

// MIDI status channels
CCStatus = 176
PCStatus = 192
LEDStatus = 144

// List of CCs and PCs of the Pads:

var JoystickLR = 0;
var JoystickUP = 1;
var JoystickDOWN = 2;

var Knob01 = 3;
var Knob02 = 4;
var Knob03 = 5;
var Knob04 = 6;
var Knob05 = 7;
var Knob06 = 8;
var Knob07 = 9;
var Knob08 = 10;

var CC =
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
var PC =
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

// MAPPING

// Joystick
var panning=JoystickLR
var pitchbendUP=JoystickUP
var pitchbendDOWN=JoystickDOWN

//Knobs: Device Macros
var macro1=Knob01
var macro2=Knob02
var macro3=Knob03
var macro4=Knob04
var macro5=Knob05
var macro6=Knob06
var macro7=Knob07
var macro8=Knob08


// CC & PB 1 - Transport and Track
var stop = CC.PAD01;
var play = CC.PAD02;
var rec = CC.PAD03;
var od = CC.PAD04;
var toggleArmCursorTrack = CC.PAD05;
var toggleSoloCursorTrack = CC.PAD06;
var toggleMuteCursorTrack = CC.PAD07;
var clipOVR = CC.PAD08;

// CC & PB 2 - Navigation and Transpose + Mapping
var cursorTrackUp = CC.PAD13;
var cursorTrackDown = CC.PAD09;
var devPageUp = CC.PAD14;
var devPageDown = CC.PAD10;
var shiftPadsUp = CC.PAD15;
var shiftPadsDown = CC.PAD11;
var toggleMacro = CC.PAD16;
var nextMap = CC.PAD12;


// PC & PB 1 - Preset Navigation
var previousPreset = PC.PAD05;
var nextPreset = PC.PAD01;
var previousPresetCategory = PC.PAD06;
var nextPresetCategory = PC.PAD02;
var previousPresetCreator = PC.PAD07;
var nextPresetCreator = PC.PAD03;
var toggleMacro2 = PC.PAD08;
var nextMap2 = PC.PAD04;

// PC & PB 2 - GUI Navigation
var note = PC.PAD09;
var automation = PC.PAD10;
var mixer = PC.PAD11;
var device = PC.PAD12;
var inspector = PC.PAD13;
var perspective = PC.PAD14;
var project = PC.PAD15;
var browser = PC.PAD16;



// PC & PB 2 - GUI Navigation
var MagicLoop = 52;



// Define State and Value Variables

var isMapMacroPressed = false;
var padShift = 0;
var padshiftHasChanged = true;
var visualFeedback = true;


var isRecordOn = false;
var recordHasChanged = false;
var isPlayOn = false;
var playHasChanged = false;
var isStopOn = false;
var stopHasChanged = false;
var isOverdubOn = false;
var overdubHasChanged = false;
var isSoloOn = false;
var soloHasChanged = false;
var isArmOn = false;
var armHasChanged = false;
var isMuteOn = false;
var muteHasChanged = false;
var isClipOVROn = false;
var clipOVRHasChanged = false;

var presetName = "";
var presetHasChanged = false;
var presetCategory = "";
var categoryHasChanged = false;
var presetCreator = "";
var creatorHasChanged = false;
var deviceName = "";
var deviceHasChanged = false;
var trackName = "";
var trackHasChanged = false;

var isMacroOn = true;
var macroHasChanged = false;
var macro = [];
var param = [];
var nextParameterPageEnabled = true;
var prevParameterPageEnabled = true;
var paraPage = 0;
var paraPageOld = 42;
var showParameter = "";

var padTranslation = initArray(0, 128);

// Pad Translation function

function setNoteTable(table, offset) {
	for (var i = 0; i < 128; i++)
	{
		table[i] = offset + i;
		if (table[i] < 0 || table[i] > 127) {
			table[i] = -1;
		}
	}
	//println(offset)
	//println(padTranslation)
	MPKminiPads.setKeyTranslationTable(padTranslation);
	//padTrans.set(Math.floor(offset/8),1);
}


// Function to toggle the Knobs between Macro and Device Mapping:
function toggleKnobs () {
	for ( var p = 0; p < 8; p++)
	{
		macro[p].getAmount().setIndication(isMacroOn);
		param[p].setIndication(!isMacroOn);
	}
}

// Function to deal with the Knobs:
function getEncoderTarget(knob, val)
{
	if (isMacroOn) {
		return macro[knob].getAmount().set(val, 128);
	}
	else {
		return param[knob].set(val, 128);
	}
}

function getObserverIndexFunc(index, f)
{
	return function(value)
	{
		f(index, value);
	};
}


//------------------------------------ Init -----------------------------------//
function init()
{
	
	// Create Preferences, DocState and Visual Notifications:
	docState = host.getDocumentState();
	prefs = host.getPreferences();
	notif = host.getNotificationSettings();

	notif.setShouldShowChannelSelectionNotifications(true);
	notif.setShouldShowDeviceLayerSelectionNotifications(true);
	notif.setShouldShowDeviceSelectionNotifications(true);
	notif.setShouldShowMappingNotifications(true);
	notif.setShouldShowPresetNotifications(true);
	notif.setShouldShowSelectionNotifications(true);
	notif.setShouldShowTrackSelectionNotifications(true);
	notif.setShouldShowValueNotifications(true);
	
	//Pad Translation
	padTrans = docState.getNumberSetting("Pad Transpose", "Settings", -5, 11, 1, "Bank Steps", 0);
	//println(padTrans)
	padTrans.addValueObserver(1, function(value){
		if (value*8 != padShift) 
		{
			padShift = value*8;
			setNoteTable(padTranslation, padShift);
		}
	});
	
	//Creating a view onto our transport. 
	transport = host.createTransport();
	application = host.createApplication();
	cursorTrack = host.createEditorTrackSelection(true,0, 8);
	cursorDevice = cursorTrack.createEditorDeviceSelection(true);
	
	
	//-------- Set MIDI callbacks / port
	host.getMidiInPort(0).setMidiCallback(onMidiPort1);
	
	//Sends Notes to Bitwig, with no input filters. 
	//noteIn = host.getMidiInPort(0).createNoteInput("Notes");

	MPKminiKeys = host.getMidiInPort(0).createNoteInput("MPKmini Keys", "?0????");
	MPKminiPads = host.getMidiInPort(0).createNoteInput("MPKmini Pads", "?1????");

	MPKminiKeys.setShouldConsumeEvents(false);
	MPKminiPads.setShouldConsumeEvents(false);

	//MPKminiKeys.assignPolyphonicAftertouchToExpression(pitchbend,NoteExpression.PITCH_UP,5)
	//MPKminiPads.assignPolyphonicAftertouchToExpression(pitchbend,NoteExpression.PITCH_UP,5)
	
	//setNoteTable(padTranslation, 0);
	

	// Initialize macro and device parameters
	for ( var p = 0; p < 8; p++)
	{
		macro[p] = cursorDevice.getMacro(p);
		macro[p].getAmount().setIndication(isMacroOn);
		param[p] = cursorDevice.getParameter(p);
		param[p].setIndication(!isMacroOn);
	}
		
	// Setup Views and Callbacks:
	cursorTrack.getSolo().addValueObserver(function(on)
	{
		isSoloOn = on;
		soloHasChanged = true;
	});
	cursorTrack.getArm().addValueObserver(function(on)
	{
		isArmOn = on;
		armHasChanged = true;
	});
	cursorTrack.getMute().addValueObserver(function(on)
	{
		isMuteOn = on;
		muteHasChanged = true;
	});

	transport.addIsPlayingObserver(function(on)
	{
		isPlayingOn = on;
		playHasChanged = true;
	});
	transport.addIsRecordingObserver(function(on)
	{
		isRecordOn = on;
		recordHasChanged = true;
	});
	transport.addOverdubObserver(function(on)
	{
		isOverdubOn = on;
		overdubHasChanged = true;
	});
	transport.addLauncherOverdubObserver(function(on)
	{
		isClipOVROn = on;
		clipOVRHasChanged = true;
	});

	cursorDevice.addSelectedPageObserver(0, function(on){
		paraPage = on;
	})

	cursorDevice.addNextParameterPageEnabledObserver(function(on){
		nextParameterPageEnabled = on;
	})

	cursorDevice.addPreviousParameterPageEnabledObserver(function(on){
		prevParameterPageEnabled = on;
	})

	for ( var p = 0; p < 8; p++)
	{
		macro[p] = cursorDevice.getMacro(p);
		macro[p].getAmount().setIndication(isMacroOn);
		param[p] = cursorDevice.getParameter(p);
		param[p].setIndication(!isMacroOn);
	}

	//// Show the Bitwig Logo on the Pads :-)
	//sendNoteOn(LEDStatus, LED.PAD01, 127);
	//sendNoteOn(LEDStatus, LED.PAD06, 127);
	//sendNoteOn(LEDStatus, LED.PAD07, 127); 
	//sendNoteOn(LEDStatus, LED.PAD04, 127);
	
	////// testing
	//// status byte for controller led : 144
	//// arpegiattor, tap tempo, etc : data1 1 - 9
	//// pad 1 - 8: data1 9 - 17
	//// bandAB, CC, PC : data1 17 - 20
	
	////for (i = 144; i < 145; i++) {
		////println(i)
		////for (j = 130; j < 140 ; j++) { 
			////sendMidi(i, j, 127);
		////}
	////}
}


// MIDI Processing

function onMidiPort1(status, data1, data2)
{
	////Test Test 
	//println(status)
	//println(data1)
	//println(data2)
	
	//Checks if the MIDI data is a CC
	if (isChannelController(status)) {
		
		// Joystick
		//if (data1 == panning){
			
		//}
		//if (data1 == pitchbend){
			
		//}
		
						
		// Macro knobs
		if (data1<11) {
			
			switch (data1) {
				case macro1:
					getEncoderTarget(0, data2);
					//macro[0].getAmount().set(data2, 128);
					break;
				case macro2:
					getEncoderTarget(1, data2);
					//macro[0].getAmount().set(data2, 128);
					break;
				case macro3:
					getEncoderTarget(2, data2);
					//macro[0].getAmount().set(data2, 128);
					break;
				case macro4:
					getEncoderTarget(3, data2);
					//macro[0].getAmount().set(data2, 128);
					break;
				case macro5:
					getEncoderTarget(4, data2);
					//macro[0].getAmount().set(data2, 128);
					break;
				case macro6:
					getEncoderTarget(5, data2);
					//macro[0].getAmount().set(data2, 128);
					break;
				case macro7:
					getEncoderTarget(6, data2);
					//macro[0].getAmount().set(data2, 128);
					break;
				case macro8:
					getEncoderTarget(7, data2);
					//macro[0].getAmount().set(data2, 128);
					break;
			}
		}
		
		// CC PADS
		
		else {
			switch (data1) {
				
				// CC & PB 1
				case stop:
					transport.stop();
					showParameter = "stop";
					break;
				case play:
					println('play')
					transport.play();
					showParameter = "play";
					break;
				case rec:
					transport.record();
					showParameter = "record";
					break;
				case od:
					transport.toggleOverdub();
					showParameter = "ovr";
					break;
				case toggleArmCursorTrack:
					cursorTrack.getArm().toggle();
					showParameter = "arm";
					break;
				case toggleSoloCursorTrack:
					cursorTrack.getSolo().toggle();
					showParameter = "solo";
					break;
				case toggleMuteCursorTrack:
					cursorTrack.getMute().toggle();
					showParameter = "mute";
					break;
				case clipOVR:
					transport.toggleLauncherOverdub();
					showParameter = "clipovr";
					break;
				
			}
			
			if (data2 == 0) // do sth when button released
			{
				//println('you released a button')
				// These are workarounds for the fact that the pads overwrite their lighted state on release
				// So we have to re-send the light on message when the button is released...
				switch (data1)
				{
					case toggleArmCursorTrack:
						armHasChanged = true;
						break;
					case toggleSoloCursorTrack:
						soloHasChanged = true;
						break;
					case toggleMuteCursorTrack:
						muteHasChanged = true;
						break;
					case play:
						playHasChanged = true;
						break;
					case rec:
						recordHasChanged = true;
						break;
					case od:
						overdubHasChanged = true;
						break;
					 case clipOVR:
						clipOVRHasChanged = true;
						break;
						
					// CC & PB 2  Should be only executed on release
					case devPageUp:
						cursorDevice.selectPrevious();
						deviceHasChanged = true;
						paraPage = 0;
						paraPage = 42;
						break;
					case devPageDown:
						cursorDevice.selectNext();
						deviceHasChanged = true;
						paraPage = 0;
						paraPage = 42;
						break;
					case cursorTrackUp:
						cursorTrack.selectPrevious();
						trackHasChanged = true;
						break;
					case cursorTrackDown:
						cursorTrack.selectNext();
						trackHasChanged = true;
						break;
					case shiftPadsUp:
						if (padShift < 88)
						{
							padShift += 8;
							println(padShift)
							setNoteTable(padTranslation, padShift);
						}
						padshiftHasChanged = true;
						showParameter = "padshift";
						break;
					case shiftPadsDown:
						if (padShift > -40)
						{						
							padShift -= 8;
							println(padShift)
							setNoteTable(padTranslation, padShift);
						}
						padshiftHasChanged = true;
						showParameter = "padshift";
						break;
					case toggleMacro:
						isMacroOn = !isMacroOn;
						if (isMacroOn) {
						   knobMode.set(knobModeEnum[0]);
						}
						else {
						   knobMode.set(knobModeEnum[1]);
						}
							toggleKnobs();
							macroHasChanged = true;
							showParameter = "macro";
							break;
					case nextMap:
						if (!isMacroOn) {
							if (!nextParameterPageEnabled) {
								cursorDevice.setParameterPage(0);
							}
							else {
								cursorDevice.nextParameterPage();
							}
						}
						break;
				}
			}
			
			
		}
				
	}
	
	else if (isProgramChange(status)) {
		switch (data1) {
			// PC & PB 1
			case previousPreset:
				cursorDevice.switchToPreviousPreset();
				presetHasChanged = true;
				break;
			case nextPreset:
				cursorDevice.switchToNextPreset();
				presetHasChanged = true;
				break;
			case previousPresetCategory:
				cursorDevice.switchToPreviousPresetCategory();
				categoryHasChanged = true;
				break;
			case nextPresetCategory:
				cursorDevice.switchToNextPresetCategory();
				categoryHasChanged = true;
				break;
			case previousPresetCreator:
				cursorDevice.switchToPreviousPresetCreator();
				creatorHasChanged = true;
				break;
			case nextPresetCreator:
				cursorDevice.switchToNextPresetCreator();
				creatorHasChanged = true;
				break;
			case toggleMacro2:
				isMacroOn = !isMacroOn;
				if (isMacroOn) {
				   knobMode.set(knobModeEnum[0]);
				}
				else {
				   knobMode.set(knobModeEnum[1]);
				}
				toggleKnobs();
				macroHasChanged = true;
				showParameter = "macro";
				break;
			case nextMap2:
				if (!isMacroOn) {
					nextParameterPageEnabled ? cursorDevice.nextParameterPage() : cursorDevice.setParameterPage(0);
				}
				break;

			// PC & PB 2
			case inspector:
				application.toggleInspector();
				break;
			case perspective:
				application.nextPerspective();
				break;
			case project:
				application.nextProject();
				break;
			case browser:
				application.toggleBrowserVisibility();
				break;
			case note:
				application.toggleNoteEditor();
				break;
			case automation:
				application.toggleAutomationEditor();
				break;
			case mixer:
				application.toggleMixer();
				break;
			case device:
				application.toggleDevices();
				break;

		}
	}

}



// Sending out Midi to the Controller

function flush()
{
	if (visualFeedback && showParameter)
	{

		switch (showParameter) {
			case "padshift":
				if (padshiftHasChanged) {
					showParameter = "none";
					host.showPopupNotification("Pad Bank: " + padShift/8);
				}
				break;
			//case "arm":
			//	if (armHasChanged) {
			//	host.showPopupNotification("Arm: " + (isArmOn ? "On" : "Off"));
			//	}
			//	break;
			//case "solo":
			//	if (soloHasChanged) {
			//		showParameter = "none";
			//		host.showPopupNotification("Solo: " + (isSoloOn ? "On" : "Off"));
			//	}
			//	break;
			//case "mute":
			//	if (muteHasChanged) {
			//		showParameter = "none";
			//		host.showPopupNotification("Mute: " + (isSoloOn ? "On" : "Off"));
			//	}
			//	break;
			case "macro":
				if (macroHasChanged) {
					showParameter = "none";
					host.showPopupNotification((isMacroOn ? "Macro Mode" : "Device Mapping Mode"));
				}
            break;
		}
	}
	
	if (armHasChanged)
	{
		sendMidi(LEDStatus, LED.PAD05, isArmOn ? 127 : 0);
		armHasChanged = false;
	}
	if (soloHasChanged)
	{
		sendMidi(LEDStatus, LED.PAD06, isSoloOn ? 127 : 0);
		soloHasChanged = false;
	}
	if (muteHasChanged)
	{
		sendMidi(LEDStatus, LED.PAD07, isMuteOn ? 127 : 0);
		muteHasChanged = false;
	}
	if (playHasChanged)
	{
		println('playhaschanged')
		sendMidi(LEDStatus, LED.PAD02, isPlayingOn ? 127 : 0);
		sendMidi(LEDStatus, LED.PAD01, isPlayingOn ? 0 : 127);
		playHasChanged = false;
	}
	if (recordHasChanged)
	{
		sendMidi(LEDStatus, LED.PAD03, isRecordOn ? 127 : 0);
		recordHasChanged = false;
	}
	if (overdubHasChanged)
	{
		sendMidi(LEDStatus, LED.PAD04, isOverdubOn ? 127 : 0);
		overdubHasChanged = false;
	}
	if (clipOVRHasChanged)
	{
		sendMidi(LEDStatus, LED.PAD08, isClipOVROn ? 127 : 0);
		clipOVRHasChanged = false;
	}
}

// EXIT

function exit()
{
	println("exit.");
}



