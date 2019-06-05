import {LoadScene} from './scenes/LoadScene';
import {GameScene} from './scenes/GameScene';
import {WinScene} from './scenes/Win';
import {FailScene} from './scenes/Fail';

export const CST = {
    SCENES: {
        LOAD: "LOAD",
        GAME: "GAME",
        WIN: "WIN",
        FAIL: "FAIL"
    },
    confField: {
        gemHeight: 49,
        gemWidth: 42.8,
        boardOffset: {
            x: (49),
            y: (117)  
        },
        sizeField: {
            x: 385.2,
            y: 441
        },
        destroySpeed: 150,
        fallSpeed: 100,
        slideSpeed: 500,
        Necessary: 500,
        MoveNum: 24
        // localStorageName: "samegame"
    },
    gameConf: {
        type: Phaser.AUTO,
        width: 877,
        height: 620,
        backgroundColor: "#a1a1a1",
        scene: [
            LoadScene, GameScene, WinScene, FailScene
        ]
    }
}