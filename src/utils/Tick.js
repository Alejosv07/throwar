import { Body } from "cannon-es";
import * as THREE from "three";
import gsap from "gsap";

export class Tick {
  constructor(
    renderInstance, scene, camera, control, physicsWorld, ballThreejs, 
    ballPhysic, cubesPhy, cubesThree, gameState, gameMenu
  ) {
    this.render = renderInstance;
    this.scene = scene;
    this.camera = camera;
    this.control = control.control;
    this.physicsWorld = physicsWorld;
    this.clock = new THREE.Clock();
    this.ballThreejs = ballThreejs;
    this.ballPhysic = ballPhysic;
    this.cubesPhy = cubesPhy;
    this.cubesThree = cubesThree;
    this.gameState = gameState;
    this.gameMenu = gameMenu;

    this.arrayPositionCubes = [];
    this.resetTimer = null;

    this.bucleTick = this.bucleTick.bind(this);
    this.playAgain = this.playAgain.bind(this);
  }

  resetBall() {
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
      this.resetTimer = null;
    }

    this.gameState.remainingAttempts--;
    this.gameMenu.updateLife(this.gameState.remainingAttempts);
    this.gameState.isBallInPlay = false;

    this.ballPhysic.type = Body.KINEMATIC;
    this.ballPhysic.velocity.set(0, 0, 0);
    this.ballPhysic.angularVelocity.set(0, 0, 0);

    const startPos = new THREE.Vector3(1.7, 6.6, -13);
    this.ballPhysic.position.copy(startPos);

    if (this.gameState.remainingAttempts <= 0) {
      this.gameMenu.addGameResult();
      
      const scoreDisplay = document.querySelectorAll(".pointScore").item(1);
      if(scoreDisplay) scoreDisplay.textContent = this.gameState.cubesHitThisAttempt.size;
      
      this.gameMenu.addEventListenerButtonPlayAgain(this.playAgain);

      gsap.to(this.camera.position, {
        x: 10.91, y: 10.47, z: -14.5,
        duration: 2, ease: "power2.inOut",
      });
    }
  }

  playAgain() {
    this.gameState.remainingAttempts = 4;
    this.gameState.cubesHitThisAttempt.clear();
    this.gameMenu.updatePoint(0);
    this.gameMenu.updateLife(3);
    this.gameState.isBallInPlay = false;

    let skip = 0;
    for (let i = 0; i < this.cubesPhy.length; i++) {
        this.cubesPhy[i].position.set(
            this.arrayPositionCubes[skip],
            this.arrayPositionCubes[skip+1],
            this.arrayPositionCubes[skip+2]
        );
        this.cubesPhy[i].quaternion.set(0,0,0,1);
        this.cubesPhy[i].velocity.set(0,0,0);
        this.cubesPhy[i].angularVelocity.set(0,0,0);
        this.cubesPhy[i].wakeUp();
        skip += 3;
    }

    gsap.to(this.camera.position, {
        x: 1.7, y: 14, z: -15.5,
        duration: 2, ease: "power2.inOut",
    });

    this.resetBall();
  }

  bucleTick() {
    const deltaTime = this.clock.getDelta();
    if (this.physicsWorld) {
      this.physicsWorld.world.step(Math.min(deltaTime, 0.05));
    }

    this.control.update();

    this.ballThreejs.mesh.position.copy(this.ballPhysic.position);
    this.ballThreejs.mesh.quaternion.copy(this.ballPhysic.quaternion);

    for (let i = 0; i < this.cubesPhy.length; i++) {
      this.cubesThree[i].position.copy(this.cubesPhy[i].position);
      this.cubesThree[i].quaternion.copy(this.cubesPhy[i].quaternion);

      const upVector = new THREE.Vector3(0, 1, 0);
      const cubeUp = new THREE.Vector3(0, 1, 0).applyQuaternion(this.cubesThree[i].quaternion);
      const angle = upVector.angleTo(cubeUp);

      if (angle > 0.2 && !this.gameState.cubesHitThisAttempt.has(this.cubesPhy[i])) {
        this.gameState.cubesHitThisAttempt.add(this.cubesPhy[i]);
        this.gameMenu.updatePoint(this.gameState.cubesHitThisAttempt.size);
      }
    }

    if (this.gameState.isBallInPlay) {
        const velocidadActual = this.ballPhysic.velocity.length();
        
        if (this.ballPhysic.position.y < -5 || Math.abs(this.ballPhysic.position.z) > 16) {
            this.resetBall();
        } 
        else if (velocidadActual < 0.2) {
            if (!this.resetTimer) {
                this.resetTimer = setTimeout(() => {
                    if (this.ballPhysic.velocity.length() < 0.2 && this.gameState.isBallInPlay) {
                        this.resetBall();
                    }
                    this.resetTimer = null;
                }, 1200);
            }
        } else {
            if (this.resetTimer) {
                clearTimeout(this.resetTimer);
                this.resetTimer = null;
            }
        }
    }

    this.render.render(this.scene, this.camera);
  }
}