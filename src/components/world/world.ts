import * as CANNON from 'cannon-es'

export const getWorld = (): CANNON.World => {
    const world = new CANNON.World();
    world.broadphase = new CANNON.SAPBroadphase(world);
    (world.solver as CANNON.GSSolver).iterations = 50;
    world.gravity.set(0, -9.82, 0);
    const defaultMaterial = new CANNON.Material('default');
    const defaultContactMaterial = new CANNON.ContactMaterial(
        defaultMaterial,
        defaultMaterial,
        {
            friction: 0.1,
            restitution: 0.7
        }
    );
    world.defaultContactMaterial = defaultContactMaterial;

    return world;
}