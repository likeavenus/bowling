import * as THREE from 'three';
import * as CANNON from 'cannon-es'

export const getSphere = (scene: THREE.Scene, world: CANNON.World) => {
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
    world.addBody(body);
    scene.add(mesh);

    return {
        mesh,
        body,
    };
};

