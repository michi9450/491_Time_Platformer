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

	//background parallax demo
	//demo for collision
	gameEngine.addEntityPast(new invisible_collision(gameEngine, 0, 600, 5000, 100));
	gameEngine.addEntityPast(new invisible_collision(gameEngine, 400, 550, 200, 200));
	gameEngine.addEntityPast(new invisible_collision(gameEngine, -20, 0, 20, 550));
	gameEngine.addEntityPast(new invisible_collision(gameEngine, 800, 0, 20, 550));
	gameEngine.addEntityPast(new invisible_collision(gameEngine, 1000, 600, 200, 200))
	gameEngine.addEntityPresent(new invisible_collision(gameEngine,  0, 600, 5000, 100))
	gameEngine.addEntityPresent(new invisible_collision(gameEngine, 400, 550, 200, 200))
	gameEngine.addEntityPresent(new invisible_collision(gameEngine, -20, 0, 20, 550))
	gameEngine.addEntityPresent(new invisible_collision(gameEngine, 1000, 0, 20, 550));
	gameEngine.addEntityPresent(new invisible_collision(gameEngine, 1000, 600, 200, 200))

	// Test platforms - Past timeline
	// Moving platform (horizontal) - moves left and right
	gameEngine.addEntityPast(new MovingPlatform(gameEngine, 600, 450, 350, 450, 120, 25, 70));
	// Falling platforms - spread out
	gameEngine.addEntityPast(new FallingPlatform(gameEngine, 250, 500, 100, 20, 1.0));
	gameEngine.addEntityPast(new FallingPlatform(gameEngine, 700, 760, 100, 20, 1.0));
	gameEngine.addEntityPast(new FallingPlatform(gameEngine, 870, 700, 100, 20, 1.0));

	// Test platforms - Present timeline
	// Moving platform (vertical) - moves up and down
	gameEngine.addEntityPresent(new MovingPlatform(gameEngine, 170, 300, 170, 500, 120, 25, 70));
	// Falling platforms - different positions
	gameEngine.addEntityPresent(new FallingPlatform(gameEngine, 450, 400, 100, 20, 1.0));
	gameEngine.addEntityPresent(new FallingPlatform(gameEngine, 700, 750, 100, 20, 1.0));
	gameEngine.addEntityPresent(new FallingPlatform(gameEngine, 860, 620, 100, 20, 1.0));

	// Demo hazards - Spikes (static)
	const spike1 = new Spike(gameEngine, 200, 561, 80, 20);
	gameEngine.addEntityPast(spike1);
	gameEngine.addEntityPresent(spike1);

	// Demo Jump pad
	const jumpP = new JumpPad(gameEngine, 100, 485);
	gameEngine.addEntityPast(jumpP);
	gameEngine.addEntityPresent(jumpP);

	// Demo hazards - Saw Blade (moving)
	// This saw blade moves horizontally 200 pixels at speed 150
	const sawBlade1 = new SawBlade(gameEngine, 600, 500, 50, 150, 150, "horizontal");
	gameEngine.addEntityPast(sawBlade1);
	gameEngine.addEntityPresent(sawBlade1);

	// Demo Portals - PAST timeline
	// Create entry portal on the left, exit portal on the right (bi-directional with 10s cooldown)
	const portalPastEntry = new Portal(gameEngine, 400, 175);
	const portalPastExit = new Portal(gameEngine, 850, 300);
	portalPastEntry.setLinkedPortal(portalPastExit); // Entry → Exit
	portalPastExit.setLinkedPortal(portalPastEntry);  // Exit → Entry (bi-directional)
	gameEngine.addEntityPast(portalPastEntry);
	gameEngine.addEntityPast(portalPastExit);

	// Demo Portals - PRESENT timeline (different positions!)
	// Entry portal at different location, exit portal at different location (bi-directional with 10s cooldown)
	const portalPresentEntry = new Portal(gameEngine, 150, 175);
	const portalPresentExit = new Portal(gameEngine, 1000, 200);
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
