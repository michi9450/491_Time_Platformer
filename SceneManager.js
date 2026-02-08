class SceneManager {
    constructor(game) {
        this.game = game;
        //this.game.camera = this; scene manager controls camera however, going to add this later
        this.lives = 3; //SceneManager will control amount of lives player has

        this.player = new Player(gameEngine, 100, 400) // creates player object

        this.LoadScreen(SceneOne, 0, 0);
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
    LoadScreen(screen, x, y){
        // this.level = level;
        this.screen = screen;
        this.clearEntities();

       // this.game.camera = new Camera(this.game, this.ctx.canvas.width, this.ctx.canvas.height);
        this.game.player = this.player;
        this.game.addEntityPast(this.player);
	    this.game.addEntityPresent(this.player);

        if(screen.collisions) {
            for (let i = 0; i < screen.collisions.length; i++) {
                let ent = screen.collisions[i];
                if(ent.dimension == 0) {// adds the collision for something in the past.
                    this.game.addEntityPast(new invisible_collision(this.game, ent.x, ent.y, ent.width, ent.height));
                }
                else { //adds the collision for something in the present.
                    this.game.addEntityPresent(new invisible_collision(this.game, ent.x, ent.y, ent.width, ent.height));
                }
            }
        }

        if(screen.falling) {
            for (let i = 0; i < screen.falling.length; i++) {
                let ent = screen.falling[i];
                if(ent.dimension == 0) {// adds the falling for something in the past.
                    this.game.addEntityPast(new FallingPlatform(this.game, ent.x, ent.y, ent.width, ent.height, ent.delay));
                }
                else { //adds the falling for something in the present.
                    this.game.addEntityPresent(new FallingPlatform(this.game, ent.x, ent.y, ent.width, ent.height, ent.delay));
                }
            }
        }

        if(screen.jumppad) {
            for (let i = 0; i < screen.jumppad.length; i++) {
                let ent = screen.jumppad[i];
                if(ent.dimension == 0) {// adds the jumppad for something in the past.
                    this.game.addEntityPast(new JumpPad(this.game, ent.x, ent.y));
                }
                else { //adds the jumppad for something in the present.
                    this.game.addEntityPresent(new JumpPad(this.game, ent.x, ent.y));
                }
            }
        }

        if(screen.saw) {
            for (let i = 0; i < screen.saw.length; i++) {
                let ent = screen.saw[i];
                if(ent.dimension == 0) {// adds the saw for something in the past.
                    this.game.addEntityPast(new SawBlade(this.game, ent.x, ent.y, ent.width, ent.path, ent.speed, ent.direction));
                }
                else { //adds the saw for something in the present.
                    this.game.addEntityPresent(new SawBlade(this.game, ent.x, ent.y, ent.width, ent.path, ent.speed, ent.direction));
                }
            }
        }

        if(screen.moving) {
            for (let i = 0; i < screen.moving.length; i++) {
                let ent = screen.moving[i];
                if(ent.dimension == 0) {// adds the moving for something in the past.
                    this.game.addEntityPast(new MovingPlateform(this.game, ent.Sx, ent.Sy, ent.Ex, ent.Ey, ent.width, ent.height, ent.speed));
                }
                else { //adds the moving for something in the present.
                    this.game.addEntityPresent(new MovingPlateform(this.game, ent.Sx, ent.Sy, ent.Ex, ent.Ey, ent.width, ent.height, ent.speed));
                }
            }
        }

        if(screen.spike) {
            for (let i = 0; i < screen.spike.length; i++) {
                let ent = screen.spike[i];
                if(ent.dimension == 0) {// adds the spike for something in the past.
                    this.game.addEntityPast(new Spike(this.game, ent.x, ent.y, ent.width, ent.height));
                }
                else { //adds the spike for something in the present.
                    this.game.addEntityPresent(new Spike(this.game, ent.x, ent.y, ent.width, ent.height));
                }
            }
        }

        if(screen.portal) {
            for (let i = 0; i < screen.portal.length; i++) {
                let ent = screen.portal[i];
                if(ent.dimension == 0) {// adds the portal for something in the past.
                    this.game.addEntityPast(new invisible_collision(this.game, ent.x, ent.y, ent.width, ent.height));
                }
                else { //adds the portal for something in the present.
                    this.game.addEntityPresent(new invisible_collision(this.game, ent.x, ent.y, ent.width, ent.height));
                }
            }
        }
        if(screen.parallax) {
            for (let i = 0; i < screen.parallax.length; i++) {
                let ent = screen.parallax[i];
                if(ent.dimension == 0) {// adds the portal for something in the past.
                    this.game.addEntityPast(new ParallaxLayer(this.game, ent.file, 0, 0 , 2, true));
                }
                else { //adds the portal for something in the present.
                    this.game.addEntityPresent(new ParallaxLayer(this.game, ent.file, 0, 0 , 2, true));
                }
            }
        }

        this.game.addEntityPast(new ParallaxLayer(this.game, "sprites/backgrounds/snowy mountains/clouds_mg_1.png", 0.6, 100, 3, false, 0));
	    this.game.addEntityPast(new ParallaxLayer(this.game, "sprites/backgrounds/snowy mountains/clouds_mg_2.png", 0.4, 50, 3, false, 0));
	    this.game.addEntityPast(new ParallaxLayer(this.game, "sprites/backgrounds/snowy mountains/clouds_mg_3.png", 0.3, 0, 3, false, 0));
	    this.game.addEntityPast(new ParallaxLayer(this.game, "sprites/backgrounds/snowy mountains/cloud_lonely.png", 0.07, 0, 3, false, 0));
	    this.game.addEntityPast(new ParallaxLayer(this.game, "sprites/backgrounds/snowy mountains/glacial_mountains.png", 0.1, 0, 3, false, 0));
	    this.game.addEntityPast(new ParallaxLayer(this.game, "sprites/backgrounds/snowy mountains/clouds_bg.png", 0.05, 0, 3, false, 0));
	    this.game.addEntityPast(new ParallaxLayer(this.game, "sprites/backgrounds/snowy mountains/sky.png", 0, 0, 5, false, 0));


	    this.game.addEntityPresent(new ParallaxLayer(this.game, "sprites/backgrounds/city skyline/5.png", 0.5, 100, 2, false, 0));
	    this.game.addEntityPresent(new ParallaxLayer(this.game, "sprites/backgrounds/city skyline/4.png", 0.4, 150, 2, false, 0));
	    this.game.addEntityPresent(new ParallaxLayer(this.game, "sprites/backgrounds/city skyline/3.png", 0.3, 100, 2, false, 0));
	    this.game.addEntityPresent(new ParallaxLayer(this.game, "sprites/backgrounds/city skyline/2.png", 0.2, 150, 2, false, 0));
	    this.game.addEntityPresent(new ParallaxLayer(this.game, "sprites/backgrounds/city skyline/1.png", 0.1, 0, 2, false, 0));

    }
}