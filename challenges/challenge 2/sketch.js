let handpose;
let video;
let predictions = [];
let modelLoaded = false;
let ballons = []; // Array voor de objecten van ballonen
let numBallons = 5; //hoeveelheid ballonnen

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  handpose = ml5.handpose(video, modelReady);

  // This sets up an event that fills the global variable "predictions"
  // with an array every time new hand poses are detected
  handpose.on("predict", results => {
    predictions = results;
    console.log(predictions);
  });

  // Hide the video element, and just show the canvas
  video.hide();

  //maken ballons
  for (let i = 0; i < numBallons; i++) {
    ballons.push(new Ballon(random(width), random(height))); 
  }
}

function modelReady() {
  console.log("Model ready!");
  modelLoaded = true;
}

function draw() {
  frameRate(30);
  if (modelLoaded) {
    image(video, 0, 0, width, height);
    
    // We can call both functions to draw all keypoints and the skeletons
    // drawKeypoints();
    drawFingers();
    
  }
  for (let i = 0; i < ballons.length; i++) {
    ballons[i].update();
    ballons[i].display();
    scale(1, -1);
  }

  
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  for (let i = 0; i < predictions.length; i += 1) {
    const prediction = predictions[i];
    for (let j = 0; j < prediction.landmarks.length; j += 1) {
      const keypoint = prediction.landmarks[j];
      fill(255, 213, 3);
      noStroke();
      ellipse(keypoint[0], keypoint[1], 10, 10);
    }
  }
}

function drawFingers() {
  console.log(predictions);
  push();
  rectMode(CORNERS);
  noStroke();
  fill(255, 213, 3);
  if (predictions[0] && predictions[0].hasOwnProperty("annotations")) {
    let index1 = predictions[0].annotations.indexFinger[0];
    let index2 = predictions[0].annotations.indexFinger[1];
    let index3 = predictions[0].annotations.indexFinger[2];
    let index4 = predictions[0].annotations.indexFinger[3];
    // circle(index1[0], index1[1], index1[2]);
    // circle(index2[0], index2[1], index2[2]);
    // circle(index3[0], index3[1], index3[2]);
    circle(index4[0], index4[1], 10);// index4[2]);
  }
  pop();
}

class Ballon {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 30;
    this.popped = false;
  }

  update() {
    // checken of de ballon is gepopt
    if (!this.popped) {
      for (let i = 0; i < predictions.length; i++) {
        const check = predictions[i];
        if (check.annotations) {
          let indexFinger = check.annotations.indexFinger;
        
          for (let j = 0; j < indexFinger.length; j++) {
            let finger = indexFinger[j];
            let distance = dist(finger[0], finger[1], this.x, this.y);
            if (distance < this.radius && !this.popped) {
              this.popped = true;
              console.log("Ballon popped!");
              // elke keer een andere ballon wanneer gepopt
              ballons.push(new Ballon(random(width), random(height)));
            }
          }
        }
      }
    }
  }

  display() {
    // Display ballon
    if (!this.popped) {
      fill(175, 3, 255);
      ellipse(this.x, this.y, this.radius * 2);
      noStroke();
    }
  }
}
