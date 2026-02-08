class SceneManager {
    constructor(game) {
        this.game = game;
        //this.game.camera = this; scene manager controls camera however, going to add this later
        this.lives = 3; //SceneManager will control amount of lives player has

        this.player = new Player(gameEngine, 100, 400) // creates player object

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
                let ent = screen.collisions[i];
                if(ent.dimension == 0) {// adds the collision for something in the past.
                    this.game.addEntityPast(new invisible_collision(this.game, ent.x, ent.y, ent.width, ent.height));
                }
                else { //adds the collision for something in the present.
                    this.game.addEntityPresent(new invisible_collision(this.game, ent.x, ent.y, ent.width, ent.height));
                }
            }
        }

        if(level.falling) {
            for (i = 0; i < screen.falling.length; i++) {
                let ent = screen.falling[i];
                if(ent.dimension == 0) {// adds the falling for something in the past.
                    this.game.addEntityPast(new FallingPlatform(this.game, ent.x, ent.y, ent.width, ent.height, ent.delay));
                }
                else { //adds the falling for something in the present.
                    this.game.addEntityPresent(new FallingPlatform(this.game, ent.x, ent.y, ent.width, ent.height, ent.delay));
                }
            }
        }

        if(level.jumppad) {
            for (i = 0; i < screen.jumppad.length; i++) {
                let ent = screen.jumppad[i];
                if(ent.dimension == 0) {// adds the jumppad for something in the past.
                    this.game.addEntityPast(new JumpPad(this.game, ent.x, ent.y));
                }
                else { //adds the jumppad for something in the present.
                    this.game.addEntityPast(new JumpPad(this.game, ent.x, ent.y));
                }
            }
        }

        if(level.saw) {
            for (i = 0; i < screen.saw.length; i++) {
                let ent = screen.saw[i];
                if(ent.dimension == 0) {// adds the saw for something in the past.
                    this.game.addEntityPast(new SawBlade(this.game, ent.x, ent.y, ent.width, ent.path, ent.speed, ent.direction));
                }
                else { //adds the saw for something in the present.
                    this.game.addEntityPast(new SawBlade(this.game, ent.x, ent.y, ent.width, ent.path, ent.speed, ent.direction));
                }
            }
        }

        if(level.moving) {
            for (i = 0; i < screen.moving.length; i++) {
                let ent = screen.moving[i];
                if(ent.dimension == 0) {// adds the moving for something in the past.
                    this.game.addEntityPast(new MovingPlateform(this.game, ent.Sx, ent.Sy, ent.Ex, ent.Ey, ent.width, ent.height, ent.speed));
                }
                else { //adds the moving for something in the present.
                    this.game.addEntityPast(new MovingPlateform(this.game, ent.Sx, ent.Sy, ent.Ex, ent.Ey, ent.width, ent.height, ent.speed));
                }
            }
        }

        if(level.spike) {
            for (i = 0; i < screen.spike.length; i++) {
                let ent = screen.spike[i];
                if(ent.dimension == 0) {// adds the spike for something in the past.
                    this.game.addEntityPast(new Spike(this.game, ent.x, ent.y, ent.width, ent.height));
                }
                else { //adds the spike for something in the present.
                    this.game.addEntityPast(new Spike(this.game, ent.x, ent.y, ent.width, ent.height));
                }
            }
        }

        if(level.portal) {
            for (i = 0; i < screen.portal.length; i++) {
                let ent = screen.portal[i];
                if(ent.dimension == 0) {// adds the portal for something in the past.
                    this.game.addEntityPast(new invisible_collision(this.game, ent.x, ent.y, ent.width, ent.height));
                }
                else { //adds the portal for something in the present.
                    this.game.addEntityPast(new invisible_collision(this.game, ent.x, ent.y, ent.width, ent.height));
                }
            }
        }
        if(level.parallax) {
            for (i = 0; i < screen.paralax.length; i++) {
                let ent = screen.portal[i];
                if(ent.dimension == 0) {// adds the portal for something in the past.
                    this.game.addEntityPast(new ParallaxLayer(this.game, ent.file, 0, 0 , 2, true));
                }
                else { //adds the portal for something in the present.
                    this.game.addEntityPast(new ParallaxLayer(this.game, ent.file, 0, 0 , 2, true));
                }
            }
        }
    }
}