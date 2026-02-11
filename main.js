const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();
ASSET_MANAGER.queueDownload("sprites/backgrounds/grunge/bg.png");
ASSET_MANAGER.queueDownload("sprites/backgrounds/grunge/buildings.png");
ASSET_MANAGER.queueDownload("sprites/backgrounds/grunge/far-buildings.png");
ASSET_MANAGER.queueDownload("sprites/backgrounds/grunge/skill-foreground.png");
ASSET_MANAGER.queueDownload("sprites/backgrounds/city skyline/1.png");
ASSET_MANAGER.queueDownload("sprites/backgrounds/city skyline/2.png");
ASSET_MANAGER.queueDownload("sprites/backgrounds/city skyline/3.png");
ASSET_MANAGER.queueDownload("sprites/backgrounds/city skyline/4.png");
ASSET_MANAGER.queueDownload("sprites/backgrounds/city skyline/5.png");

ASSET_MANAGER.queueDownload("sprites/backgrounds/snowy mountains/sky.png");
ASSET_MANAGER.queueDownload("sprites/backgrounds/snowy mountains/glacial_mountains.png");
ASSET_MANAGER.queueDownload("sprites/backgrounds/snowy mountains/clouds_mg_1.png");
ASSET_MANAGER.queueDownload("sprites/backgrounds/snowy mountains/clouds_mg_2.png");
ASSET_MANAGER.queueDownload("sprites/backgrounds/snowy mountains/clouds_mg_3.png");
ASSET_MANAGER.queueDownload("sprites/backgrounds/snowy mountains/clouds_bg.png");
ASSET_MANAGER.queueDownload("sprites/backgrounds/snowy mountains/cloud_lonely.png");




