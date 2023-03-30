import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { Sphere } from './components/sphere/sphere';

export interface IGameState {
    power: number;
    isStarted: boolean;
    isEnded: boolean;
    isStrike: boolean;
    isTouched: boolean;
    roundsLimit: number;
    time: number;
    scene: THREE.Scene;
    world: CANNON.World;
    sphere: Sphere;
    setInitialState(): IGameState;
}

export interface IObjects<T extends THREE.BufferGeometry> {
    mesh: THREE.Mesh<T, THREE.MeshStandardMaterial>;
    body: CANNON.Body;
}