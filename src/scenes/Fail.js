import {CST} from "../CST";

export class FailScene extends Phaser.Scene{
    constructor(){
        super({
            key: CST.SCENES.FAIL
        })
    }
    init(){

    }

    create(){
        this.add.bitmapText(CST.gameConf.width/2, CST.gameConf.height/2, 'font', 'OOOOPPPSS, Fail!!!', 30).setOrigin(0.5, 0.5);
    }
}