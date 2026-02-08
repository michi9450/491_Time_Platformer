/**
 * works by checking the player position and moving the "canvas"
 * based on the movement.
 * also have optional vertical scrolling, because why not.
 */
class Camera {
    constructor (game, width, height) {
        Object.assign(this, { game, width, height });
        this.x = 0;
        this.y = 0;

        this.deadZoneX = width * 0.4;
        this.deadZoneY = height * 0.4;

        // temporary before we get level objects going
        this.worldWidth = 3200;
        this.worldHeight = 900;
    }
    update() {
    const player = this.game.player;
    if (!player) return;

    const leftEdge  = this.x + this.deadZoneX;
    const rightEdge = this.x + this.width - this.deadZoneX;

    if (player.x < leftEdge) {
        this.x = player.x - this.deadZoneX;
    } 
    else if (player.x > rightEdge) {
        this.x = player.x - (this.width - this.deadZoneX);
    }

    // Optional vertical scrolling
    const topEdge    = this.y + this.deadZoneY;
    const bottomEdge = this.y + this.height - this.deadZoneY;

    if (player.y < topEdge) {
        this.y = player.y - this.deadZoneY;
    } 
    else if (player.y > bottomEdge) {
        this.y = player.y - (this.height - this.deadZoneY);
    }

    // Clamp to world bounds (only move within game world bounds)
    this.x = Math.max(0, Math.min(this.x, this.worldWidth - this.width));
    this.y = Math.max(0, Math.min(this.y, this.worldHeight - this.height));
}
}