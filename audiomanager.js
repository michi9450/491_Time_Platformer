class AudioManager {
  constructor() {
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    //gain
    this.masterGain = this.audioCtx.createGain();
    this.masterGain.connect(this.audioCtx.destination);

    // channels
    this.channels = {};

    //loaded buffers
    this.buffers = {};
    //currently playing music
    this.music = null;

    this.activeSources = new Set();

    //populate channels
    this.createChannel("sfx", 0.8);
    this.createChannel("music", 0.8);
    this.createChannel("ui", 0.8);
  }

  resume() {
    if (this.audioCtx.state === "suspended") this.audioCtx.resume();
  }

  createChannel(name, volume = 1) {
    const gain = this.audioCtx.createGain();
    gain.gain.value = volume;
    gain.connect(this.masterGain);
    this.channels[name] = { gain, muted: false, savedVolume: volume };
    return this;
  }
  setChannelVolume(name, volume) {
    const ch = this.getChannel(name);
    ch.savedVolume = volume;
    if (!ch.muted) ch.gain.gain.value = volume;
  }
  muteChannel(name) {
    const ch = this.getChannel(name);
    ch.muted = true;
    ch.gain.gain.value = 0;
  }
  unmuteChannel(name) {
    const ch = this.getChannel(name);
    ch.muted = false;
    ch.gain.gain.value = ch.savedVolume;
  }
  toggleMute(name) {
    const ch = this.getChannel(name);
    if (ch.muted) {
      this.unmuteChannel(name);
    } else {
      this.muteChannel(name);
    }
  }

  setMasterVolume(volume) {
    this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
  }
  getChannel(name) {
    if (!this.channels[name]) throw new Error(`Channel "${name}" not found`);
    return this.channels[name];
  }

  async load(key, url) {
    if (this.buffers[key]) return this.buffers[key];
    const res = await fetch(url);
    const arr = await res.arrayBuffer();
    const buf = await this.audioCtx.decodeAudioData(arr);
    this.buffers[key] = buf;
    return buf;
  }

  async loadAll(sounds) {
    return Promise.all(Object.entries(sounds).map(([k, v]) => this.load(k, v)));
  }

  /**
   * Play a one-shot sound effect.
   * @param {string} key
   * @param {object} opts
   *   channel    {string}  – channel name (default: "sfx")
   *   volume     {number}  – 0–1 (default: 1)
   *   pitch      {number}  – playback rate (default: 1)
   *   pitchVar   {number}  – ± random pitch variance (default: 0)
   *   volumeVar  {number}  – ± random volume variance (default: 0)
   *   pan        {number}  – stereo pan -1 to 1 (default: 0)
   *   loop       {boolean} – loop the sound (default: false)
   *   onEnd      {function}– callback when sound ends
   * @returns {{ stop, source }} control handle
   */
  play(key, opts = {}) {
    this.resume();
    const buf = this.buffers[key];
    if (!buf) {
      console.warn(`Sound "${key}" not loaded`);
      return null;
    }

    const {
      channel = "sfx",
      volume = 1,
      pitch = 1,
      pitchVar = 0,
      volumeVar = 0,
      pan = 0,
      loop = false,
      onEnd = null,
    } = opts;

    const source = this.audioCtx.createBufferSource();
    source.buffer = buf;
    source.loop = loop;
    source.playbackRate.value = pitch + (Math.random() * 2 - 1) * pitchVar;

    const gainNode = this.audioCtx.createGain();
    gainNode.gain.value = Math.max(
      0,
      volume + (Math.random() * 2 - 1) * volumeVar,
    );

    const panNode = this.audioCtx.createStereoPanner();
    panNode.pan.value = Math.max(-1, Math.min(1, pan));

    source.connect(gainNode);
    gainNode.connect(panNode);
    panNode.connect(this.getChannel(channel).gain);

    this.activeSources.add(source);
    source.onended = () => {
      this.activeSources.delete(source);
      if (onEnd) onEnd();
    };

    source.start();

    return {
      source,
      stop: (fadeOut = 0) => {
        if (fadeOut > 0) {
          gainNode.gain.setValueAtTime(
            gainNode.gain.value,
            this.audioCtx.currentTime,
          );
          gainNode.gain.linearRampToValueAtTime(
            0,
            this.audioCtx.currentTime + fadeOut,
          );
          setTimeout(() => {
            try {
              source.stop();
            } catch (_) {}
          }, fadeOut * 1000);
        } else {
          try {
            source.stop();
          } catch (_) {}
        }
      },
    };
  }
  /**
   * Play looping music, optionally crossfading from the current track.
   * @param {string} key
   * @param {object} opts
   *   fadeDuration {number} – crossfade time in seconds (default: 1)
   *   volume       {number} – 0–1 (default: 1)
   */
  playMusic(key, { fadeDuration = 1, volume = 1 } = {}) {
    this.resume();
    const buf = this.buffers[key];
    if (!buf) {
      console.warn(`Sound "${key}" not loaded`);
      return;
    }

    const now = this.audioCtx.currentTime;

    // Fade out current music
    if (this._music) {
      const old = this._music;
      old.gainNode.gain.setValueAtTime(old.gainNode.gain.value, now);
      old.gainNode.gain.linearRampToValueAtTime(0, now + fadeDuration);
      setTimeout(
        () => {
          try {
            old.source.stop();
          } catch (_) {}
        },
        fadeDuration * 1000 + 100,
      );
    }

    const source = this.audioCtx.createBufferSource();
    source.buffer = buf;
    source.loop = true;

    const gainNode = this.audioCtx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + fadeDuration);

    source.connect(gainNode);
    gainNode.connect(this.getChannel("music").gain);
    source.start();

    this._music = { source, gainNode };
  }

  stopMusic(fadeDuration = 1) {
    if (!this._music) return;
    const { source, gainNode } = this._music;
    const now = this.audioCtx.currentTime;
    gainNode.gain.setValueAtTime(gainNode.gain.value, now);
    gainNode.gain.linearRampToValueAtTime(0, now + fadeDuration);
    setTimeout(
      () => {
        try {
          source.stop();
        } catch (_) {}
      },
      fadeDuration * 1000 + 100,
    );
    this._music = null;
  }

  pauseAll() {
    this.audioCtx.suspend();
  }
  resumeAll() {
    this.audioCtx.resume();
  }

  stopAllSfx() {
    for (const src of this.activeSources) {
      try {
        src.stop();
      } catch (_) {}
    }
    this.activeSources.clear();
  }

  isLoaded(key) {
    return !!this.buffers[key];
  }

  unload(key) {
    delete this.buffers[key];
  }
}
