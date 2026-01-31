class Animator 
{
    constructor(spritesheet, xStart, yStart, width, height, frameCount, frameDuration) {
        Object.assign(this,{spritesheet, xStart, yStart, width, height, frameCount, frameDuration});
        this.elapsedTime = 0;
        this.totalTime = frameCount * frameDuration;
    };
    drawFrame(tick, ctx, x, y, flip = false) {
        this.elapsedTime += tick;
        if(this.elapsedTime > this.totalTime) this.elapsedTime -= this.totalTime;
        const frame = this.currentFrame();
        const scale = 4;

        ctx.save();
        //needed this to flip animations, also global scale cleaner.
        if (flip) {
          ctx.translate(x + this.width * (scale - 1), y);
          ctx.scale(-1, 1);
          x = 0;
          y = 0;
        }
        ctx.drawImage(this.spritesheet,
            this.xStart + this.width*frame, this.yStart,
            this.width, this.height,
            x, y,
            this.width*scale, this.height*scale); 
        ctx.restore();
    };
    currentFrame() {
        return Math.floor(this.elapsedTime/ this.frameDuration);
    };
    isDone() {
        return (this.elapsedTime >= this.totalTime);
    }
};