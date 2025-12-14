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
import gsap from "gsap";

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
  let tick;
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

  const onMouseDown = () => {
    console.log("disparado");
    isDragging = true;
    dragStartTime = performance.now();
  };

  const onMouseUp = (event) => {
    if (isDragging) {
      shootBall(event);
    }
  };

  const startGame = () => {
    isDragging = false;
    dragStartTime = 0;

    let cubes = 100;
    textureUtil
      .loadTexture("img/logo.jpeg", ballThreejs.mesh.material)
      .then(() => {
        sceneManager.scene.add(ballThreejs.mesh);
      });
    const objCubes = gamePhysic.createCubes(cubes, 10);
    tick.arrayPositionCubes = objCubes.posInitial;
    cubesPhy.push(...objCubes.cubes);
    cubesThree.push(...cubeThreejs.createCubes(cubes));
    for (const cube of cubesThree) {
      textureUtil.loadTexture("img/logo.jpeg", cube.material).then(() => {
        sceneManager.scene.add(cube);
      });
    }
    gsap.to(sceneManager.camera.position, {
      x: 1.7,
      y: 14,
      z: -15.5,
      duration: 2,
      ease: "power2.inOut",
    });
    gamePhysic.addWorld(ballPhysic);
    control.control.enabled = false;
    gameMenu.addGamePoint();

    const canvas = d.querySelector("canvas.webgl");
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("touchstart", (e) => onMouseDown(e.touches[0]));
    canvas.addEventListener("touchend", (e) => onMouseUp(e.changedTouches[0]));
  };

  sceneManager.envMap().then(() => {
    gameMenu.addEventListenerButtonPlay(startGame);
    tick = new Tick(
      sceneManager.render,
      sceneManager.scene,
      sceneManager.camera,
      control,
      gamePhysic,
      ballThreejs,
      ballPhysic,
      cubesPhy,
      cubesThree,
      gameState,
      gameMenu
    );

    tick.bucleTick();
  });
})(document, window);
