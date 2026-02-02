class Portal {
    constructor(game, x, y, linkedPortal = null, width = 16, height = 32) {
        Object.assign(this, { game, x, y, width, height });

        // Reference to the portal this one teleports to
        this.linkedPortal = linkedPortal;

        // Flag for collision detection
        this.isTeleporter = true;

        // Cooldown to prevent instant re-teleport
        this.cooldownTimer = 0;
        this.COOLDOWN_DURATION = 1.5; // seconds

        // Animation properties for 6-frame, 2-row sprite sheet
        this.spritesheet = ASSET_MANAGER.getAsset("sprites/Dimensional_Portal.png");
        this.frameWidth = 32;
        this.frameHeight = 32;
        this.frameCount = 6;
        this.framesPerRow = 3;
        this.frameDuration = 0.15; // seconds per frame
        this.elapsedTime = 0;
        this.scale = 4; // Match the game's sprite scale

        this.updateBB();
    }

    // Link this portal to another portal
    setLinkedPortal(portal) {
        this.linkedPortal = portal;
    }

    // Teleport the player to the linked portal
    teleport(player) {
        if (!this.linkedPortal) return false;
        if (this.cooldownTimer > 0) return false;

        // Teleport player to linked portal position (center of portal)
        // Use scaled dimensions for proper centering
        const portalCenterX = this.linkedPortal.x + (this.linkedPortal.width * this.linkedPortal.scale / 2);
        const portalCenterY = this.linkedPortal.y + (this.linkedPortal.height * this.linkedPortal.scale / 2);

        player.x = portalCenterX - (player.width * 2 / 2);
        player.y = portalCenterY - (player.height * 4 / 2);

        // Preserve player velocity (they keep moving in the same direction)
        // player.velocity remains unchanged

        // Update player bounding box
        player.updateBB();

        // Set cooldown on BOTH portals to prevent instant re-teleport
        this.cooldownTimer = this.COOLDOWN_DURATION;
        this.linkedPortal.cooldownTimer = this.COOLDOWN_DURATION;

        return true;
    }

    updateBB() {
        this.BB = new BoundingBox(this.x + this.width * 2, this.y, this.width * this.scale , this.height * this.scale);
    }

    update() {
        const TICK = this.game.clockTick;

        // Update cooldown timer
        if (this.cooldownTimer > 0) {
            this.cooldownTimer -= TICK;
        }

        // Update animation timer
        this.elapsedTime += TICK;
        const totalTime = this.frameCount * this.frameDuration;
        if (this.elapsedTime > totalTime) {
            this.elapsedTime -= totalTime;
        }
    }

    draw(ctx) {
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
            this.x, this.y,                                       // Destination position
            this.frameWidth * this.scale, this.frameHeight * this.scale  // Destination size (scaled)
        );

        // Debug: draw bounding box
        this.BB.draw(ctx);
    }
}
