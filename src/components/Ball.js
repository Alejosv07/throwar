import * as THREE from "three";

export class Ball {
    constructor(){
        this.mesh = new THREE.Mesh(new THREE.SphereGeometry(),new THREE.MeshBasicMaterial({color: "white",wireframe:true}));
    }
}