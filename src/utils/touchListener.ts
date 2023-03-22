import * as CANNON from 'cannon-es';
import { IGameState } from '../types';

export const addTouchListener = (body: CANNON.Body, gameState: IGameState) => {
    function playStrikeSound(e: any) {
        if (e.body.material?.name === 'pin' && !gameState.isTouched) {
            gameState.isTouched = true;
        }
    }
    body.addEventListener('collide', playStrikeSound);
    return gameState.isTouched;
}
