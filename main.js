const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();
ASSET_MANAGER.queueDownload("sprites/backgrounds/grunge/bg.png");
ASSET_MANAGER.queueDownload("sprites/backgrounds/grunge/buildings.png");
ASSET_MANAGER.queueDownload("sprites/backgrounds/grunge/far-buildings.png");
ASSET_MANAGER.queueDownload("sprites/backgrounds/grunge/skill-foreground.png");
ASSET_MANAGER.queueDownload("sprites/backgrounds/city skyline/front.png");
ASSET_MANAGER.queueDownload("sprites/backgrounds/city skyline/buildings.png");
ASSET_MANAGER.queueDownload("sprites/backgrounds/city skyline/back.png");
ASSET_MANAGER.queueDownload("sprites/temp.png");
ASSET_MANAGER.queueDownload("sprites/adventurer-Sheet.png");
ASSET_MANAGER.queueDownload("sprites/SawBladeSuriken.png");
ASSET_MANAGER.queueDownload("sprites/Trap_Spike.png");
ASSET_MANAGER.queueDownload("sprites/jumppad.png");
ASSET_MANAGER.queueDownload("sprites/Dimensional_Portal.png");



ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;

	PARAMS.BLOCKWIDTH = PARAMS.BITWIDTH * PARAMS.SCALE;

	gameEngine.init(ctx);
	this.player = new Player(gameEngine, 0, 400)
	gameEngine.player = this.player;
	gameEngine.camera = new Camera(gameEngine, ctx.canvas.width, ctx.canvas.height);
	gameEngine.addEntityPast(this.player);
	gameEngine.addEntityPresent(this.player);

	//wall on leftside of screen and rightside
	gameEngine.addEntityPast(new invisible_collision(gameEngine, -20, 0, 20, 550));
	gameEngine.addEntityPresent(new invisible_collision(gameEngine, -20, 0, 20, 550));
	gameEngine.addEntityPast(new invisible_collision(gameEngine, 3000, 0, 20, 550));
	gameEngine.addEntityPresent(new invisible_collision(gameEngine, 3000, 0, 20, 550));

	//collision past
	gameEngine.addEntityPast(new invisible_collision(gameEngine, 0, 600, 400, 100));
	gameEngine.addEntityPast(new invisible_collision(gameEngine, 200, 100, 40, 500));
	
	gameEngine.addEntityPast(new invisible_collision(gameEngine, 700, 100, 40, 500));
	gameEngine.addEntityPast(new invisible_collision(gameEngine, 1300, 100, 40, 500));
	gameEngine.addEntityPast(new invisible_collision(gameEngine, 1800, 50, 40, 500));	
	gameEngine.addEntityPast(new invisible_collision(gameEngine, 1300, 600, 800, 100));
	gameEngine.addEntityPast(new invisible_collision(gameEngine, 2300, 50, 40, 500));
	gameEngine.addEntityPast(new invisible_collision(gameEngine, 2800, 50, 40, 500));	
	gameEngine.addEntityPast(new invisible_collision(gameEngine, 2900, 600, 400, 100));

	//collision present
	gameEngine.addEntityPresent(new invisible_collision(gameEngine, 0, 600, 400, 100));	
	gameEngine.addEntityPresent(new invisible_collision(gameEngine, 500, 100, 40, 500));
	gameEngine.addEntityPresent(new invisible_collision(gameEngine, 860, 100, 40, 500));

	gameEngine.addEntityPresent(new invisible_collision(gameEngine, 500, 600, 400, 100));	

	gameEngine.addEntityPresent(new invisible_collision(gameEngine, 1100, 600, 500, 100));
	gameEngine.addEntityPresent(new invisible_collision(gameEngine, 1300, 100, 40, 500));	
	gameEngine.addEntityPresent(new invisible_collision(gameEngine, 1550, 100, 40, 500));
	gameEngine.addEntityPresent(new invisible_collision(gameEngine, 2400, 50, 40, 500));	
	gameEngine.addEntityPresent(new invisible_collision(gameEngine, 2900, 600, 400, 100));
	
	//plateforms 
	gameEngine.addEntityPast(new FallingPlatform(gameEngine, 550, 500, 100, 20, 1.0));
	gameEngine.addEntityPast(new FallingPlatform(gameEngine, 800, 500, 100, 20, 1.0));
	gameEngine.addEntityPast(new FallingPlatform(gameEngine, 1100, 500, 100, 20, 1.0));
	gameEngine.addEntityPresent(new FallingPlatform(gameEngine, 1850, 500, 100, 20, 1.0));

	//hazards
	gameEngine.addEntityPresent(new SawBlade(gameEngine, 550, 500, 50, 250, 200, "horizontal"));
	gameEngine.addEntityPast(new Spike(gameEngine, 1700, 550, 80, 20));
	gameEngine.addEntityPast(new Spike(gameEngine, 1750, 550, 80, 20));
	gameEngine.addEntityPast(new Spike(gameEngine, 1800, 550, 80, 20));
	gameEngine.addEntityPast(new Spike(gameEngine, 1850, 550, 80, 20));
	gameEngine.addEntityPast(new Spike(gameEngine, 1900, 550, 80, 20));
	gameEngine.addEntityPast(new LaserBeam(gameEngine, 1000, 500, 200, "horizontal"));
	gameEngine.addEntityPresent(new LaserBeam(gameEngine, 700, 300, 150, "vertical"));

	//jump pads
	gameEngine.addEntityPast(new JumpPad(gameEngine, 2500, 485));

	//portal
	portalPresentEntry = new Portal(gameEngine, 1320, 450);
	portalPresentExit = new Portal(gameEngine, 1180, 450);
	portalPresentEntry.setLinkedPortal(portalPresentExit); // Entry → Exit
	portalPresentExit.setLinkedPortal(portalPresentEntry);  // Exit → Entry (bi-directional)
	gameEngine.addEntityPresent(portalPresentEntry);
	gameEngine.addEntityPresent(portalPresentExit);

	//background should be added after everything 
	gameEngine.addEntityPast(new ParallaxLayer(gameEngine, "sprites/backgrounds/grunge/skill-foreground.png", 0.4, 225, 4));
	gameEngine.addEntityPast(new ParallaxLayer(gameEngine, "sprites/backgrounds/grunge/far-buildings.png", 0.3, 50, 4));
	gameEngine.addEntityPast(new ParallaxLayer(gameEngine, "sprites/backgrounds/grunge/buildings.png", 0.2, 0, 4));
	gameEngine.addEntityPast(new ParallaxLayer(gameEngine, "sprites/backgrounds/grunge/bg.png", 0.1, 0, 4));
	gameEngine.addEntityPresent(new ParallaxLayer(gameEngine, "sprites/backgrounds/city skyline/front.png", 0.4, 100, 3));
	gameEngine.addEntityPresent(new ParallaxLayer(gameEngine, "sprites/backgrounds/city skyline/buildings.png", 0.2, 150, 2.5));
	gameEngine.addEntityPresent(new ParallaxLayer(gameEngine, "sprites/backgrounds/city skyline/back.png", 0.1, 0, 3));

	gameEngine.start();
});
