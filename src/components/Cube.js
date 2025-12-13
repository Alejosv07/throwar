import * as THREE from "three";

export class Cube {
  constructor() {
    this.geometry = new THREE.BoxGeometry();
    this.material = new THREE.MeshBasicMaterial({ color: "white", wireframe: false });
  }

  createCube() {
    return new THREE.Mesh(
      this.geometry,
      this.material
    );
  }

  createCubes(quantity = 1) {
    let cubes = [];
    for (let index = 0; index < quantity; index++) {
        cubes.push(this.createCube());
    }
    return cubes;
  }
}
