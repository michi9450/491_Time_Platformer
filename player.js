class Player {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });

        this.width = 20;
        this.height = 26;

        this.animations = {
            temp: new Animator(
                ASSET_MANAGER.getAsset("sprites/temp.png"),
                0, 0, 20, 26, 1, 1
            )
        };
        this.animator = this.animations.temp;

        // Physics
        this.velocity = { x: 0, y: 0 };

        // State -- initial
        this.onGround = false;
        this.facing = "right";
        this.state = "idle";
        this.dead = false;

        // Jump helpers
        this.coyoteTime = 0;
        this.jumpBuffer = 0;
        this.hasDoubleJump = true;

        // Dash
        this.canDash = true;
        this.dashTime = 0;
    }

    update() {
        const TICK = this.game.clockTick;

        //constants
        const GRAVITY = 2000;
        const MAX_FALL = 1500;

        const RUN_ACCEL = 3000;
        const RUN_DECEL = 2500;
        const MAX_RUN = 400;

        const JUMP_SPEED = 650;
        const JUMP_CUT_MULT = 0.4;

        const COYOTE_TIME_MAX = 0.1;
        const JUMP_BUFFER_MAX = 0.1;

        const DASH_SPEED = 900;
        const DASH_DURATION = 0.15;

        const GROUND_Y = 500; // adjust

        //input keys
        const left = this.game.keys["a"];
        const right = this.game.keys["d"];
        const jumpPressed = this.game.keys[" "];
        const dashPressed = this.game.keys["Shift"];

        //timers
        this.coyoteTime -= TICK;
        this.jumpBuffer -= TICK;

        // Dash
        if (dashPressed && this.canDash) {
            this.canDash = false;
            this.dashTime = DASH_DURATION;
            this.velocity.y = 0;
            this.velocity.x = this.facing === "right" ? DASH_SPEED : -DASH_SPEED;
        }

        if (this.dashTime > 0) {
            this.dashTime -= TICK;
            this.velocity.y = 0; // No gravity during dash
        } else {

            // horizontal
            if (left) {
                this.velocity.x -= RUN_ACCEL * TICK;
                this.facing = "left";
            } else if (right) {
                this.velocity.x += RUN_ACCEL * TICK;
                this.facing = "right";
            } else {
                if (this.velocity.x > 0) {
                    this.velocity.x -= RUN_DECEL * TICK;
                    if (this.velocity.x < 0) this.velocity.x = 0;
                } else if (this.velocity.x < 0) {
                    this.velocity.x += RUN_DECEL * TICK;
                    if (this.velocity.x > 0) this.velocity.x = 0;
                }
            }

            this.velocity.x = Math.max(-MAX_RUN, Math.min(MAX_RUN, this.velocity.x));

            // jump
            if (jumpPressed) {
                this.jumpBuffer = JUMP_BUFFER_MAX;
            }

            if (this.jumpBuffer > 0) {
                if (this.onGround || this.coyoteTime > 0) {
                    this.velocity.y = -JUMP_SPEED;
                    this.jumpBuffer = 0;
                    this.onGround = false;
                } else if (this.hasDoubleJump) {
                    this.velocity.y = -JUMP_SPEED;
                    this.hasDoubleJump = false;
                    this.jumpBuffer = 0;
                }
            }

            // Variable jump height
            if (!jumpPressed && this.velocity.y < 0) {
                this.velocity.y *= JUMP_CUT_MULT;
            }

            //Gravity
            this.velocity.y += GRAVITY * TICK;
            this.velocity.y = Math.min(this.velocity.y, MAX_FALL);
        }

        // update position
        this.x += this.velocity.x * TICK;
        this.y += this.velocity.y * TICK;

        //Collision and ground stuff
        // if (this.y + this.height >= GROUND_Y) {
        //     this.y = GROUND_Y - this.height;
        //     this.velocity.y = 0;
        //     this.onGround = true;
        //     this.coyoteTime = COYOTE_TIME_MAX;
        //     this.hasDoubleJump = true;
        //     this.canDash = true;
        // } else {
        //     this.onGround = false;
        // }

        if (!this.onGround) this.state = "jump";
        else if (Math.abs(this.velocity.x) > 10) this.state = "run";
        else this.state = "idle";
    }

    draw(ctx) {
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
}
