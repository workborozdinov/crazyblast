import {CST} from "../CST";
import {gameField} from '../gameClass/board';
import {WinScene} from "./Win";
import {FailScene} from "./Fail";


export class GameScene extends Phaser.Scene{
    constructor(){
        super({
            key: CST.SCENES.GAME
        })
    }
    init(){

    }

    create(){
        this.add.image(534,572, 'leftbutton').setOrigin(0)
        this.add.image(696,572, 'rightbutton').setOrigin(0)

        const moves = this.add.image(0, 0, 'moves').setOrigin(0)
        const bg = this.add.image(-12, -12, 'background').setOrigin(0)

        //container for field
        const hitArea = new Phaser.Geom.Rectangle(0, 0, CST.confField.sizeField.x, CST.confField.sizeField.y)
        this.containField = this.add.container(CST.confField.boardOffset.x, CST.confField.boardOffset.y)
        this.containField.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains).on("pointerdown", this.tileSelect, this);

        //container for Score/Necessary/Moves
        const containScore = this.add.container(545, 117)
        containScore.add(moves)

        this.gameField = new gameField({
            row: 9,
            columns: 9,
            items: 4,
            fallingDown: true
        })

        this.containField.add(bg)

        this.score = 0
        this.gameField.generateBoard()
        this.drawField(this.containField)
        this.scoreText = this.add.bitmapText(20, 20, 'font', 'ccc', 30);
        this.scoreNecessary = this.add.bitmapText(20, 60, 'font', 'Necessary: ' + CST.confField.Necessary, 30);
        this.scoreMoves = this.add.bitmapText(97, 10, 'font', 'Moves', 20);
        this.scoreMovesNum = this.add.bitmapText(110, 140, 'font', CST.confField.MoveNum, 40)
        containScore.add(this.scoreMoves)
        containScore.add(this.scoreMovesNum)
        this.updateScore();
    }
    
    updateScore(){
        this.scoreText.setText("Score: " + this.score.toString())
    }

    updateMoves(){
        this.scoreMovesNum.setText(this.scoreMovesNum.text - 1)
        if(this.scoreMovesNum.text < 10){
            this.scoreMovesNum.setX(130)
        }
    }
    
    drawField(contain){
        this.poolArray = [];
        for(let i = 0; i < this.gameField.getRows(); i++){
            for(let j = 0; j < this.gameField.getColumns(); j++){
                let gemX = CST.confField.gemWidth * j + CST.confField.gemWidth / 2
                let gemY = CST.confField.gemHeight * i + CST.confField.gemHeight / 2
                let gem = this.add.sprite(gemX, gemY, "tiles", this.gameField.getValueAt(i, j))
                contain.add(gem)
                this.gameField.setCustomData(i, j, gem)
            }
        }
    }

    tileSelect(pointer){
        let row = Math.floor((pointer.y - CST.confField.boardOffset.y) / CST.confField.gemHeight);
        let col = Math.floor((pointer.x - CST.confField.boardOffset.x) / CST.confField.gemWidth);
        if(this.gameField.validPick(row, col) && !this.gameField.isEmpty(row, col)){
            let connectedItems = this.gameField.countConnectedItems(row, col)
            if(connectedItems > 1){
                this.score += (connectedItems * (connectedItems - 1));
                this.updateScore();
                this.updateMoves();
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
                                this.makeGemsFall();
                            }
                        }
                    });
                }.bind(this))
            }
        }
    }

    makeGemsFall(){
        let movements = this.gameField.arrangeBoard();
        if(movements.length == 0){
            this.makeGemsSlide();
        }
        else{
            let fallingGems = 0;
            movements.forEach(function(movement){
                fallingGems ++;
                this.tweens.add({
                    targets: this.gameField.getCustomDataAt(movement.row, movement.column),
                    y: this.gameField.getCustomDataAt(movement.row, movement.column).y + CST.confField.gemHeight * movement.deltaRow,
                    duration: CST.confField.fallSpeed * Math.abs(movement.deltaRow),
                    callbackScope: this,
                    onComplete: function(){
                        fallingGems --;
                        if(fallingGems == 0){
                            this.makeGemsSlide();
                        }
                    }
                })
            }.bind(this));
        }
    }
    makeGemsSlide(){
        let slideMovements = this.gameField.compactBoardToLeft();
        if(slideMovements.length == 0){
            this.endOfMove();
        }
        else{
            let movingGems = 0;
            slideMovements.forEach(function(movement){
                movingGems ++;
                this.tweens.add({
                    targets: this.gameField.getCustomDataAt(movement.row, movement.column),
                    x: this.gameField.getCustomDataAt(movement.row, movement.column).x + CST.confField.gemWidth * movement.deltaColumn,
                    duration: Math.abs(CST.confField.slideSpeed * movement.deltaColumn),
                    ease: "Bounce.easeOut",
                    callbackScope: this,
                    onComplete: function(){
                        movingGems --;
                        if(movingGems == 0){
                            this.endOfMove();
                        }
                    }
                });
            }.bind(this))
        }
    }

    addGems(contain){
        for(let i = 0; i < this.gameField.getRows(); i++){
            for(let j = 0; j < this.gameField.getColumns(); j++){
                if ((this.gameField.isEmpty(i, j))){
                    let gemX = CST.confField.gemWidth * j + CST.confField.gemWidth / 2
                    let gemY = CST.confField.gemHeight * i + CST.confField.gemHeight / 2
                    let randomValue = Math.floor(Math.random() * this.gameField.items);
                    this.gameField.gameArray[i][j] = {
                        value: randomValue,
                        isEmpty: false,
                        row: i,
                        column: j
                    }

                    let gem = this.add.sprite(gemX, gemY, "tiles", this.gameField.getValueAt(i, j)).setDepth(2)
                    contain.add(gem)
                    this.gameField.setCustomData(i, j, gem)
                }
            }
        }
    }
    endOfMove(){
        this.addGems(this.containField)
        if ((parseInt(this.scoreMovesNum.text)>0)&&(CST.confField.Necessary<this.score)){
            this.add.bitmapText(CST.gameConf.width/2, CST.gameConf.height/2, 'font', 'CONGRATULATION', 30).setOrigin(0.5, 0.5);
            this.scene.start(CST.SCENES.WIN)
        } else if (parseInt(this.scoreMovesNum.text)==0) {
            this.add.bitmapText(CST.gameConf.width/2, CST.gameConf.height/2, 'font', 'OOOOPPPS, Fail', 30).setOrigin(0.5, 0.5);
            this.scene.start(CST.SCENES.FAIL)
        }
    }
}