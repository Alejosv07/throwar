import * as THREE from "three";
export class Texture {
  constructor(instanceLoader) {
    this.textureLoader = new THREE.TextureLoader();
  }

  loadTexture(path = "img/logo.jpeg", materialGeometry) {
    return new Promise((resolve, reject) => {
      this.textureLoader.load(
        path,
        (texture) => {
          materialGeometry.map = texture;
          resolve({
            ok: "Texture loaded",
          });
        },
        () => {},
        (err) => {
          console.error(err);
          reject({
            error: err,
          });
        }
      );
    });
  }
}
