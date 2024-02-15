// AUDIO

/**
 * Start the audio context
 * Called when the user clicks on the mute checkbox
 */
function startAudio() {
  userStartAudio();
  audioOn = true;
  mute.checked = false;
  mute.removeEventListener("click", startAudio);
  mute.addEventListener("click", muteAudio);
}

/**
 * Mute or unmute the audio
 * Called when the user clicks on the mute checkbox
 * @param {Event} e
 * @returns
 */
function muteAudio() {
  audioOn = !mute.checked;
  if (audioOn) {
    osc.forEach(({ o }) => o.start());
  } else {
    osc.forEach(({ o }) => o.stop());
  }
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    if (music.checked) sound.play();
  }
}

function createInstruments() {
  // create a synth and connect it to the master output (your speakers)
  fft = new p5.FFT(0.01);
  reverb = new p5.Reverb();
  osc = Array(12)
    .fill(0)
    .map((e, i) => {
      const o = new p5.Oscillator();
      const env = new p5.Envelope();
      o.setType("sine");
      env.setRange(0.8, 0);
      // set ADSR envelope settings to a piano-like sound
      env.setADSR(0.01, 0.1, 0.1, 0.1);
      o.start();
      o.amp(env);
      reverb.process(o, 3, 2);
      return { o, env };
    });
}

function preload() {
  if (window.location.protocol === "file:") {
    // Dont load sound if we are running from the file system
  } else {
    sound = loadSound("./OldOak.mp3");
  }
}

let part;
let phrases = [];
let bassPattern = [0, 1];
let trebblePatter = [2, 3];
function playChord(root, type) {
  type = [3, 7, 12, 15];
  if (audioOn && !sound?.isPlaying()) {
    phrases[0] = new p5.Phrase(
      "bass",
      playNote,
      // on 12 beats play bass (type[0] + root, type[1] + root )
      Array(12)
        .fill({ midi: root, duration: 1 })
        .map((e, i) =>
          i % 3
            ? 0 // rest
            : { midi: e.midi + type[i % 2], duration: e.duration, beat: i }
        )
    );
    phrases[1] = new p5.Phrase(
      "trebble",
      playNote,
      // on 12 beats play bass (type[0] + root, type[1] + root )
      Array(12)
        .fill({ midi: root, duration: 1 })
        .map((e, i) =>
          i % 2
            ? 0 // rest
            : {
                midi: e.midi + type[(Math.floor(i / 2) % 2) + 2],
                duration: e.duration,
                beat: i,
              }
        )
    );

    if (part === undefined) part = new p5.Part();
    part.removePhrase("bass");
    part.removePhrase("trebble");
    if (bassOn.checked) part.addPhrase(phrases[0]);
    if (trebleOn.checked) part.addPhrase(phrases[1]);
    part.setBPM(60);
    part.loop();
  }
}

let oscIndex = 0;
function playNote(timeFromNow, { midi, duration, beat }) {
  // get an oscillator from the array
  const { o, env } = osc[oscIndex++ % osc.length];
  // set the note
  o.freq(midiToFreq(57 + midi));
  // set the volume
  const volume = 0.6 + (beat % 6 ? 0 : 0.2) + 0.02 * Math.random();
  const timeOffset = timeFromNow + 0.02 * Math.random();
  const durationOffset = (0.6 + 0.05 * Math.random()) * duration;
  env.setRange(volume, 0);
  // start the envelope at the time from now
  env.triggerAttack(o, timeOffset);
  // stop the envelope after the duration
  env.triggerRelease(o, timeOffset + (durationOffset / part.getBPM()) * 60);
  activeNotes.set(midiToNoteName(midi), { o, env });
  setTimeout(() => {
    activeNotes.delete(midiToNoteName(midi));
  }, (durationOffset / part.getBPM()) * 60 * 1000);
  // draw the note on the circle
  const coordinate = noteToCoordinates(midi + 57, radius);
  const noteName = inverseRootMap[midi + 57];

  fill(200);
  ellipse(coordinate.x, coordinate.y, 10, 10);
  fill(0);
  textAlign(CENTER, CENTER);
  text(noteName, Math.max(0, coordinate.x), Math.max(0, coordinate.y));
}

module.exports = {
  startAudio,
  muteAudio,
  createInstruments,
  preload,
  playChord,
  playNote,
};
