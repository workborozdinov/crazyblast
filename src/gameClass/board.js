export class gameField{

    // constructor, simply turns obj information into class properties
    constructor(obj){
        if(obj == undefined){
            obj = {}
        }
        this.rows = (obj.rows != undefined) ? obj.rows : 9;
        this.columns = (obj.columns != undefined) ? obj.columns : 9;
        this.items = (obj.items != undefined) ? obj.items : 4;
        this.fallingDown = (obj.fallingDown != undefined) ? obj.fallingDown : true;
    }

    // generates the game board
    generateBoard(){
        this.gameArray = [];
        for(let i = 0; i < this.rows; i ++){
            this.gameArray[i] = [];
            for(let j = 0; j < this.columns; j ++){
                let randomValue = Math.floor(Math.random() * this.items);
                this.gameArray[i][j] = {
                    value: randomValue,
                    isEmpty: false,
                    row: i,
                    column: j
                }
            }
        }
    }

    // returns the number of board rows
    getRows(){
        return this.rows;
    }

    // returns the number of board columns
    getColumns(){
        return this.columns;
    }

    // returns true if the item at (row, column) is empty
    isEmpty(row, column){
        return this.gameArray[row][column].isEmpty;
    }

    // returns the value of the item at (row, column), or false if it's not a valid pick
    getValueAt(row, column){
        if(!this.validPick(row, column)){
            return false;
        }
        return this.gameArray[row][column].value;
    }

    // returns the custom data of the item at (row, column)
    getCustomDataAt(row, column){
        return this.gameArray[row][column].customData;
    }

    // returns true if the item at (row, column) is a valid pick
    validPick(row, column){
        return row >= 0 && row < this.rows && column >= 0 && column < this.columns && this.gameArray[row] != undefined && this.gameArray[row][column] != undefined;
    }

    // sets a custom data on the item at (row, column)
    setCustomData(row, column, customData){
        this.gameArray[row][column].customData = customData;
    }

    // returns an object with all connected items starting at (row, column)
    listConnectedItems(row, column){
        if(!this.validPick(row, column) || this.gameArray[row][column].isEmpty){
            return;
        }
        this.colorToLookFor = this.gameArray[row][column].value;
        this.floodFillArray = [];
        this.floodFillArray.length = 0;
        this.floodFill(row, column);
        return this.floodFillArray;
    }

    // returns the number of connected items starting at (row, column)
    countConnectedItems(row, column){
        return this.listConnectedItems(row, column).length;
    }

    // removes all connected items starting at (row, column)
    removeConnectedItems(row, column){
        let items = this.listConnectedItems(row, column);
        items.forEach(function(item){
            this.gameArray[item.row][item.column].isEmpty = true;
        }.bind(this))
    }

    // returs true if in the board there is at least a move with a minimum minCombo items
    stillPlayable(minCombo){
        for(let i = 0; i < this.getRows(); i ++){
            for(let j = 0; j < this.getColumns(); j ++){
                if(!this.isEmpty(i, j) && this.countConnectedItems(i, j) >= minCombo){
                    return true;
                }
            }
        }
        return false;
    }

    // returns the amount of non empty items on the board
    nonEmptyItems(minCombo){
        let result = 0;
        for(let i = 0; i < this.getRows(); i ++){
            for(let j = 0; j < this.getColumns(); j ++){
                if(!this.isEmpty(i, j) ){
                    result ++;
                }
            }
        }
        return result;
    }

    // flood fill routine
    floodFill(row, column){
        if(!this.validPick(row, column) || this.isEmpty(row, column)){
            return;
        }
        if(this.gameArray[row][column].value == this.colorToLookFor && !this.alreadyVisited(row, column)){
            this.floodFillArray.push({
                row: row,
                column: column
            });
            this.floodFill(row + 1, column);
            this.floodFill(row - 1, column);
            this.floodFill(row, column + 1);
            this.floodFill(row, column - 1);
        }
    }

    // arranges the board, making items fall down. Returns an object with movement information
    arrangeBoard(){
        let result = []

        // falling down
        if(this.fallingDown){
            for(let i = this.getRows() - 2; i >= 0; i --){
                for(let j = 0; j < this.getColumns(); j ++){
                    let emptySpaces = this.emptySpacesBelow(i, j);
                    if(!this.isEmpty(i, j) && emptySpaces > 0){
                        this.swapItems(i, j, i + emptySpaces, j)
                        result.push({
                            row: i + emptySpaces,
                            column: j,
                            deltaRow: emptySpaces
                        });
                    }
                }
            }
        }

        // falling up
        else{
            for(let i = 1; i < this.getRows(); i ++){
                for(let j = 0; j < this.getColumns(); j ++){
                    let emptySpaces = this.emptySpacesAbove(i, j);
                    if(!this.isEmpty(i, j) && emptySpaces > 0){
                        this.swapItems(i, j, i - emptySpaces, j)
                        result.push({
                            row: i - emptySpaces,
                            column: j,
                            deltaRow: -emptySpaces
                        });
                    }
                }
            }
        }
        return result;
    }

    // checks if a column is completely empty
    isEmptyColumn(column){
        return this.emptySpacesBelow(-1, column) == this.getRows();
    }

    // counts empty columns to the left of column
    countLeftEmptyColumns(column){
        let result = 0;
        for(let i = column - 1; i >= 0; i --){
            if(this.isEmptyColumn(i)){
                result ++;
            }
        }
        return result;
    }

    // compacts the board to the left and returns an object with movement information
    compactBoardToLeft(){
        let result = [];
        for(let i = 1; i < this.getColumns(); i ++){
            if(!this.isEmptyColumn(i)){
                let emptySpaces = this.countLeftEmptyColumns(i);
                if(emptySpaces > 0){
                    for(let j = 0; j < this.getRows(); j ++){
                        if(!this.isEmpty(j, i)){
                            this.swapItems(j, i, j, i - emptySpaces)
                            result.push({
                                row: j,
                                column: i - emptySpaces,
                                deltaColumn: -emptySpaces
                            });
                        }
                    }
                }
            }
        }
        return result;
    }

    // replenishes the board and returns an object with movement information
    replenishBoard(){
        let result = [];
        for(let i = 0; i < this.getColumns(); i ++){
            if(this.isEmpty(0, i)){
                let emptySpaces = this.emptySpacesBelow(0, i) + 1;
                for(let j = 0; j < emptySpaces; j ++){
                    let randomValue = Math.floor(Math.random() * this.items);
                    result.push({
                        row: j,
                        column: i,
                        deltaRow: emptySpaces
                    });
                    this.gameArray[j][i].value = randomValue;
                    this.gameArray[j][i].isEmpty = false;
                }
            }
        }
        return result;
    }

    // returns the amount of empty spaces below the item at (row, column)
    emptySpacesBelow(row, column){
        let result = 0;
        if(row != this.getRows()){
            for(let i = row + 1; i < this.getRows(); i ++){
                if(this.isEmpty(i, column)){
                    result ++;
                }
            }
        }
        return result;
    }

    // returns the amount of empty spaces above the item at (row, column)
    emptySpacesAbove(row, column){
        let result = 0;
        if(row != 0){
            for(let i = row - 1; i >=0; i --){
                if(this.isEmpty(i, column)){
                    result ++;
                }
            }
        }
        return result;
    }

    // swap the items at (row, column) and (row2, column2)
    swapItems(row, column, row2, column2){
        let tempObject = Object.assign(this.gameArray[row][column]);
        this.gameArray[row][column] = Object.assign(this.gameArray[row2][column2]);
        this.gameArray[row2][column2] = Object.assign(tempObject);
    }

    // returns true if (row, column) is already in floodFillArray array
    alreadyVisited(row, column){
        let found = false;
        this.floodFillArray.forEach(function(item){
            if(item.row == row && item.column == column){
                found = true;
            }
        });
        return found;
    }

}