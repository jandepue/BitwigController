
// Program 1:
//	Joystick left/right: CC0
//	Joystick up/down: CC1/CC2
//	Knobs: CC3 - CC10
//	Pads CC : CC11 - CC26
//	Pads PC : CC27 - CC42

loadAPI(1); 

load("MPKminiMkII_JDP_Mapping.js"); // All mapping is done here
load("MPKminiMkII_JDP_HandlersRegistry.js"); // All mapping is done here
load("MPKminiMkII_JDP_TrackControl.js");

// Define the controller

host.defineController("JDP", "MPKminiMkII_JDP2", "1.0", "FBE16610-F98F-11E4-B939-0800200C9A66","Jan De Pue");
host.defineSysexIdentityReply("F0 7E ?? 06 02 00 20 29 03 00 03 00 ?? ?? ?? ?? ?? F7");
host.addDeviceNameBasedDiscoveryPair(["MPKminiMkII_JDP2"], ["MPKminiMkII_JDP2"]);
host.defineMidiPorts(1, 1);


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

var isMovingLeft = false;
var isMovingRight = false;
var isMovingUp = false;
var isMovingDown = false;
var moveLimit = 20;


var isPlaying = false;	
var lastCC = -99;
var visualFeedback_CCMin=11;
var visualFeedback_CCMax=18;
var transport_visualFeedback=false;

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



function selectSlotInBank(trackBank,trackIndex, slotIndex) {
		println('select')
		var channel = trackBank.getChannel(trackIndex);
		var clips = channel.getClipLauncherSlots();
		clips.select(slotIndex);
	};

function deleteSlot(trackBank,trackIndex, slotIndex, val) {
	if(val === 0){
		println('del')
		selectSlotInBank(trackBank,trackIndex, slotIndex);
		application.remove();
		//application.delete();
	}
};

function slot(trackBank, trackIndex, slotIndex, val, transport,isPlaying) {
		if(val === 0){
		var _slot = slots[trackIndex].trackSlots[slotIndex];
		var _track = tracks[trackIndex];
		
		select(trackBank, trackIndex, slotIndex);
		
		if(!_slot.hasContent) {
			select(trackBank, trackIndex, slotIndex);
			//Start rec on transport
			if(!isPlaying) {
				transport.play();
			}
			_track.record(slotIndex);
			_track.launch(slotIndex);
		}
		else if(_slot.hasContent && !_slot.isQueued && !_slot.isRecording && !_slot.isPlaying) {
			select(trackBank, trackIndex, slotIndex);
			_track.launch(slotIndex);
		}
		else if(_slot.hasContent && (_slot.isQueued || _slot.isRecording || _slot.isPlaying)) {
			select(trackBank, trackIndex, slotIndex);
			var playAfterStop = _slot.isRecording;
			_track.stop();
			if(playAfterStop) {
				_track.launch(slotIndex);
				_track.showInEditor(slotIndex);
			}
		}
	}
	};

