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
        0.125,
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
    };
    this.animator = this.animations.idle;

    ((this.landAnimator = new Animator(
      ASSET_MANAGER.getAsset("sprites/land.png"),
      0,
      0,
      24,
      16,
      8,
      0.05,
    )),
      (this.deathAnimator = new Animator(
        ASSET_MANAGER.getAsset("sprites/death.png"),
        0,
        0,
        64,
        64,
        12,
        0.05,
      )),
      (this.dashAnimator = new Animator(
        ASSET_MANAGER.getAsset("sprites/dash.png"),
        0,
        0,
        32,
        32,
        9,
        0.0222222,
      )),
      // constants
      (this.config = {
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
        levelTransitionDelay: 0.5, //how long it waits before checking level transition
      }));
    // Physics
    this.velocity = { x: 0, y: 0 };

    // State -- initial
    this.onGround = false;
    this.facing = "right";
    this.state = "idle";
    this.dead = false;

    // Death animation state
    this.deathTimer = 0;

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

    //leveltransition timer
    this.levelTransitionDelay = 0;
    this.dimensionSwitchTimer = 0.1;

    //bounding box
    this.bbPadX = 10;
    this.bbPadY = 10;
    this.updateBB();
    //sound help
    this.runningSound = null;
    //effect states
    this.showExplosion = false;
    this.explosionTimer = 0;
    this.explosionDuration =
      this.deathAnimator.frameCount * this.deathAnimator.frameDuration;

    // effect helpers
    this.showLand = false;
    this.landTimer = 0;
    this.landX = 0;
    this.landY = 0;
    this.landDuration =
      this.landAnimator.frameCount * this.landAnimator.frameDuration;
    this.dashX = 0;
    this.dashY = 0;
    this.wasOnGround = false;
  }

  updateBB() {
    this.lastBB = this.BB;
    const padBottom = 2;
    this.BB = new BoundingBox(
      this.x + this.bbPadX,
      this.y + this.bbPadY,
      this.width * 4 - this.bbPadX * 2,
      this.height * 4 - this.bbPadY - padBottom,
    );
  }

  update() {
    const TICK = this.game.clockTick;

    // Freeze player when game is complete
    if (this.game.hudTimer && this.game.hudTimer.gameComplete) {
      this.velocity = { x: 0, y: 0 };
      this.state = "idle";
      this.#stopRunSound();
      this.#updateAnimation();
      return;
    }

    // Handle death animation state
    if (this.dead) {
      this.updateDeathAnimation(TICK);
      return; // Skip normal update while dead
    }

    if (this.ridingPlatform) {
      this.x += this.ridingPlatform.velX;
      this.y += this.ridingPlatform.velY;
      this.updateBB();
    }
    this.ridingPlatform = null;
    this.#handleInput(TICK);
    this.velocity.x;
    this.x += this.velocity.x * TICK;
    this.updateBB();

    this.#handleCollisions("x", TICK);

    this.y += this.velocity.y * TICK;
    this.updateBB();
    this.onGround = false;
    const velocityBeforeLanding = this.velocity.y;
    this.#handleCollisions("y", TICK);

    if (
      this.onGround &&
      (this.game.keys["KeyA"] || this.game.keys["KeyD"]) &&
      Math.abs(this.velocity.x) > 10
    ) {
      this.#startRunSound();
    } else {
      this.#stopRunSound();
    } //moved running sound outside of input, to handle all cases.
    // Land effect — trigger once when player touches ground
    const justLanded =
      this.onGround && !this.wasOnGround && velocityBeforeLanding > 100;

    if (justLanded) {
      this.showLand = true;
      this.landTimer = 0;
      this.landAnimator.elapsedTime = 0; // reset so it plays from frame 1
      this.landX = this.x;
      this.landY = this.y;
    }
    if (this.showLand) {
      this.landTimer += TICK;
      if (this.landTimer >= this.landDuration) {
        this.showLand = false;
      }
    }
    this.wasOnGround = this.onGround;

    // Explosion timer
    if (this.showExplosion) {
      this.explosionTimer += TICK;
      if (this.explosionTimer >= this.explosionDuration) {
        this.showExplosion = false;
      }
    }
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

  respawn() {
    if (!this.game.isPast) this.game.changeTime();
    this.showExplosion = true;
    this.explosionTimer = 0;
    this.deathAnimator.elapsedTime = 0; // reset so it plays from frame 1
    this.explosionX = this.x;
    this.explosionY = this.y;
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

    // Reset all objects platforms
    this.game.getPastList().forEach(function (entity) {
      if (entity instanceof FallingPlatform) entity.reset();
      if (entity instanceof MovingPlatform) entity.reset();
      if (entity instanceof SawBlade) entity.reset();
    });
    this.game.getPresentList().forEach(function (entity) {
      if (entity instanceof FallingPlatform) entity.reset();
      if (entity instanceof MovingPlatform) entity.reset();
      if (entity instanceof SawBlade) entity.reset();
    });

    this.showExplosion = true;
    this.explosionTimer = 0;
    this.#stopRunSound();
    this.game.sound.play("death", { volume: 0.8 });
    this.jumpBuffer = 0;
    this.updateBB();
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

  #handleLevelTransition(entity, TICK) {
    this.levelTransitionDelay += TICK;
    if (
      entity.isLevelTransition &&
      this.levelTransitionDelay > this.config.levelTransitionDelay
    ) {
      this.levelTransitionDelay = 0;
      this.#stopRunSound();
      entity.SM.loadnewLevel(entity.getlevel());
    }
  }

  #handleHorizontalCollision(entity) {
    if (!entity.isPlatform) return;

    const fromLeft = this.lastBB.right <= entity.BB.left + 5;
    const fromRight = this.lastBB.left >= entity.BB.right - 5;

    if (entity instanceof invisible_collision) {
      //fixes moving platform not making player collide with regular collision
      const playerCenterX = this.x + (this.width * 4) / 2;
      const entityCenterX = entity.x + entity.width / 2;
      if (playerCenterX < entityCenterX) {
        this.x = entity.BB.left - this.BB.width - this.bbPadX;
      } else {
        this.x = entity.BB.right - this.bbPadX;
      }
      this.velocity.x = 0;
    } else {
      if (fromLeft && this.velocity.x > 0) {
        this.x = entity.BB.left - this.BB.width - this.bbPadX;
        this.velocity.x = 0;
      } else if (fromRight && this.velocity.x < 0) {
        this.x = entity.BB.right - this.bbPadX;
        this.velocity.x = 0;
      }
    }
  }
  #handleVerticalCollisions(entity) {
    if (!entity.isPlatform) return;

    // landing
    let landingThreshold = 10;
    if (entity instanceof MovingPlatform) {
      const platformDelta = Math.abs(entity.velY) * this.game.clockTick;
      landingThreshold = Math.max(40, platformDelta + 10);
    }
    if (
      this.velocity.y >= 0 &&
      this.lastBB.bottom <= entity.BB.top + landingThreshold
    ) {
      this.y = entity.BB.top - this.BB.height - this.bbPadY;
      this.velocity.y = 0;
      this.onGround = true;
      this.canDash = true;
      this.hasDoubleJump = true;
      this.coyoteTime = this.config.coyoteTime;

      if (entity instanceof FallingPlatform) entity.activate();

      if (entity instanceof MovingPlatform) {
        this.ridingPlatform = entity;
      }
    }

    // ceiling
    if (this.velocity.y < 0 && this.lastBB.top >= entity.BB.bottom - 10) {
      this.y = entity.BB.bottom - this.bbPadY;
      this.velocity.y = 0;
    }
  }
  #handleCollisions(axis, TICK) {
    for (const entity of this.game.getEntityList()) {
      if (!entity.BB) continue;
      if (!this.BB.collide(entity.BB)) continue;

      if (axis === "x") this.#handleHorizontalCollision(entity);

      if (axis === "y") {
        this.#handleVerticalCollisions(entity);
        this.#handleJumpPad(entity);
      }

      this.#handleHazard(entity);
      this.#handlePortal(entity);
      this.#handleLevelTransition(entity, TICK);
    }
  }
  #handleJumpPad(entity) {
    if (!entity.isJumpPad) return;

    if (this.velocity.y > 0 && this.lastBB.bottom <= entity.BB.top + 10) {
      this.y = entity.BB.top - this.height * 4;
      this.velocity.y = -entity.boost;
      this.fromJumpPad = true;
      this.ridingPlatform = null;

      this.onGround = false;
      this.coyoteTime = 0;
      this.hasDoubleJump = true;
      this.canDash = true;

      this.game.sound.play("jumppad", { pitchVar: 0.2, volume: 0.3 });
      entity.bounce();
    }
  }
  #handleHazard(entity) {
    if (entity.isHazard) this.respawn();
  }

  #handlePortal(entity) {
    if (entity.isTeleporter) entity.teleport(this);
  }
  #updateAnimation() {
    if (this.dead) return;
    if (this.dashTime > 0) this.animator = this.animations.dash;
    else if (!this.onGround && !this.ridingPlatform && this.dimensionSwitchTimer <= 0)
        this.animator = this.velocity.y < 0 ? this.animations.jump : this.animations.fall;
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
    const jumpPressed = this.game.keys["Space"] || this.game.keys["KeyW"];
    const dashPressed = this.game.keys["ShiftLeft"];
    const timejumpPressed = this.game.keys["KeyM"];

    //timers
    this.coyoteTime -= TICK;
    this.jumpBuffer -= TICK;
    this.dimensionSwitchTimer -= TICK;

    // Dash
    const dashJustPressed = dashPressed && !this.wasDashPressed;
    this.wasDashPressed = dashPressed;
    if (dashJustPressed && this.canDash) {
      this.canDash = false;
      this.dashTime = this.config.dashDuration;
      this.velocity.y = 0;
      this.dashX = this.x;
      this.dashY = this.y;
      this.game.sound.play("dash", { pitchVar: 0.05, volume: 0.3 });

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
        this.#stopRunSound();
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
          this.ridingPlatform = null;
          this.game.sound.play("jump", { pitchVar: 0.05, volume: 0.3 });
          this.#stopRunSound();
        } else if (this.hasDoubleJump) {
          this.velocity.y = -this.config.jumpSpeed;
          this.hasDoubleJump = false;
          this.jumpBuffer = 0;
          this.ridingPlatform = null;
          this.game.sound.play("jump", { pitchVar: 0.05, volume: 0.3 });
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
        this.checkDimensionCollision();
      }

      //Gravity
      if (
        this.ridingPlatform &&
        this.ridingPlatform.velY > 0 &&
        this.onGround
      ) {
        this.velocity.y = this.ridingPlatform.velY;
      } else {
        this.velocity.y += this.config.gravity * TICK;
        this.velocity.y = Math.min(this.velocity.y, this.config.maxFall);
      }
      if (this.velocity.y >= 0) this.fromJumpPad = false;
      if (this.velocity.y > 0 && this.coyoteTime > 0) this.onGround = false;
    }
  }
  #startRunSound() {
    if (this.runningSoundHandle || !this.onGround) return; // already playing or in air
    this.runningSoundHandle = this.game.sound.play("run", {
      loop: true,
      volume: 0.2,
    });
  }

  #stopRunSound() {
    if (!this.runningSoundHandle) return;
    this.runningSoundHandle.stop(0.05); // tiny fade out so it doesn't click
    this.runningSoundHandle = null;
  }

  checkDimensionCollision() {
    //add threshold for how far into an object you need to be before it pushes you
    const that = this;
    let overlappingWalls = [];

    // Find all overlapping walls in current dimension
    this.game.getEntityList().forEach(function (entity) {
      if (entity instanceof invisible_collision && that.BB.collide(entity.BB)) {
        overlappingWalls.push(entity);
      }
    });

    if (overlappingWalls.length === 0) return;

    // Find nearest wall if multiple overlaps
    let nearestWall = overlappingWalls[0];
    let minOverlap = Infinity;

    overlappingWalls.forEach(function (wall) {
      let overlap = that.BB.overlap(wall.BB);
      let totalOverlap = Math.abs(overlap.x) + Math.abs(overlap.y);
      if (totalOverlap < minOverlap) {
        minOverlap = totalOverlap;
        nearestWall = wall;
      }
    });

    // Calculate which side to push to
    let overlap = that.BB.overlap(nearestWall.BB);
    let playerCenter = that.x + (that.width * 4) / 2;
    let wallCenter = nearestWall.x + nearestWall.width / 2;

    // Push to nearest edge based on overlap amount
    if (Math.abs(overlap.x) < Math.abs(overlap.y)) {
      // Horizontal push (less overlap = easier to push out)
      if (playerCenter < wallCenter) {
        // Push left
        that.x = nearestWall.BB.left - that.width * 4;
      } else {
        // Push right
        that.x = nearestWall.BB.right;
      }
    } else {
      // Vertical push (if more vertically overlapped)
      if (
        that.y + (that.height * 4) / 2 <
        nearestWall.y + nearestWall.height / 2
      ) {
        // Push up
        that.y = nearestWall.BB.top - that.height * 4;
      } else {
        // Push down
        that.y = nearestWall.BB.bottom;
      }
    }

    // Update bounding box after position change
    that.updateBB();
    this.dimensionSwitchTimer = 0.15;

    // Zero out velocity to prevent immediate movement after push
    // that.velocity.x = 0;
    // that.velocity.y = 0;
  }

  draw(ctx) {
    const flip = this.facing === "left";
    this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y, flip);

    // Dash effect — behind player, scale 3
    if (this.dashTime > 0) {
    const dashOffsetX = this.facing === "right" ? -this.dashAnimator.width * 2 : this.dashAnimator.width * 2;
    const dashX = this.dashX + (this.width * 4) / 2 - this.dashAnimator.width * 1.5 + dashOffsetX;
    const dashY = this.dashY + (this.height * 4) / 2 - this.dashAnimator.height * 1.5;
    this.dashAnimator.drawFrame(this.game.clockTick, ctx, dashX, dashY, flip, 3);
}

    // Land puff — plays once on landing, not while running
    if (this.showLand) {
    const landOffsetY = 28;
    const landX = this.landX + (this.width * 4) / 2 - this.landAnimator.width * 2;
    const landY = this.landY + this.height * 4 - this.landAnimator.height * 2 - landOffsetY;
    this.landAnimator.drawFrame(this.game.clockTick, ctx, landX, landY, flip, 4);
}

    // Death explosion — plays once at captured death position
    if (this.showExplosion) {
      const deathX =
        this.explosionX + (this.width * 4) / 2 - this.deathAnimator.width * 2;
      const deathY =
        this.explosionY + (this.height * 4) / 2 - this.deathAnimator.height * 2;
      this.deathAnimator.drawFrame(
        this.game.clockTick,
        ctx,
        deathX,
        deathY,
        false,
        3.5,
      );
    }
  }
}
