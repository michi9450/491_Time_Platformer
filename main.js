const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();
ASSET_MANAGER.queueDownload("sprites/temp.png");
ASSET_MANAGER.queueDownload("sprites/SawBladeSuriken.png");
ASSET_MANAGER.queueDownload("sprites/Trap_Spike.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;

	PARAMS.BLOCKWIDTH = PARAMS.BITWIDTH * PARAMS.SCALE;

	gameEngine.init(ctx);
	this.Player = new Player(gameEngine, 0, 400)
	gameEngine.addEntityPast(this.Player);
	gameEngine.addEntityPresent(this.Player);

	//demo for collision
	gameEngine.addEntityPast(new invisible_collision(gameEngine, 0, 600, 500, 100));
	gameEngine.addEntityPast(new invisible_collision(gameEngine, 400, 550, 200, 200));
	gameEngine.addEntityPast(new invisible_collision(gameEngine, -20, 0, 20, 550));
	gameEngine.addEntityPast(new invisible_collision(gameEngine, 800, 0, 20, 550));
	gameEngine.addEntityPast(new invisible_collision(gameEngine, 1000, 600, 200, 200))
	gameEngine.addEntityPresent(new invisible_collision(gameEngine,  0, 600, 500, 100))
	gameEngine.addEntityPresent(new invisible_collision(gameEngine, 400, 550, 200, 200))
	gameEngine.addEntityPresent(new invisible_collision(gameEngine, -20, 0, 20, 550))
	gameEngine.addEntityPresent(new invisible_collision(gameEngine, 1000, 0, 20, 550));
	gameEngine.addEntityPresent(new invisible_collision(gameEngine, 1000, 600, 200, 200))

	// Demo hazards - Spikes (static)
	// Spike(game, x, y, width, height)
	const spike1 = new Spike(gameEngine, 200, 561, 80, 20);
	gameEngine.addEntityPast(spike1);
	gameEngine.addEntityPresent(spike1);

	// Demo hazards - Saw Blade (moving)
	// SawBlade(game, x, y, size, pathLength, speed, direction)
	// This saw blade moves horizontally 200 pixels at speed 150
	const sawBlade1 = new SawBlade(gameEngine, 600, 500, 50, 150, 150, "horizontal");
	gameEngine.addEntityPast(sawBlade1);
	gameEngine.addEntityPresent(sawBlade1);

	gameEngine.start();
});
