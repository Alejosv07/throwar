import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class Control{
    constructor(camera,canvas){
        this.control = new OrbitControls(camera,canvas);
        this.control.enableDamping = true;
    }
}