import * as THREE from 'three';
import * as CANNON from 'cannon-es';

import './style.css';
import { getPlane } from './components/plane';
import { getControls } from './components/controls';
import { getSphere } from './components/sphere';
import CannonDebugRenderer from './utils/cannonDebugRenderer';
import { getPins } from './components/pin';
import { getWorld } from './components/world/world';
import { addTouchListener } from './utils/touchListener';
import { checkPositions } from './utils/checkPositions';
import { getColor } from './utils/getProgressbarColor';
import { state } from './gameConfig';
import { IObjects, IGameState } from './types';
import { restart } from './utils/restart';
import { applyImpulse } from './utils/applyImpulse';
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

let gameState: IGameState = state;

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

const cannonDebugRenderer = new CannonDebugRenderer(scene, world)
let oldElapsedTime = 0;

let pinsToUpdate: IObjects[] = getPins(scene, world);
const { body: sphereBody, mesh: sphereMesh } = getSphere(scene, world);

let objectsToUpdate = [...pinsToUpdate, { body: sphereBody, mesh: sphereMesh }];
scene.add(sphereMesh);


let direction = 'up';
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !gameState.isStarted) {
    if (gameState.power <= 0) {
      direction = 'up';
    }
    if (gameState.power > 2001) {
      direction = 'down';
    }

    if (direction === 'up') {
      gameState.power += 100;
    } else {
      gameState.power -= 100;
    }
  }

  if (sphereBody && gameState.isStarted) {
    if (e.code === 'ArrowLeft') {
      // sphereBody.position.x -= 0.07;
      sphereBody.applyImpulse(new CANNON.Vec3(-3, 0, 0), sphereBody.position);
    }

    if (e.code === 'ArrowRight') {
      // sphereBody.position.x += 0.07;
      sphereBody.applyImpulse(new CANNON.Vec3(3, 0, 0), sphereBody.position);
    }
  }
});

const spaceBtn = document.querySelector('.control__space');
// spaceBtn?.addEventListener('mousedown', () => {
//   if (direction === 'up') {
//     gameState.power += 100;
//   } else {
//     gameState.power -= 100;
//   }
// });
// spaceBtn?.addEventListener('mouseup', () => {
//   applyImpulse(gameState, sphereBody);
// });


window.addEventListener('keyup', (e) => {
  // && gameState.roundsLimit
  if (e.code === 'Space' && !gameState.isStarted) {
    applyImpulse(gameState, sphereBody);
  }
});


const restartBtn = document.querySelector('.modal__content--restart') as HTMLButtonElement;
restartBtn?.addEventListener('click', () => {
  restart(sphereBody);
  gameState.setInitialState();
  objectsToUpdate = [...pinsToUpdate, { body: sphereBody, mesh: sphereMesh }];
  (document.activeElement as HTMLButtonElement).blur();
  addTouchListener(sphereBody, gameState);
});

addTouchListener(sphereBody, gameState);


function animate() {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  world.step(1 / 60, deltaTime, 3);
  strengthMesh.scale.set(0.5, gameState.power * 0.06, 3);
  strengthMesh.material.color.set(new THREE.Color(getColor(gameState.power)));
  console.log(gameState.isTouched);

  if (!gameState.isTouched) {
    camera.position.x = sphereBody.position.x;
    camera.position.y = sphereBody.position.y + 0.5;
    camera.position.z = sphereBody.position.z + 1;
    camera.lookAt(
      new THREE.Vector3(
        sphereBody.position.x,
        sphereBody.position.y,
        sphereBody.position.z
      )
    );
  }
  cannonDebugRenderer.update();

  for (const object of objectsToUpdate) {
    object.mesh.position.copy(object.body.position as unknown as THREE.Vector3)
    object.mesh.quaternion.copy(object.body.quaternion as unknown as THREE.Quaternion)
  }

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





