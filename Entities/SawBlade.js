class SawBlade {
    constructor(game, x, y, size, pathLength, speed, direction = "horizontal") {
        Object.assign(this, { game, x, y, size, pathLength, speed, direction });

        // Starting position for path calculation
        this.startX = x;
        this.startY = y;

        // Movement direction: 1 = forward, -1 = backward
        this.moveDirection = 1;

        // Current position offset from start
        this.pathOffset = 0;

        // Sprite animation - 96x24 sprite sheet, 4 frames of 24x24 each
        this.animator = new Animator(
            ASSET_MANAGER.getAsset("sprites/SawBladeSuriken.png"),
            0, 0,           // xStart, yStart
            24, 24,         // frame width, frame height
            4,              // frameCount
            0.08            // frameDuration (animation speed)
        );

        // Scale for drawing (2 = half size of default 4x, adjust this to change size)
        this.scale = 2;

        // Mark this as a hazard for collision detection
        this.isHazard = true;

        // Create bounding box
        this.updateBB();
    }

    updateBB() {
        // Bounding box matches the drawn sprite size (24×24 at custom scale)
        const spriteWidth = 24 * this.scale;
        const spriteHeight = 24 * this.scale;
        this.BB = new BoundingBox(this.x, this.y, spriteWidth, spriteHeight);
    }

    update() {
        const TICK = this.game.clockTick;

        // Move along path
        this.pathOffset += this.speed * this.moveDirection * TICK;

        // Reverse direction at path ends
        if (this.pathOffset >= this.pathLength) {
            this.pathOffset = this.pathLength;
            this.moveDirection = -1;
        } else if (this.pathOffset <= 0) {
            this.pathOffset = 0;
            this.moveDirection = 1;
        }

        // Update position based on direction type
        if (this.direction === "horizontal") {
            this.x = this.startX + this.pathOffset;
        } else {
            this.y = this.startY + this.pathOffset;
        }

        // Update bounding box
        this.updateBB();
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
