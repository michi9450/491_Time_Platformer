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
        this.level = level;
        this.screen= screen;
        this.clearEntities();

        if(level.collision) {
            for (i = 0; i < screen.collisions.length; i++) {
                let col = screen.collisions[i];
                if(col.dimension == 0) {// adds the collision for something in the past.

                }
                else { //adds the collision for something in the present.

                }
            }
        }

        if(level.falling) {
            for (i = 0; i < screen.falling.length; i++) {
                let col = screen.falling[i];
                if(col.dimension == 0) {// adds the falling for something in the past.

                }
                else { //adds the falling for something in the present.

                }
            }
        }

        if(level.jumppad) {
            for (i = 0; i < screen.jumppad.length; i++) {
                let col = screen.jumppad[i];
                if(col.dimension == 0) {// adds the jumppad for something in the past.

                }
                else { //adds the jumppad for something in the present.

                }
            }
        }

        if(level.saw) {
            for (i = 0; i < screen.saw.length; i++) {
                let col = screen.saw[i];
                if(col.dimension == 0) {// adds the saw for something in the past.

                }
                else { //adds the saw for something in the present.

                }
            }
        }

        if(level.moving) {
            for (i = 0; i < screen.moving.length; i++) {
                let col = screen.moving[i];
                if(col.dimension == 0) {// adds the moving for something in the past.

                }
                else { //adds the moving for something in the present.

                }
            }
        }

        if(level.spike) {
            for (i = 0; i < screen.spike.length; i++) {
                let col = screen.spike[i];
                if(col.dimension == 0) {// adds the spike for something in the past.

                }
                else { //adds the spike for something in the present.

                }
            }
        }

        if(level.portal) {
            for (i = 0; i < screen.portal.length; i++) {
                let col = screen.portal[i];
                if(col.dimension == 0) {// adds the portal for something in the past.

                }
                else { //adds the portal for something in the present.

                }
            }
        }
    }
}