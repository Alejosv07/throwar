import { SceneManager } from "./scene/SceneManager.js";
import { Resizer } from "./utils/Resizer.js";
import { Ball } from "./components/Ball.js";
import { Tick } from "./utils/Tick.js";
import { Control } from "./utils/Control.js";
import { Loading } from "./components/loading.js";
import { GameMenu } from "./game/GameMenu.js";
import { GamePhysic } from "./game/gamePhysic.js";
import { Cube } from "./components/cube.js";
import { GuiTest } from "./gui/GuiTest.js";
import * as THREE from "three";
import { Body } from "cannon-es";
import { Texture } from "./utils/Texture.js";

((d, w) => {
  const loading = new Loading(d);
  const gameMenu = new GameMenu(d);
  const gamePhysic = new GamePhysic();
  const ballThreejs = new Ball();
  ballThreejs.mesh.position.set(1.7, 6.6, -13);
  const cubeThreejs = new Cube();
  const textureLoader = new THREE.TextureLoader();
  const textureUtil = new Texture(textureLoader);
  let cubesPhy = [];
  let cubesThree = [];
  const ballPhysic = gamePhysic.createBallBody();
  ballPhysic.position.copy(ballThreejs.mesh.position);
  gamePhysic.creareFloor();

  const sceneManager = new SceneManager({
    width: w.innerWidth,
    height: w.innerHeight,
    canvas: d.querySelector("canvas.webgl"),
    loading,
    gameMenu,
  });
  //  const gui = new GuiTest({}, ballThreejs.mesh.position);

  const resizer = new Resizer(sceneManager);
  resizer.activateResizer();

  const control = new Control(
    sceneManager.camera,
    d.querySelector("canvas.webgl")
  );

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let isDragging = false;
  let dragStartTime = 0;
  const gameState = {
    remainingAttempts: 3,
    isBallInPlay: false,
    cubesHitThisAttempt: new Set(),
  };
  const shootBall = (event) => {
    if (gameState.remainingAttempts <= 0) return;
    const dragEndTime = performance.now();
    const dragDuration = dragEndTime - dragStartTime;

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, sceneManager.camera);

    const direction = raycaster.ray.direction.clone();

    const MAX_FORCE = 100;
    const MIN_FORCE = 10;
    const MAX_DURATION = 1000;

    const forceFactor = Math.min(dragDuration / MAX_DURATION, 1);
    const launchForce = MIN_FORCE + (MAX_FORCE - MIN_FORCE) * forceFactor;

    const velocityVector = direction.multiplyScalar(launchForce);

    ballPhysic.type = Body.DYNAMIC;

    ballPhysic.wakeUp();
    gameState.isBallInPlay = true;
    ballPhysic.velocity.set(
      velocityVector.x,
      velocityVector.y,
      velocityVector.z
    );

    isDragging = false;
    dragStartTime = 0;
  };

  const onMouseDown = (event) => {
    isDragging = true;
    dragStartTime = performance.now();
    control.control.enabled = false;
  };

  const onMouseUp = (event) => {
    if (isDragging) {
      shootBall(event);
      control.control.enabled = true;
    }
  };

  const canvas = d.querySelector("canvas.webgl");
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("touchstart", (e) => onMouseDown(e.touches[0]));
  canvas.addEventListener("touchend", (e) => onMouseUp(e.changedTouches[0]));

  const startGame = () => {
    let cubes = 100;
    textureUtil.loadTexture("img/logo.jpeg", ballThreejs.mesh.material).then(() => {
      sceneManager.scene.add(ballThreejs.mesh);
    });
    cubesPhy.push(...gamePhysic.createCubes(cubes, 10));
    cubesThree.push(...cubeThreejs.createCubes(cubes));
    for (const cube of cubesThree) {
      textureUtil.loadTexture("img/logo.jpeg", cube.material).then(() => {
        sceneManager.scene.add(cube);
      });
    }
    sceneManager.camera.position.x = 1.7;
    sceneManager.camera.position.y = 14;
    sceneManager.camera.position.z = -15.5;
    gamePhysic.addWorld(ballPhysic);
  };

  sceneManager.envMap().then(() => {
    gameMenu.addEventListenerButtonPlay(startGame);

    const tick = new Tick(
      sceneManager.render,
      sceneManager.scene,
      sceneManager.camera,
      control,
      gamePhysic,
      ballThreejs,
      ballPhysic,
      cubesPhy,
      cubesThree,
      gameState
    );

    tick.bucleTick();
  });
})(document, window);