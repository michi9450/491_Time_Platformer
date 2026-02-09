class invisible_collision{
    constructor(game, x, y, width, height){
        Object.assign(this, { game, x, y , width, height});
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
        this.isPlatform = true;
    }

    update(){

    }

    draw(ctx) {
        ctx.strokeStyle= "red";
        //ctx.strokeRect(this.x, this.y, this.width, this.height);
        this.BB.draw(ctx);
    }
}