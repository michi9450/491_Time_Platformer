class ParallaxLayer {
  constructor(game, imagePath, speedFactor, y = 0, scale = 1, isStatic = false, x = 0, autoscrollSpeed = 0) {
    Object.assign(this, { game, speedFactor, y, scale, isStatic, x, autoscrollSpeed});
    this.image = ASSET_MANAGER.getAsset(imagePath);
    this.autoscrollOffset = 0;
  }

  update() {
    this.autoscrollOffset += this.autoscrollSpeed;
  }

  draw(ctx) {
    if (!this.image) return;

    ctx.save();

    const imgWidth = this.image.width * this.scale;
    const imgHeight = this.image.height * this.scale;

    // parallax background
    if (!this.isStatic) {
      // reset camera transform
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      const cameraX = this.game.camera.x * this.speedFactor;
      const totalOffset = cameraX + this.autoscrollOffset;
      const startX = -(totalOffset % imgWidth);

      for (let x = startX; x < ctx.canvas.width; x += imgWidth) {
        ctx.drawImage(this.image, x, this.y, imgWidth, imgHeight);
      }
    } else { // does not move at all
      ctx.drawImage(this.image, this.x, this.y, imgWidth, imgHeight);
    }

    ctx.restore();
  }
}
