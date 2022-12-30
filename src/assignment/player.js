import {delayAsync, buildTimer} from '../util';

/** Single track play function */
const playTrack = (synthesizer, track, timer) => () =>
  new Promise(async (resolve, reject) => {
    const channel = synthesizer.getChannel(track.instrumentName);
    let lastPlayedTime = 0;

    for (const note of track.notes) {
      try {
        const isPlaying = channel.playNote(note.name, note.velocity);

        if (!isPlaying) {
          break;
        }

        /** delayAsync reentrant issue managed by modifying delayAsync function.
         *  It can be avoided by using worker thread method.
         *  delay time is calculated from buildTimer to avoid accumulated errors */
        await delayAsync(note.duration + lastPlayedTime - timer());

        lastPlayedTime = lastPlayedTime + note.duration;

        channel.stopNote();
      } catch (error) {
        reject(error);
      }
    }

    resolve('track play completed');
  });

/** Play function for multiple track */
export const player = async (synthesizer, tracks) =>
  new Promise((resolve, reject) => {
    const trackPromises = [];
    const timer = buildTimer(); // init timer to avoid timer accumulated issues

    tracks.forEach((track) => trackPromises.push(playTrack(synthesizer, track, timer))); // creating promises array for each track

    Promise.all(trackPromises.map((trackPromise) => trackPromise())) // Using promise.all method to resolve when it completed playing all tracks
      .then(() => resolve('all track play completed'))
      .catch((error) => reject(error));
  });
