const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();
ASSET_MANAGER.queueDownload("sprites/temp.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;

	PARAMS.BLOCKWIDTH = PARAMS.BITWIDTH * PARAMS.SCALE;

	gameEngine.init(ctx);
	gameEngine.addEntity(new Player(gameEngine, 0, 400));

	//demo for collision
	gameEngine.addEntity(new invisible_collision(gameEngine, 0, 600, 500, 100));
	gameEngine.addEntity(new invisible_collision(gameEngine, 400, 550, 200, 200));
	gameEngine.addEntity(new invisible_collision(gameEngine, -20, 0, 20, 550));
	gameEngine.start();
});
