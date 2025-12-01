import { SceneManager } from "../src/scene/SceneManager.js"
import { Resizer } from "../src/utils/Resizer.js"

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