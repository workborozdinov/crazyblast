import {CST} from "../CST";

export class WinScene extends Phaser.Scene{
    constructor(){
        super({
            key: CST.SCENES.WIN
        })
    }
    init(){

    }

    create(){
        this.add.bitmapText(CST.gameConf.width/2, CST.gameConf.height/2, 'font', 'CONGRATULATION, You Win!!!', 30).setOrigin(0.5, 0.5);
    }
}