ASSET_MANAGER.queueDownload("sprites/temp.png");
ASSET_MANAGER.queueDownload("sprites/adventurer-Sheet.png");
ASSET_MANAGER.queueDownload("sprites/SawBladeSuriken.png");
ASSET_MANAGER.queueDownload("sprites/Trap_Spike.png");
ASSET_MANAGER.queueDownload("sprites/jumppad.png");
ASSET_MANAGER.queueDownload("sprites/Dimensional_Portal.png");
ASSET_MANAGER.queueDownload("sprites/levels/screen_1_past.png");
ASSET_MANAGER.queueDownload("sprites/levels/screen_1_present.png");
ASSET_MANAGER.queueDownload("sprites/levels/screen_2_past.png");
ASSET_MANAGER.queueDownload("sprites/levels/screen_2_present.png");
ASSET_MANAGER.queueDownload("sprites/levels/screen_3_past.png");
ASSET_MANAGER.queueDownload("sprites/levels/screen_3_present.png");




ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;

	PARAMS.BLOCKWIDTH = PARAMS.BITWIDTH * PARAMS.SCALE;

	gameEngine.init(ctx);
	// this.player = new Player(gameEngine, 100, 400)
	// gameEngine.player = this.player;
	gameEngine.camera = new Camera(gameEngine, ctx.canvas.width, ctx.canvas.height);
	// gameEngine.addEntityPast(this.player);
	// gameEngine.addEntityPresent(this.player);

	// //wall on leftside of screen and rightside
	// gameEngine.addEntityPast(new invisible_collision(gameEngine, 45, 0, 20, 550));
	// gameEngine.addEntityPresent(new invisible_collision(gameEngine, 45, 0, 20, 550));
	// gameEngine.addEntityPast(new invisible_collision(gameEngine, 3200-60, 0, 20, 550));
	// gameEngine.addEntityPresent(new invisible_collision(gameEngine, 3200-60, 0, 20, 550));

	// //collision past
	// gameEngine.addEntityPast(new invisible_collision(gameEngine, 0, 640, 700, 100));
	// gameEngine.addEntityPast(new invisible_collision(gameEngine, 1150, 640, 260, 260));
	// gameEngine.addEntityPast(new invisible_collision(gameEngine, 1920, 640, 260, 260));
	// gameEngine.addEntityPast(new invisible_collision(gameEngine, 2940, 640, 260, 260));

	// gameEngine.addEntityPast(new invisible_collision(gameEngine, 450, 250, 60, 440));
	// gameEngine.addEntityPast(new invisible_collision(gameEngine, 1540, 195, 60, 440));
	// gameEngine.addEntityPast(new invisible_collision(gameEngine, 2500, 195, 60, 440));


	// //collision present
	// gameEngine.addEntityPresent(new invisible_collision(gameEngine, 0, 640, 700, 100));	
	// gameEngine.addEntityPresent(new invisible_collision(gameEngine, 1150, 640, 260, 260));
	// gameEngine.addEntityPresent(new invisible_collision(gameEngine, 1920, 640, 260, 260));
	// gameEngine.addEntityPresent(new invisible_collision(gameEngine, 2940, 640, 260, 260));
	
	// gameEngine.addEntityPresent(new invisible_collision(gameEngine, 900, 195, 60, 440));
	// gameEngine.addEntityPresent(new invisible_collision(gameEngine, 1732, 195, 60, 440));
	// gameEngine.addEntityPresent(new invisible_collision(gameEngine, 2240, 195, 60, 440));
	// gameEngine.addEntityPresent(new invisible_collision(gameEngine, 2816, 195, 60, 440));
	// // //plateforms 
	// // gameEngine.addEntityPast(new FallingPlatform(gameEngine, 550, 500, 100, 20, 1.0));
	// // gameEngine.addEntityPast(new FallingPlatform(gameEngine, 800, 500, 100, 20, 1.0));
	// // gameEngine.addEntityPast(new FallingPlatform(gameEngine, 1100, 500, 100, 20, 1.0));
	// // gameEngine.addEntityPresent(new FallingPlatform(gameEngine, 1850, 500, 100, 20, 1.0));

	// // //hazards
	// // gameEngine.addEntityPresent(new SawBlade(gameEngine, 550, 500, 50, 250, 200, "horizontal"));
	// // gameEngine.addEntityPast(new Spike(gameEngine, 1700, 550, 80, 20));
	// // gameEngine.addEntityPast(new Spike(gameEngine, 1750, 550, 80, 20));
	// // gameEngine.addEntityPast(new Spike(gameEngine, 1800, 550, 80, 20));
	// // gameEngine.addEntityPast(new Spike(gameEngine, 1850, 550, 80, 20));
	// // gameEngine.addEntityPast(new Spike(gameEngine, 1900, 550, 80, 20));

	// // //jump pads
	// // gameEngine.addEntityPast(new JumpPad(gameEngine, 2500, 485));

	// //portal
	// // portalPresentEntry = new Portal(gameEngine, 1320, 450);
	// // portalPresentExit = new Portal(gameEngine, 1180, 450);
	// // portalPresentEntry.setLinkedPortal(portalPresentExit); // Entry → Exit
	// // portalPresentExit.setLinkedPortal(portalPresentEntry);  // Exit → Entry (bi-directional)
	// // gameEngine.addEntityPresent(portalPresentEntry);
	// // gameEngine.addEntityPresent(portalPresentExit);

	// //background should be added after everything 
	
	// // gameEngine.addEntityPast(new ParallaxLayer(gameEngine, "sprites/levels/screen_1_past.png", 0,0,2, true));
	// // gameEngine.addEntityPresent(new ParallaxLayer(gameEngine, "sprites/levels/screen_1_present.png", 0, 0, 2, true));
	
	// gameEngine.addEntityPast(new ParallaxLayer(gameEngine, "sprites/levels/screen_1_past.png", 0,0,2, true));
	// gameEngine.addEntityPresent(new ParallaxLayer(gameEngine, "sprites/levels/screen_1_present.png", 0, 0, 2, true));

	// gameEngine.addEntityPast(new ParallaxLayer(gameEngine, "sprites/backgrounds/snowy mountains/clouds_mg_1.png", 0.6, 100, 3, false, 0));
	// gameEngine.addEntityPast(new ParallaxLayer(gameEngine, "sprites/backgrounds/snowy mountains/clouds_mg_2.png", 0.4, 50, 3, false, 0));
	// gameEngine.addEntityPast(new ParallaxLayer(gameEngine, "sprites/backgrounds/snowy mountains/clouds_mg_3.png", 0.3, 0, 3, false, 0));
	// gameEngine.addEntityPast(new ParallaxLayer(gameEngine, "sprites/backgrounds/snowy mountains/cloud_lonely.png", 0.07, 0, 3, false, 0));
	// gameEngine.addEntityPast(new ParallaxLayer(gameEngine, "sprites/backgrounds/snowy mountains/glacial_mountains.png", 0.1, 0, 3, false, 0));
	// gameEngine.addEntityPast(new ParallaxLayer(gameEngine, "sprites/backgrounds/snowy mountains/clouds_bg.png", 0.05, 0, 3, false, 0));
	// gameEngine.addEntityPast(new ParallaxLayer(gameEngine, "sprites/backgrounds/snowy mountains/sky.png", 0, 0, 5, false, 0));


	// gameEngine.addEntityPresent(new ParallaxLayer(gameEngine, "sprites/backgrounds/city skyline/5.png", 0.5, 100, 2, false, 0));
	// gameEngine.addEntityPresent(new ParallaxLayer(gameEngine, "sprites/backgrounds/city skyline/4.png", 0.4, 150, 2, false, 0));
	// gameEngine.addEntityPresent(new ParallaxLayer(gameEngine, "sprites/backgrounds/city skyline/3.png", 0.3, 100, 2, false, 0));
	// gameEngine.addEntityPresent(new ParallaxLayer(gameEngine, "sprites/backgrounds/city skyline/2.png", 0.2, 150, 2, false, 0));
	// gameEngine.addEntityPresent(new ParallaxLayer(gameEngine, "sprites/backgrounds/city skyline/1.png", 0.1, 0, 2, false, 0));


	
	new SceneManager(gameEngine);
	gameEngine.start();
});