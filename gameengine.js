// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011
//thhis should fix shit
class GameEngine {
    constructor(options) {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        this.ctx = null;
        this.player = null;
        this.camera = null;

        // Everything that will be updated and drawn each frame
        this.entitiesPast = [];//list of entities in "past" version stage
        this.entitiesPresent = [];//list of entities in "present" version of stage

        //Boolean that keeps track of which version of stage to draw
        this.isPast = true;

        // Information on the input
        this.click = null;
        this.mouse = null;
        this.wheel = null;
        this.keys = {};

        // Options and the Details
        this.options = options || {
            debugging: false,
        };
    };

    init(ctx) {
        this.ctx = ctx;
        this.startInput();
        this.timer = new Timer();
    };

    start() {
        this.running = true;
        const gameLoop = () => {
            this.loop();
            requestAnimFrame(gameLoop, this.ctx.canvas);
        };
        gameLoop();
    };

    startInput() {
        const getXandY = e => ({
            x: e.clientX - this.ctx.canvas.getBoundingClientRect().left,
            y: e.clientY - this.ctx.canvas.getBoundingClientRect().top
        });
        
        this.ctx.canvas.addEventListener("mousemove", e => {
            if (this.options.debugging) {
                console.log("MOUSE_MOVE", getXandY(e));
            }
            this.mouse = getXandY(e);
        });

        this.ctx.canvas.addEventListener("click", e => {
            if (this.options.debugging) {
                console.log("CLICK", getXandY(e));
            }
            this.click = getXandY(e);
        });

        this.ctx.canvas.addEventListener("wheel", e => {
            if (this.options.debugging) {
                console.log("WHEEL", getXandY(e), e.wheelDelta);
            }
            e.preventDefault(); // Prevent Scrolling
            this.wheel = e;
        });

        this.ctx.canvas.addEventListener("contextmenu", e => {
            if (this.options.debugging) {
                console.log("RIGHT_CLICK", getXandY(e));
            }
            e.preventDefault(); // Prevent Context Menu
            this.rightclick = getXandY(e);
        });

        this.ctx.canvas.addEventListener("keydown", event => this.keys[event.code] = true);
        this.ctx.canvas.addEventListener("keyup", event => this.keys[event.code] = false);
    };

    addEntityPast(entity) {
        this.entitiesPast.push(entity);
    };

    addEntityPresent(entity) {
        this.entitiesPresent.push(entity);
    };

    getEntityList(){
        if(this.isPast) return this.entitiesPast;
        else return this.entitiesPresent;
    }

    changeTime() {
        if(this.isPast) this.isPast = false;
        else this.isPast = true;
    }

    draw() {
        // Clear the whole canvas with transparent color (rgba(0, 0, 0, 0))
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        //saves the entire state of the canvas by pushing it into a stack.
        this.ctx.save();
        this.ctx.translate(-this.camera.x, -this.camera.y);

        // Draw latest things first
        this.currentlist = this.getEntityList();
        for (let i = this.currentlist.length - 1; i >= 0; i--) {
            this.currentlist[i].draw(this.ctx, this);
        }
        
        //restores the most recently saved canvas state if any
        this.ctx.restore();
    };

    update() {
        this.currentlist = this.getEntityList();
        let entitiesCount = this.currentlist.length;

        for (let i = 0; i < entitiesCount; i++) {
            let entity = this.currentlist[i];

            if (!entity.removeFromWorld) {
                entity.update();
            }
        }

        for (let i = this.currentlist.length - 1; i >= 0; --i) {
            if (this.currentlist[i].removeFromWorld) {
                this.currentlist.splice(i, 1);
            }
        }
        this.camera.update();
    };

    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
    };

};

// KV Le was here :)