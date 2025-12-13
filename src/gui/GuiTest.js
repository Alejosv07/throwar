import GUI from 'lil-gui';

export class GuiTest {
    
    constructor(parametersGUI, obj){
        this.gui = new GUI(parametersGUI);
        this.objs = obj;
        this.gui.add(obj,"x",-100,100,0.1);
        this.gui.add(obj,"y",-100,100,0.1);
        this.gui.add(obj,"z",-100,100,0.1);
    }


}