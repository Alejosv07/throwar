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

      // 1. Detener la pelota y hacerla cinemática de nuevo
      this.ballPhysic.type = Body.KINEMATIC;
      this.ballPhysic.velocity.set(0, 0, 0);
      this.ballPhysic.angularVelocity.set(0, 0, 0);

      // 2. Colocarla en la posición de origen deseada (la posición que tienes en el código principal)
      const startPosition = new THREE.Vector3(1.7, 6.6, -13);
      this.ballPhysic.position.copy(startPosition);
      this.ballThreejs.mesh.position.copy(startPosition);

      // 3. Notificar al usuario (por ejemplo, actualizando la GUI)
      console.log(`Intentos restantes: ${this.gameState.remainingAttempts}`);
      // Aquí podrías llamar a una función de la GUI para actualizar el marcador

      // 4. Si los intentos terminaron, terminar el juego
      if (this.gameState.remainingAttempts <= 0) {
        console.log("¡Juego terminado! Puntuación final: ...");
        // Lógica de fin de juego
      }

      // 5. Reiniciar el seguimiento de colisiones para el próximo lanzamiento
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

        // Verifica si el cubo está durmiendo (en reposo)
        if (cubeBody.sleepState === Body.SLEEPING) {
          // Verifica si ha habido una rotación significativa desde el inicio.
          // Una rotación de ~0.05 a 0.1 radianes (5-6 grados) indica un derribo.
          const angle = cubeMesh.quaternion.angleTo(new THREE.Quaternion()); // Comparar con rotación inicial (si es 0, 0, 0)

          if (angle > 0.1 && !this.gameState.cubesHitThisAttempt.has(cubeBody)) {
            // ** El cubo fue derribado y no ha sido contado **
            this.gameState.cubesHitThisAttempt.add(cubeBody); // Añadir al set para no contarlo de nuevo

            // Lógica de Puntuación:
            console.log(`¡Cubo ${index} derribado! Puntos +1`);
            // Actualiza tu marcador global aquí.

            // Opcional: Podrías marcar el cubo como 'STATIC' y cambiar su color
            // para que ya no interactúe y visualmente sea un derribo.
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
      // La pelota ha caído por debajo del nivel de juego (-5 en Y)
      this.resetBall();
    }

    this.control.update();
    this.render.render(this.scene, this.camera);
    requestAnimationFrame(this.bucleTick);
  };
}
