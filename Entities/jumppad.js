class JumpPad {
    constructor(game, x, y, width = 32, height = 12, boost = 900) {
        Object.assign(this, { game, x, y, width, height });

        this.animations = {
            idle: new Animator(
                ASSET_MANAGER.getAsset("sprites/jumppad.png"),
                0, 0, 28, 28, 1, 1
            ),
            bounce: new Animator(ASSET_MANAGER.getAsset("sprites/jumppad.png"),
                28, 0, 28, 28, 8, 0.1
            )
        }
        this.animator = this.animations.idle;
        this.boost = boost;
        this.isJumpPad = true;

        this.bounceTimer = 0;
        this.BOUNCE_DURATION = 0.8;

        this.updateBB();
    }
    bounce() {
        this.animator = this.animations.bounce;
        this.animations.bounce.elapsedTime = 0;
        this.bounceTimer = this.BOUNCE_DURATION;
    }

    updateBB() {
        this.BB = new BoundingBox(this.x + 10, this.y + 60, this.width*3, this.height*3);
    }

    update() {
        if (this.bounceTimer > 0) {
            this.bounceTimer -= this.game.clockTick;
            if (this.bounceTimer <= 0) {
                this.animator = this.animations.idle;
            }
        }
    }

    draw(ctx) {
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y);
        this.BB.draw(ctx); 
    }
}