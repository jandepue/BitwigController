
loadAPI(1); 

load("NovationImpulse61_Mapping.js"); // All mapping is done here
load("NovationImpulse61_HandlersRegistry.js"); // All mapping is done here
// load("MPKminiMkII_JDP_TrackControl.js");

// Define the controller

host.defineController("Novation", "Impulse61", "1.0", "fe8ac210-d83d-11e6-9598-0800200c9a66","De Pue De Vleesch");
host.defineSysexIdentityReply("F0 7E ?? 06 02 00 20 29 03 00 03 00 ?? ?? ?? ?? ?? F7");
host.addDeviceNameBasedDiscoveryPair(["NovationImpulse61"], ["NovationImpulse61"]);
host.defineMidiPorts(1, 1);

var isMacroOn = true;
var macroHasChanged = false;
var macro = [];
var param = [];
var nextParameterPageEnabled = true;
var prevParameterPageEnabled = true;
var paraPage = 0;
var paraPageOld = 42;
var showParameter = "";

// Function to toggle the Knobs between Macro and Device Mapping:
function toggleKnobs () {
    for ( var p = 0; p < 8; p++)
    {
	macro[p].getAmount().setIndication(isMacroOn);
	param[p].setIndication(!isMacroOn);
    }
}

// Function to deal with the Knobs:
function getEncoderTarget(knob, val) {
    if (isMacroOn) {
	return macro[knob].getAmount().set(val, 128);
    }
    else {
	return param[knob].set(val, 128);
    }
}

function getObserverIndexFunc(index, f) {
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
    for ( var p = 0; p < 8; p++) {
	macro[p] = cursorDevice.getMacro(p);
	macro[p].getAmount().setIndication(isMacroOn);
	param[p] = cursorDevice.getParameter(p);
	param[p].setIndication(!isMacroOn);
    }
    
    for ( var p = 0; p < 8; p++) {
	macro[p] = cursorDevice.getMacro(p);
	macro[p].getAmount().setIndication(isMacroOn);
	param[p] = cursorDevice.getParameter(p);
	param[p].setIndication(!isMacroOn);
    }

}


// MIDI Processing

function onMidiPort1(status, data1, data2) {

    ////Test Test 
    println(status)
    println(data1)
    println(data2)
    println("")
    
    //Checks if the MIDI data is a CC
    if (isChannelController(status)) {	
	
	// Macro knobs
	if (data1<30) {
	    
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
    }

}



// Sending out Midi to the Controller

function flush() {

}

// EXIT

function exit() {
    println("exit.");
}



