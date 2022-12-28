import {Synthesizer} from '../synthesizer/Synthesizer';
import {Track} from '../types';

export function player(synthesizer: Synthesizer, tracks: ReadonlyArray<Track>): Promise<void>;
