var canv;
var mcircle = 200;
var col;
var r;
var lblInfo;
var lblX, lblY, lblMouseCoord;
var rotangle = 0;
var MassAngle = 0;
var posx, posy = 0;
var infoText = "";
var repell = 0;
var repellAngle = 0;
var CoordText = "";

//****ADJUST THESE TO CONTROL THE ANIMATION */
var Imax = 247; //Number of particles
var ArrayFreq = [108.51, 0.9, 180.26]; //Array of Frequencies that define the shape animation 
var ArrayPhaseIncr = [0, 2, 1.6]; //Array of phase offsets that control the motion of the animation
//****ADJUST THESE TO CONTROL THE ANIMATION */

//******SOME NICE PRESETS ********/
//Preset 1
//var Imax = 570;
//var ArrayFreq = [0.5, 2, 102.43]; //Imax=570
//var ArrayPhaseIncr = [0.1, 0, 0.5]

//Preset 2
//var Imax=566;
//var ArrayFreq = [13.43,13.32,39.87];
//var ArrayPhaseIncr = [0.1, 0, 0.5];

//Preset 3
//var Imax=277;
//var ArrayFreq = [72.13, 72.29, 89.85]; 
//var ArrayPhaseIncr = [0, 1, 1];
//******SOME NICE PRESETS *********/

var phase = 0; //initial phase for Frequency 1
var phase2 = 0.00; //initial phase for Frequency 2
var phase3 = 0.00; //initial phase for Frequency 3

//****ADJUST THESE TO CONTROL THE ANIMATION */
//SET EnableRecording = true to allow capturing. Press key C to start */
//SET RecorderState = 1 to start recording automatically */
//SET EnableFixFrameRecording = true to stop capturing after <NumOfFramesToCapture> frames */
//Press key S to stop capturing at any time */
var EnableRecording = true;
var RecorderState = 0;
var EnableFixFrameRecording = true;
var NumOfFramesToCapture = 360; // at 60 frames per second
//****ADJUST THESE TO CONTROL THE ANIMATION */

var myfps = 60;
var capturer = new CCapture({
    format: 'gif',
    name: 'GifParticleFlow_2',
    frameRate: myfps,
    workersPath: './worker/',
    verbose: true,
    autoSaveTime: 20,
});

var freqSliders = [];
var freqInputs = [];
var IncrementInputs = [];
var ParticleCountInput;

function setup() {

    canv = createCanvas(300, 300);
    canv.parent('sketch-div');

    ParticleCountInput = document.getElementById("NumberOfParticles");
    freqInputs[0] = document.getElementById("FreqTextInput");
    freqSliders[0] = document.getElementById("FreqSlideInput");
    freqInputs[1] = document.getElementById("Freq2TextInput");
    freqSliders[1] = document.getElementById("Freq2SlideInput");
    freqInputs[2] = document.getElementById("Freq3TextInput");
    freqSliders[2] = document.getElementById("Freq3SlideInput");
    IncrementInputs[0] = document.getElementById("PhaseIncr");
    IncrementInputs[1] = document.getElementById("Phase2Incr");
    IncrementInputs[2] = document.getElementById("Phase3Incr");
    ParticleCountInput.Value = Imax;

    ParticleCountInput.oninput = function() {
        if (isNaN(ParticleCountInput.value) === false && ParticleCountInput.value <= 1300) {
            Imax = ParticleCountInput.value;
        }
    };
    for (let k = 0; k < 3; k++) {
        AddMyOnInputEventHandler(freqInputs[k], ArrayFreq, k, true, freqSliders[k]);
        AddMyOnInputEventHandler(freqSliders[k], ArrayFreq, k, true, freqInputs[k]);
        AddMyOnWheelEventHandler(freqInputs[k], 0.5, ArrayFreq, k, true, freqSliders[k]);
        AddMyOnWheelEventHandler(freqSliders[k], 0.2, ArrayFreq, k, true, freqInputs[k])
        freqInputs[k].value = ArrayFreq[k];
        freqSliders[k].value = ArrayFreq[k];
    }
    for (let k = 0; k < 3; k++) {
        AddMyOnInputEventHandler(IncrementInputs[k], ArrayPhaseIncr, k, false);
        AddMyOnWheelEventHandler(IncrementInputs[k], 1, ArrayPhaseIncr, k, false)
        IncrementInputs[k].value = ArrayPhaseIncr[k];
    }

    lblInfo = select("#lblInfo");
    lblX = select("#lblX");
    lblY = select("#lblY");

    lblMouseCoord = select("#MouseCoordinates");
    ellipseMode(RADIUS);
    blendMode(BLEND);

    frameRate(myfps);

    if (EnableRecording == false) {
        console.log("Capturing disabled");
    } else {
        console.log("Capturing Enabled.");
        if (EnableFixFrameRecording == true && RecorderState == 0) {
            console.log("Press C to capture "+ NumOfFramesToCapture+ " frames.");
        }
    }
}

