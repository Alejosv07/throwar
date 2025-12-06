import * as THREE from "three";
import { HDRLoader } from "three/addons/loaders/HDRLoader.js";

export class SceneManager {
  /**
   *
   * @param {*} parameters
   */
  constructor(parameters) {
    this.scene = new THREE.Scene();
    const width = parameters.width || window.innerWidth;
    const height = parameters.height || window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = -18.84574067232871;
    this.camera.position.y = -0.905525898593025;
    this.camera.position.x = -23.854099885728537;
    const canvas = parameters.canvas || document.querySelector("canvas.webgl");
    this.render = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvas,
      alpha: true,
    });
    this.render.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.render.outputEncoding = THREE.sRGBEncoding;
    this.render.toneMapping = THREE.ACESFilmicToneMapping;
    this.render.physicallyCorrectLights = true;
    this.render.setSize(width, height);
  }

  activateShadow() {
    this.render.shadowMap.enabled = true;
    this.render.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  renderAll() {
    this.render.render(this.scene, this.camera);
  }

  envMap(hdriUrl = "img/bloem_field_sunrise_1k.hdr") {
    const loader = new HDRLoader();
    const pmremGenerator = new THREE.PMREMGenerator(this.render);
    pmremGenerator.compileEquirectangularShader();

    loader.load(
      hdriUrl,
      (map) => {
        map.mapping = THREE.EquirectangularReflectionMapping;
        this.scene.background = map;

        const envMap = pmremGenerator.fromEquirectangular(map).texture;
        this.scene.environment = envMap;

        map.dispose();
        pmremGenerator.dispose();
        this.renderAll();
      },
      undefined,
      (err) => {
        console.error("Error cargando HDR:", err);
      }
    );
  }
}
