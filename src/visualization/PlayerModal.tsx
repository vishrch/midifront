import {useCallback, useEffect, useState, FC} from 'react';
import {Synthesizer} from '../synthesizer/Synthesizer';
import {player} from '../assignment/player';
import {Recorder, Recording} from '../synthesizer/Recorder';
import {ScoreVisualization} from './ScoreVisualization';
import {Handler} from '../util';
import {Score} from '../types';

interface PlayerModalProps {
  score: Score;
  shouldAutoStart: boolean;
  onAutoStart: Handler;
  onRequestClose: Handler;
}

export const PlayerModal: FC<PlayerModalProps> = ({score, shouldAutoStart, onAutoStart, onRequestClose}) => {
  const [synthesizer, setSynthesizer] = useState<Synthesizer>();
  const [recorder, setRecorder] = useState<Recorder>();
  const [error, setError] = useState<string>();
  const [recording, setRecording] = useState<Recording>();
  const [isViewingScore, setViewingScore] = useState(false);

  const isPlaying = Boolean(synthesizer);

  const onPlay = useCallback(async () => {
    const newRecorder = new Recorder(score);
    const newSynthesizer = new Synthesizer(newRecorder);

    setSynthesizer(newSynthesizer);
    setRecorder(newRecorder);
    setError(undefined);

    try {
      await player(newSynthesizer, score);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }

      throw err;
    } finally {
      newSynthesizer.close();
      setSynthesizer(undefined);
    }
  }, [score]);

  const onStop = useCallback(() => {
    if (synthesizer) {
      synthesizer.close();
    }

    setSynthesizer(undefined);
    setError(undefined);
  }, [synthesizer]);

  const toggleViewScore = useCallback(() => setViewingScore(!isViewingScore), [isViewingScore]);

  // Render at 30fps.
  useEffect(() => {
    if (!recorder) {
      return;
    }

    const interval = setInterval(() => {
      setRecording(recorder.getState());
    }, 32);

    return () => clearInterval(interval);
  }, [recorder]);

  useEffect(() => {
    if (shouldAutoStart) {
      onPlay();
      onAutoStart();
    }
  }, [shouldAutoStart, onAutoStart, onPlay]);

  // Stop on unmount.
  useEffect(() => {
    return () => {
      if (synthesizer) {
        synthesizer.close();
      }
    };
  }, [synthesizer]);

  return (
    <>
      <div className="overlay" onClick={onRequestClose} />
      <div className="modal pane">
        {recording && <ScoreVisualization recording={recording} isViewingScore={isViewingScore} isPlaying={isPlaying} />}

        {!recording && <div>Play to visualize notes.</div>}

        <div className="player-controls">
          <button onClick={onPlay} disabled={isPlaying}>
            Play
          </button>

          <button onClick={onStop} disabled={!isPlaying}>
            Stop
          </button>

          {!isViewingScore && <button onClick={toggleViewScore}>View reference</button>}

          {isViewingScore && <button onClick={toggleViewScore}>View live</button>}

          <button onClick={onRequestClose}>Close</button>
        </div>

        {error && <div className="error">{error}</div>}
      </div>
    </>
  );
};
