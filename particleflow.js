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
//preset: 566,13.43,13.32,39.87,0,1,0.5
//var ArrayFreq = [21.47, 1.6, 20.6]; 
var ArrayFreq = [25.5, 1.6, 1]; //247
//var ArrayFreq = [0.5, 2, 102.43]; //570
var ArrayPhaseIncr=[0,4,2];

var myfps = 60;
var phase = 3; //initial phase
var phase2 = 5.00;
var phase3 = 1.00;

var Imax = 247;

var EnableRecording = false;
var RecorderState = 0;
var EnableFixFrameRecording=true;
var NumOfFramesToCapture=180;


var capturer = new CCapture({
    format: 'gif',
    name: 'Flow8',
    frameRate: myfps,
    workersPath: './worker/',
    verbose: true,
    autoSaveTime: 15,
});

var freqSliders = [];
var freqInputs = [];
var IncrementInputs=[];
var ParticleCountInput;

function setup() {

    canv = createCanvas(300, 300);
    canv.parent('sketch-div');

    //myCanvas.mouseClicked(MyMouseEvent);
    // freqSlider = createSlider(0, 100, 6.67, 0.01);

    freqInputs[0] = document.getElementById("FreqTextInput");
    freqSliders[0] = document.getElementById("FreqSlideInput");
    freqInputs[1] = document.getElementById("Freq2TextInput");
    freqSliders[1] = document.getElementById("Freq2SlideInput");
    freqInputs[2] = document.getElementById("Freq3TextInput");
    freqSliders[2] = document.getElementById("Freq3SlideInput");
    ParticleCountInput = document.getElementById("NumberOfParticles");
    IncrementInputs[0]=document.getElementById("PhaseIncr");
    IncrementInputs[1]=document.getElementById("Phase2Incr");
    IncrementInputs[2]=document.getElementById("Phase3Incr");
    ParticleCountInput.Value=Imax;

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
        freqInputs[k].value=ArrayFreq[k];
        freqSliders[k].value=ArrayFreq[k];
    }
for (let k = 0; k < 3; k++){
    AddMyOnInputEventHandler(IncrementInputs[k],ArrayPhaseIncr,k,false);
    AddMyOnWheelEventHandler(IncrementInputs[k],1,ArrayPhaseIncr,k,false)
    console.log(ArrayPhaseIncr[k]);
    IncrementInputs[k].value=ArrayPhaseIncr[k];
}

    lblInfo = select("#lblInfo");
    lblX = select("#lblX");
    lblY = select("#lblY");

    lblMouseCoord = select("#MouseCoordinates");
    ellipseMode(RADIUS);
    blendMode(BLEND);
    //let slideFreq2 = createSlider(0, 100, 0, 0.1);
    frameRate(myfps);
    //if (RecorderState===0) capturer.start();

}

function RenderMyLoop() {

    background(255, 255, 255,255);

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


        //    // lblX.elt.innerHTML = "RecState: " + RecorderState + "</BR> freq: " + nf(freq, 1, 5) +
        //         "-- freq2: " + nf(freq2, 1, 5) +
        //         "-- freq3: " + nf(freq3, 1, 5) +
        //         "</BR>RotAngleIncrement= " + nf(((360 / Imax) * freq), 1, 4) +
        //         "<br>360/Angleincr: " + nf((360 / ((360 / Imax) * freq)), 1, 4) + " ~dots until repeat" +
        //         "</BR>Imax/freq= " + nf(((Imax / freq)), 1, 4) +
        //         "</BR>RepellAngleIncrement= " + nf(((360 / Imax) * freq3), 1, 4) +
        //         "--- Rounds= " + Rounds;

        // infoText += "i: " + i + "-->>rotangle: " + nf(rotangle, 1, 4) + " -- Massangle: " + nf(MassAngle, 1, 4) +
        //   " --                 repellAngle: " + nf(repellAngle, 1, 4) + "</BR>";
        //+
        //"</BR>---Phase:   " + nf(phase, 1, 4) + "-----------Phase2: " + nf(phase2, 1, 4) + " ------Phase3 : " + nf(
        //    phase3, 1, 4);

        //CoordText += "i:" + i + "-->x:" + nf(posx, 1, 4) + "-->y:" + nf(posy, 1, 4) + "..R=" +
        // nf(sqrt(posx * posx + posy * posy), 1, 4) + "</br>";

        //text(i, posx, posy);
    }

    lblInfo.elt.innerHTML = infoText;
    lblY.elt.innerHTML = CoordText;
    infoText = "";
    CoordText = "";

    phase = phase + ArrayPhaseIncr[0];
    phase2 = phase2 + ArrayPhaseIncr[1];
    phase3 = phase3 + ArrayPhaseIncr[2];

}

function draw() {
    //console.log(RecorderState);
    if (RecorderState === 1 && EnableRecording === true) {
        capturer.start();
        RecorderState = 2;
        console.log("Starting Recording: " + RecorderState);
    }

    // updateLabels(lblMouseCoord, mouseX, mouseY);
    RenderMyLoop();

    if (RecorderState === 2 && EnableRecording === true) {
        capturer.capture(canv.canvas);
    }

    if (EnableRecording===true && ((RecorderState === 3) || (EnableFixFrameRecording===true && frameCount>=NumOfFramesToCapture))){
        capturer.stop();
        capturer.save();
        RecorderState = 0;
        noLoop();
    }

}

function keyPressed() {
    if (key == "s" || key == "S") {

        if (isNaN(capturer) != false && RecorderState == 2) {
            RecorderState = 3; //stop Capture
        }
        console.log("STOP!. RecState: " + RecorderState);
        noLoop();
    }

    if (key == "g" || key == "G") {
        console.log("START LOOP!");
        loop();
    }

    if ((key == "c" || key == "C") && RecorderState === 0 && EnableRecording === true) {
        RecorderState = 1; //start Capture
    }
}

function freqInputChanged() {
    console.log(typeof(freqInputs.value()));
    if (typeof(freqInputs.value()) === "number") {
        freq = freqInputs.value()
        console.log("Number");
    }
}