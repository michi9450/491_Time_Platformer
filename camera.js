/**
 * works by checking the player position and moving the "canvas"
 * based on the movement.
 * also have optional vertical scrolling, because why not.
 */
class Camera {
  constructor(game, width, height) {
    Object.assign(this, { game, width, height });
    this.x = 0;
    this.y = 0;

    this.deadZoneY = height * 0.45;

    // temporary before we get level objects going
    this.worldWidth = 3200;
    this.worldHeight = 900;

    this.smoothingFactor = 0.1;
    
    // Target that the camera is moving toward
    this.targetX = 0;
    this.targetY = 0;

    // Look-ahead settings
    this.lookAheadDistance = width * 0.1; // How far ahead to look (adjustable)
    this.lookAheadSmoothing = 0.03; // How quickly to shift look-ahead (adjustable: 0.03-0.1)
    this.currentLookAhead = 0; // Current look-ahead offset
    this.velocityThreshold = 150; // Minimum velocity to trigger look-ahead
    
    // Player offset position on screen (where player sits when stationary)
    // 0.25 = player at 1/4 from left edge, giving 3/4 of screen ahead
    this.playerOffsetX = width * 0.35; 
  }

  update() {
    const player = this.game.player;
    if (!player) return;

    // Calculate desired look-ahead based on player VELOCITY
    let desiredLookAhead = 0;
    
    if (Math.abs(player.velocity.x) > this.velocityThreshold) {
      // Normalize velocity to -1, 0, or 1 direction
      const direction = player.velocity.x > 0 ? 1 : -1;
      desiredLookAhead = direction * this.lookAheadDistance;
    } else {
      // When stationary, maintain offset based on last known direction
      // Keep the current look-ahead value instead of returning to 0
      desiredLookAhead = this.currentLookAhead;
    }
    this.currentLookAhead += (desiredLookAhead - this.currentLookAhead) * this.lookAheadSmoothing;
    const playerXWithLookAhead = player.x + this.currentLookAhead;
    this.targetX = playerXWithLookAhead - this.playerOffsetX;

    // Optional vertical scrolling
    const topEdge = this.targetY + this.deadZoneY;
    const bottomEdge = this.targetY + this.height - this.deadZoneY;

    if (player.y < topEdge) {
      this.targetY = player.y - this.deadZoneY;
    } else if (player.y > bottomEdge) {
      this.targetY = player.y - (this.height - this.deadZoneY);
    }

    // Clamp target to world bounds
    this.targetX = Math.max(0, Math.min(this.targetX, this.worldWidth - this.width));
    this.targetY = Math.max(0, Math.min(this.targetY, this.worldHeight - this.height));

    this.x += (this.targetX - this.x) * this.smoothingFactor;
    this.y += (this.targetY - this.y) * this.smoothingFactor;

    // Final clamp to world bounds
    this.x = Math.max(0, Math.min(this.x, this.worldWidth - this.width));
    this.y = Math.max(0, Math.min(this.y, this.worldHeight - this.height));
  }
}