function select(trackBank, trackIndex, slotIndex) {
		var _slot = slots[trackIndex].trackSlots[slotIndex];
		var _track = tracks[trackIndex];
		_track.select(slotIndex);
		trackBank.getChannel(trackIndex).select();
	};

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
	handlersRegistry = new HandlersRegistry();
	transport = host.createTransport();
	application = host.createApplication();
	cursorTrack = host.createEditorTrackSelection(true,0, 8);
	cursorDevice = cursorTrack.createEditorDeviceSelection(true);
	
	track = host.createCursorTrack(2, 0);
	device = track.getPrimaryDevice();

	transport.addIsPlayingObserver(function(value){
		isPlaying=value;
		println(isPlaying)
	});
	
	// Track Control
	
	slots=[]
	
	trackBank = host.createMainTrackBank(4, 2, tk_init.SCENES_NUM);
	track0 = trackBank.getChannel(0).getClipLauncherSlots();
	track1 = trackBank.getChannel(1).getClipLauncherSlots();
	track2 = trackBank.getChannel(2).getClipLauncherSlots();
	track3 = trackBank.getChannel(3).getClipLauncherSlots();
	track0.setIndication(true);
	track1.setIndication(true);
	track2.setIndication(true);
	track3.setIndication(true);
	
	tracks=[track0,track1,track2,track3];

	for (var i=0; i<4; i++) {
		var _trackSlots = [];
		for (var j=0; j<tk_init.SCENES_NUM; j++) {
			_trackSlots.push({
				isSelected: false,
				hasContent: false,
				isPlaying: false,
				isRecording: false,
				isQueued: false
			});
		}
		slots.push({
			trackSelected: false,
			trackSlots: _trackSlots
		});
	}
	
	for (var k=0; k<4; k++) {
		function setS(){
			var _track = tracks[k];
			var _i = k;
			trackBank.getChannel(_i).addIsSelectedObserver(function(isSelected){
				slots[_i].trackSelected = isSelected;
			});
			_track.addIsSelectedObserver(function(slotIndex, isSelected){
				slots[_i].trackSlots[slotIndex].isSelected = isSelected;
			});
			_track.addIsPlayingObserver(function(slotIndex, isPlaying){
				slots[_i].trackSlots[slotIndex].isPlaying = isPlaying;
			});
			_track.addHasContentObserver(function(slotIndex, hasContent){
				slots[_i].trackSlots[slotIndex].hasContent = hasContent;
			});
			_track.addIsRecordingObserver(function(slotIndex, isRecording){
				slots[_i].trackSlots[slotIndex].isRecording = isRecording;
			});
			_track.addIsQueuedObserver(function(slotIndex, isQueued){
				slots[_i].trackSlots[slotIndex].isQueued = isQueued;
			});
		};
		setS();
	}
	
	
	
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
		
		else if (data1<43){
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
		
		// Program II joystick
		else if (data1<47){
			switch (data1){
				case moveLEFT:
					if (!isMovingLeft && data2 > moveLimit){
						//application.arrowKeyLeft()
						trackBank.scrollTracksPageUp()
						isMovingLeft=true;
					}
					else if (isMovingLeft && data2<moveLimit){
						isMovingLeft=false;
					}
					break;
				case moveRIGHT:
					if (!isMovingRight && data2 > moveLimit){
						//application.arrowKeyRight()
						trackBank.scrollTracksPageDown()
						isMovingRight=true;
					}
					else if (isMovingRight && data2<moveLimit){
						isMovingRight=false;
					}
					break;
				case moveUP:
					if (!isMovingUp && data2 > moveLimit){
						//application.arrowKeyUp()
						trackBank.scrollScenesPageUp()
						isMovingUp=true;
					}
					else if (isMovingUp && data2<moveLimit){
						isMovingUp=false;
					}
					break;
				case moveDOWN:
					if (!isMovingDown && data2 > moveLimit){
						//application.arrowKeyDown()
						println('down')
						trackBank.scrollScenesPageDown()
						isMovingDown=true;
					}
					else if (isMovingDown && data2<moveLimit){
						isMovingDown=false;
					}
					break;
			}
		}
		
		// Program II CC slot control
		else if (data1<62){
			if (data2===0){
				switch (data1){
					case startSlot00:
						slot(trackBank, 0, 0, data2, transport, isPlaying)
						break;
					case startSlot01:
						slot(trackBank, 0, 1, data2, transport, isPlaying)
						break;
					case startSlot10:
						slot(trackBank, 1, 0, data2, transport, isPlaying)
						break;
					case startSlot11:
						slot(trackBank, 1, 1, data2, transport, isPlaying)
						break;
					case startSlot20:
						slot(trackBank, 2, 0, data2, transport, isPlaying)
						break;
					case startSlot21:
						slot(trackBank, 2, 1, data2, transport, isPlaying)
						break;
					case startSlot30:
						slot(trackBank, 3, 0, data2, transport, isPlaying)
						break;
					case startSlot31:
						slot(trackBank, 3, 1, data2, transport, isPlaying)
						break;
					case delSlot00:
						deleteSlot(trackBank, 0, 0, data2, transport)
						break;
					case delSlot01:
						deleteSlot(trackBank, 0, 1, data2, transport)
						break;
					case delSlot10:
						deleteSlot(trackBank, 1, 0, data2, transport)
						break;
					case delSlot11:
						deleteSlot(trackBank, 1, 1, data2, transport)
						break;
					case delSlot20:
						deleteSlot(trackBank, 2, 0, data2, transport)
						break;
					case delSlot21:
						deleteSlot(trackBank, 2, 1, data2, transport)
						break;
					case delSlot30:
						deleteSlot(trackBank, 3, 0, data2, transport)
						break;
					case delSlot31:
						deleteSlot(trackBank, 3, 1, data2, transport)
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
	
	lastCC=data1;

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
	
	if (lastCC>=visualFeedback_CCMin && lastCC<=visualFeedback_CCMin){
		
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
}

// EXIT

function exit()
{
	println("exit.");
}



