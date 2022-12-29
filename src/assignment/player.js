import {delayAsync} from '../util';

const playTrack = (synthesizer, track) => () =>
  new Promise(async (resolve, reject) => {
    const channel = synthesizer.getChannel(track.instrumentName);

    for (const note of track.notes) {
      try {
        const isPlaying = channel.playNote(note.name, 100);

        if (!isPlaying) {
          break;
        }

        await delayAsync(note.duration);

        channel.stopNote();
      } catch (error) {
        reject(error);
      }
    }

    resolve('track play completed');
  });

export const player = async (synthesizer, tracks) =>
  new Promise((resolve, reject) => {
    const trackPromiseArray = [];

    tracks.forEach((track) => {
      trackPromiseArray.push(playTrack(synthesizer, track));
    });

    Promise.all(trackPromiseArray.map((item) => item()))
      .then(() => resolve('all track play completed'))
      .catch((error) => reject(error));
  });
