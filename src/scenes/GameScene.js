import {CST} from "../CST";
import {gameField} from '../gameClass/board';


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

    create(){
        this.add.image(534,572, 'leftbutton').setOrigin(0)
        this.add.image(696,572, 'rightbutton').setOrigin(0)
        
        this.gameField = new gameField({
            row: 9,
            columns: 9,
            items: 4,
            fallingDown: false
        })
        this.score = 0
        this.gameField.generateBoard()
        this.drawField()
    }
    
    
    
    
    
    drawField(){
        this.poolArray = [];
        for(let i = 0; i < this.gameField.getRows(); i++){
            for(let j = 0; j < this.gameField.getColumns(); j++){
                let gemX = CST.confField.boardOffset.x + CST.confField.gemWidth * j + CST.confField.gemWidth / 2
                let gemY = CST.confField.boardOffset.y + CST.confField.gemHeight * i + CST.confField.gemHeight / 2
                let gem = this.add.sprite(gemX, gemY, "tiles", this.gameField.getValueAt(i, j)).setOrigin(0).setDepth(2)
                this.gameField.setCustomData(i, j, gem)
            }
        }
    }
}