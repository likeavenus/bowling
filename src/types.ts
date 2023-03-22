export interface IGameState {
    power: number;
    isStarted: boolean,
    isEnded: boolean,
    isStrike: boolean,
    isTouched: boolean,
}

export interface IObjects {
    mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>;
    body: CANNON.Body;
}