class Player {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });

        // Store spawn position for respawning
        this.spawnX = x;
        this.spawnY = y;

        this.width = 24;
        this.height = 32;

        this.animations = {
            idle: new Animator(
                ASSET_MANAGER.getAsset("sprites/adventurer-Sheet.png"),
                3, 0, 32, 32, 4, 0.2
            ),
            run: new Animator(
                ASSET_MANAGER.getAsset("sprites/adventurer-Sheet.png"),
                3, 32, 32, 32, 6, 0.15
            ),
            jump: new Animator(
                ASSET_MANAGER.getAsset("sprites/adventurer-Sheet.png"),
                67, 64, 32, 32, 2, 0.2
            ),
            fall: new Animator(
                ASSET_MANAGER.getAsset("sprites/adventurer-Sheet.png"),
                3, 96, 32, 32, 2, 0.1
            ),
            dash: new Animator(
                ASSET_MANAGER.getAsset("sprites/adventurer-Sheet.png"),
                3, 128, 32, 32, 4, 0.05
            ),
            // TODO: Add death animation here?
        };
        this.animator = this.animations.idle;

        // Physics
        this.velocity = { x: 0, y: 0 };

        // State -- initial
        this.onGround = false;
        this.facing = "right";
        this.state = "idle";
        this.dead = false;

        // Death animation state
        this.deathTimer = 0;
        this.deathAnimationDuration = 2.0; // seconds for full death animation

        // Jump helpers
        this.coyoteTime = 0;
        this.jumpBuffer = 0;
        this.hasDoubleJump = true;
        this.wasJumpPressed = false;
        //jump pad helper
        this.fromJumpPad = false;

        // Dash
        this.canDash = true;
        this.dashTime = 0;

        // Time Jump
        this.canTimeJump = true;
        this.timeJumpTimer = 0;

        //bounding box
        this.updateBB();
    }

    updateBB(){
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x, this.y, this.width*4, this.height*4);
        //console.log(this.BB.bottom);
    }

    update() {
        const TICK = this.game.clockTick;

        // Handle death animation state
        if (this.dead) {
            this.updateDeathAnimation(TICK);
            return; // Skip normal update while dead
        }

        //retrieve current entity list
        //this.currentlist = game.getEntityList();

        //constants
        //acceleration downwards
        const GRAVITY = 1500;
        //maximum fall speed
        const MAX_FALL = 1750;

        const RUN_ACCEL = 3000;
        const RUN_DECEL = 2500;
        const MAX_RUN = 400;

        //initial jumping speed
        const JUMP_SPEED = 650;
        //Multiplier that allows for shorter hops, and varying jump height based on input
        const JUMP_CUT_MULT = 0.4;

        //JUMP FORGIVENESS
        //max time (seconds) a player can still jump after leaving the ground
        const COYOTE_TIME_MAX = 0.1;
        //time (seconds) a jump input is remembered before landing
        //allows jumping before touching the ground
        const JUMP_BUFFER_MAX = 0.1;

        //horizontal dash speed movement
        const DASH_SPEED = 900;
        //how long the dash lasts in (seconds)
        const DASH_DURATION = 0.15;

        //how long the time animation lasts in (seconds)
        const TIME_JUMP_DURATION = .2;

        //input keys
        const left = this.game.keys["KeyA"];
        const right = this.game.keys["KeyD"];
        const jumpPressed = this.game.keys["Space"];
        const dashPressed = this.game.keys["ShiftLeft"];
        const timejumpPressed = this.game.keys["KeyM"];

        //timers
        this.coyoteTime -= TICK;
        this.jumpBuffer -= TICK;
        if(!this.canTimeJump) {
            if(this.timeJumpTimer > 0) this.timeJumpTimer -= TICK;
            else this.canTimeJump = true;
        }

        // Dash
        const dashJustPressed = dashPressed && !this.wasDashPressed;
        this.wasDashPressed = dashPressed;
        if (dashJustPressed && this.canDash) {
            this.canDash = false;
            this.dashTime = DASH_DURATION;
            this.velocity.y = 0;
            if (this.facing === "right") {
                this.velocity.x = DASH_SPEED;
            } else this.velocity.x = -DASH_SPEED;
        }

        if (this.dashTime > 0) {
            this.dashTime -= TICK;
            this.velocity.y = 0; // No gravity during dash
        } else {

            // horizontal
            if (left && right && this.onGround) { //both clicked and on the floor
                if (this.velocity.x > 0) {
                    this.velocity.x -= RUN_DECEL * TICK;
                    if (this.velocity.x < 0) this.velocity.x = 0;
                } else if (this.velocity.x < 0) {
                    this.velocity.x += RUN_DECEL * TICK;
                    if (this.velocity.x > 0) this.velocity.x = 0;
                }
            } else if (left) {
                this.velocity.x -= RUN_ACCEL * TICK;
                this.facing = "left";
            } else if (right) {
                this.velocity.x += RUN_ACCEL * TICK;
                this.facing = "right";
            } else { // none clicked
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
            const jumpJustPressed = jumpPressed && !this.wasJumpPressed;
            this.wasJumpPressed = jumpPressed;
            if (jumpJustPressed) {
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
            if (!jumpPressed && this.velocity.y < 0 && !this.fromJumpPad) {
                this.velocity.y *= JUMP_CUT_MULT;
            }

            //Gravity
            this.velocity.y += GRAVITY * TICK;
            this.velocity.y = Math.min(this.velocity.y, MAX_FALL);
            if (this.velocity.y >= 0) this.fromJumpPad = false;
            if(this.velocity.y > 0 && this.coyoteTime > 0) this.onGround = false;
        }


        // update position
        this.x += this.velocity.x * TICK;
        this.updateBB();
        this.handleHorizontalCollision();

        this.y += this.velocity.y * TICK;
        this.updateBB();
            const that = this;
        //console.log("verticle");
        this.game.getEntityList().forEach(function (entity) {
            //if statesments for all collision cases
            if(that.velocity.y > 0){//falling cases
                if(entity.BB && that.BB.collide(entity.BB)){
                // Check for all platform types
                if((entity instanceof invisible_collision ||
                    entity instanceof MovingPlatform ||
                    entity instanceof FallingPlatform)
                    && (that.lastBB.bottom) <= entity.BB.top + 10){//landing - added tolerance for moving platforms
                        //console.log("it is doing the thing");
                    that.y = entity.BB.top - that.height*4;
                    that.velocity.y = 0;
                    that.onGround = true;
                    that.canDash = true;
                    that.hasDoubleJump = true;
                    that.coyoteTime = COYOTE_TIME_MAX;

                    // Activate falling platform when player lands on it
                    if(entity instanceof FallingPlatform) {
                        entity.activate();
                    }

                    // Move with moving platform (both X and Y)
                    if(entity instanceof MovingPlatform && entity.lastX !== undefined) {
                        that.x += (entity.x - entity.lastX);
                        that.y += (entity.y - entity.lastY);
                    }
                    }
                }
            }
            if(that.velocity.y < 0){//jumping cases
                if(entity.BB && that.BB.collide(entity.BB)){
                // Check for all platform types
                if((entity instanceof invisible_collision ||
                    entity instanceof MovingPlatform ||
                    entity instanceof FallingPlatform)
                    && (that.lastBB.top) >= entity.BB.bottom - 10){//ceiling - added tolerance
                    that.y = entity.BB.bottom;
                    that.velocity.y = 0;
                    }
                }
            }
        })
        
        //Time skip mechanic
        const timejumpJustPressed = timejumpPressed && !this.wastimejumpPressed;
        this.wastimejumpPressed = timejumpPressed;
        if(timejumpPressed && this.canTimeJump){
            this.canTimeJump = false;
            this.game.changeTime();
            this.timeJumpTimer = TIME_JUMP_DURATION;
        }

        this.checkJumpPadCollision();
        // Check for portal collisions
        this.checkPortalCollision();
        // Check for hazard collisions
        this.checkHazardCollision();

        // Check if player fell off the map (below screen)
        if (this.y > 1000) {
            this.respawn();
        }

        if (!this.onGround) this.state = "jump";
        else if (Math.abs(this.velocity.x) > 10) this.state = "run";
        else this.state = "idle";

        //animation selection after all flags reset
            if (this.dead) {
                //something here
            }
            if (this.dashTime > 0) {
                this.animator = this.animations.dash;
            } else if (!this.onGround) {
                if (this.velocity.y < 0) {
                    this.animator = this.animations.jump;
                } else {
                    this.animator = this.animations.fall;
                }
            } else if (Math.abs(this.velocity.x) > 10) {
                this.animator = this.animations.run;
            } else{ this.animator = this.animations.idle;}
    }

    // Check collision with hazards (spikes, saw blades, etc.)
    checkHazardCollision() {
        const that = this;
        this.game.getEntityList().forEach(function (entity) {
            if (entity.isHazard && entity.BB && that.BB.collide(entity.BB)) {
                that.die();
            }
        });
    }
    //check for jump pad
    checkJumpPadCollision() {
    const that = this;

    this.game.getEntityList().forEach(function (entity) {
        if (entity.isJumpPad && entity.BB && that.BB.collide(entity.BB)) {

            // Only trigger if landing on it (from above)
            if (that.velocity.y > 0 && that.lastBB.bottom <= entity.BB.top + 10) {
                that.y = entity.BB.top - that.height * 4;
                that.velocity.y = -entity.boost;
                that.fromJumpPad = true;

                that.onGround = false;
                that.coyoteTime = 0;
                that.hasDoubleJump = true;
                that.canDash = true;
                entity.bounce();
            }
        }
    });
}

    // Check for portal collisions and teleport
    checkPortalCollision() {
        const that = this;

        this.game.getEntityList().forEach(function (entity) {
            if (entity.isTeleporter && entity.BB && that.BB.collide(entity.BB)) {
                // Attempt to teleport through the portal
                entity.teleport(that);
            }
        });
    }

    // Trigger death state - Mario style pop up then fall
    die() {
        if (this.dead) return; // Already dead, don't trigger again

        this.dead = true;
        this.state = "dead";
        this.deathTimer = 0;

        // Mario-style death: pop up first
        this.velocity.y = -500; // Pop up
        this.velocity.x = 0;    // Stop horizontal movement

    }

    // Update death animation
    updateDeathAnimation(TICK) {
        const DEATH_GRAVITY = 1200;
        const MAX_FALL = 1750;

        this.deathTimer += TICK;

        // Apply gravity during death animation
        this.velocity.y += DEATH_GRAVITY * TICK;
        this.velocity.y = Math.min(this.velocity.y, MAX_FALL);

        // Update position (only vertical, no horizontal movement)
        this.y += this.velocity.y * TICK;
        this.updateBB();

        // Respawn after animation completes or player falls off screen
        if (this.deathTimer >= this.deathAnimationDuration || this.y > 1000) {
            this.respawn();
        }
    }

    // Respawn player at spawn point
    respawn() {
        if(!(this.game.isPast)) this.game.changeTime();
        this.x = this.spawnX;
        this.y = this.spawnY;
        this.velocity = { x: 0, y: 0 };
        this.dead = false;
        this.state = "idle";
        this.deathTimer = 0;
        this.onGround = false;
        this.hasDoubleJump = true;
        this.canDash = true;
        this.coyoteTime = 0;

        // Reset all platforms in both timelines
        [this.game.entitiesPast, this.game.entitiesPresent].forEach(function(list) {
            list.forEach(function(entity) {
                if (entity instanceof FallingPlatform || entity instanceof MovingPlatform) {
                    entity.reset();
                }
            });
        });
        this.jumpBuffer = 0;
        this.updateBB();
    }

    handleHorizontalCollision(){
        //console.log("hoirzontal");
        const that = this;
        this.game.getEntityList().forEach(function (entity) {
            //console.log(that.BB.collide(entity.BB));
            if(entity.BB && that.BB.collide(entity.BB)){
                // Check for all platform types
                if(entity instanceof invisible_collision ||
                   entity instanceof MovingPlatform ||
                   entity instanceof FallingPlatform){
                    let overlap = that.BB.overlap(entity.BB);

                    // Determine collision side based on where player was coming from
                    const fromLeft = that.lastBB.right <= entity.BB.left + 5;
                    const fromRight = that.lastBB.left >= entity.BB.right - 5;

                    if(fromLeft && that.velocity.x > 0) {
                        //console.log("it is doing the thing");
                        that.x = entity.BB.left - that.width*4;
                        that.velocity.x = 0;
                    }
                    else if(fromRight && that.velocity.x < 0) {
                        //console.log("it is doing the thing 2");
                        that.x = entity.BB.right;
                        that.velocity.x = 0;
                    }
                }
            }
        })
    }


    draw(ctx) {
        const flip = this.facing === "left"; //changes animation direction
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y, flip);
        // ctx.strokeRect(this.x, this.y, this.width * 4, this.height * 4);
        this.BB.draw(ctx);
    }
}
