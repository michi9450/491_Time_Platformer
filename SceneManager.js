class SceneManager {
    constructor(game) {
        this.game = game;
        //this.game.camera = this; scene manager controls camera however, going to add this later
        this.lives = 3; //SceneManager will control amount of lives player has

        this.player = new Player(gameEngine, 0, 400) // creates player object

    }

    clearEntities(){
        this.game.entitiesPast.forEach(function (entity){
            entitiy.removeFromWorld = true;
        })
        this.game.entitiesPresent.forEach(function (entity){
            entitiy.removeFromWorld = true;
        })
    }
    /*
        level is which level the player is on
        screen is which screen the player is on from the level (basically which part of the level)
        x and y are the coordinates where the player should spawn if they die

        in theory we will have a level.js for each level which will hold var for each screen which will be loaded by this method.
    */
    LoadScreen(level, screen, x, y){
        
    }

}