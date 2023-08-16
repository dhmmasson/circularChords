function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  ellipse(200, 200, 100, 100);
}

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
