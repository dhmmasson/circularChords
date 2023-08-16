function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
/**
 *
 * @param {number} root
 * @param {number[]} chordType
 */
function drawChord(root, chordType) {
  // divide the circle into 12 parts
  // draw a dot at the root
  // Draw the other dots based on the chord type

  const radius = 100;
  const centerX = 200;
  const centerY = 200;
  const rootRadius = 15;
  const chordRadius = 8;

  const rootAngle = (root * 2 * PI) / 12;
  const rootX = centerX + radius * cos(rootAngle);
  const rootY = centerY + radius * sin(rootAngle);

  fill(0);
  ellipse(rootX, rootY, rootRadius, rootRadius);

  let previousAngle = rootAngle;
  chordType.forEach((interval) => {
    if (interval === 0) {
      return;
    }
    const angle = ((root + interval) * 2 * PI) / 12;
    const x = centerX + radius * cos(angle);
    const y = centerY + radius * sin(angle);

    fill(0);
    ellipse(x, y, chordRadius, chordRadius);

    // draw an arc from previous note to current note
    // arc(x, y, w, h, start, stop, [mode], [detail])
    noFill();
    ellipseMode(RADIUS);
    arc(centerX, centerY, radius, radius, previousAngle, angle, OPEN);
    // Add a tick mark every 1/12
    for (
      let tickAngle = previousAngle + PI / 6;
      tickAngle < angle;
      tickAngle += PI / 6
    ) {
      const tickX = centerX + radius * cos(tickAngle);
      const tickY = centerY + radius * sin(tickAngle);
      // small line
      line(
        tickX,
        tickY,
        tickX + 5 * cos(tickAngle),
        tickY + 5 * sin(tickAngle)
      );
    }
  });

  // Write the name of the root in the circle in white
  const rootName = inverseRootMap[root];
  fill(255);
  textAlign(CENTER, CENTER);
  text(rootName, rootX, rootY);

  // Write the name of the chord in the center of the circle in white
  fill(0);
  let chordName = Object.keys(chordsMap).find(
    (key) => JSON.stringify(chordsMap[key]) === JSON.stringify(chordType)
  );
  chordName = rootName + chordName;
  text(chordName, centerX, centerY);
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
