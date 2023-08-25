let polySynth;
let audioOn = false;

const radius = 100;
/**
 * Represent the coordinate on screen
 * @typedef Coordinate
 * @type {Object}
 * @property {number} x the x coordinate
 * @property {number} y the y coordinate
 */

/** @type {Coordinate} */
let canvasCenter = { x: 200, y: 200 };

const rootRadius = 15;
const chordRadius = 8;
const octaveRadiusOffset = 5;

let sound;
let fft;
let osc;
let indexFrame = 0;
let root = 0;
let type = "maj";
let canvas = null;

function setup() {
  canvas = createCanvas(400, 400, document.getElementById("canvas"));
  windowResized();
  createInstruments();
  // Add a text label to start the sound
  mute.checked = true;
  mute.addEventListener("click", startAudio);

  //fill the chord select element with the chord types
  const chordSelect = document.getElementById("chord");
  //empty the select element
  chordSelect.innerHTML = "";
  Object.keys(chordsMap).forEach((chord) => {
    const option = document.createElement("option");
    option.value = chord;
    option.text = chord;
    chordSelect.appendChild(option);
  });
  // fill the root select element with the root notes
  const rootSelect = document.getElementById("root");
  //empty the select element
  rootSelect.innerHTML = "";
  Object.keys(rootMap).forEach((root) => {
    const option = document.createElement("option");
    option.value = root;
    option.text = root;
    rootSelect.appendChild(option);
  });
  // check the random chord checkbox
  document
    .getElementById("randomChord")
    .addEventListener("click", checkRandomChord);
  checkRandomChord();
}

function windowResized() {
  //Parent div of the canvas
  const visualizer = document.getElementById("visualizer");
  // small canvas so that flexbox can resize it
  //make the canvas float

  resizeCanvas(100, 100);
  setTimeout(resize, 1);
}

function resize() {
  // Get the width and height of the visualizer element
  const width = visualizer.clientWidth;
  const height = Math.min(width, visualizer.clientHeight);
  // Resize the canvas to match the visualizer element's size
  //resizeCanvas(width, height);
  canvasCenter.x = width / 2;
  canvasCenter.y = height / 2;
  resizeCanvas(width, height);
}

function startAudio() {
  userStartAudio();
  audioOn = true;
  mute.checked = false;
  mute.removeEventListener("click", startAudio);
  mute.addEventListener("click", muteAudio);
}

function muteAudio() {
  audioOn = !mute.checked;
  osc.stop();
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    if (music.checked) sound.play();
  }
}

function createInstruments() {
  // create a synth and connect it to the master output (your speakers)
  polySynth = new p5.PolySynth();
  polySynth.setADSR(0.01, 0.1, 1.5, 0.1); // attack, decay, sustain, release
  fft = new p5.FFT(0.01);
  osc = new p5.Oscillator();
  osc.setType("sine");
}

function preload() {
  if (window.location.protocol === "file:") {
    // Dont load sound if we are running from the file system
  } else {
  sound = loadSound("./OldOak.mp3");
}
}

function playChord(root, type) {
  if (audioOn && !sound.isPlaying()) {
    type.forEach((interval) => {
      let freq = midiToFreq(57 + root);
      //polySynth.play(freq, 1, 0, 0.35);
      osc.freq(freq);
      osc.amp(0.5);
      osc.start();
    });
  }
}

function draw() {
  background(220);
  drawOctave();
  drawNoteNames();
  drawFFT();

  // check if root and chord have changed
  if (
    !document.getElementById("randomChord").checked &&
    (rootMap[document.getElementById("root").value] !== root ||
      chordsMap[document.getElementById("chord").value] !== type)
  ) {
    indexFrame = 0;
  }

  if (indexFrame++ % 60 === 0) {
    // get the root from the #root select element
    // get the chord from the #chord select element
    root = rootMap[document.getElementById("root").value];
    type = chordsMap[document.getElementById("chord").value];
    if (document.getElementById("randomChord").checked) {
      root = Math.floor(Math.random() * 12);
      randomChord = Math.floor(Math.random() * Object.keys(chordsMap).length);
      type = chordsMap[Object.keys(chordsMap)[randomChord]];
    }
    playChord(root, type);
  }
  drawChord(root, type);
}

