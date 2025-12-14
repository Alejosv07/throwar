import { Body } from "cannon-es";
import * as THREE from "three";
import gsap from "gsap";

export class Tick {
  constructor(
    renderInstance,
    scene,
    camera,
    control,
    physicsWorld,
    ballThreejs,
    ballPhysic,
    cubesPhy,
    cubesThree,
    gameState,
    gameMenu
  ) {
    this.control = control.control;
    this.render = renderInstance;
    this.scene = scene;
    this.camera = camera;
    this.physicsWorld = physicsWorld;
    this.clock = new THREE.Clock();
    this.ballThreejs = ballThreejs;
    this.ballPhysic = ballPhysic;
    this.cubesPhy = cubesPhy;
    this.cubesThree = cubesThree;
    this.gameState = gameState;
    this.gameMenu = gameMenu;
    console.log(this.gameState);
    
  }
  arrayPositionCubes = [];

  resetBall() {
    if (this.gameState.isBallInPlay) {
      this.gameState.remainingAttempts--;
      this.gameMenu.updateLife(this.gameState.remainingAttempts);
      this.gameState.isBallInPlay = false;

      this.ballPhysic.type = Body.KINEMATIC;
      this.ballPhysic.velocity.set(0, 0, 0);
      this.ballPhysic.angularVelocity.set(0, 0, 0);

      const startPosition = new THREE.Vector3(1.7, 6.6, -13);
      this.ballPhysic.position.copy(startPosition);
      this.ballThreejs.mesh.position.copy(startPosition);

      if (this.gameState.remainingAttempts <= 0) {
        console.log("¡Juego terminado! Puntuación final: ...");
        this.gameMenu.addGameResult();
        this.gameMenu.addEventListenerButtonPlayAgain(this.playAgain);
        gsap.to(this.camera.position, {
          x: 10.91,
          y: 10.47,
          z: -14.5,
          duration: 2,
          ease: "power2.inOut",
        });
      }
    }
  }
  
  playAgain = () => {
    
    this.gameState.isBallInPlay = false;
    this.gameState.remainingAttempts = 3;
    this.gameState.cubesHitThisAttempt.clear();
    this.gameMenu.updatePoint(this.gameState.cubesHitThisAttempt.size);
    this.gameMenu.updateLife(this.gameState.remainingAttempts);

    let skip = 0;
    for (let index = 0; index < this.cubesPhy.length; index++) {
      this.cubesPhy[index].position.set(
        this.arrayPositionCubes[skip],
        this.arrayPositionCubes[skip + 1],
        this.arrayPositionCubes[skip + 2]
      );
      skip += 3;
      this.cubesPhy[index].velocity.set(0, 0, 0);
      this.cubesPhy[index].angularVelocity.set(0, 0, 0);
      this.cubesPhy[index].wakeUp();
      this.cubesPhy[index].quaternion.set(0, 0, 0, 1);
      this.cubesThree[index].position.copy(this.cubesPhy[index].position);
      this.cubesThree[index].quaternion.copy(this.cubesPhy[index].quaternion);
    }
    gsap.to(this.camera.position, {
      x: 1.7,
      y: 14,
      z: -15.5,
      duration: 2,
      ease: "power2.inOut",
    });
  };

  bucleTick = () => {
    const deltaTime = this.clock.getDelta();
    const MAX_DELTA = 0.05;
    const clampedDelta = Math.min(deltaTime, MAX_DELTA);

    if (this.physicsWorld) {
      this.physicsWorld.world.step(clampedDelta);
    }

    if (this.gameState.isBallInPlay === false) {
      this.cubesPhy.forEach((cubeBody, index) => {
        const cubeMesh = this.cubesThree[index];

        if (cubeBody.sleepState === Body.SLEEPING) {
          const angle = cubeMesh.quaternion.angleTo(new THREE.Quaternion());

          if (
            angle > 0.1 &&
            !this.gameState.cubesHitThisAttempt.has(cubeBody)
          ) {
            this.gameState.cubesHitThisAttempt.add(cubeBody);
            this.gameMenu.updatePoint(this.gameState.cubesHitThisAttempt.size);
          }
        }
      });
    }
    this.ballThreejs.mesh.position.copy(this.ballPhysic.position);
    this.ballThreejs.mesh.quaternion.copy(this.ballPhysic.quaternion);

    for (let index = 0; index < this.cubesPhy.length; index++) {
      this.cubesThree[index].position.copy(this.cubesPhy[index].position);
      this.cubesThree[index].quaternion.copy(this.cubesPhy[index].quaternion);
    }

    if (this.ballPhysic.position.z > 11) {
      this.resetBall();
    }
    
    this.control.update();
    this.render.render(this.scene, this.camera);
    requestAnimationFrame(this.bucleTick);
  };
}
