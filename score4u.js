// SCORE4U
// Rendering & editing engine
// Quim Llimona
// BCN MHD, 2012


//////////////////////////////
//
//  CONTEXT HANDLERS
//

var timeSignature, stave, canvas, renderer, ctx, beam;

function init() {
    canvas =  document.getElementById("scoreCanvas");
    renderer = new Vex.Flow.Renderer(canvas,Vex.Flow.Renderer.Backends.CANVAS);
    ctx = renderer.getContext();

    timeSignature = Vex.Flow.TIME4_4;
    setClef("treble");
    scrollRight();

    document.onkeydown = (function(key) {
    var key = window.event || key;
    switch(key.keyIdentifier) {
    case "Left":
    scrollLeft();
    break;
    case "Up":
    changePitch(1);
    break;
    case "Right":
    scrollRight();
    break;
    case "Down":
    changePitch(-1);
    break;
    case "Enter":
    validateNote();
    break;
    }
    draw();
    });
}

function setClef(newClef) {
    stave = new Vex.Flow.Stave(10, 0, 600);
    stave.addClef(newClef);
}

function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height)
    //beam = new Vex.Flow.Beam(notes);
    //beam.setContext(ctx).draw();
    stave.setContext(ctx).draw();
    Vex.Flow.Formatter.FormatAndDraw(ctx,stave,notes,timeSignature);
}

//////////////////////////////
//
//  NOTE HANDLERS
//

var pitch = 60, dur = "v", notes = [], noteIndex = 0, colors;
colors = {"normal":"#000000","highlight":"#FF0000"};


function replaceNote() {
    notes[noteIndex] = new Vex.Flow.StaveNote({ keys: [getNote()], duration: dur });
    notes[noteIndex].setColor(colors.highlight);
}

function insertNote() {
    notes.splice(noteIndex,0,new Vex.Flow.StaveNote({ keys: [getNote()], duration: dur }));
    notes[noteIndex].setColor(colors.highlight);
}

function deleteNote() {
    delete notes[noteIndex];
    if (notes.length == 0) {
        insertNote();
        notes[noteIndex].isTemp = true;
        notes[noteIndex].setColor(colors.highlight);
    } else if (noteIndex == notes.length) {
        noteIndex--;
        notes[noteIndex].setColor(colors.highlight);
    } else {
        notes[noteIndex].setColor(colors.highlight);
    }
}

function scrollLeft() {
    if (noteIndex != 0) {
        if (notes[noteIndex].isTemp) {
            notes.pop();
        } else {
            notes[noteIndex].setColor(colors.normal);
        }
        noteIndex = noteIndex - 1;
        notes[noteIndex].setColor(colors.highlight);
    }
}

function scrollRight() {
    if (notes.length == 0) {
            // Create new temp note
            notes.push(new Vex.Flow.StaveNote({keys: [getNote()], duration: dur }));
            notes[noteIndex].setColor(colors.highlight);
            notes[noteIndex].isTemp = true;
    }
    else if (!(notes[noteIndex].isTemp)) {
        if (noteIndex == notes.length-1) {
            // Create temp note
            notes.push(new Vex.Flow.StaveNote({keys: [getNote()], duration: dur }));
            notes[noteIndex].setColor(colors.normal);
            noteIndex++;
            notes[noteIndex].setColor(colors.highlight);
            notes[noteIndex].isTemp = true;
        } else {
            // Move forward
            notes[noteIndex].setColor(colors.normal);
            noteIndex++;
            notes[noteIndex].setColor(colors.highlight);
        }
    }
}

function changePitch(steps) {
    pitch += steps;
    replaceNote();
}

function getNote() {
    return "" + Vex.Flow.integerToNote.table[pitch%12] + "/" + (pitch/12);
}

function changeDur(newDur) {
    dur = newDur;
    replaceNote();
}

function validateNote() {
    notes[noteIndex].isTemp = false;
    scrollRight();
}