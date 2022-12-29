function worker() {
  let isDelaying = false;

  function delayAsync(duration) {
    if (isDelaying) throw new Error('delayAsync is not reentrant.');

    isDelaying = true;

    return new Promise((resolve) =>
      setTimeout(() => {
        isDelaying = false;
        resolve(undefined);
      }, duration)
    );
  }

  // eslint-disable-next-line no-restricted-globals
  self.addEventListener('message', async (e) => {
    // eslint-disable-line no-restricted-globals
    if (!e) return;

    const duration = e.data?.duration;

    await delayAsync(duration);

    postMessage('seconds');
  });
}

export default worker;
