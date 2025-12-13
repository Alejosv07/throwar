import { Body, Box, GSSolver, Plane, Sphere, Vec3, World } from "cannon-es";

export class GamePhysic {
  constructor() {
    const solver = new GSSolver();
    solver.iterations = 15;
    this.world = new World({
      gravity: new Vec3(0, -9.82, 0),
      solver: solver,
    });
    this.world.allowSleep = true;
    this.boxGeometry = new Box(new Vec3(0.5, 0.5, 0.5));
  }

  createBallBody(radius = 1, mass = 20) {
    const sphereBody = new Body({
      mass: mass,
      shape: new Sphere(radius),
      type: Body.KINEMATIC
    });
    sphereBody.addEventListener('collide', (event) => {
        const collidedBody = event.body;
    });
    sphereBody.position.set(0, radius, 0);
    return sphereBody;
  }

  creareFloor() {
    const floorShape = new Plane();

    const floorBody = new Body({
      mass: 0,
      shape: floorShape,
    });

    floorBody.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), -Math.PI / 2);

    floorBody.position.set(0, 0, 0);

    this.world.addBody(floorBody);
    return floorBody;
  }

  addWorld(body) {
    this.world.addBody(body);
  }

  createCube() {
    const boxBody = new Body({
      mass: 1,
      shape: this.boxGeometry,
      allowSleep: true,
      sleepSpeedLimit: 0.1,
      sleepTimeLimit: 0.3,
    });
    return boxBody;
  }

  createCubes(quantity = 1, rows = 10) {
    let cubes = [];
    let posX = -5;
    let posY = 0;

    for (let index = 0; index < quantity; index++) {
      let cube = this.createCube();
      if (index === quantity / rows + posY) {
        posY = index;
        posX += 1;
      }

      cube.position.set(posX, 0.5 + (index - posY), 10);
      cubes.push(cube);
      this.addWorld(cube);
    }
    return cubes;
  }
}