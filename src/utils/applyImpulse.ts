import * as CANNON from 'cannon-es';

import { IGameState } from "../types";

export function applyImpulse(gameState: IGameState, body: CANNON.Body) {
    gameState.isStarted = true;
    body.applyImpulse(new CANNON.Vec3(0, 0, -gameState.power * 0.02), body.position);
    gameState.power = 0;
    gameState.roundsLimit -= 1;
}