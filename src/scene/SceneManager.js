import * as THREE from "three";

export default class SceneManager {
    /**
     * 
     * @param {*} parameters 
     */
    constructor(parameters) {

        this.scene = new THREE.Scene();        
        const width = parameters.width || window.innerWidth;
        const height = parameters.height || window.innerHeight;

        this.camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            1000
        );
        
        const canvas = parameters.canvas || document.querySelector("canvas.webgl");
        this.render = new THREE.WebGLRenderer({antialias: true,canvas: canvas});
        this.render.setSize(width,height);
    }

    activateShadow(){
        this.render.shadowMap.enabled = true;
        this.render.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    renderAll(){
        this.render.render(this.scene,this.camera);
    }
    
}