import * as CANNON from 'cannon-es';
import * as THREE from 'three';

import { IGameState } from '../types';

export const followCamera = (gameState: IGameState, camera: THREE.Camera, sphereBody: CANNON.Body) => {
    if (!gameState.isTouched) {
        camera.position.x = sphereBody.position.x;
        camera.position.y = sphereBody.position.y + 0.5;
        camera.position.z = sphereBody.position.z + 1;
        camera.lookAt(
            new THREE.Vector3(
                sphereBody.position.x,
                sphereBody.position.y,
                sphereBody.position.z
            )
        );
    }
}