import * as CANNON from 'cannon-es';

interface IContact {
    contact: CANNON.ContactEquation;
}
export const playHitSound = ({ contact }: IContact) => {
    const hitSound = new Audio('/pin/hit.mp3');

    const impactStrength = contact.getImpactVelocityAlongNormal();
    if (impactStrength > 1.2) {
        hitSound.volume = Math.random();
        hitSound.currentTime = 0;
        hitSound.play();
    }

}