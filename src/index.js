import {LoadScene} from './scenes/LoadScene';
import {GameScene} from './scenes/GameScene';

const config = {
    type: Phaser.AUTO,
    width: 877,
    height: 620,
    backgroundColor: "#a1a1a1",
    scene: [
        LoadScene, GameScene
    ]
};

const game = new Phaser.Game(config);

function preload ()
{

}

function create ()
{

}
