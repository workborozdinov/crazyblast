import {CST} from "../CST";

export class GameScene extends Phaser.Scene{
    constructor(){
        super({
            key: CST.SCENES.GAME
        })
    }
    init(data){
        console.log(data)
        console.log("I GOT IT")
    }
    preload(){
        console.log(this.game)
        // this.game.stage.backgroundColor = "#A1A1A1";
    }
    create(){
        
    }
}