export class Tick{
    constructor(renderInstance,scene,camera,control){
        this.control = control.control;
        this.render = renderInstance;
        this.scene = scene;
        this.camera = camera;
    }

    bucleTick=()=>{
        console.log(this.camera.position);
        this.control.update();
        this.render.render(this.scene,this.camera);
        requestAnimationFrame(this.bucleTick)
    }
}