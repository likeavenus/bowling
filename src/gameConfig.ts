import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { Sphere } from './components/sphere';

import { IGameState } from './types';

// const modal = document.querySelector('.modal');
// const winContent = document.querySelector('.modal__content--win');

class State implements IGameState {
    public power: number;
    public isStarted: boolean;
    public isEnded: boolean;
    public isStrike: boolean;
    public isTouched: boolean;
    public roundsLimit: number;
    public time: number;
    public sphere;
    public scene: THREE.Scene;
    public world: CANNON.World;

    constructor(scene: THREE.Scene, world: CANNON.World) {
        this.power = 0;
        this.isStarted = false;
        this.isEnded = false;
        this.isStrike = false;
        this.isTouched = false;
        this.roundsLimit = 2;
        this.time = 0;
        this.scene = scene;
        this.world = world;
        this.sphere = new Sphere(scene, world);

        return new Proxy(this, {
            get(target, name: keyof IGameState) {
                return target[name];
            },
            set(target, name: keyof IGameState, receiver: never) {
                if (name in target) {
                    target[name] = receiver;
                    return true;
                }
                return false;
            },
        });
    }

    public setInitialState(): IGameState {
        this.isTouched = false;
        this.power = 0;
        this.isStarted = false;
        this.isEnded = false;
        this.isStrike = false;
        this.roundsLimit = 2;
        this.sphere.setInitialState();

        // modal?.classList.add('modal--active');
        // winContent?.classList.add('active');
        // setTimeout(() => {
        //     modal?.classList.remove('modal--active');
        //     winContent?.classList.remove('active');
        //     restart(sphereBody);
        //     // gameState.setInitialState();
        //     pinsToUpdate = pins.generatePins(scene, world);
        //     objectsToUpdate = [...pinsToUpdate, { body: sphereBody, mesh: sphereMesh }];
        // }, 4000);
        return this;
    }
};

export { State };