function RenderMyLoop() {

    background(255, 255, 255, 255);
    translate(150, 150);
    //rotate(radians(rot));

    for (let i = 1; i <= Imax; i++) {
        // mcircle = 200 + 50 * sin(millis() * freq * i);

        mcircle = 100 + 50 * sin(radians(MassAngle));
        repell = 40 * sin(radians(repellAngle));

        posx = (70 + repell) * cos(radians(rotangle));
        posy = (70 + repell) * sin(radians(rotangle));

        rotangle = phase + i * (ArrayFreq[0]);
        MassAngle = phase2 + i * (ArrayFreq[1])
        repellAngle = phase3 + i * (ArrayFreq[2])

        col = map(mcircle, 50, 150, 255, 60);
        r = map(mcircle, 50, 150, 4, 1);

        fill(col, 0, 74);
        noStroke();
        ellipse(posx, posy, r, r);
    }
    phase = phase + ArrayPhaseIncr[0];
    phase2 = phase2 + ArrayPhaseIncr[1];
    phase3 = phase3 + ArrayPhaseIncr[2];

}

function draw() {

    if (RecorderState === 1 && EnableRecording === true && typeof capturer !== "undefined") {
        capturer.start();
        RecorderState = 2;
        console.log("Recording started...");
    }
    RenderMyLoop();

    if (RecorderState === 2 && EnableRecording === true) {
        capturer.capture(canv.canvas);
    }

    if (EnableRecording === true && ((RecorderState === 3) || (RecorderState == 2 && EnableFixFrameRecording === true &&
            frameCount >= NumOfFramesToCapture))) {
        capturer.stop();
        capturer.save();
        RecorderState = 0;
        noLoop();
    }
}

function keyPressed() {

    if (key == "s" || key == "S") {
        //console.log(capturer);
        if (typeof capturer !== "undefined" && RecorderState == 2) {
            RecorderState = 3; //stop Capture
            console.log("Recording stopped!. Saving file...");
            noLoop();
            return;
        }
        console.log("Animation stopped.");
        noLoop();
    }

    if ((key == "g" || key == "G") && keyCode !== 103) {
        console.log("Animation Started.");
        loop();
    }

    if ((key == "c" || key == "C") && keyCode !== 99 && RecorderState === 0 && EnableRecording === true) {
        if (typeof capturer !== "undefined") {
            RecorderState = 1; //Initialize capture
        }
    }

    if ((key == "f" || key == "F") && keyCode !== 102) {
        for (let i = 0; i < 3; i++) {
            freqInputs[i].value = random(0, 265.33)
            freqInputs[i].oninput();
        }
    }
}

function AddMyOnWheelEventHandler(myHtmlElement, incr, myArray, myIndex, WriteBackValue, displayingelement) {

    myHtmlElement.onwheel = function(e) {
        e.preventDefault();
        if (isNaN(myHtmlElement.value) === false && myHtmlElement.value != "") {
            if (e.deltaY > 0) {
                myHtmlElement.value = parseFloat(myHtmlElement.value) - parseFloat(incr)
            } else {
                myHtmlElement.value = parseFloat(myHtmlElement.value) + parseFloat(incr);
            }
            myArray[myIndex] = parseFloat(myHtmlElement.value);
            if (WriteBackValue) displayingelement.value = myArray[myIndex];
            //console.log("onwheel " + myHtmlElement.id)
        }
    };
}

function AddMyOnInputEventHandler(myHtmlElement, myArray, myIndex, WriteBackValue, displayingelement) {

    myHtmlElement.oninput = function() {
        if (isNaN(myHtmlElement.value) === false && myHtmlElement.value != "") {
            myArray[myIndex] = parseFloat(myHtmlElement.value);
            if (WriteBackValue) displayingelement.value = myArray[myIndex];
        }
    };
}