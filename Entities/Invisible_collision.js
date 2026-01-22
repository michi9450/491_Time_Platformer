class invisible_collision{
    constructor(game, x, y, width, height){
        Object.assign(this, { game, x, y , width, height});
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    }

    update(){

    }

    draw(ctx) {
        // ctx.fillRect(this.x, this.y, this.width, this.height);
        this.BB.draw(ctx);
    }
}