class HUDTimer {
    constructor(game, startingLevel = 1) {
        this.game = game;
        this.totalTime = 0;
        this.levelStartTime = 0;
        this.currentLevel = startingLevel;
        this.levelTimes = [];

        // Per-level flash (shown briefly when a level is completed)
        this.flashActive = false;
        this.flashTimer = 0;
        this.flashDuration = 2.5;
        this.flashLevelTime = 0;
        this.flashLevelNumber = 0;

        // Final screen (shown after the last level is completed)
        this.gameComplete = false;
        this.finalTime = 0;
    }

    update() {
        if (this.gameComplete) return;
        this.totalTime += this.game.clockTick;

        if (this.flashActive) {
            this.flashTimer -= this.game.clockTick;
            if (this.flashTimer <= 0) this.flashActive = false;
        }
    }

    // Called by SceneManager when the player hits a level transition.
    // Returns true if this was the last level (game complete).
    onLevelComplete(levelNumber) {
        if (this.gameComplete) return true; // Already done, ignore repeated calls
        const levelTime = this.totalTime - this.levelStartTime;
        this.levelTimes.push({ level: levelNumber, time: levelTime });

        this.flashLevelNumber = levelNumber;
        this.flashLevelTime = levelTime;
        this.flashActive = true;
        this.flashTimer = this.flashDuration;
        this.levelStartTime = this.totalTime;

        if (levelNumber >= 10) {
            this.gameComplete = true;
            this.finalTime = this.totalTime;
            return true;
        }
        return false;
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 100);
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
    }

    draw(ctx) {
        const canvasW = this.game.ctx.canvas.width;
        const canvasH = this.game.ctx.canvas.height;

        if (this.gameComplete) {
            this.drawFinalScreen(ctx, canvasW, canvasH);
        } else {
            this.drawRunningTimer(ctx, canvasW);
            if (this.flashActive) this.drawFlash(ctx, canvasW, canvasH);
        }
    }

    drawRunningTimer(ctx, canvasW) {
        const boxW = 190, boxH = 48;
        const x = canvasW - 90 - boxW;
        const y = 12;

        ctx.save();

        // Glow
        ctx.shadowColor = 'rgba(0, 217, 255, 0.45)';
        ctx.shadowBlur = 12;

        ctx.fillStyle = 'rgba(10, 10, 26, 0.80)';
        ctx.strokeStyle = '#00d9ff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(x, y, boxW, boxH, 6);
        ctx.fill();
        ctx.stroke();

        ctx.shadowBlur = 0;

        ctx.font = 'bold 10px monospace';
        ctx.fillStyle = '#7dd3e8';
        ctx.textAlign = 'left';
        ctx.fillText('TIME', x + 10, y + 15);

        ctx.textAlign = 'right';
        ctx.fillText(`LVL ${this.currentLevel}`, x + boxW - 10, y + 15);

        ctx.fillStyle = '#00d9ff';
        ctx.font = 'bold 22px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(this.formatTime(this.totalTime), x + boxW / 2, y + 38);

        ctx.restore();
    }

    drawFlash(ctx, canvasW, canvasH) {
        const t = this.flashTimer / this.flashDuration; // 1 → 0 as flash expires
        let alpha;
        if (t > 0.92)      alpha = (1 - t) / 0.08; // fade in
        else if (t < 0.18) alpha = t / 0.18;         // fade out
        else               alpha = 1;

        const boxW = 420, boxH = 96;
        const bx = (canvasW - boxW) / 2;
        const by = 80;

        ctx.save();
        ctx.globalAlpha = alpha;

        ctx.shadowColor = 'rgba(0, 217, 255, 0.6)';
        ctx.shadowBlur = 18;

        ctx.fillStyle = 'rgba(10, 10, 26, 0.92)';
        ctx.strokeStyle = '#00d9ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(bx, by, boxW, boxH, 8);
        ctx.fill();
        ctx.stroke();

        ctx.shadowBlur = 0;

        ctx.fillStyle = '#7dd3e8';
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`LEVEL ${this.flashLevelNumber} COMPLETE`, canvasW / 2, by + 28);

        ctx.fillStyle = '#00d9ff';
        ctx.font = 'bold 36px monospace';
        ctx.fillText(this.formatTime(this.flashLevelTime), canvasW / 2, by + 74);

        ctx.restore();
    }

    drawFinalScreen(ctx, canvasW, canvasH) {
        // Dim the game behind the panel
        ctx.fillStyle = 'rgba(10, 10, 26, 0.85)';
        ctx.fillRect(0, 0, canvasW, canvasH);

        const boxW = 520;
        const boxH = 220 + this.levelTimes.length * 24;
        const bx = (canvasW - boxW) / 2;
        const by = (canvasH - boxH) / 2;

        ctx.save();

        ctx.shadowColor = '#00d9ff';
        ctx.shadowBlur = 30;

        ctx.fillStyle = 'rgba(16, 20, 48, 0.98)';
        ctx.strokeStyle = '#00d9ff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(bx, by, boxW, boxH, 12);
        ctx.fill();
        ctx.stroke();

        ctx.shadowBlur = 0;

        // Title
        ctx.fillStyle = '#00d9ff';
        ctx.font = 'bold 34px monospace';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#00d9ff';
        ctx.shadowBlur = 16;
        ctx.fillText('YOU BEAT THE GAME!', canvasW / 2, by + 54);
        ctx.shadowBlur = 0;

        // Divider
        ctx.strokeStyle = 'rgba(0, 217, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(bx + 30, by + 70);
        ctx.lineTo(bx + boxW - 30, by + 70);
        ctx.stroke();

        // Final time label
        ctx.fillStyle = '#7dd3e8';
        ctx.font = 'bold 14px monospace';
        ctx.fillText('FINAL TIME', canvasW / 2, by + 100);

        // Final time value
        ctx.fillStyle = '#00d9ff';
        ctx.font = 'bold 52px monospace';
        ctx.shadowColor = '#00d9ff';
        ctx.shadowBlur = 14;
        ctx.fillText(this.formatTime(this.finalTime), canvasW / 2, by + 158);
        ctx.shadowBlur = 0;

        // Per-level breakdown divider
        ctx.strokeStyle = 'rgba(0, 217, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(bx + 30, by + 174);
        ctx.lineTo(bx + boxW - 30, by + 174);
        ctx.stroke();

        // Per-level times
        ctx.fillStyle = '#7dd3e8';
        ctx.font = '13px monospace';
        this.levelTimes.forEach((lt, i) => {
            ctx.fillText(`Level ${lt.level}   ${this.formatTime(lt.time)}`, canvasW / 2, by + 198 + i * 24);
        });

        ctx.restore();
    }
}
