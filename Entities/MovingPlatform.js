class MovingPlatform {
    constructor(game, startX, startY, endX, endY, width, height, speed) {
        Object.assign(this, { game, width, height, speed });

        // Position
        this.x = startX;
        this.y = startY;

        // Movement path
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;

        // Calculate total distance and direction
        const dx = endX - startX;
        const dy = endY - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Normalized direction vector
        this.dirX = distance > 0 ? dx / distance : 0;
        this.dirY = distance > 0 ? dy / distance : 0;

        // Movement state
        this.movingForward = true; // true = start to end, false = end to start

        // Bounding box
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
        this.isPlatform = true;
    }

    update() {
        const TICK = this.game.clockTick;

        // Store last position for collision detection
        this.lastX = this.x;
        this.lastY = this.y;

        // Move platform
        if (this.movingForward) {
            this.x += this.dirX * this.speed * TICK;
            this.y += this.dirY * this.speed * TICK;

            // Check if reached end point
            const reachedEndX = this.dirX > 0 ? this.x >= this.endX : this.x <= this.endX;
            const reachedEndY = this.dirY > 0 ? this.y >= this.endY : this.y <= this.endY;

            if ((this.dirX !== 0 && reachedEndX) || (this.dirY !== 0 && reachedEndY)) {
                this.x = this.endX;
                this.y = this.endY;
                this.movingForward = false;
            }
        } else {
            this.x -= this.dirX * this.speed * TICK;
            this.y -= this.dirY * this.speed * TICK;

            // Check if reached start point
            const reachedStartX = this.dirX > 0 ? this.x <= this.startX : this.x >= this.startX;
            const reachedStartY = this.dirY > 0 ? this.y <= this.startY : this.y >= this.startY;

            if ((this.dirX !== 0 && reachedStartX) || (this.dirY !== 0 && reachedStartY)) {
                this.x = this.startX;
                this.y = this.startY;
                this.movingForward = true;
            }
        }

        // Update bounding box
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    }

    draw(ctx) {
        // Draw shadow for depth
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(this.x + 3, this.y + 3, this.width, this.height);

        // Main platform body
        ctx.fillStyle = '#6B4423';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Top highlight
        ctx.fillStyle = '#8B5A3C';
        ctx.fillRect(this.x, this.y, this.width, this.height / 3);

        // Border
        ctx.strokeStyle = '#4A2F1A';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        // Draw bounding box for debugging
        this.BB.draw(ctx);
    }
}
