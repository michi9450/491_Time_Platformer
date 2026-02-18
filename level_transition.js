class level_transition{
    constructor(game, x, y, width, height, level, SceneManager){
        Object.assign(this, { game, x, y , width, height});
        this.level = level;
        this.SM = SceneManager;
        this.isLevelTransition = true;
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);

         // Animation properties for 6-frame, 2-row sprite sheet
        this.spritesheet = ASSET_MANAGER.getAsset("sprites/Dimensional_Portal.png");
        this.frameWidth = 32;
        this.frameHeight = 32;
        this.frameCount = 6;
        this.framesPerRow = 3;
        this.frameDuration = 0.15; // seconds per frame
        this.elapsedTime = 0;
        this.scale = 4; // Match the game's sprite scale
    }

    update(){
        const TICK = this.game.clockTick;

         // Update animation timer
        this.elapsedTime += TICK;
        const totalTime = this.frameCount * this.frameDuration;
        if (this.elapsedTime > totalTime) {
            this.elapsedTime -= totalTime;
        }
    }

    getlevel() { return this.level}

    draw(ctx) {
        ctx.strokeStyle= "red";
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        this.BB.draw(ctx);

        // Calculate current frame (0-5)
        const currentFrame = Math.floor(this.elapsedTime / this.frameDuration) % this.frameCount;

        // Calculate row and column for 2-row sprite sheet layout
        // Top row: frames 0, 1, 2
        // Bottom row: frames 3, 4, 5
        const row = Math.floor(currentFrame / this.framesPerRow);
        const col = currentFrame % this.framesPerRow;

        // Calculate source position in sprite sheet
        const srcX = col * this.frameWidth;
        const srcY = row * this.frameHeight;

        // Draw the portal sprite
        ctx.drawImage(
            this.spritesheet,
            srcX, srcY,                                           // Source position
            this.frameWidth, this.frameHeight,                    // Source size
            this.x-this.width/2, this.y-this.height/2,                                       // Destination position
            this.frameWidth * this.scale, this.frameHeight * this.scale  // Destination size (scaled)
        );
    }
}