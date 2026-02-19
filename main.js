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
ASSET_MANAGER.queueDownload("sprites/levels/screen_4_past.png");
ASSET_MANAGER.queueDownload("sprites/levels/screen_4_present.png");
ASSET_MANAGER.queueDownload("sprites/levels/screen_5_past.png");
ASSET_MANAGER.queueDownload("sprites/levels/screen_5_present.png");




// Function to initialize and start the game
window.startGame = function(levelNumber) {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;

	PARAMS.BLOCKWIDTH = PARAMS.BITWIDTH * PARAMS.SCALE;

	gameEngine.init(ctx);
	gameEngine.camera = new Camera(gameEngine, ctx.canvas.width, ctx.canvas.height);

	// Map level numbers to scenes
	const levelMap = {
		1: SceneOne,
		2: SceneTwo,
		3: SceneThree,
		4: SceneFour,
		5: SceneFive
	};

	// Get the scene for the selected level, default to SceneOne
	const selectedScene = levelMap[levelNumber] || SceneOne;

	new SceneManager(gameEngine, selectedScene);
	gameEngine.start();
};

// Load assets but don't start the game until user clicks Play
ASSET_MANAGER.downloadAll(() => {
	window.assetsLoaded = true;
});