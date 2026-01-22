class invisible_collision{
    constructor(game, x, y, width, height){
        Object.assign(this, { game, x, y });
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    }

    update(){

    }

    draw(ctx) {
        ctx.fillRect(0, 600, 500, 100);
    }
}