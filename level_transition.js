class level_transition{
    constructor(game, x, y, width, height, level, SceneManager){
        Object.assign(this, { game, x, y , width, height});
        this.level = level;
        this.SM = SceneManager;
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    }

    update(){

    }

    getlevel() { return this.level}

    draw(ctx) {
        ctx.strokeStyle= "red";
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        this.BB.draw(ctx);
    }
}