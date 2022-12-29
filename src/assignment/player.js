import workerJs from './worker.js';

const loadWebWorker = (worker) => {
  const code = worker.toString();
  const blob = new Blob(['(' + code + ')()']);

  return new Worker(URL.createObjectURL(blob));
};

const completeDelay = ({worker}) => {
  return new Promise((resolve) => {
    worker.onmessage = (event) => {
      resolve(undefined);
    };
  });
};

function playTrack(synthesizer, track) {
  const playTrackPromise = () =>
    new Promise(async (resolve, reject) => {
      const channel = synthesizer.getChannel(track.instrumentName);
      const worker = loadWebWorker(workerJs);

      for (const note of track.notes) {
        const isPlaying = channel.playNote(note.name, 100);

        if (!isPlaying) {
          break;
        }

        worker.postMessage({duration: note.duration});

        await completeDelay({worker});

        channel.stopNote();
      }

      resolve('track play completed');
    });

  return playTrackPromise;
}

export async function player(synthesizer, tracks) {
  return new Promise((resolve) => {
    const trackPromiseArray = [];

    tracks.forEach((track) => {
      trackPromiseArray.push(playTrack(synthesizer, track));
    });

    Promise.all(trackPromiseArray.map((item) => item())).then((values, err) => {
      console.log(values, err);
      resolve('all track play completed');
    });
  });
}
