import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { playHitSound } from './sounds';
import { IObjects } from '../../types';

export const getPins = (scene: THREE.Scene, world: CANNON.World): IObjects[] => {
    const width = 0.095;
    const height = 0.5;
    const depth = 0.095;

    const geometry = new THREE.BoxGeometry(1, 1, 1);

    const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5));

    const pins = [1, 2, 3, 4];
    const objectsToUpdate: IObjects[] = [];
    const gap = 0.2;
    const count = 10;
    for (let i = 0; i < pins.length; i++) {
        for (let k = 0; k < pins[i]; k++) {
            const boxMaterial = new THREE.MeshStandardMaterial({
                metalness: 0.3,
                roughness: 0.4,
            });
            const mesh = new THREE.Mesh(geometry, boxMaterial);
            const body = new CANNON.Body({
                mass: 1,
                position: new CANNON.Vec3(k * gap - i / count, 0.2, -i * gap),
                allowSleep: true,
                sleepSpeedLimit: 1,
                sleepTimeLimit: 1,
                shape: shape,
                material: {
                    friction: 0.1,
                    restitution: 0.3,
                    name: 'pin',
                    id: i + k,
                },
            });
            mesh.scale.set(width, height, depth);
            mesh.castShadow = true;
            mesh.position.copy(body.position as unknown as THREE.Vector3);
            objectsToUpdate.push({
                mesh,
                body,
            });
            world.addBody(body);
            scene.add(mesh);

            body.addEventListener('collide', playHitSound);
        }
    }

    return objectsToUpdate;
}