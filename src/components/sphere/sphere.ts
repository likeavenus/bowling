import * as CANNON from 'cannon-es';
import * as THREE from 'three';

import { IObjects } from '../../types';

export class Sphere {
    private scene: THREE.Scene;
    private world: CANNON.World;
    public sphere;

    constructor(scene: THREE.Scene, world: CANNON.World) {
        this.scene = scene;
        this.world = world;
        this.sphere = this._createSphere();

        // return this.sphere;
    }

    public setInitialState() {
        this.sphere.mesh.position.set(0, 0.2, 4);
        // orientation
        this.sphere.body.quaternion.set(0, 0, 0, 1);
        this.sphere.body.initQuaternion.set(0, 0, 0, 1);
        this.sphere.body.previousQuaternion.set(0, 0, 0, 1);
        this.sphere.body.interpolatedQuaternion.set(0, 0, 0, 1);

        // Velocity
        this.sphere.body.velocity.setZero();
        this.sphere.body.initVelocity.setZero();
        this.sphere.body.angularVelocity.setZero();
        this.sphere.body.initAngularVelocity.setZero();

        // Force
        this.sphere.body.force.setZero();
        this.sphere.body.torque.setZero();

        // Sleep state reset
        this.sphere.body.sleepState = 0;
        this.sphere.body.timeLastSleepy = 0;
    }

    private _createSphere(): IObjects<THREE.SphereGeometry> {
        const size = 0.08;
        const geometry = new THREE.SphereGeometry(size);
        const material = new THREE.MeshStandardMaterial();
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.position.set(0, 1, 4);
        const sphereShape = new CANNON.Sphere(size);
        const body = new CANNON.Body({
            mass: 10,
            position: new CANNON.Vec3(0, 0.05, 4),
            shape: sphereShape,
            allowSleep: true,
            sleepSpeedLimit: 1,
            sleepTimeLimit: 1,
            material: {
                friction: 1,
                restitution: 1,
                name: 'ball',
                id: 1,
            },
        });
        mesh.position.copy(body.position as unknown as THREE.Vector3);
        this.world.addBody(body);
        this.scene.add(mesh);

        return {
            mesh,
            body,
        };
    }
}