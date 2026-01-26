class SceneManager {
    constructor(game) {
        this.game = game;
        //this.game.camera = this; scene manager controls camera however, going to add this later
        this.lives = 3; //SceneManager will control amount of lives player has

        this.player = new Player(gameEngine, 0, 400) // creates player object

    }

    clearEntities(){
        
    }
}