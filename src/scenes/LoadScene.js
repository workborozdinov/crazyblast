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
        this.load.image('background', 'dist/assets/bg.png')
        this.load.image('moves', 'dist/assets/moves.png')
        this.load.bitmapFont("font", "dist/assets/font.png", "dist/assets/font.fnt");

        this.load.spritesheet('tiles', 'dist/assets/tiles.png', {
            frameHeight: CST.confField.gemHeight,
            frameWidth: CST.confField.gemWidth,
        },)
        
        //create loading bar
        const loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xdd0066
            }
        })

        //simulate load
        for (let i=0; i < 100; i++){
            this.load.image('moves', 'dist/assets/moves.png')
        }

        this.load.on("progress", (percent) =>{
            loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50)
        })

        this.load.on('complete', ()=>{
            this.scene.start(CST.SCENES.GAME, 'hello from load')    
        })
    }
    create(){

    }
}