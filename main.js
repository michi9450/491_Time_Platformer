const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();
ASSET_MANAGER.queueDownload("sprites/temp.png");

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

	gameEngine.start();
});