function drawFFT() {
  let spectrum = fft.analyze();
  for (midi = 57; midi < 93; midi++) {
    let frequency = midiToFreq(midi);
    let amplitude = fft.getEnergy(frequency * 0.99, frequency * 1.01);
    // draw the frequency spectrum on the circle
    let offset = midi - 57;
    let angle = (offset * 2 * PI) / 12;
    let octave = Math.floor(offset / 12);
    let x =
      canvasCenter.x + (radius + octave * octaveRadiusOffset) * cos(angle);
    let y =
      canvasCenter.y + (radius + octave * octaveRadiusOffset) * sin(angle);
    amplitude /= 255;
    amplitude *= amplitude;
    amplitude *= amplitude;
    let s = map(amplitude, 0, 1, 0, octaveRadiusOffset);

    fill(255, 0, 0);
    if (amplitude > 0.9) fill(255, 255, 0);

    ellipse(x, y, s, s);
  }
}
function drawOctave() {
  noFill();
  //dark gray
  stroke(200);
  ellipse(canvasCenter.x, canvasCenter.y, radius * 2, radius * 2);
  //light gray
  stroke(205);
  ellipse(
    canvasCenter.x,
    canvasCenter.y,
    radius * 2 + octaveRadiusOffset * 2,
    radius * 2 + octaveRadiusOffset * 2
  );
  //light gray
  stroke(210);
  ellipse(
    canvasCenter.x,
    canvasCenter.y,
    radius * 2 + octaveRadiusOffset * 4,
    radius * 2 + octaveRadiusOffset * 4
  );
  stroke(0);
  fill(0);
}

function drawNoteNames() {
  for (note in Object.values(inverseRootMap)) {
    const coordinate = noteToCoordinates(note, radius + octaveRadiusOffset * 8);
    const noteName = inverseRootMap[note];
    fill(0);
    textAlign(CENTER, CENTER);
    text(noteName, Math.max(0, coordinate.x), Math.max(0, coordinate.y));
  }
}

function checkRandomChord() {
  if (document.getElementById("randomChord").checked) {
    document.getElementById("chord").disabled = true;
    document.getElementById("root").disabled = true;
  } else {
    document.getElementById("chord").disabled = false;
    document.getElementById("root").disabled = false;
  }
}

/**
 * How to represent the note on the circle, Chromatic or Fifth
 * @typedef {1|5} AngleMode
 */

/**
 * Represent the angles modes
 * @readonly
 * @enum {AngleMode}
 */
const AngleModes = {
  Chromatic: 1,
  Fifth: 5,
};

/**
 * @typedef {number} Angle
 */

/**
 * Take a note and return the angle on the circle
 * @param {*} note
 * @param {AngleMode} [mode] default to the mode selected on the UI
 * @returns {Angle}
 */
function noteToAngle(note, mode) {
  if (mode === undefined)
    mode = AngleModes[coordinateSystem.value] || AngleModes.Chromatic;
  let angle = 0;
  const circleOfFifths = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5]; // [0, 5, 10, 3, 8, 1, 6, 11, 4, 9, 2, 7];
  switch (mode) {
    case AngleModes.Chromatic:
      angle = ((note % 12) * PI) / 6;
      break;
    case AngleModes.Fifth:
      angle = (circleOfFifths[note % 12] * PI) / 6;
      break;
  }
  return angle;
}

/**
 *
 * @param {number} note the Midi representation of the note
 * @param {number} [radius=200] radius of the circle
 * @param {Coordinate} [center=CanvasCenter] the center the circle (default to the center of the canvas)]
 * @param {AngleMode} [mode] Coordinate Mode [default to UI or Chromatic]
 * @returns {Coordinate}
 */
function noteToCoordinates(note, radius, center = canvasCenter, mode) {
  const angle = noteToAngle(note, mode);
  return angleToCoordinate(angle, radius, center);
}

/**
 *
 * @param {Angle} angle the radian angle
 * @param {number} [radius=200] radius of the circle
 * @param {Coordinate} [center=CanvasCenter] the center the circle (default to the center of the canvas)]
 * @returns {Coordinate}
 */
function angleToCoordinate(angle, radius, center = canvasCenter) {
  const x = center.x + radius * cos(angle);
  const y = center.y + radius * sin(angle);
  return { x, y };
}

/**
 *
 * @param {number} root
 * @param {number[]} chordType
 */
function drawChord(root, chordType) {
  //check the option from the #shape select element

  if (document.getElementById("polygon").checked)
    drawPolygonChord(root, chordType);
  if (document.getElementById("star").checked) drawStarChord(root, chordType);
  if (document.getElementById("circleShape").checked)
    drawCircleChord(root, chordType);
  // write the name of the chord on the top left
  const rootName = inverseRootMap[root];
  let chordName = Object.keys(chordsMap).find(
    (key) => JSON.stringify(chordsMap[key]) === JSON.stringify(chordType)
  );
  chordName = rootName + chordName;
  fill(0);
  textAlign(LEFT, TOP);
  text(
    chordName,
    Math.max(0, canvasCenter.x - 200),
    Math.max(0, canvasCenter.y - 200)
  );
}

/**
 * Draw a star from the center to the root and the other notes
 * the center branch is larger than the others
 *
 * the circle is divided into 12 parts (one for each half step note)
 * It draws a small ellipse at the center.
 * For each note, the function draws a triangle from the center ellipse to the note.
 * To do this, it first calculates two points on the circle at the same angle as the note,
 * but offset by 1/24 or 1/12 of a circle.
 * It then draws a triangle from the center ellipse to the note
 * @param {number} root
 * @param {number[]} chordType
 */
