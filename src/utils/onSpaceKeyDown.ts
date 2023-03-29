import { BallDirecton } from '../constants';
import { IGameState } from '../types';

let direction: BallDirecton = BallDirecton.UP;
export function onSpaceKeyDown(gameState: IGameState) {
    if (!gameState.isTouched) {
        if (gameState.power <= 0) {
            direction = BallDirecton.UP;
        }
        if (gameState.power > 2001) {
            direction = BallDirecton.DOWN;
        }

        if (direction === BallDirecton.UP) {
            gameState.power += 100;
        } else {
            gameState.power -= 100;
        }
    }
}