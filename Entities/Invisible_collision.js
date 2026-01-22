class invisible_collision{
    constructor(game, x, y, width, height){
        Object.assign(this, { game, x, y });
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    }

    update(){

    }

    draw(ctx) {
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}