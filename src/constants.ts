import { IGameState } from './types';
const initialState: IGameState = {
    power: 0,
    isStarted: false,
    isEnded: false,
    isStrike: false,
    isTouched: false,
    roundsLimit: 2,
};
export { initialState }
