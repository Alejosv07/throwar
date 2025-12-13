import { Body } from "cannon-es";
import * as THREE from "three";
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
    gameState
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
  }

  resetBall() {
    if (this.gameState.isBallInPlay) {
      this.gameState.remainingAttempts--;
      this.gameState.isBallInPlay = false;

      this.ballPhysic.type = Body.KINEMATIC;
      this.ballPhysic.velocity.set(0, 0, 0);
      this.ballPhysic.angularVelocity.set(0, 0, 0);

      const startPosition = new THREE.Vector3(1.7, 6.6, -13);
      this.ballPhysic.position.copy(startPosition);
      this.ballThreejs.mesh.position.copy(startPosition);

      console.log(`Intentos restantes: ${this.gameState.remainingAttempts}`);

      if (this.gameState.remainingAttempts <= 0) {
        console.log("¡Juego terminado! Puntuación final: ...");
      }

      this.gameState.cubesHitThisAttempt.clear();
    }
  }

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

          if (angle > 0.1 && !this.gameState.cubesHitThisAttempt.has(cubeBody)) {
            this.gameState.cubesHitThisAttempt.add(cubeBody);

            console.log(`Cubo ${index} Puntos +1`);
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
    if (
      this.ballPhysic.type === Body.DYNAMIC &&
      this.ballPhysic.position.y < -5
    ) {
      this.resetBall();
    }

    this.control.update();
    this.render.render(this.scene, this.camera);
    requestAnimationFrame(this.bucleTick);
  };
}