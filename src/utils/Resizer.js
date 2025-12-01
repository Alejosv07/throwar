export class Resizer {
  constructor(sceneManagerInstance) {
    this.sceneManager = sceneManagerInstance;
  }

  activateResizer() {
    window.addEventListener("resize", () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      this.sceneManager.camera.aspect = w / h;
      this.sceneManager.camera.updateProjectionMatrix();
      this.sceneManager.render.setSize(w, h);
    });
  }
}
