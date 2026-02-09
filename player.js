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
        3,
        0,
        32,
        32,
        4,
        0.2,
      ),
      run: new Animator(
        ASSET_MANAGER.getAsset("sprites/adventurer-Sheet.png"),
        3,
        32,
        32,
        32,
        6,
        0.15,
      ),
      jump: new Animator(
        ASSET_MANAGER.getAsset("sprites/adventurer-Sheet.png"),
        67,
        64,
        32,
        32,
        2,
        0.2,
      ),
      fall: new Animator(
        ASSET_MANAGER.getAsset("sprites/adventurer-Sheet.png"),
        3,
        96,
        32,
        32,
        2,
        0.1,
      ),
      dash: new Animator(
        ASSET_MANAGER.getAsset("sprites/adventurer-Sheet.png"),
        3,
        128,
        32,
        32,
        4,
        0.05,
      ),
      // TODO: Add death animation here?
    };
    this.animator = this.animations.idle;

    // constants
    this.config = {
      gravity: 1500, //acceleration downward
      maxFall: 1750, // maximum falling speed
      runAccel: 3000,
      runDecel: 2500,
      maxRun: 400,
      jumpSpeed: 650, //initial jump speed
      jumpCut: 0.4, //Multiplier that allows for short hops or max jumps
      coyoteTime: 0.1, // max time(seconds) player can jump after leaving ground
      jumpBuffer: 0.1, // time that a input is remembered before landing
      dashSpeed: 900, //horizontal dash speed
      dashDuration: 0.2, // how long the dash lasts in seconds
      timeJumpDuration: 0.2, // how long before the player can time jump again
    };
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
    this.wasTimeJumpPressed = false;

    //bounding box
    this.updateBB();
  }

  updateBB() {
    this.lastBB = this.BB;
    this.BB = new BoundingBox(this.x, this.y, this.width * 4, this.height * 4);
    //console.log(this.BB.bottom);
  }

  update() {
    const TICK = this.game.clockTick;

    // Handle death animation state
    if (this.dead) {
      this.updateDeathAnimation(TICK);
      return; // Skip normal update while dead
    }

    this.#handleInput(TICK);

    this.handleHorizontalCollision();

    this.y += this.velocity.y * TICK;
    this.updateBB();
    const that = this;
    //console.log("verticle");
    this.game.getEntityList().forEach(function (entity) {
      //if statesments for all collision cases
      if (that.velocity.y > 0) {
        //falling cases
        if (entity.BB && that.BB.collide(entity.BB)) {
          // Check for all platform types
          if (entity.isPlatform && that.lastBB.bottom <= entity.BB.top + 10) {
            //landing - added tolerance for moving platforms
            that.y = entity.BB.top - that.height * 4;
            that.velocity.y = 0;
            that.onGround = true;
            that.canDash = true;
            that.hasDoubleJump = true;
            that.coyoteTime = that.config.coyoteTime;

            // Activate falling platform when player lands on it
            if (entity instanceof FallingPlatform) {
              entity.activate();
            }

            // Move with moving platform (both X and Y)
            if (
              entity instanceof MovingPlatform &&
              entity.lastX !== undefined
            ) {
              that.x += entity.x - entity.lastX;
              that.y += entity.y - entity.lastY;
            }
          }
        }
      }
      if (that.velocity.y < 0) {
        //jumping cases
        if (entity.BB && that.BB.collide(entity.BB)) {
          // Check for all platform types
          if (entity.isPlatform && that.lastBB.top >= entity.BB.bottom - 10) {
            //ceiling - added tolerance
            that.y = entity.BB.bottom;
            that.velocity.y = 0;
          }
        }
      }
    });

    this.checkJumpPadCollision();
    // Check for portal collisions
    this.checkPortalCollision();
    // Check for hazard collisions
    this.checkHazardCollision();

    this.checkLevel_Transition();
    // Check if player fell off the map (below screen)
    if (this.y > 1000) {
      this.respawn();
    }

    if (!this.onGround) this.state = "jump";
    else if (Math.abs(this.velocity.x) > 10) this.state = "run";
    else this.state = "idle";

    //animation selection after all flags reset
    this.#updateAnimation();
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
    this.velocity.x = 0; // Stop horizontal movement
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

    checkLevel_Transition() {
        const that = this;

        this.game.getEntityList().forEach(function (entity) {
            if (entity instanceof level_transition) {
                if(entity.BB && that.BB.collide(entity.BB)){
                    // changes to level transitions stored level.
                    entity.SM.loadnewLevel(entity.getlevel());
                } 
            }
        });
    }

    // Trigger death state - Mario style pop up then fall
    die() {
        if (this.dead) return; // Already dead, don't trigger again

    // Reset all falling platforms
    this.game.getEntityList().forEach(function (entity) {
      if (entity instanceof FallingPlatform) {
        entity.reset();
      }
    });
    this.jumpBuffer = 0;
    this.updateBB();
  }

  handleHorizontalCollision() {
    //console.log("hoirzontal");
    const that = this;
    this.game.getEntityList().forEach(function (entity) {
      //console.log(that.BB.collide(entity.BB));
      if (entity.BB && that.BB.collide(entity.BB)) {
        // Check for all platform types
        if (entity.isPlatform) {
          let overlap = that.BB.overlap(entity.BB);

          // Determine collision side based on where player was coming from
          const fromLeft = that.lastBB.right <= entity.BB.left + 5;
          const fromRight = that.lastBB.left >= entity.BB.right - 5;

          if (fromLeft && that.velocity.x > 0) {
            //console.log("it is doing the thing");
            that.x = entity.BB.left - that.width * 4;
            that.velocity.x = 0;
          } else if (fromRight && that.velocity.x < 0) {
            //console.log("it is doing the thing 2");
            that.x = entity.BB.right;
            that.velocity.x = 0;
          }
        }
      }
    });
  }
  #updateAnimation() {
    if (this.dead) return;
    if (this.dashTime > 0) this.animator = this.animations.dash;
    else if (!this.onGround)
      this.animator =
        this.velocity.y < 0 ? this.animations.jump : this.animations.fall;
    else if (Math.abs(this.velocity.x) > 10)
      this.animator = this.animations.run;
    else this.animator = this.animations.idle;
  }
  #applyFriction(amount, TICK) {
    if (this.velocity.x > 0)
      this.velocity.x = Math.max(0, this.velocity.x - amount * TICK);
    else if (this.velocity.x < 0)
      this.velocity.x = Math.min(0, this.velocity.x + amount * TICK);
  }
  #handleInput(TICK) {
    //input keys
    const left = this.game.keys["KeyA"];
    const right = this.game.keys["KeyD"];
    const jumpPressed = this.game.keys["Space"];
    const dashPressed = this.game.keys["ShiftLeft"];
    const timejumpPressed = this.game.keys["KeyM"];

    //timers
    this.coyoteTime -= TICK;
    this.jumpBuffer -= TICK;

    // Dash
    const dashJustPressed = dashPressed && !this.wasDashPressed;
    this.wasDashPressed = dashPressed;
    if (dashJustPressed && this.canDash) {
      this.canDash = false;
      this.dashTime = this.config.dashDuration;
      this.velocity.y = 0;
      if (this.facing === "right") {
        this.velocity.x = this.config.dashSpeed;
      } else this.velocity.x = -this.config.dashSpeed;
    }

    if (this.dashTime > 0) {
      this.dashTime -= TICK;
      this.velocity.y = 0; // No gravity during dash
    } else {
      // horizontal
      if (left && right && this.onGround) {
        //both clicked and on the floor
        this.#applyFriction(this.config.runDecel, TICK);
      } else if (left) {
        this.velocity.x -= this.config.runAccel * TICK;
        this.facing = "left";
      } else if (right) {
        this.velocity.x += this.config.runAccel * TICK;
        this.facing = "right";
      } else {
        // none clicked
        this.#applyFriction(this.config.runDecel, TICK);
      }

      this.velocity.x = Math.max(
        -this.config.maxRun,
        Math.min(this.config.maxRun, this.velocity.x),
      );

      // jump
      const jumpJustPressed = jumpPressed && !this.wasJumpPressed;
      this.wasJumpPressed = jumpPressed;
      if (jumpJustPressed) {
        this.jumpBuffer = this.config.jumpBuffer;
      }

      if (this.jumpBuffer > 0) {
        if (this.onGround || this.coyoteTime > 0) {
          this.velocity.y = -this.config.jumpSpeed;
          this.jumpBuffer = 0;
          this.onGround = false;
        } else if (this.hasDoubleJump) {
          this.velocity.y = -this.config.jumpSpeed;
          this.hasDoubleJump = false;
          this.jumpBuffer = 0;
        }
      }

      // Variable jump height
      if (!jumpPressed && this.velocity.y < 0 && !this.fromJumpPad) {
        this.velocity.y *= this.config.jumpCut;
      }
      //Time skip mechanic (programmed same as dash - activates on press not on hold)
      const timejumpJustPressed = timejumpPressed && !this.wasTimeJumpPressed;
      this.wasTimeJumpPressed = timejumpPressed;
      //timing
      if (!this.canTimeJump) {
        this.timeJumpTimer -= TICK;
        if (this.timeJumpTimer <= 0) {
          this.canTimeJump = true;
        }
      }
      // trigger
      if (timejumpJustPressed && this.canTimeJump) {
        this.canTimeJump = false;
        this.timeJumpTimer = this.config.timeJumpDuration;
        this.game.changeTime();
      }

      //Gravity
      this.velocity.y += this.config.gravity * TICK;
      this.velocity.y = Math.min(this.velocity.y, this.config.maxFall);
      if (this.velocity.y >= 0) this.fromJumpPad = false;
      if (this.velocity.y > 0 && this.coyoteTime > 0) this.onGround = false;
    }
    // update position
    this.x += this.velocity.x * TICK;
    this.updateBB();
  }

  draw(ctx) {
    const flip = this.facing === "left"; //changes animation direction
    this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y, flip);
    // ctx.strokeRect(this.x, this.y, this.width * 4, this.height * 4);
    this.BB.draw(ctx);
  }
}
