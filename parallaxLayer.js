//basically works by changing the ctx movement settings from the scroll mechanic that we have
// need to make one object for each layer of background image that you are using
class ParallaxLayer {
  constructor(game, imagePath, speedFactor, y = 0, scale = 1) {
    this.game = game;
    this.image = ASSET_MANAGER.getAsset(imagePath);
    this.speedFactor = speedFactor; // change how fast this layer moves, close should be fastest and furthest slowest
    this.y = y;
    this.scale = scale;
  }

  update() {}

  draw(ctx) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const cameraX = this.game.camera.x * this.speedFactor;
    const imgWidth = this.image.width * this.scale;
    const startX = -(cameraX % imgWidth);
    for (let x = startX; x < ctx.canvas.width; x += imgWidth) {
      ctx.drawImage(
        this.image,
        x,
        this.y,
        imgWidth,
        this.image.height * this.scale,
      );
    }

    ctx.restore();
  }
}
