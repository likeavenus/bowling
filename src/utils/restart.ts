import * as CANNON from 'cannon-es';

export const restart = (body: CANNON.Body) => {
    body.position.set(0, 0.2, 4);
    // orientation
    body.quaternion.set(0, 0, 0, 1);
    body.initQuaternion.set(0, 0, 0, 1);
    body.previousQuaternion.set(0, 0, 0, 1);
    body.interpolatedQuaternion.set(0, 0, 0, 1);

    // Velocity
    body.velocity.setZero();
    body.initVelocity.setZero();
    body.angularVelocity.setZero();
    body.initAngularVelocity.setZero();

    // Force
    body.force.setZero();
    body.torque.setZero();

    // Sleep state reset
    body.sleepState = 0;
    body.timeLastSleepy = 0;
    // body.applyImpulse(new CANNON.Vec3(0, 0, power * 0.02), body.position);
}