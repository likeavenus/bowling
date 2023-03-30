import * as THREE from "three";
import { IObjects, IGameState } from '../types';

const droppedItems = new Set();
export const checkPositions = (objects: IObjects<THREE.BoxGeometry>[], gameState: IGameState) => {
    const gameIsEnd = droppedItems.size === 10;
    if (!gameIsEnd) {
        for (const object of objects) {
            if (object.mesh.quaternion.w < 0.9) {
                object.mesh.material.color.set(new THREE.Color('purple'));
            }
            if (object.mesh.material.color.r !== 1) {
                droppedItems.add(object.mesh);
            }
            if (droppedItems.size === objects.length) {
                gameState.isStrike = true;
                droppedItems.clear();
            }
        }
    }
}