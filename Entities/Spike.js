class Spike {
    constructor(game, x, y, width, height) {
        Object.assign(this, { game, x, y, width, height });

        // Sprite animation - 1835x74 sprite sheet, 15 frames
        // Each frame is 128px wide (43px spike + 85px whitespace), 74px tall
        this.animator = new Animator(
            ASSET_MANAGER.getAsset("sprites/Trap_Spike.png"),
            0, 0,           // xStart, yStart
            128, 74,        // frame width (includes whitespace), frame height
            15,             // frameCount
            0.025             // frameDuration (animation speed)
        );

        // Scale for drawing (adjust to make spikes smaller/larger)
        // Default is 4x, using 1 for smaller spikes
        this.scale = 1;

        // Mark this as a hazard for collision detection
        this.isHazard = true;

        // Create bounding box
        this.updateBB();
    }

    updateBB() {
        // Bounding box uses only the spike portion (43px), not the whitespace
        const spikeWidth = 43 * this.scale;
        const spikeHeight = 74 * this.scale;
        this.BB = new BoundingBox(this.x, this.y, spikeWidth, spikeHeight);
    }

    update() {
        // Static hazard - no movement, just animation
    }

    draw(ctx) {
        // Draw the animated sprite with custom scale
        const frame = this.animator.currentFrame();
        const spritesheet = this.animator.spritesheet;

        ctx.drawImage(spritesheet,
            this.animator.xStart + this.animator.width * frame, this.animator.yStart,
            this.animator.width, this.animator.height,
            this.x, this.y,
            this.animator.width * this.scale, this.animator.height * this.scale);

        // Update animator elapsed time
        this.animator.elapsedTime += this.game.clockTick;
        if(this.animator.elapsedTime > this.animator.totalTime) {
            this.animator.elapsedTime -= this.animator.totalTime;
        }

        // Debug: draw bounding box (commented out)
        // this.BB.draw(ctx);
    }
}