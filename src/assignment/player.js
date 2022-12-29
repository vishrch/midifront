import {delayAsync, buildTimer} from '../util';

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

        await delayAsync(note.duration + lastPlayedTime - timer());

        lastPlayedTime = lastPlayedTime + note.duration;

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
    const timer = buildTimer();

    tracks.forEach((track) => trackPromiseArray.push(playTrack(synthesizer, track, timer)));

    Promise.all(trackPromiseArray.map((item) => item()))
      .then(() => resolve('all track play completed'))
      .catch((error) => reject(error));
  });
