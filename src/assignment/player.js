/*
 * Feel free to rename this file `player.ts` and remove `player.d.ts` if you are more comfortable with TypeScript.
 */
import workerJs from './worker.js';
import {delayAsync} from '../util';

const loadWebWorker = (worker) => {
  const code = worker.toString();
  const blob = new Blob(['(' + code + ')()']);

  return new Worker(URL.createObjectURL(blob));
};

const completePlay = ({worker}) => {
  return new Promise((resolve) => {
    worker.onmessage = (event) => {
      resolve(undefined);
    };
  });
};

async function playTrack(synthesizer, track) {
  const worker = loadWebWorker(workerJs);
  const channel = synthesizer.getChannel(track.instrumentName);

  for (const note of track.notes) {
    const isPlaying = channel.playNote(note.name, 100);
    console.log(1, isPlaying);
    if (!isPlaying) {
      break;
    }
    console.log(2);
    worker.postMessage({duration: note.duration});
    console.log(3);
    await completePlay({worker});
    console.log(4);

    channel.stopNote();
  }
}

export async function player(synthesizer, tracks) {
  console.log(synthesizer, tracks);
  // Write your code here.
  // throw new Error('You need to implement the player!');
  const track = tracks[0];
  // tracks.forEach(async (track) => {
  //   // const track = tracks[index];

  //
  //   const channel = synthesizer.getChannel(track.instrumentName);

  //   for (const note of track.notes) {
  //     const isPlaying = channel.playNote(note.name, 100);

  //     if (!isPlaying) {
  //       break;
  //     }

  //     await delayAsync(note.duration);

  //     channel.stopNote();
  //   }
  // });

  // tracks.forEach((track) => {
  // const channel = synthesizer.getChannel(track.instrumentName);
  // playTrack(synthesizer, tracks[0]);
  // });

  const worker = loadWebWorker(workerJs);
  const channel = synthesizer.getChannel(track.instrumentName);

  for (const note of track.notes) {
    const isPlaying = channel.playNote(note.name, 100);
    console.log(1, isPlaying);
    if (!isPlaying) {
      break;
    }
    console.log(2);
    worker.postMessage({duration: note.duration});
    console.log(3);
    await completePlay({worker});
    console.log(4);

    channel.stopNote();
  }
}
