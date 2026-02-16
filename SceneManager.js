class SceneManager {
    constructor(game) {
        this.game = game;
        //this.game.camera = this; scene manager controls camera however, going to add this later
        this.lives = 3; //SceneManager will control amount of lives player has


        this.LoadScreen(SceneFour, 0, 0);
    }

    loadnewLevel(screen){//change this to a hashmap later
        if(screen === "SceneTwo"){
            this.LoadScreen(SceneTwo, 0, 0);
        }
        if(screen === "SceneThree"){
            this.LoadScreen(SceneThree, 0, 0);
        }
        if(screen === "SceneFour"){
            this.LoadScreen(SceneFour, 128, 192);
        }
    }

    clearEntities(){
        this.game.entitiesPast.forEach(function (entity){
            entity.removeFromWorld = true;
        })
        this.game.entitiesPresent.forEach(function (entity){
            entity.removeFromWorld = true;
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
       if(this.screen.player) {
        var ent = this.screen.player[0];
        this.player = new Player(gameEngine, ent.x, ent.y) // creates player object
        this.game.player = this.player;
        this.game.addEntityPast(this.player);
	    this.game.addEntityPresent(this.player);
       }
       
        

        if(this.screen.collisions) {
            for (var i = 0; i < this.screen.collisions.length; i++) {
                var ent = this.screen.collisions[i];
                if(ent.dimension == 0) {// adds the collision for something in the past.
                    this.game.addEntityPast(new invisible_collision(this.game, ent.x, ent.y, ent.width, ent.height));
                }
                else { //adds the collision for something in the present.
                    this.game.addEntityPresent(new invisible_collision(this.game, ent.x, ent.y, ent.width, ent.height));
                }
            }
        }

        if(this.screen.falling) {
            for (var i = 0; i < this.screen.falling.length; i++) {
                var ent = this.screen.falling[i];
                if(ent.dimension == 0) {// adds the falling for something in the past.
                    this.game.addEntityPast(new FallingPlatform(this.game, ent.x, ent.y, ent.width, ent.height, ent.delay));
                }
                else { //adds the falling for something in the present.
                    this.game.addEntityPresent(new FallingPlatform(this.game, ent.x, ent.y, ent.width, ent.height, ent.delay));
                }
            }
        }

        if(this.screen.jumppad) {
            for (var i = 0; i < this.screen.jumppad.length; i++) {
                var ent = this.screen.jumppad[i];
                if(ent.dimension == 0) {// adds the jumppad for something in the past.
                    this.game.addEntityPast(new JumpPad(this.game, ent.x, ent.y));
                }
                else { //adds the jumppad for something in the present.
                    this.game.addEntityPresent(new JumpPad(this.game, ent.x, ent.y));
                }
            }
        }

        if(this.screen.saw) {
            for (var i = 0; i < this.screen.saw.length; i++) {
                var ent = this.screen.saw[i];
                if(ent.dimension == 0) {// adds the saw for something in the past.
                    this.game.addEntityPast(new SawBlade(this.game, ent.x, ent.y, ent.width, ent.path, ent.speed, ent.direction));
                }
                else { //adds the saw for something in the present.
                    this.game.addEntityPresent(new SawBlade(this.game, ent.x, ent.y, ent.width, ent.path, ent.speed, ent.direction));
                }
            }
        }

        if(this.screen.moving) {
            for (var i = 0; i < this.screen.moving.length; i++) {
                var ent = this.screen.moving[i];
                if(ent.dimension == 0) {// adds the moving for something in the past.
                    this.game.addEntityPast(new MovingPlateform(this.game, ent.Sx, ent.Sy, ent.Ex, ent.Ey, ent.width, ent.height, ent.speed));
                }
                else { //adds the moving for something in the present.
                    this.game.addEntityPresent(new MovingPlateform(this.game, ent.Sx, ent.Sy, ent.Ex, ent.Ey, ent.width, ent.height, ent.speed));
                }
            }
        }

        if(this.screen.spike) {
            for (var i = 0; i < this.screen.spike.length; i++) {
                var ent = this.screen.spike[i];
                if(ent.dimension == 0) {// adds the spike for something in the past.
                    this.game.addEntityPast(new Spike(this.game, ent.x, ent.y, ent.width, ent.height));
                }
                else { //adds the spike for something in the present.
                    this.game.addEntityPresent(new Spike(this.game, ent.x, ent.y, ent.width, ent.height));
                }
            }
        }

        if(this.screen.portal) {
            for (var i = 0; i < this.screen.portal.length; i++) {
                var ent = this.screen.portal[i];
                if(ent.dimension == 0) {// adds the portal for something in the past.
                    this.game.addEntityPast(new invisible_collision(this.game, ent.x, ent.y, ent.width, ent.height));
                }
                else { //adds the portal for something in the present.
                    this.game.addEntityPresent(new invisible_collision(this.game, ent.x, ent.y, ent.width, ent.height));
                }
            }
        }
        if(this.screen.parallax) {
            for (var i = 0; i < this.screen.parallax.length; i++) {
                var ent = this.screen.parallax[i];
                if(ent.dimension == 0) {// adds the portal for something in the past.
                    this.game.addEntityPast(new ParallaxLayer(this.game, ent.file, 0, 0 , 2, true));
                }
                else { //adds the portal for something in the present.
                    this.game.addEntityPresent(new ParallaxLayer(this.game, ent.file, 0, 0 , 2, true));
                }
            }
        }

        if(this.screen.transition) {
            for (var i = 0; i < this.screen.transition.length; i++) {
                var ent = this.screen.transition[i];
                if(ent.dimension == 0) {// adds the portal for something in the past.
                    this.game.addEntityPast(new level_transition(this.game, ent.x, ent.y, ent.width, ent.height, ent.level, this));
                }
                else { //adds the portal for something in the present.
                    this.game.addEntityPresent(new level_transition(this.game, ent.x, ent.y, ent.width, ent.height, ent.level, this));
                }
            }
        }
        this.game.addEntityPast(new ParallaxLayer(this.game, "sprites/backgrounds/snowy mountains/clouds_mg_1.png", 0.6, 100, 3, false, 0, 0.3));
	    this.game.addEntityPast(new ParallaxLayer(this.game, "sprites/backgrounds/snowy mountains/clouds_mg_2.png", 0.4, 50, 3, false, 0, 0.15));
	    this.game.addEntityPast(new ParallaxLayer(this.game, "sprites/backgrounds/snowy mountains/clouds_mg_3.png", 0.3, 0, 3, false, 0, 0.1));
	    this.game.addEntityPast(new ParallaxLayer(this.game, "sprites/backgrounds/snowy mountains/cloud_lonely.png", 0.07, 0, 3, false, 0, 0.05));
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