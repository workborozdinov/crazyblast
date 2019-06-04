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
        
        //container for field
        const hitArea = new Phaser.Geom.Rectangle(0, 0, CST.confField.sizeField.x, CST.confField.sizeField.y)
        let contein = this.add.container(CST.confField.boardOffset.x, CST.confField.boardOffset.y)
        contein.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains).on("pointerdown", this.tileSelect, this);

        this.gameField = new gameField({
            row: 9,
            columns: 9,
            items: 4,
            fallingDown: false
        })
        this.score = 0
        this.gameField.generateBoard()
        this.drawField(contein)
        this.canPick = true;
        // this.input.on("pointerdown", this.tileSelect, this);
    }
    
    
    
    // updateScore(){
    //     this.scoreText.text = "Score: " + this.score.toString();
    // }
    
    drawField(contein){
        this.poolArray = [];
        for(let i = 0; i < this.gameField.getRows(); i++){
            for(let j = 0; j < this.gameField.getColumns(); j++){
                let gemX = CST.confField.gemWidth * j + CST.confField.gemWidth / 2
                let gemY = CST.confField.gemHeight * i + CST.confField.gemHeight / 2
                let gem = this.add.sprite(gemX, gemY, "tiles", this.gameField.getValueAt(i, j)).setDepth(2)
                contein.add(gem)
                this.gameField.setCustomData(i, j, gem)
            }
        }
    }

    tileSelect(pointer){
        if(this.canPick){
            console.log(12121)
            let row = Math.floor((pointer.y - CST.confField.boardOffset.y) / CST.confField.gemHeight);
            let col = Math.floor((pointer.x - CST.confField.boardOffset.x) / CST.confField.gemWidth);
            if(this.gameField.validPick(row, col) && !this.gameField.isEmpty(row, col)){
                let connectedItems = this.gameField.countConnectedItems(row, col)
                if(connectedItems > 1){
                    this.score += (connectedItems * (connectedItems - 1));
                    // this.updateScore();
                    this.canPick = false;
                    let gemsToRemove = this.gameField.listConnectedItems(row, col);
                    let destroyed = 0;
                    gemsToRemove.forEach(function(gem){
                        destroyed ++;
                        this.poolArray.push(this.gameField.getCustomDataAt(gem.row, gem.column))
                        this.tweens.add({
                            targets: this.gameField.getCustomDataAt(gem.row, gem.column),
                            alpha: 0,
                            duration: CST.confField.destroySpeed,
                            callbackScope: this,
                            onComplete: function(){
                                destroyed --;
                                if(destroyed == 0){
                                    this.gameField.removeConnectedItems(row, col)
                                    // this.makeGemsFall();
                                }
                            }
                        });
                    }.bind(this))
                }
            }
        }
    }
}