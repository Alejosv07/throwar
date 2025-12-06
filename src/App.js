import { SceneManager } from "./scene/SceneManager.js";
import { Resizer } from "./utils/Resizer.js";
import { Ball } from "./components/Ball.js";
import { Tick } from "./utils/tick.js";
import { Control } from "./utils/Control.js";

((d, w) => {
  const sceneManager = new SceneManager({
    width: w.innerWidth,
    height: w.innerHeight,
    canvas: d.querySelector("canvas.webgl"),
  });
  const resizer = new Resizer(sceneManager);
  resizer.activateResizer();

  //const ball = new Ball();

  //sceneManager.scene.add(ball.mesh);

  const control = new Control(
    sceneManager.camera,
    d.querySelector("canvas.webgl")
  );
  
  sceneManager.envMap();
  const tick = new Tick(
    sceneManager.render,
    sceneManager.scene,
    sceneManager.camera,
    control
  );
  tick.bucleTick();
})(document, window);