function drawStarChord(root, chordType) {
  ellipse(canvasCenter.x, canvasCenter.y, rootRadius, rootRadius);
  chordType.forEach((interval, index) => {
    const noteCoordinate = noteToCoordinates(root + interval, radius);
    const angle = noteToAngle(root + interval);
    // draw a triangle from the center ellipse to the note
    // find two points on the circle at the same angle as the note +/- 1/24 of a circle
    offsetAngle = index ? PI / 24 : PI / 12;
    const x1 = canvasCenter.x + (rootRadius / 2) * cos(angle - offsetAngle);
    const y1 = canvasCenter.y + (rootRadius / 2) * sin(angle - offsetAngle);
    const x2 = canvasCenter.x + (rootRadius / 2) * cos(angle + offsetAngle);
    const y2 = canvasCenter.y + (rootRadius / 2) * sin(angle + offsetAngle);
    // draw the triangle
    triangle(x1, y1, noteCoordinate.x, noteCoordinate.y, x2, y2);
  });
}

/**
 *
 * draw triangles (center, note, next note) for each note in the chord
 * shade them with a color based on the note
 *
 * @param {*} root
 * @param {*} chordType
 */
function drawPolygonChord(root, chordType) {
  const chord = []
    .concat(chordType)
    .map((interval) => noteToAngle(root + (interval % 12)))
    .sort((a, b) => a - b)
    .forEach((angle, index, angles) => {
      const previous = angleToCoordinate(
        angles[(angles.length + index - 1) % angles.length],
        radius
      );
      const current = angleToCoordinate(angle, radius);
      stroke(0);
      // color through the rainbow based on the index
      // color mode hsb
      colorMode(HSB, 100);
      fill((index * 100) / chordType.length, 100, 100);
      const shade = Math.cos(angle);
      fill(10, 50, 40 + 30 + 30 * shade);
      triangle(
        canvasCenter.x,
        canvasCenter.y,
        previous.x,
        previous.y,
        current.x,
        current.y
      );
    });
}

function drawCircleChord(root, chordType) {
  // divide the circle into 12 parts
  // draw a dot at the root
  // Draw the other dots based on the chord type

  const rootAngle = noteToAngle(root);
  const rootCoordinate = noteToCoordinates(root, radius);

  let previousAngle = rootAngle;
  // draw arcs
  chordType.forEach((interval) => {
    if (interval === 0) {
      return;
    }

    const angle = noteToAngle(root + interval);
    const circleRadius =
      radius + Math.floor(interval / 12) * octaveRadiusOffset;
    const offset = +Math.floor(interval / 12) * octaveRadiusOffset;

    noFill();
    arc(
      canvasCenter.x,
      canvasCenter.y,
      2 * (radius + offset),
      2 * (radius + offset),
      rootAngle,
      angle % (2 * PI)
    );
    // Add a tick mark every 1/12
    for (
      let tickAngle = previousAngle;
      tickAngle <= angle + 0.1;
      tickAngle += PI / 6
    ) {
      const tickOffset = octaveRadiusOffset / 2;
      const tickX = canvasCenter.x + circleRadius * cos(tickAngle);
      const tickY = canvasCenter.y + circleRadius * sin(tickAngle);

      line(
        tickX,
        tickY,
        tickX + tickOffset * cos(tickAngle),
        tickY + tickOffset * sin(tickAngle)
      );
    }
    previousAngle = angle;
  });

  chordType.forEach((interval, index) => {
    const nodeRadius = index ? chordRadius : rootRadius;
    const circleRadius =
      radius + Math.floor(interval / 12) * octaveRadiusOffset;
    const coordinate = noteToCoordinates(root + interval, circleRadius);
    fill(0);
    ellipse(coordinate.x, coordinate.y, nodeRadius, nodeRadius);
  });

  // Write the name of the root in the circle in white
  const rootName = inverseRootMap[root];
  fill(255);
  textAlign(CENTER, CENTER);
  text(rootName, rootCoordinate.x, rootCoordinate.y);

  // Write the name of the chord in the center of the circle in white
  fill(0);
  let chordName = Object.keys(chordsMap).find(
    (key) => JSON.stringify(chordsMap[key]) === JSON.stringify(chordType)
  );
  chordName = rootName + chordName;
  text(chordName, canvasCenter.x, canvasCenter.y);
}

const rootMap = {
  A: 0,
  "A#": 1,
  Bb: 1,
  B: 2,
  C: 3,
  "C#": 4,
  Db: 4,
  D: 5,
  "D#": 6,
  Eb: 6,
  E: 7,
  F: 8,
  "F#": 9,
  Gb: 9,
  G: 10,
  "G#": 11,
  Ab: 11,
};

