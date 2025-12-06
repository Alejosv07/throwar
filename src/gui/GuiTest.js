import GUI from 'lil-gui';

export class GuiTest {
    
    constructor(parametersGUI, obj){
        this.gui = new GUI(parametersGUI);
        this.objs = obj;

        this.gui.add(obj,"x",-100,100,0.1);
    }


}