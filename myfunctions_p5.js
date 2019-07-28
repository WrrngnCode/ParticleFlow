function updateLabels(p5htmlelement,xpos1, ypos1) {

    p5htmlelement.elt.innerHTML = "X: " + xpos1 +"Y: " + ypos1;
    
    //lblInfo.innerHTML = "car.x: " + myCar.x + "           car.y: " + myCar.y;

    if (frameCount % 300 == 0) {
       // lblFrameRate.elt.innerHTML = frameRate() + " ---- " + frameCount.valueOf();

    }
}
function MyMouseEvent() {
    //redraw();
    console.log(myCar);
    console.log(obj);
    obj.myfunct();
}

function AddMyOnWheelEventHandler(myHtmlElement, incr, myArray, myIndex, WriteBackValue, displayingelement) {

    myHtmlElement.onwheel = function(e) {
        e.preventDefault();
        if (isNaN(myHtmlElement.value) === false && myHtmlElement.value!="") {
            if (e.deltaY > 0) {
                myHtmlElement.value = parseFloat(myHtmlElement.value) - parseFloat(incr)
            } else {
                myHtmlElement.value = parseFloat(myHtmlElement.value) + parseFloat(incr);
            }
            myArray[myIndex] = float(myHtmlElement.value);
            if (WriteBackValue) displayingelement.value = myArray[myIndex];
            //console.log("onwheel " + myHtmlElement.id)
        }
    };

}

function AddMyOnInputEventHandler(myHtmlElement, myArray, myIndex, WriteBackValue, displayingelement) {
    console.log(myHtmlElement.id+"--->"+myHtmlElement.value);
    myHtmlElement.oninput = function() {
        if (isNaN(myHtmlElement.value) === false && myHtmlElement.value!="") {
            myArray[myIndex] = float(myHtmlElement.value);
           //console.log(myHtmlElement);
            //console.log(myIndex +"---"+myArray[myIndex]);
            if (WriteBackValue) displayingelement.value = myArray[myIndex];
            console.log("oninput " + myHtmlElement.id);
        } else {
            console.log("Not a number " + myHtmlElement.id);
        }
        console.log(myHtmlElement.id+"--->>>>"+typeof(myHtmlElement.value));
    };

}

//  if (keyIsPressed==true && (key="s" || key=="S")) {
//     console.log("STOP1.");
//  }