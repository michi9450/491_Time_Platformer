class FallingPlatform {
    constructor(game, x, y, width, height, fallDelay = 0.5) {
        Object.assign(this, { game, x, y, width, height, fallDelay });

        // Initial position (for potential reset)
        this.initialX = x;
        this.initialY = y;

        // State
        this.activated = false; // Has player stepped on it?
        this.falling = false;   // Is it currently falling?
        this.fallTimer = 0;     // Time before it starts falling

        // Physics
        this.velocity = { x: 0, y: 0 };

        // Bounding box
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);

        // For marking removal from world
        this.removeFromWorld = false;
        this.isPlatform = true;
    }

    activate() {
        if (!this.activated && !this.falling) {
            this.activated = true;
            this.fallTimer = this.fallDelay;
        }
    }

    reset() {
        // Reset platform to initial state
        this.x = this.initialX;
        this.y = this.initialY;
        this.activated = false;
        this.falling = false;
        this.fallTimer = 0;
        this.velocity = { x: 0, y: 0 };
        this.removeFromWorld = false;
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    }

    update() {
        const TICK = this.game.clockTick;

        // If activated but not yet falling, count down timer
        if (this.activated && !this.falling) {
            this.fallTimer -= TICK;

            if (this.fallTimer <= 0) {
                this.falling = true;
            }
        }

        // If falling, apply gravity
        if (this.falling) {
            const GRAVITY = 1500;
            const MAX_FALL = 1000;

            this.velocity.y += GRAVITY * TICK;
            this.velocity.y = Math.min(this.velocity.y, MAX_FALL);

            this.y += this.velocity.y * TICK;

            // Stop updating once far off screen (don't remove, we'll reset it on respawn)
            if (this.y > 1200) {
                this.y = 2000; // Move way off screen
                this.velocity.y = 0; // Stop falling
            }
        }

        // Update bounding box
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    }

    draw(ctx) {
        // Don't draw if way off screen
        if (this.y > 1500) return;

        // Visual feedback based on state
        let baseColor, highlightColor;

        if (this.falling) {
            baseColor = '#D32F2F'; // Dark red when falling
            highlightColor = '#FF6B6B'; // Light red
        } else if (this.activated) {
            // Flashing effect while counting down
            const flashSpeed = 8;
            const flash = Math.sin(this.fallTimer * flashSpeed * Math.PI) > 0;
            if (flash) {
                baseColor = '#FF9800'; // Orange
                highlightColor = '#FFB74D';
            } else {
                baseColor = '#F57C00'; // Darker orange
                highlightColor = '#FFA726';
            }
        } else {
            baseColor = '#795548'; // Normal brown
            highlightColor = '#A1887F';
        }

        // Draw shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(this.x + 2, this.y + 2, this.width, this.height);

        // Main platform body
        ctx.fillStyle = baseColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Top highlight
        ctx.fillStyle = highlightColor;
        ctx.fillRect(this.x, this.y, this.width, this.height / 3);

        // Border
        ctx.strokeStyle = '#3E2723';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        // Draw bounding box for debugging
        this.BB.draw(ctx);
    }
}
