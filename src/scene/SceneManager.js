import * as THREE from "three";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

export class SceneManager {
  /**
   *
   * @param {*} parameters
   */
  constructor(parameters) {
    this.scene = new THREE.Scene();
    const width = parameters.width || window.innerWidth;
    const height = parameters.height || window.innerHeight;
    this.gameMenu = parameters.gameMenu;

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z =-5.293315996206591;
    this.camera.position.y = -0.20093966014075043;
    this.camera.position.x = -4.181941931956155;
    const canvas = parameters.canvas || document.querySelector("canvas.webgl");
    this.render = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvas,
      alpha: false,
    });
    this.render.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.render.outputColorSpace = THREE.SRGBColorSpace;
    this.render.toneMapping = THREE.ACESFilmicToneMapping;
    this.render.setSize(width, height);
    this.loading = parameters.loading;
  }

  activateShadow() {
    this.render.shadowMap.enabled = true;
    this.render.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  renderAll() {
    this.render.render(this.scene, this.camera);
  }

  envMap(hdriUrl = "img/bloem_field_sunrise_1k.hdr") {
    return new Promise((resolve, reject) => {
      const loader = new RGBELoader();
      const pmremGenerator = new THREE.PMREMGenerator(this.render);
      pmremGenerator.compileEquirectangularShader();

      loader.load(
        hdriUrl,
        (map) => {
          if (this.loading) {
            this.loading.disableLoading();
          }
          this.gameMenu.addGameMenuInit();
          resolve();
          map.mapping = THREE.EquirectangularReflectionMapping;
          this.scene.background = map;

          const envMap = pmremGenerator.fromEquirectangular(map).texture;
          this.scene.environment = envMap;

          map.dispose();
          pmremGenerator.dispose();
          this.renderAll();
        },
        () => {
          this.loading.activateLoading();
        },
        undefined,
        (err) => {
          console.error("Error cargando HDR:", err);
          reject(err);
        }
      );
    });
  }
}