const inverseRootMap = {
  0: "A",
  1: ["A#", "Bb"],
  2: "B",
  3: "C",
  4: ["C#", "Db"],
  5: "D",
  6: ["D#", "Eb"],
  7: "E",
  8: "F",
  9: ["F#", "Gb"],
  10: "G",
  11: ["G#", "Ab"],
};

const chordsMap = {
  maj: [0, 4, 7],
  min: [0, 3, 7],
  dim: [0, 3, 6],
  aug: [0, 4, 8],
  maj7: [0, 4, 7, 11],
  min7: [0, 3, 7, 10],
  7: [0, 4, 7, 10],
  dim7: [0, 3, 6, 9],
  hdim7: [0, 3, 6, 10],
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],
  6: [0, 4, 7, 9],
  m6: [0, 3, 7, 9],
  9: [0, 4, 7, 10, 14],
  m9: [0, 3, 7, 10, 14],
  maj9: [0, 4, 7, 11, 14],
  11: [0, 4, 7, 10, 14, 17],
  m11: [0, 3, 7, 10, 14, 17],
  13: [0, 4, 7, 10, 14, 17, 21],
  m13: [0, 3, 7, 10, 14, 17, 21],
  add9: [0, 4, 7, 14],
  "7sus4": [0, 5, 7, 10],
  "7b5": [0, 4, 6, 10],
  "7#5": [0, 4, 8, 10],
  "7b9": [0, 4, 7, 10, 13],
  "7#9": [0, 4, 7, 10, 15],
  "7b5b9": [0, 4, 6, 10, 13],
  "7b5#9": [0, 4, 6, 10, 15],
  "7#5b9": [0, 4, 8, 10, 13],
  "7#5#9": [0, 4, 8, 10, 15],
  "9b5": [0, 4, 6, 10, 14],
  "9#5": [0, 4, 8, 10, 14],
  "9sus4": [0, 5, 7, 10, 14],
  "11b9": [0, 4, 7, 10, 13, 17],
  "13b9": [0, 4, 7, 10, 13, 21],
  "13#9": [0, 4, 7, 10, 15, 21],
  "13b5": [0, 4, 6, 10, 14, 21],
  "13#11": [0, 4, 7, 10, 14, 18, 21],
  "maj7#11": [0, 4, 7, 11, 18],
  maj7b5: [0, 4, 6, 11],
  "maj7#5": [0, 4, 8, 11],
  maj7b9: [0, 4, 7, 11, 13],
  "maj7#9": [0, 4, 7, 11, 15],
  maj7b5b9: [0, 4, 6, 11, 13],
  "maj7b5#9": [0, 4, 6, 11, 15],
  "maj7#5b9": [0, 4, 8, 11, 13],
  "maj7#5#9": [0, 4, 8, 11, 15],
  minmaj7: [0, 3, 7, 11],
  min6: [0, 3, 7, 9],
  min9: [0, 3, 7, 10, 14],
  min11: [0, 3, 7, 10, 14, 17],
  min13: [0, 3, 7, 10, 14, 17, 21],
  min7b5: [0, 3, 6, 10],
  "min7#5": [0, 3, 8, 10],
  min7b9: [0, 3, 7, 10, 13],
  "min7#9": [0, 3, 7, 10, 15],
  min7b5b9: [0, 3, 6, 10, 13],
  "min7b5#9": [0, 3, 6, 10, 15],
  "min7#5b9": [0, 3, 8, 10, 13],
  "min7#5#9": [0, 3, 8, 10, 15],
  min9b5: [0, 3, 6, 10, 14],
  "min9#5": [0, 3, 8, 10, 14],
  min11b9: [0, 3, 7, 10, 13, 17],
  min13b9: [0, 3, 7, 10, 13, 21],
  "min13#9": [0, 3, 7, 10, 15, 21],
  dim7b9: [0, 3, 6, 9, 13],
  dim7bb9: [0, 3, 6, 9, 12],
  "dim7#9": [0, 3, 6, 9, 15],
  dim7b5b9: [0, 3, 6, 10, 13],
  "dim7b5#9": [0, 3, 6, 10, 15],
  "dim7#5b9": [0, 3, 8, 9, 13],
  "dim7#5#9": [0, 3, 8, 9, 15],
  aug7: [0, 4, 8, 10],
  augmaj7: [0, 4, 8, 11],
  aug9: [0, 4, 8, 10, 14],
  augmaj9: [0, 4, 8, 11, 14],
  aug11: [0, 4, 8, 10, 14, 17],
  augmaj11: [0, 4, 8, 11, 14, 17],
  aug13: [0, 4, 8, 10, 14, 17, 21],
  augmaj13: [0, 4, 8, 11, 14, 17, 21],
};
