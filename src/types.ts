import * as CANNON from 'cannon-es';


export interface IGameState {
    power: number;
    isStarted: boolean;
    isEnded: boolean;
    isStrike: boolean;
    isTouched: boolean;
    roundsLimit: number;
    time: number;
    setInitialState(): ThisType<IGameState>;
}

export interface IObjects {
    mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>;
    body: CANNON.Body;
}