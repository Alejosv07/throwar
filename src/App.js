import { SceneManager } from "./scene/SceneManager.js"
import { Resizer } from "./utils/Resizer.js"

((d,w)=>{
    const sceneManager = new SceneManager(
        {
            width: w.innerWidth,
            height: w.innerHeight,
            canvas: d.querySelector("canvas.webgl")
        }
    );

    const resizer = new Resizer(sceneManager);
    resizer.activateResizer();
})(document,window);