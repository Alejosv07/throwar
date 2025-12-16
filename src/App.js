import { SceneManager } from "./scene/SceneManager.js";
import { Resizer } from "./utils/Resizer.js";
import { Ball } from "./components/Ball.js";
import { Tick } from "./utils/Tick.js";
import { Control } from "./utils/Control.js";
import { Loading } from "./components/loading.js";
import { GameMenu } from "./game/GameMenu.js";
import { GamePhysic } from "./game/gamePhysic.js";
import { Cube } from "./components/cube.js";
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
  const textureUtil = new Texture(new THREE.TextureLoader());

  let cubesPhy = [];
  let cubesThree = [];
  let tick;

  const ballPhysic = gamePhysic.createBallBody();
  ballPhysic.position.copy(ballThreejs.mesh.position);
  gamePhysic.creareFloor();

  const gameState = {
    remainingAttempts: 3,
    isBallInPlay: false,
    cubesHitThisAttempt: new Set(),
  };

  const sceneManager = new SceneManager({
    width: w.innerWidth,
    height: w.innerHeight,
    canvas: d.querySelector("canvas.webgl"),
    loading,
    gameMenu,
  });

  const resizer = new Resizer(sceneManager);
  resizer.activateResizer();

  const control = new Control(sceneManager.camera, sceneManager.render.domElement);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let isDragging = false;
  let dragStartTime = 0;

  const shootBall = (event) => {
    if (gameState.remainingAttempts <= 0 || gameState.isBallInPlay) {
        isDragging = false;
        return;
    }

    pointer.x = (event.clientX / w.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / w.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, sceneManager.camera);
    const direction = raycaster.ray.direction.clone();

    const dragEndTime = performance.now();
    const dragDuration = dragEndTime - dragStartTime;
    const forceFactor = Math.min(dragDuration / 1000, 1);
    const launchForce = 15 + 85 * forceFactor;

    ballPhysic.type = Body.DYNAMIC;
    ballPhysic.wakeUp();
    
    gameState.isBallInPlay = true;

    ballPhysic.velocity.set(
      direction.x * launchForce,
      direction.y * launchForce,
      direction.z * launchForce
    );

    isDragging = false;
  };

  const startGame = () => {
    isDragging = false;
    let cubesCount = 100;

    textureUtil.loadTexture("img/logo.jpeg", ballThreejs.mesh.material).then(() => {
        sceneManager.scene.add(ballThreejs.mesh);
    });

    control.control.enabled = false;
    const objCubes = gamePhysic.createCubes(cubesCount, 10);
    tick.arrayPositionCubes = objCubes.posInitial;
    cubesPhy.push(...objCubes.cubes);
    cubesThree.push(...cubeThreejs.createCubes(cubesCount));

    for (const cube of cubesThree) {
      textureUtil.loadTexture("img/logo.jpeg", cube.material).then(() => {
        sceneManager.scene.add(cube);
      });
    }

    gsap.to(sceneManager.camera.position, {
      x: 1.7, y: 14, z: -15.5,
      duration: 2, ease: "power2.inOut",
    });

    gamePhysic.addWorld(ballPhysic);
    gameMenu.addGamePoint();

    const canvas = sceneManager.render.domElement;
    canvas.addEventListener("mousedown", () => {
      if (!gameState.isBallInPlay) {
          isDragging = true;
          dragStartTime = performance.now();
      }
    });
    canvas.addEventListener("mouseup", (e) => {
      if (isDragging) shootBall(e);
    });
  };

  sceneManager.envMap().then(() => {
    gameMenu.addEventListenerButtonPlay(startGame);

    tick = new Tick(
      sceneManager.render, sceneManager.scene, sceneManager.camera, control,
      gamePhysic, ballThreejs, ballPhysic, cubesPhy, cubesThree, gameState, gameMenu
    );

    sceneManager.render.setAnimationLoop(tick.bucleTick);
  });
})(document, window);