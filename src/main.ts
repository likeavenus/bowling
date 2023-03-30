import * as THREE from 'three';
import * as CANNON from 'cannon-es';

import './style.css';
import { getPlane } from './components/plane';
import { getControls } from './components/controls';
// import CannonDebugRenderer from './utils/cannonDebugRenderer';
import { Pins } from './components/pin';
import { getWorld } from './components/world/world';
import { addTouchListener } from './utils/touchListener';
import { checkPositions } from './utils/checkPositions';
import { getColor } from './utils/getProgressbarColor';
import { State } from './gameConfig';
import { IGameState } from './types';
import { restart } from './utils/restart';
import { applyImpulse } from './utils/applyImpulse';
import { onSpaceKeyDown } from './utils/onSpaceKeyDown';
import { followCamera } from './utils/followCamera';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const world = getWorld();
scene.fog = new THREE.FogExp2('rgb(255,255,255)', 0.001);

camera.position.set(0, 1, 5);

const plane = getPlane();

scene.add(plane);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg') as HTMLCanvasElement,
  antialias: true,
});

const gameState: IGameState = new State(scene, world);

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const orbitControls = getControls(camera, renderer);

const ambientLight = new THREE.AmbientLight('rgb(50, 1, 205)', 0.3);
const pointLight = new THREE.PointLight('white', 1);
pointLight.castShadow = true;
pointLight.position.set(4, 4, 0);
scene.add(ambientLight, pointLight);


const clock = new THREE.Clock();

const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({
  sleepSpeedLimit: 1
});
floorBody.mass = 0;
floorBody.addShape(floorShape);
floorBody.quaternion.setFromAxisAngle(
  new CANNON.Vec3(1, 0, 0),
  -Math.PI * 0.5
);
world.addBody(floorBody);

const geometry = new THREE.BoxGeometry(0.2, 0.01, 0);
const material = new THREE.MeshBasicMaterial({
  color: 'green'
});
const strengthMesh = new THREE.Mesh(geometry, material);
strengthMesh.position.set(1, 0, 3);
scene.add(strengthMesh);

// const cannonDebugRenderer = new CannonDebugRenderer(scene, world)
let oldElapsedTime = 0;

const pins = new Pins();
let pinsToUpdate = pins.generatePins(scene, world);
const { body: sphereBody, mesh: sphereMesh } = gameState.sphere.sphere;

let objectsToUpdate = [...pinsToUpdate, { body: sphereBody, mesh: sphereMesh }];
scene.add(sphereMesh);


window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !gameState.isStarted) {
    onSpaceKeyDown(gameState);
  }

  if (sphereBody && gameState.isStarted) {
    if (e.code === 'ArrowLeft') {
      sphereBody.applyImpulse(new CANNON.Vec3(-3, 0, 0), sphereBody.position);
    }

    if (e.code === 'ArrowRight') {
      sphereBody.applyImpulse(new CANNON.Vec3(3, 0, 0), sphereBody.position);
    }
  }
});

let RAF: number | null = null;
const spaceBtn = document.querySelector('.control__space');
const controlLeft = document.querySelector('.control__left');
const controlRight = document.querySelector('.control__right');

controlLeft?.addEventListener('mousedown', () => {
  if (sphereBody && gameState.isStarted) {
    sphereBody.applyImpulse(new CANNON.Vec3(-3, 0, 0), sphereBody.position);
  }
})

controlRight?.addEventListener('click', () => {
  if (sphereBody && gameState.isStarted) {
    sphereBody.applyImpulse(new CANNON.Vec3(3, 0, 0), sphereBody.position);
  }
})

const onMouseDown = () => {
  if (!gameState.isStarted) {
    onSpaceKeyDown(gameState);
    // TODO: замедлить
    RAF = requestAnimationFrame(onMouseDown);
  }
};

spaceBtn?.addEventListener('mousedown', onMouseDown);
spaceBtn?.addEventListener('mouseup', () => {
  applyImpulse(gameState, sphereBody);
  cancelAnimationFrame(RAF as number);
  (document.activeElement as HTMLButtonElement).blur();
});


window.addEventListener('keyup', (e) => {
  // && gameState.roundsLimit
  if (e.code === 'Space' && !gameState.isStarted) {
    applyImpulse(gameState, sphereBody);
  }
});


const restartBtn = document.querySelector('.js-restart-btn') as HTMLButtonElement;
restartBtn?.addEventListener('click', () => {
  restart(sphereBody);
  gameState.setInitialState();
  pinsToUpdate = pins.generatePins(scene, world);
  objectsToUpdate = [...pinsToUpdate, { body: sphereBody, mesh: sphereMesh }];
  (document.activeElement as HTMLButtonElement).blur();
});

addTouchListener(sphereBody, gameState);

const modal = document.querySelector('.modal');
const winContent = document.querySelector('.modal__content--win');

function animate() {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;
  gameState.time = elapsedTime;

  world.step(1 / 60, deltaTime, 3);
  strengthMesh.scale.set(0.5, gameState.power * 0.06, 3);
  strengthMesh.material.color.set(new THREE.Color(getColor(gameState.power)));


  if (gameState.isStrike && !winContent?.classList.contains('active')) {
    modal?.classList.add('modal--active');
    winContent?.classList.add('active');
    setTimeout(() => {
      modal?.classList.remove('modal--active');
      winContent?.classList.remove('active');
      restart(sphereBody);
      gameState.setInitialState();
      pinsToUpdate = pins.generatePins(scene, world);
      objectsToUpdate = [...pinsToUpdate, { body: sphereBody, mesh: sphereMesh }];
    }, 4000);
  }
  // cannonDebugRenderer.update();

  for (const object of objectsToUpdate) {
    object.mesh.position.copy(object.body.position as unknown as THREE.Vector3)
    object.mesh.quaternion.copy(object.body.quaternion as unknown as THREE.Quaternion)
  }

  followCamera(gameState, camera, sphereBody);
  checkPositions(pinsToUpdate, gameState);

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  orbitControls.update();
}
animate();


window.addEventListener('resize', () => {
  // Update camera
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})





