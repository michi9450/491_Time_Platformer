class LaserBeam {
    constructor(game, x, y, direction = "vertical") {
        Object.assign(this, { game, x, y, direction });

        this.width = 40;
        this.height = 120;
        this.scale = 2;

        this.animator = new Animator(
            ASSET_MANAGER.getAsset("sprites/laser.png"),
            0, 0, 40, 120, 3, 0.1
        );

        this.isHazard = true;
        this.updateBB();
    }

    updateBB() {
        if (this.direction === "vertical") {
            this.BB = new BoundingBox(
                this.x - 20,
                this.y,
                this.width/2 * this.scale,
                this.height * this.scale
            );
        } else { // horizontal
            this.BB = new BoundingBox(
                this.x,
                this.y - 20,
                this.height * this.scale,
                this.width/2 * this.scale
            );
        }
    }

    update() {
        this.updateBB();
    }

    draw(ctx) {
        ctx.save();

        if (this.direction === "vertical") {
            this.animator.drawFrame(
                this.game.clockTick,
                ctx,
                this.x,
                this.y,
                this.scale, this.scale
            );
        } else {
            ctx.translate(this.x, this.y);

            // Rotate 90 degrees
            ctx.rotate(Math.PI / 2);

            // Draw rotated sprite
            this.animator.drawFrame(
                this.game.clockTick,
                ctx,
                0,
                -this.height * this.scale,
                this.scale, this.scale
            );
        }

        ctx.restore();

        // Draw debug BB
        ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
    }
}