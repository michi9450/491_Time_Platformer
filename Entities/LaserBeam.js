class LaserBeam {
    constructor(game, x, y, length, direction = "horizontal",
                chargeDuration = 1.0, fireDuration = 0.5, cooldownDuration = 1.0) {
        Object.assign(this, {
            game, x, y, length, direction,
            chargeDuration, fireDuration, cooldownDuration
        });

        // State machine: "charging", "firing", "cooldown"
        this.state = "charging";
        this.stateTimer = 0;

        // Mark as hazard ONLY when firing
        this.isHazard = false;

        this.scale = 1;
        this.updateBB();
    }

    updateBB() {
        // Bounding box depends on direction
        if (this.direction === "horizontal") {
            this.BB = new BoundingBox(this.x, this.y, this.length, 10);
        } else {
            this.BB = new BoundingBox(this.x, this.y, 10, this.length);
        }
    }

    update() {
        const TICK = this.game.clockTick;
        this.stateTimer += TICK;

        // State machine
        switch(this.state) {
            case "charging":
                this.isHazard = false;
                if (this.stateTimer >= this.chargeDuration) {
                    this.state = "firing";
                    this.stateTimer = 0;
                }
                break;

            case "firing":
                this.isHazard = true;
                if (this.stateTimer >= this.fireDuration) {
                    this.state = "cooldown";
                    this.stateTimer = 0;
                }
                break;

            case "cooldown":
                this.isHazard = false;
                if (this.stateTimer >= this.cooldownDuration) {
                    this.state = "charging";
                    this.stateTimer = 0;
                }
                break;
        }
    }

    draw(ctx) {
        // Color based on state
        let color;
        switch(this.state) {
            case "charging":
                // Pulsing yellow warning
                let pulse = Math.sin(this.stateTimer * 8) * 0.3 + 0.7;
                ctx.fillStyle = `rgba(255, 255, 0, ${pulse})`;
                break;
            case "firing":
                // Bright red danger
                ctx.fillStyle = "rgba(255, 0, 0, 0.9)";
                break;
            case "cooldown":
                // Dim gray safe
                ctx.fillStyle = "rgba(128, 128, 128, 0.3)";
                break;
        }

        if (this.direction === "horizontal") {
            ctx.fillRect(this.x, this.y, this.length, 10);
        } else {
            ctx.fillRect(this.x, this.y, 10, this.length);
        }

        // Debug: draw bounding box
        // this.BB.draw(ctx);
    }
}
