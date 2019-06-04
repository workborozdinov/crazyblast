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
        this.load.image('leftbutton', 'dist/assets/anonLeft.png')
        this.load.image('rightbutton', 'dist/assets/anonRight.png')

        this.load.spritesheet('tiles', 'dist/assets/tiles.png', {
            frameHeight: CST.confField.gemHeight,
            frameWidth: CST.confField.gemWidth, 
        })
        
        //create loading bar
        const loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xdd0066
            }
        })

        //simulate load
        for (let i=0; i < 100; i++){
            this.load.image('leftbutton'+i, 'dist/assets/anonLeft.png')
        }

        this.load.on("progress", (percent) =>{
            loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50)
        })

        this.load.on('complete', ()=>{
            this.scene.start(CST.SCENES.GAME, 'hello from load')    
        })
    }
    create(){
        // this.scene.start(CST.SCENES.GAME, 'hello from load')
    }
}