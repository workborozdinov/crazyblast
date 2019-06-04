import {CST} from "../CST";
import { GameScene } from "./GameScene";

export class LoadScene extends Phaser.Scene{
    constructor(){
        super({
            key: CST.SCENES.LOAD
        })
    }
    init(){

    }
    preload(){
        this.load.image('tiles', 'dist/assets/tiles.png')

        //create loading bar
        const loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff
            }
        })

        //simulate load
        for (let i=0; i < 100; i++){
            this.load.image('tiles'+i, 'dist/assets/tiles.png')
        }

        this.load.on("progress", (percent) =>{
            loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50)
            console.log(percent);
        })
    }
    create(){
        this.scene.start(CST.SCENES.GAME, 'hello from load')
    }
}