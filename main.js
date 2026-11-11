/**
 * =====================================================================
 * 1. WEB AUDIO API SYNTHESIZER (Zero External Audio Dependencies)
 * =====================================================================
 */
class PastelAudioSynth {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.engineOsc = null;
    this.engineGain = null;
    this.engineFilter = null;
    this.isEngineRunning = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playUITap(freq = 580) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.45, now + 0.08);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  playLaserPew() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(920, now);
    osc.frequency.exponentialRampToValueAtTime(190, now + 0.16);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.17);
  }

  playCreditChime() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [880, 1174.66, 1567.98];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.045);
      gain.gain.setValueAtTime(0.14, now + idx * 0.045);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.045 + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.045);
      osc.stop(now + idx * 0.045 + 0.22);
    });
  }

  playShieldPowerup() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const chord = [523.25, 659.25, 783.99, 1046.5];
    chord.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);
      gain.gain.setValueAtTime(0.14, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.32);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.32);
    });
  }

  playShieldDeflect() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(640, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.28);

    gain.gain.setValueAtTime(0.24, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.29);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.29);
  }

  playVoxelExplosion(isBig = false) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const duration = isBig ? 0.55 : 0.32;

    const bufferSize = this.ctx.sampleRate * duration;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(isBig ? 320 : 580, now);
    filter.Q.setValueAtTime(1.2, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(isBig ? 0.35 : 0.22, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    whiteNoise.start(now);

    const notes = isBig ? [220, 165, 110] : [523.25, 659.25, 783.99];
    notes.forEach((nt, idx) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(nt, now + idx * 0.04);
      g.gain.setValueAtTime(0.08, now + idx * 0.04);
      g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.14);
      osc.connect(g);
      g.connect(this.ctx.destination);
      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.14);
    });
  }

  playWrapChime() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const chord = [440, 554.37, 659.25, 880];
    chord.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.035);
      gain.gain.setValueAtTime(0.09, now + i * 0.035);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.035 + 0.28);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.035);
      osc.stop(now + i * 0.035 + 0.28);
    });
  }

  startEngineSound(mode = 'car') {
    this.init();
    if (!this.ctx) return;
    this.stopEngineSound();

    const now = this.ctx.currentTime;
    this.engineOsc = this.ctx.createOscillator();
    this.engineFilter = this.ctx.createBiquadFilter();
    this.engineGain = this.ctx.createGain();

    if (mode === 'car') {
      this.engineOsc.type = 'sawtooth';
      this.engineOsc.frequency.setValueAtTime(65, now);
      this.engineFilter.type = 'lowpass';
      this.engineFilter.frequency.setValueAtTime(240, now);
    } else {
      this.engineOsc.type = 'triangle';
      this.engineOsc.frequency.setValueAtTime(52, now);
      this.engineFilter.type = 'lowpass';
      this.engineFilter.frequency.setValueAtTime(180, now);
    }

    this.engineGain.gain.setValueAtTime(this.muted ? 0.0001 : 0.045, now);

    this.engineOsc.connect(this.engineFilter);
    this.engineFilter.connect(this.engineGain);
    this.engineGain.connect(this.ctx.destination);

    this.engineOsc.start(now);
    this.isEngineRunning = true;
  }

  updateEnginePitch(normalizedSpeed, mode = 'car') {
    if (!this.isEngineRunning || !this.ctx || !this.engineOsc) return;
    const now = this.ctx.currentTime;
    if (this.muted) {
      this.engineGain.gain.setTargetAtTime(0.0001, now, 0.05);
      return;
    }
    const baseFreq = mode === 'car' ? 58 : 48;
    const targetFreq = baseFreq + normalizedSpeed * (mode === 'car' ? 75 : 45);
    this.engineOsc.frequency.setTargetAtTime(targetFreq, now, 0.08);
    this.engineFilter.frequency.setTargetAtTime(180 + normalizedSpeed * 320, now, 0.08);
    this.engineGain.gain.setTargetAtTime(0.035 + normalizedSpeed * 0.03, now, 0.08);
  }

  stopEngineSound() {
    if (this.engineOsc) {
      try {
        this.engineOsc.stop();
        this.engineOsc.disconnect();
      } catch (e) {}
      this.engineOsc = null;
    }
    this.isEngineRunning = false;
  }

  toggleMute() {
    this.muted = !this.muted;
    if (!this.muted) {
      this.playUITap(660);
    } else if (this.engineGain && this.ctx) {
      this.engineGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.04);
    }
    return this.muted;
  }
}

/**
 * =====================================================================
 * 2. GEOTYPE DEFINITIONS, VEHICLE SPECS & PASTEL PALETTES
 * =====================================================================
 */
const GEOTYPES = {
  meadow: {
    name: 'Pastel Meadow',
    skyTop: '#ffdde1',
    skyBottom: '#fff0f3',
    fogColor: 0xffeef2,
    groundColor: 0x2d5a4c,
    riverWaterColor: 0x0284c7,
    riverShallowColor: 0x38bdf8,
    riverBankColor: 0xd6ccc2,
    roadColor: 0x3b4252,
    roadShoulderColor: 0x1e293b,
    roadLineColor: 0xfacc15,
    mountainColors: [0xd8bbff, 0xffc2d1, 0xa8dadc],
    propTypes: ['sakura', 'pine', 'bush'],
    ambientColor: 0xffffff,
    sunColor: 0xfff8f0,
    weatherType: 'petals',
    night: {
      skyTop: '#090d1e',
      skyBottom: '#1e1b4b',
      fogColor: 0x131633,
      groundColor: 0x142e28,
      riverWaterColor: 0x0369a1,
      riverShallowColor: 0x0284c7,
      riverBankColor: 0x334155,
      mountainColors: [0x312e81, 0x4c1d95, 0x1e3a8a],
      ambientColor: 0x94a3b8,
      sunColor: 0xc7d2fe
    }
  },
  snow: {
    name: 'Snow Wonderland',
    skyTop: '#d8ecff',
    skyBottom: '#eef7ff',
    fogColor: 0xeaf4ff,
    groundColor: 0x5c768d,
    riverWaterColor: 0x0284c7,
    riverShallowColor: 0x38bdf8,
    riverBankColor: 0x94a3b8,
    roadColor: 0x334155,
    roadShoulderColor: 0x0f172a,
    roadLineColor: 0x38bdf8,
    mountainColors: [0xbde0fe, 0xa2d2ff, 0xd8e2dc],
    propTypes: ['snowPine', 'snowman', 'crystal'],
    ambientColor: 0xffffff,
    sunColor: 0xffffff,
    weatherType: 'snow',
    night: {
      skyTop: '#050b14',
      skyBottom: '#0f2942',
      fogColor: 0x0c1f36,
      groundColor: 0x1b2a3d,
      riverWaterColor: 0x0369a1,
      riverShallowColor: 0x0284c7,
      riverBankColor: 0x334155,
      mountainColors: [0x1e3a8a, 0x0284c7, 0x334155],
      ambientColor: 0x94a3b8,
      sunColor: 0xbae6fd
    }
  },
  underwater: {
    name: 'Underwater Reef',
    skyTop: '#48bfe3',
    skyBottom: '#a9def9',
    fogColor: 0x72efdd,
    groundColor: 0x1f4e5f,
    riverWaterColor: 0x0077b6,
    riverShallowColor: 0x00b4d8,
    riverBankColor: 0x52796f,
    roadColor: 0x374151,
    roadShoulderColor: 0x111827,
    roadLineColor: 0xfde047,
    mountainColors: [0x72efdd, 0x64dfdf, 0xbde0fe],
    propTypes: ['coral', 'kelp', 'seaArch'],
    ambientColor: 0xffffff,
    sunColor: 0xf0fdf4,
    weatherType: 'bubbles',
    night: {
      skyTop: '#021019',
      skyBottom: '#063445',
      fogColor: 0x052938,
      groundColor: 0x0b2430,
      riverWaterColor: 0x0369a1,
      riverShallowColor: 0x0d9488,
      riverBankColor: 0x1e293b,
      mountainColors: [0x0f766e, 0x0369a1, 0x1d4ed8],
      ambientColor: 0x94a3b8,
      sunColor: 0x99f6e4
    }
  },
  canyon: {
    name: 'Sunset Canyon',
    skyTop: '#ffafcc',
    skyBottom: '#ffddd2',
    fogColor: 0xffd6c9,
    groundColor: 0x7c4d3a,
    riverWaterColor: 0x0284c7,
    riverShallowColor: 0x38bdf8,
    riverBankColor: 0xc9ada7,
    roadColor: 0x3f3f46,
    roadShoulderColor: 0x18181b,
    roadLineColor: 0xfef08a,
    mountainColors: [0xff9ebb, 0xe5989b, 0xcdb4db],
    propTypes: ['mesa', 'cactus', 'arch'],
    ambientColor: 0xffffff,
    sunColor: 0xfff3e0,
    weatherType: 'dust',
    night: {
      skyTop: '#14091c',
      skyBottom: '#31102f',
      fogColor: 0x220c24,
      groundColor: 0x2a1815,
      riverWaterColor: 0x1d4ed8,
      riverShallowColor: 0x3b82f6,
      riverBankColor: 0x4c1d95,
      mountainColors: [0x581c87, 0x701a75, 0x4c1d95],
      ambientColor: 0xcbd5e1,
      sunColor: 0xfbcfe8
    }
  }
};

const PLAYER_BODY_TYPES = {
  coupe: {
    name: 'Sports Coupe',
    classBadge: 'Twin-Turbo Aero GT',
    desc: 'Low-slung aerodynamic grand tourer with high-downforce rear wing and twin plasma blaster ports.',
    speed: '250 KM/H',
    handling: '9.6 / 10',
    power: 'V8 Hybrid'
  },
  muscle: {
    name: 'Muscle GT',
    classBadge: 'Supercharged Brawler',
    desc: 'Heavy-duty street machine featuring an exposed supercharger hood scoop and dual racing stripes.',
    speed: '262 KM/H',
    handling: '8.8 / 10',
    power: '750 HP V8'
  },
  suv: {
    name: 'Cyber SUV',
    classBadge: 'Armored Off-Road 4x4',
    desc: 'High-clearance tactical cruiser equipped with wide fender flares, roof LED lightbar, and rear spare tire.',
    speed: '235 KM/H',
    handling: '9.1 / 10',
    power: 'Quad-Motor'
  },
  formula: {
    name: 'Formula Apex',
    classBadge: 'Open-Wheel Hypercar',
    desc: 'Featherweight single-seater carbon monocoque engineered for maximum cornering G-force and velocity.',
    speed: '285 KM/H',
    handling: '10 / 10',
    power: '1000 HP ERS'
  }
};

const SKY_CRAFT_TYPES = {
  balloon: {
    name: 'Hot Air Balloon',
    classBadge: 'Thermal Sky Cruiser',
    desc: 'Multi-band pastel silk envelope suspended above a hand-woven wicker gondola with dual plasma burners.',
    speed: '65 KTS',
    handling: '8.7 / 10',
    power: 'Twin Burner'
  },
  blimp: {
    name: 'Aero Blimp',
    classBadge: 'Helium Dirigible Airship',
    desc: 'Streamlined pastel airship with pressurized observation gondola, cruciform tail fins, and dual vector props.',
    speed: '82 KTS',
    handling: '9.2 / 10',
    power: 'Dual Vector'
  },
  aircraft: {
    name: 'Mini Aircraft',
    classBadge: 'Valley Sport Plane',
    desc: 'Nimble aerobatic monoplane with high-RPM spinning nose propeller, bubble canopy, and wingtip tanks.',
    speed: '118 KTS',
    handling: '9.8 / 10',
    power: 'Turbo-Prop'
  },
  paperplane: {
    name: 'Paper Plane',
    classBadge: 'Origami Delta Glider',
    desc: 'Precision-folded geometric delta wing that rides valley thermals with whisper-quiet agility.',
    speed: '105 KTS',
    handling: '9.9 / 10',
    power: 'Aero Glide'
  }
};

const PASTEL_PALETTE = [
  { key: 'sakura',      name: 'Sakura Rose',       hex: 0xff7597, css: '#ff7597', family: 'pink' },
  { key: 'babyblue',    name: 'Baby Sky Blue',     hex: 0x60a5fa, css: '#60a5fa', family: 'blue' },
  { key: 'mint',        name: 'Mint Seafoam',      hex: 0x34d399, css: '#34d399', family: 'mint' },
  { key: 'lavender',    name: 'Soft Lavender',     hex: 0xa78bfa, css: '#a78bfa', family: 'purple' },
  { key: 'butter',      name: 'Buttercup Gold',    hex: 0xfbbf24, css: '#fbbf24', family: 'yellow' },
  { key: 'peach',       name: 'Peach Coral',       hex: 0xfb7185, css: '#fb7185', family: 'peach' },
  { key: 'pistachio',   name: 'Pistachio Sage',    hex: 0x84cc16, css: '#84cc16', family: 'green' },
  { key: 'periwinkle',  name: 'Lagoon Aqua',       hex: 0x22d3ee, css: '#22d3ee', family: 'blue' },
  { key: 'cloudwhite',  name: 'Pearl Ivory',       hex: 0xe2e8f0, css: '#e2e8f0', family: 'white' }
];

const TRAFFIC_COLOR_POOL = [
  { key: 'slate',     hex: 0x334155, family: 'dark' },
  { key: 'crimson',   hex: 0xe11d48, family: 'red' },
  { key: 'indigo',    hex: 0x4338ca, family: 'indigo' },
  { key: 'emerald',   hex: 0x059669, family: 'emerald' },
  { key: 'amber',     hex: 0xd97706, family: 'amber' },
  { key: 'teal',      hex: 0x0d9488, family: 'teal' }
];

const TRAFFIC_CLASSES = ['semiTruck', 'cityBus', 'motorcycle', 'pickup', 'hatchback'];

const CAMERA_VIEWS = [
  { id: 'chase',   name: 'Chase Cam' },
  { id: 'hood',    name: 'Hood / Cockpit Cam' },
  { id: 'top',     name: 'Top-Down Cam' },
  { id: 'action',  name: 'Action Wide Cam' }
];

/**
 * =====================================================================
 * 3. MAIN 3D VELOZAAR APPLICATION
 * =====================================================================
 */
class TrafficRGame {
  constructor() {
    this.audio = new PastelAudioSynth();

    this.state = 'DEVICE_SELECT';
    this.deviceType = 'keyboard';
    this.uiTheme = 'light';
    this.graphicsQuality = 'hd';
    this.gameMode = 'car';
    this.currentGeotype = 'meadow';
    this.skyTimeMode = 'day';
    this.randomizeOnRespawn = true;

    this.playerBodyType = 'coupe';
    this.skyCraftType = 'balloon';
    this.selectedPastelKeys = ['sakura', 'babyblue', 'lavender'];

    this.cameraViewIndex = 0;

    this.WORLD_WRAP_LIMIT = 23.0;
    this.playerX = 0;
    this.playerVX = 0;
    this.baseSpeed = 46;
    this.minSpeed = 24;
    this.maxSpeed = 96;
    this.currentSpeed = 46;

    this.score = 0;
    this.survivalTime = 0;
    this.blasts = 0;
    this.credits = 0;
    this.totalCredits = 0;
    this.shields = 0;
    this.maxShields = 3;
    this.highScore = 0;
    this.bestTime = 0;
    this.lastSavedScore = 0;
    this.lastSavedTime = 0;
    this.savedSession = null;

    this.lastShotTime = 0;
    this.shotCooldown = 0.22;

    this.keys = { left: false, right: false, up: false, down: false, space: false };

    this.obstacles = [];
    this.collectibles = [];
    this.terrainProps = [];
    this.valleyMountains = [];
    this.roadStripes = [];
    this.riverSegments = [];
    this.clouds = [];
    this.projectiles = [];
    this.voxelParticles = [];
    this.spinningPropellers = [];
    this.previewPropellers = [];
    this.weatherParticles = null;
    this.starField = null;
    this.celestialBody = null;
    this.playerShieldMesh = null;

    this.sharedVoxelGeo = new THREE.BoxGeometry(0.48, 0.48, 0.48);
    this.sharedOrbGeo = new THREE.OctahedronGeometry(0.85, 0);
    this.sharedOrbRingGeo = new THREE.TorusGeometry(1.15, 0.08, 8, 20);
    this.sharedShieldCoreGeo = new THREE.IcosahedronGeometry(0.78, 0);
    this.sharedShieldShellGeo = new THREE.OctahedronGeometry(1.18, 1);

    this.previewYaw = 0.65;
    this.previewPitch = 0.25;
    this.previewAutoSpin = true;
    this.isDraggingPreview = false;
    this.dragStartX = 0;
    this.dragStartY = 0;

    this.countdownRemaining = 0;
    this.countdownLastInt = 0;
    this.countdownRimAngle = 0;
    this.smoothedDt = 1 / 60;

    this.hiddenUIs = {
      keyboard: { brand: false, controls: false, telemetryLeft: false, telemetryRight: false, pcHint: false },
      touch: { brand: false, controls: false, telemetryLeft: false, telemetryRight: false }
    };

    this.clock = new THREE.Clock();

    this.loadSavedRecords();

    this.initThreeScene();
    this.initPreviewScene();
    this.buildWorldGeometry();
    this.buildPlayerModels();
    this.renderPastelColorGrid();
    this.applyGraphicsQualitySettings(false);
    this.applyGeotype('meadow', false);
    this.updateRecordDisplays();
    this.updateStudioUI();
    this.bindEvents();
    this.animate();
  }

  loadSavedRecords() {
    try {
      const savedScore = localStorage.getItem('velozaar_high_score');
      const savedTime = localStorage.getItem('velozaar_best_time');
      const lastScore = localStorage.getItem('velozaar_last_saved_score');
      const lastTime = localStorage.getItem('velozaar_last_saved_time');
      const savedCredits = localStorage.getItem('velozaar_total_credits');
      const savedGfx = localStorage.getItem('velozaar_gfx_quality');
      const savedRunJson = localStorage.getItem('velozaar_saved_session');

      if (savedScore) this.highScore = parseInt(savedScore, 10) || 0;
      if (savedTime) this.bestTime = parseFloat(savedTime) || 0;
      if (lastScore) this.lastSavedScore = parseInt(lastScore, 10) || 0;
      if (lastTime) this.lastSavedTime = parseFloat(lastTime) || 0;
      if (savedCredits) this.totalCredits = parseInt(savedCredits, 10) || 0;

      if (savedGfx === 'ld' || savedGfx === 'hd') {
        this.graphicsQuality = savedGfx;
      } else if (navigator.deviceMemory && navigator.deviceMemory <= 2) {
        this.graphicsQuality = 'ld';
      }

      if (savedRunJson) {
        this.savedSession = JSON.parse(savedRunJson);
      }
    } catch (e) {}
  }

  saveRecords() {
    try {
      localStorage.setItem('velozaar_high_score', String(this.highScore));
      localStorage.setItem('velozaar_best_time', String(this.bestTime.toFixed(1)));
      localStorage.setItem('velozaar_last_saved_score', String(this.lastSavedScore));
      localStorage.setItem('velozaar_last_saved_time', String(this.lastSavedTime.toFixed(1)));
      localStorage.setItem('velozaar_total_credits', String(this.totalCredits));
      localStorage.setItem('velozaar_gfx_quality', this.graphicsQuality);
    } catch (e) {}
  }

  saveCurrentGameplayProgress(keepResumableSession = true) {
    const currentScoreInt = Math.floor(this.score);
    const currentSurvTime = Number(this.survivalTime.toFixed(1));

    if (currentScoreInt > 0 || currentSurvTime > 0) {
      this.lastSavedScore = currentScoreInt;
      this.lastSavedTime = currentSurvTime;
    }

    if (currentScoreInt > this.highScore) {
      this.highScore = currentScoreInt;
    }
    if (currentSurvTime > this.bestTime) {
      this.bestTime = currentSurvTime;
    }
    this.saveRecords();

    if (keepResumableSession && (currentScoreInt > 0 || currentSurvTime >= 0.1)) {
      this.savedSession = {
        score: this.score,
        survivalTime: this.survivalTime,
        blasts: this.blasts,
        credits: this.credits,
        shields: this.shields,
        gameMode: this.gameMode,
        currentGeotype: this.currentGeotype,
        skyTimeMode: this.skyTimeMode,
        playerBodyType: this.playerBodyType,
        skyCraftType: this.skyCraftType,
        selectedPastelKeys: [...this.selectedPastelKeys],
        cameraViewIndex: this.cameraViewIndex,
        currentSpeed: this.currentSpeed,
        playerX: this.playerX,
        savedAt: Date.now()
      };
      try {
        localStorage.setItem('velozaar_saved_session', JSON.stringify(this.savedSession));
      } catch (e) {}
    }

    this.updateRecordDisplays();
  }

  clearSavedSession() {
    this.audio.playUITap(520);
    this.savedSession = null;
    try {
      localStorage.removeItem('velozaar_saved_session');
    } catch (e) {}
    this.updateRecordDisplays();
  }

  resumeSavedSession() {
    if (!this.savedSession) return;
    this.audio.playUITap(720);

    const s = this.savedSession;
    this.gameMode = s.gameMode || 'car';
    if (s.playerBodyType && PLAYER_BODY_TYPES[s.playerBodyType]) {
      this.playerBodyType = s.playerBodyType;
    }
    if (s.skyCraftType && SKY_CRAFT_TYPES[s.skyCraftType]) {
      this.skyCraftType = s.skyCraftType;
    }
    if (Array.isArray(s.selectedPastelKeys) && s.selectedPastelKeys.length > 0) {
      this.selectedPastelKeys = [...s.selectedPastelKeys];
    }
    if (typeof s.cameraViewIndex === 'number') {
      this.cameraViewIndex = s.cameraViewIndex;
    }
    if (s.skyTimeMode) {
      this.skyTimeMode = s.skyTimeMode;
    }
    if (s.currentGeotype && GEOTYPES[s.currentGeotype]) {
      this.applyGeotype(s.currentGeotype, false);
    }

    const isCar = this.gameMode === 'car';
    this.highwayGroup.visible = isCar;
    this.riverValleyGroup.visible = !isCar;
    this.carModel.visible = isCar;
    this.balloonModel.visible = !isCar;

    this.score = Number(s.score) || 0;
    this.survivalTime = Number(s.survivalTime) || 0;
    this.blasts = Number(s.blasts) || 0;
    this.credits = Number(s.credits) || 0;
    this.shields = Number(s.shields) || 0;
    this.currentSpeed = Number(s.currentSpeed) || this.baseSpeed;
    this.playerX = Number(s.playerX) || 0;
    this.playerVX = 0;

    this.renderPastelColorGrid();
    this.rebuildAllPlayerMeshes();
    this.updateStudioUI();
    this.resetObstacles();
    this.resetCollectibles();
    this.updateShieldVisuals();

    document.getElementById('hud-score').textContent = Math.floor(this.score);
    document.getElementById('hud-time').textContent = this.formatTime(this.survivalTime);
    document.getElementById('hud-blasts').textContent = `${this.blasts} 💥`;
    const credEl = document.getElementById('hud-credits');
    if (credEl) credEl.textContent = `${this.credits} 💎`;

    const modeIcon = document.getElementById('hud-mode-icon');
    const speedUnit = document.getElementById('hud-speed-unit');
    if (isCar) {
      modeIcon.className = 'fa-solid fa-car-side hud-mini-icon text-pink-400';
      speedUnit.textContent = 'SPEED (KM/H)';
    } else {
      modeIcon.className = 'fa-solid fa-cloud-sun hud-mini-icon text-sky-400';
      speedUnit.textContent = 'AIRSPEED (KTS)';
    }

    document.getElementById('screen-device').classList.add('hidden');
    document.getElementById('screen-mode').classList.add('hidden');
    document.getElementById('screen-garage').classList.add('hidden');
    document.getElementById('screen-gameover').classList.add('hidden');
    document.getElementById('gameplay-hud').classList.remove('hidden');
    document.getElementById('hud-menu-btn').classList.remove('hidden');
    document.getElementById('hud-menu-btn').classList.add('flex');
    document.getElementById('hud-pause-btn').classList.remove('hidden');
    document.getElementById('hud-pause-btn').classList.add('flex');

    this.state = 'PAUSED';
    this.resumeGameWithCountdown();
  }

  formatTime(seconds) {
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(1).padStart(4, '0');
    return `${mins}:${secs}`;
  }

  updateRecordDisplays() {
    const bestTimeStr = this.formatTime(this.bestTime);
    const hsEl = document.getElementById('hud-high-score');
    const btEl = document.getElementById('hud-best-time');
    const mScoreEl = document.getElementById('menu-best-score');
    const mTimeEl = document.getElementById('menu-best-time');
    const mCredEl = document.getElementById('menu-total-credits');
    const sCredEl = document.getElementById('studio-total-credits');
    const fTotalCredEl = document.getElementById('final-total-credits');

    if (hsEl) hsEl.textContent = this.highScore;
    if (btEl) btEl.textContent = bestTimeStr;
    if (mScoreEl) mScoreEl.textContent = this.highScore;
    if (mTimeEl) mTimeEl.textContent = bestTimeStr;
    if (mCredEl) mCredEl.textContent = this.totalCredits;
    if (sCredEl) sCredEl.textContent = this.totalCredits;
    if (fTotalCredEl) fTotalCredEl.textContent = `${this.totalCredits} 💎`;

    const modeBanner = document.getElementById('saved-session-banner-mode');
    const garageBanner = document.getElementById('saved-session-banner-garage');
    if (this.savedSession && (this.savedSession.score >= 1 || this.savedSession.survivalTime >= 0.5)) {
      const sScore = Math.floor(this.savedSession.score);
      const sTime = this.formatTime(this.savedSession.survivalTime);
      const sBlasts = `${this.savedSession.blasts || 0} 💥`;
      const sCredits = `${this.savedSession.credits || 0} 💎`;
      const isCar = this.savedSession.gameMode === 'car';

      if (modeBanner) {
        modeBanner.classList.remove('hidden');
        const tagEl = document.getElementById('saved-session-mode-tag');
        if (tagEl) {
          tagEl.textContent = isCar ? 'The Endless Highway' : 'Beyond the Fearless Sky';
          tagEl.className = isCar
            ? 'px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-pink-500/15 text-pink-500'
            : 'px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-sky-500/15 text-sky-400';
        }
        const scEl = document.getElementById('saved-session-score');
        const tmEl = document.getElementById('saved-session-time');
        const blEl = document.getElementById('saved-session-blasts');
        const crEl = document.getElementById('saved-session-credits');
        if (scEl) scEl.textContent = sScore;
        if (tmEl) tmEl.textContent = sTime;
        if (blEl) blEl.textContent = sBlasts;
        if (crEl) crEl.textContent = sCredits;
      }

      if (garageBanner) {
        garageBanner.classList.remove('hidden');
        const gScEl = document.getElementById('garage-saved-score');
        const gTmEl = document.getElementById('garage-saved-time');
        const gBlEl = document.getElementById('garage-saved-blasts');
        const gCrEl = document.getElementById('garage-saved-credits');
        if (gScEl) gScEl.textContent = sScore;
        if (gTmEl) gTmEl.textContent = sTime;
        if (gBlEl) gBlEl.textContent = sBlasts;
        if (gCrEl) gCrEl.textContent = sCredits;
      }
    } else {
      if (modeBanner) modeBanner.classList.add('hidden');
      if (garageBanner) garageBanner.classList.add('hidden');
    }
  }

  setGraphicsQuality(mode) {
    if (mode !== 'hd' && mode !== 'ld') return;
    this.audio.playUITap(640);
    this.graphicsQuality = mode;
    this.saveRecords();
    this.applyGraphicsQualitySettings(true);
  }

  toggleGraphicsQuality() {
    this.setGraphicsQuality(this.graphicsQuality === 'hd' ? 'ld' : 'hd');
  }

  applyGraphicsQualitySettings(notify = false) {
    const isLD = this.graphicsQuality === 'ld';
    document.body.classList.toggle('low-def-mode', isLD);

    if (this.renderer) {
      const targetPixelRatio = isLD ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      this.renderer.setPixelRatio(targetPixelRatio);
      this.renderer.shadowMap.enabled = !isLD;
      if (this.dirLight) {
        this.dirLight.castShadow = !isLD;
      }
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    if (this.previewRenderer) {
      this.previewRenderer.setPixelRatio(isLD ? 1 : Math.min(window.devicePixelRatio || 1, 2));
      this.resizePreviewRenderer();
    }

    if (this.weatherParticles) {
      this.weatherParticles.visible = !isLD;
    }

    const initHd = document.getElementById('init-gfx-hd');
    const initLd = document.getElementById('init-gfx-ld');
    if (initHd) initHd.classList.toggle('active-selection-ring', !isLD);
    if (initLd) initLd.classList.toggle('active-selection-ring', isLD);

    const pauseHd = document.getElementById('pause-gfx-hd');
    const pauseLd = document.getElementById('pause-gfx-ld');
    if (pauseHd) pauseHd.classList.toggle('active-selection-ring', !isLD);
    if (pauseLd) pauseLd.classList.toggle('active-selection-ring', isLD);

    const hudGfxIcon = document.getElementById('hud-gfx-icon');
    const hudGfxLabel = document.getElementById('hud-gfx-label');
    if (hudGfxIcon) {
      hudGfxIcon.className = isLD ? 'fa-solid fa-bolt text-amber-400' : 'fa-solid fa-microchip text-emerald-400';
    }
    if (hudGfxLabel) {
      hudGfxLabel.textContent = isLD ? 'LD 2GB' : 'HD';
    }

    if (this.mountainGroup && this.terrainProps.length > 0) {
      this.randomizeTerrainProps();
    }

    if (notify) {
      this.showToast(isLD ? 'LOW DEF (2GB RAM ULTRA-SMOOTH MODE) ACTIVATED ⚡' : 'HIGH DEF MODE ACTIVATED ✨');
    }
  }

  initThreeScene() {
    this.canvas = document.getElementById('game-canvas');
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0xffeef2, 0.0034);

    this.camera = new THREE.PerspectiveCamera(54, window.innerWidth / window.innerHeight, 0.5, 650);

    const isLD = this.graphicsQuality === 'ld';
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: !isLD,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(isLD ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = !isLD;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setClearColor(0x000000, 0);

    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0xffcad4, 0.92);
    this.hemiLight.position.set(0, 80, 0);
    this.scene.add(this.hemiLight);

    this.dirLight = new THREE.DirectionalLight(0xfff8f0, 0.85);
    this.dirLight.position.set(45, 95, 55);
    this.dirLight.castShadow = !isLD;
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    this.dirLight.shadow.camera.near = 10;
    this.dirLight.shadow.camera.far = 260;
    const d = 65;
    this.dirLight.shadow.camera.left = -d;
    this.dirLight.shadow.camera.right = d;
    this.dirLight.shadow.camera.top = d;
    this.dirLight.shadow.camera.bottom = -d;
    this.dirLight.shadow.bias = -0.0005;
    this.scene.add(this.dirLight);
  }

  initPreviewScene() {
    const previewCanvas = document.getElementById('preview-canvas');
    if (!previewCanvas) return;

    this.previewScene = new THREE.Scene();
    this.previewCamera = new THREE.PerspectiveCamera(42, 1.5, 0.1, 100);

    const isLD = this.graphicsQuality === 'ld';
    this.previewRenderer = new THREE.WebGLRenderer({
      canvas: previewCanvas,
      antialias: !isLD,
      alpha: true
    });
    this.previewRenderer.setPixelRatio(isLD ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    this.previewRenderer.setClearColor(0x000000, 0);

    const amb = new THREE.HemisphereLight(0xffffff, 0x94a3b8, 0.95);
    this.previewScene.add(amb);

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.78);
    keyLight.position.set(6, 10, 8);
    this.previewScene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.35);
    rimLight.position.set(-6, 4, -6);
    this.previewScene.add(rimLight);

    this.previewStageGroup = new THREE.Group();
    this.previewScene.add(this.previewStageGroup);

    const discGeo = new THREE.CylinderGeometry(2.75, 2.95, 0.18, 36);
    const discMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.position.y = -1.15;
    this.previewStageGroup.add(disc);

    const ringGeo = new THREE.RingGeometry(2.55, 2.72, 36);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xf472b6, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = -1.05;
    this.previewStageGroup.add(ring);

    this.previewVehicleHolder = new THREE.Group();
    this.previewStageGroup.add(this.previewVehicleHolder);

    this.resizePreviewRenderer();
  }

  resizePreviewRenderer() {
    const container = document.getElementById('preview-canvas-container');
    if (!container || !this.previewRenderer || !this.previewCamera) return;
    const w = Math.max(200, container.clientWidth);
    const h = Math.max(150, container.clientHeight);
    this.previewCamera.aspect = w / h;
    this.previewCamera.updateProjectionMatrix();
    this.previewRenderer.setSize(w, h, false);
  }

  getSelectedPastelHexes() {
    if (!this.selectedPastelKeys || this.selectedPastelKeys.length === 0) {
      return [0xff7597];
    }
    return this.selectedPastelKeys.map(k => {
      const found = PASTEL_PALETTE.find(p => p.key === k);
      return found ? found.hex : 0xff7597;
    });
  }

  createPastelVehicleMaterial(colorHex, flatShading = false, doubleSided = false) {
    return new THREE.MeshPhongMaterial({
      color: colorHex,
      specular: 0x222222,
      shininess: 22,
      flatShading,
      side: doubleSided ? THREE.DoubleSide : THREE.FrontSide
    });
  }

  buildWorldGeometry() {
    const groundGeo = new THREE.PlaneGeometry(1200, 1200);
    this.groundMat = new THREE.MeshLambertMaterial({ color: 0x2d5a4c });
    this.groundMesh = new THREE.Mesh(groundGeo, this.groundMat);
    this.groundMesh.rotation.x = -Math.PI / 2;
    this.groundMesh.receiveShadow = true;
    this.scene.add(this.groundMesh);

    this.highwayGroup = new THREE.Group();
    this.scene.add(this.highwayGroup);

    const shoulderGeo = new THREE.PlaneGeometry(this.WORLD_WRAP_LIMIT * 2 + 3.2, 1000);
    this.shoulderMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
    this.shoulderMesh = new THREE.Mesh(shoulderGeo, this.shoulderMat);
    this.shoulderMesh.rotation.x = -Math.PI / 2;
    this.shoulderMesh.position.y = 0.05;
    this.shoulderMesh.receiveShadow = true;
    this.highwayGroup.add(this.shoulderMesh);

    const roadGeo = new THREE.PlaneGeometry(this.WORLD_WRAP_LIMIT * 2, 1000);
    this.roadMat = new THREE.MeshLambertMaterial({ color: 0x3b4252 });
    this.roadMesh = new THREE.Mesh(roadGeo, this.roadMat);
    this.roadMesh.rotation.x = -Math.PI / 2;
    this.roadMesh.position.y = 0.09;
    this.roadMesh.receiveShadow = true;
    this.highwayGroup.add(this.roadMesh);

    const edgeLineGeo = new THREE.PlaneGeometry(0.45, 1000);
    const edgeLineMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
    this.leftEdgeLine = new THREE.Mesh(edgeLineGeo, edgeLineMat);
    this.leftEdgeLine.rotation.x = -Math.PI / 2;
    this.leftEdgeLine.position.set(-this.WORLD_WRAP_LIMIT + 0.9, 0.12, -200);

    this.rightEdgeLine = new THREE.Mesh(edgeLineGeo, edgeLineMat);
    this.rightEdgeLine.rotation.x = -Math.PI / 2;
    this.rightEdgeLine.position.set(this.WORLD_WRAP_LIMIT - 0.9, 0.12, -200);
    this.highwayGroup.add(this.leftEdgeLine, this.rightEdgeLine);

    const railGeo = new THREE.BoxGeometry(0.65, 0.42, 1000);
    this.railMat = new THREE.MeshLambertMaterial({ color: 0xfacc15 });
    this.leftRail = new THREE.Mesh(railGeo, this.railMat);
    this.leftRail.position.set(-this.WORLD_WRAP_LIMIT - 0.4, 0.24, -200);
    this.rightRail = new THREE.Mesh(railGeo, this.railMat);
    this.rightRail.position.set(this.WORLD_WRAP_LIMIT + 0.4, 0.24, -200);
    this.highwayGroup.add(this.leftRail, this.rightRail);

    const stripeGeo = new THREE.PlaneGeometry(0.5, 6.8);
    this.stripeMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const laneXPositions = [-11.5, 0, 11.5];
    for (let z = 25; z > -320; z -= 16) {
      laneXPositions.forEach(lx => {
        const stripe = new THREE.Mesh(stripeGeo, this.stripeMat);
        stripe.rotation.x = -Math.PI / 2;
        stripe.position.set(lx, 0.13, z);
        this.highwayGroup.add(stripe);
        this.roadStripes.push(stripe);
      });
    }

    this.riverValleyGroup = new THREE.Group();
    this.riverValleyGroup.visible = false;
    this.scene.add(this.riverValleyGroup);

    this.riverBankMat = new THREE.MeshLambertMaterial({ color: 0xd6ccc2 });
    this.riverShallowMat = new THREE.MeshLambertMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.82 });
    this.riverWaterMat = new THREE.MeshPhongMaterial({
      color: 0x0284c7,
      specular: 0xbae6fd,
      shininess: 65,
      transparent: true,
      opacity: 0.9
    });

    const bankBed = new THREE.Mesh(new THREE.PlaneGeometry(34, 1000), this.riverBankMat);
    bankBed.rotation.x = -Math.PI / 2;
    bankBed.position.y = 0.04;
    const shallowBed = new THREE.Mesh(new THREE.PlaneGeometry(26, 1000), this.riverShallowMat);
    shallowBed.rotation.x = -Math.PI / 2;
    shallowBed.position.y = 0.08;
    const deepChannel = new THREE.Mesh(new THREE.PlaneGeometry(19, 1000), this.riverWaterMat);
    deepChannel.rotation.x = -Math.PI / 2;
    deepChannel.position.y = 0.12;
    this.riverValleyGroup.add(bankBed, shallowBed, deepChannel);

    const foamMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.65 });
    const rockMat = new THREE.MeshLambertMaterial({ color: 0x64748b, flatShading: true });
    for (let z = 30; z > -340; z -= 17) {
      const seg = new THREE.Group();
      seg.position.set(0, 0, z);

      for (let r = 0; r < 3; r++) {
        const ripple = new THREE.Mesh(new THREE.PlaneGeometry(0.35 + (r % 2) * 0.25, 4.5 + r * 1.4), foamMat);
        ripple.rotation.x = -Math.PI / 2;
        ripple.position.set((r - 1) * 5.2 + Math.sin(z + r) * 1.8, 0.15, (r - 1) * 2.1);
        seg.add(ripple);
      }

      [-1, 1].forEach(side => {
        const boulder = new THREE.Mesh(new THREE.DodecahedronGeometry(1.1 + Math.random() * 0.9, 0), rockMat);
        boulder.position.set(side * (12.5 + Math.random() * 4.5), 0.45, (Math.random() - 0.5) * 6);
        boulder.scale.set(1.2, 0.65, 1.1);
        seg.add(boulder);
      });

      this.riverValleyGroup.add(seg);
      this.riverSegments.push(seg);
    }

    this.mountainGroup = new THREE.Group();
    this.scene.add(this.mountainGroup);
    this.generateDistantMountains();

    this.cloudGroup = new THREE.Group();
    this.scene.add(this.cloudGroup);
    this.cloudMat = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.42,
      depthWrite: false
    });
    for (let i = 0; i < 20; i++) {
      const cloud = this.createPastelCloud();
      cloud.position.set(
        (Math.random() - 0.5) * 280,
        24 + Math.random() * 35,
        15 - Math.random() * 380
      );
      this.cloudGroup.add(cloud);
      this.clouds.push(cloud);
    }

    this.celestialGroup = new THREE.Group();
    const sunCoreGeo = new THREE.SphereGeometry(18, 20, 20);
    this.celestialMat = new THREE.MeshBasicMaterial({ color: 0xfff3b0, fog: false });
    this.celestialBody = new THREE.Mesh(sunCoreGeo, this.celestialMat);

    const haloGeo = new THREE.SphereGeometry(24, 20, 20);
    this.celestialHaloMat = new THREE.MeshBasicMaterial({
      color: 0xffd166,
      transparent: true,
      opacity: 0.28,
      fog: false
    });
    this.celestialHalo = new THREE.Mesh(haloGeo, this.celestialHaloMat);
    this.celestialGroup.add(this.celestialBody, this.celestialHalo);
    this.celestialGroup.position.set(55, 78, -340);
    this.scene.add(this.celestialGroup);

    const starCount = 320;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 580;
      starPos[i * 3 + 1] = 28 + Math.random() * 160;
      starPos[i * 3 + 2] = -40 - Math.random() * 440;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    this.starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.45,
      transparent: true,
      opacity: 0.9,
      fog: false
    });
    this.starField = new THREE.Points(starGeo, this.starMat);
    this.starField.visible = false;
    this.scene.add(this.starField);

    const weatherCount = 200;
    const weatherGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(weatherCount * 3);
    for (let i = 0; i < weatherCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 140;
      positions[i * 3 + 1] = Math.random() * 55;
      positions[i * 3 + 2] = 20 - Math.random() * 200;
    }
    weatherGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.weatherMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.75,
      transparent: true,
      opacity: 0.8
    });
    this.weatherParticles = new THREE.Points(weatherGeo, this.weatherMat);
    this.scene.add(this.weatherParticles);
  }

  createPastelCloud() {
    const group = new THREE.Group();
    const puffs = 3 + Math.floor(Math.random() * 2);
    for (let i = 0; i < puffs; i++) {
      const size = 2.4 + Math.random() * 2.2;
      const puff = new THREE.Mesh(new THREE.BoxGeometry(size * 1.4, size * 0.8, size), this.cloudMat);
      puff.position.set((i - puffs / 2) * 2.2, (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 1.2);
      group.add(puff);
    }
    return group;
  }

  generateDistantMountains() {
    while (this.mountainGroup.children.length > 0) {
      this.mountainGroup.remove(this.mountainGroup.children[0]);
    }
    const geoConfig = GEOTYPES[this.currentGeotype];
    const mColors = this.skyTimeMode === 'night' ? geoConfig.night.mountainColors : geoConfig.mountainColors;
    const minBankDist = this.gameMode === 'balloon' ? 38 : 55;
    const count = this.graphicsQuality === 'ld' ? 22 : 42;

    for (let i = 0; i < count; i++) {
      const radius = 18 + Math.random() * 34;
      const height = 28 + Math.random() * 68;
      const segments = this.currentGeotype === 'canyon' ? 4 : 5;
      const mGeo = new THREE.ConeGeometry(radius, height, segments);
      const color = mColors[i % mColors.length];
      const mMat = new THREE.MeshLambertMaterial({ color, flatShading: true });
      const mesh = new THREE.Mesh(mGeo, mMat);

      const side = i % 2 === 0 ? -1 : 1;
      const x = side * (minBankDist + Math.random() * 200);
      const z = 10 - Math.random() * 440;
      mesh.position.set(x, height / 2 - 2, z);
      mesh.rotation.y = Math.random() * Math.PI;
      this.mountainGroup.add(mesh);
    }
  }

  buildPlayerModels() {
    this.playerRoot = new THREE.Group();
    this.scene.add(this.playerRoot);

    this.carModel = new THREE.Group();
    this.balloonModel = new THREE.Group();
    this.playerRoot.add(this.carModel, this.balloonModel);

    const shieldGeo = new THREE.IcosahedronGeometry(3.15, 1);
    const shieldMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      wireframe: true,
      transparent: true,
      opacity: 0.42
    });
    this.playerShieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    this.playerShieldMesh.position.set(0, 1.4, 0);
    this.playerShieldMesh.visible = false;
    this.playerRoot.add(this.playerShieldMesh);

    this.rebuildAllPlayerMeshes();
  }

  rebuildAllPlayerMeshes() {
    this.spinningPropellers = [];
    this.previewPropellers = [];

    while (this.carModel.children.length > 0) {
      this.carModel.remove(this.carModel.children[0]);
    }
    this.carWheels = [];
    const carBuilt = this.constructCarHierarchy(this.playerBodyType, this.getSelectedPastelHexes());
    this.carModel.add(carBuilt.root);
    this.carWheels = carBuilt.wheels;
    this.carFlames = carBuilt.flames;

    while (this.balloonModel.children.length > 0) {
      this.balloonModel.remove(this.balloonModel.children[0]);
    }
    const skyBuilt = this.constructSkyCraftHierarchy(this.skyCraftType, this.getSelectedPastelHexes(), this.spinningPropellers);
    this.balloonModel.add(skyBuilt.root);
    this.balloonFlame = skyBuilt.flame;
    this.balloonModel.position.y = 4.2;

    this.carModel.visible = this.gameMode === 'car';
    this.balloonModel.visible = this.gameMode === 'balloon';

    if (this.previewVehicleHolder) {
      while (this.previewVehicleHolder.children.length > 0) {
        this.previewVehicleHolder.remove(this.previewVehicleHolder.children[0]);
      }
      let previewObj;
      if (this.gameMode === 'car') {
        const pCar = this.constructCarHierarchy(this.playerBodyType, this.getSelectedPastelHexes());
        previewObj = pCar.root;
      } else {
        const pSky = this.constructSkyCraftHierarchy(this.skyCraftType, this.getSelectedPastelHexes(), this.previewPropellers);
        previewObj = pSky.root;
        if (this.skyCraftType === 'balloon') {
          previewObj.scale.setScalar(0.68);
        } else {
          previewObj.scale.setScalar(0.92);
        }
      }

      const box = new THREE.Box3().setFromObject(previewObj);
      const center = new THREE.Vector3();
      box.getCenter(center);
      previewObj.position.sub(center);
      previewObj.position.y += 0.25;
      this.previewVehicleHolder.add(previewObj);
    }
  }

  constructCarHierarchy(bodyType, hexPalette) {
    const root = new THREE.Group();
    const wheels = [];

    const c0 = hexPalette[0];
    const c1 = hexPalette[1 % hexPalette.length];
    const c2 = hexPalette[2 % hexPalette.length];

    const primaryMat = this.createPastelVehicleMaterial(c0);
    const secondaryMat = this.createPastelVehicleMaterial(c1);
    const accentMat = this.createPastelVehicleMaterial(c2);
    const darkTrimMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
    const glassMat = new THREE.MeshBasicMaterial({ color: 0x7dd3fc });
    const headMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const tailMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
    const turretMat = new THREE.MeshLambertMaterial({ color: 0x334155 });

    if (bodyType === 'coupe') {
      const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.72, 4.6), primaryMat);
      chassis.position.y = 0.65;
      chassis.castShadow = true;
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.74, 4.62), secondaryMat);
      stripe.position.y = 0.65;

      const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.05, 0.65, 2.3), accentMat);
      cabin.position.set(0, 1.30, -0.15);
      const glass = new THREE.Mesh(new THREE.BoxGeometry(1.92, 0.54, 2.36), glassMat);
      glass.position.set(0, 1.30, -0.15);

      const wingL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.4, 0.3), darkTrimMat);
      wingL.position.set(-0.8, 1.15, 1.9);
      const wingR = wingL.clone();
      wingR.position.x = 0.8;
      const wingBlade = new THREE.Mesh(new THREE.BoxGeometry(2.45, 0.14, 0.55), secondaryMat);
      wingBlade.position.set(0, 1.38, 1.95);

      root.add(chassis, stripe, cabin, glass, wingL, wingR, wingBlade);
    } else if (bodyType === 'muscle') {
      const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.65, 0.82, 4.85), primaryMat);
      chassis.position.y = 0.7;
      chassis.castShadow = true;

      [-0.34, 0.34].forEach(sx => {
        const st = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.84, 4.87), secondaryMat);
        st.position.set(sx, 0.7, 0);
        root.add(st);
      });

      const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.62, 2.1), accentMat);
      cabin.position.set(0, 1.35, 0.25);
      const glass = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.5, 2.16), glassMat);
      glass.position.set(0, 1.35, 0.25);

      const blower = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.38, 0.95), darkTrimMat);
      blower.position.set(0, 1.2, -1.25);
      const lip = new THREE.Mesh(new THREE.BoxGeometry(2.55, 0.22, 0.35), secondaryMat);
      lip.position.set(0, 1.18, 2.28);

      root.add(chassis, cabin, glass, blower, lip);
    } else if (bodyType === 'suv') {
      const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.7, 1.05, 4.7), primaryMat);
      chassis.position.y = 0.88;
      chassis.castShadow = true;

      const fenders = new THREE.Mesh(new THREE.BoxGeometry(2.84, 0.4, 4.4), secondaryMat);
      fenders.position.y = 0.55;

      const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.82, 3.1), accentMat);
      cabin.position.set(0, 1.72, 0.15);
      const glass = new THREE.Mesh(new THREE.BoxGeometry(2.22, 0.65, 3.16), glassMat);
      glass.position.set(0, 1.72, 0.15);

      const lightBar = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.18, 0.25), headMat);
      lightBar.position.set(0, 2.2, -1.1);

      const spareTireGeo = new THREE.CylinderGeometry(0.52, 0.52, 0.32, 12);
      spareTireGeo.rotateX(Math.PI / 2);
      const spareTire = new THREE.Mesh(spareTireGeo, darkTrimMat);
      spareTire.position.set(0, 1.15, 2.45);

      root.add(chassis, fenders, cabin, glass, lightBar, spareTire);
    } else if (bodyType === 'formula') {
      const nose = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.48, 4.9), primaryMat);
      nose.position.y = 0.52;
      nose.castShadow = true;

      const sidePods = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.52, 2.4), secondaryMat);
      sidePods.position.set(0, 0.54, 0.2);

      const frontWing = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.14, 0.65), accentMat);
      frontWing.position.set(0, 0.34, -2.35);

      const cockpitHalo = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.45, 1.2), glassMat);
      cockpitHalo.position.set(0, 0.92, -0.1);

      const rearWing = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.18, 0.65), accentMat);
      rearWing.position.set(0, 1.28, 2.15);
      const rearPost = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.65, 0.4), darkTrimMat);
      rearPost.position.set(0, 0.95, 2.1);

      root.add(nose, sidePods, frontWing, cockpitHalo, rearWing, rearPost);
    }

    const turretY = bodyType === 'suv' ? 2.22 : bodyType === 'formula' ? 1.18 : 1.72;
    const turretMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.26, 0.7, 8), turretMat);
    turretMesh.rotation.x = Math.PI / 2;
    turretMesh.position.set(0, turretY, -0.5);
    root.add(turretMesh);

    [-0.85, 0.85].forEach(xPos => {
      const hl = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.24, 0.14), headMat);
      hl.position.set(xPos, 0.72, -2.32);
      const tl = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.24, 0.14), tailMat);
      tl.position.set(xPos, 0.75, 2.32);
      root.add(hl, tl);
    });

    const flameMat = new THREE.MeshBasicMaterial({ color: 0x00f5d4 });
    const flames = new THREE.Group();
    [-0.55, 0.55].forEach(xPos => {
      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.9, 6), flameMat);
      flame.rotation.x = Math.PI / 2;
      flame.position.set(xPos, 0.48, 2.65);
      flames.add(flame);
    });
    root.add(flames);

    const wheelRadius = bodyType === 'suv' ? 0.55 : 0.46;
    const wheelGeo = new THREE.CylinderGeometry(wheelRadius, wheelRadius, 0.4, 12);
    wheelGeo.rotateZ(Math.PI / 2);
    const wheelMat = new THREE.MeshLambertMaterial({ color: 0x0f172a });
    const wheelPositions = [
      [-1.32, wheelRadius, -1.45],
      [1.32, wheelRadius, -1.45],
      [-1.32, wheelRadius, 1.45],
      [1.32, wheelRadius, 1.45]
    ];
    wheelPositions.forEach(pos => {
      const w = new THREE.Mesh(wheelGeo, wheelMat);
      w.position.set(...pos);
      w.castShadow = true;
      root.add(w);
      wheels.push(w);
    });

    return { root, wheels, flames };
  }

  constructSkyCraftHierarchy(craftType, hexPalette, propList) {
    const root = new THREE.Group();
    const burnerFlameMat = new THREE.MeshBasicMaterial({ color: 0xffbe0b });
    let flame = new THREE.Mesh(new THREE.ConeGeometry(0.38, 1.0, 8), burnerFlameMat);

    if (craftType === 'balloon') {
      const basketMat = new THREE.MeshLambertMaterial({ color: 0xe09f67 });
      const basketRimMat = new THREE.MeshLambertMaterial({ color: 0xc97b43 });
      const basketBody = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.15, 1.5), basketMat);
      basketBody.position.y = 0.6;
      basketBody.castShadow = true;
      const basketRim = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.22, 1.68), basketRimMat);
      basketRim.position.y = 1.2;
      root.add(basketBody, basketRim);

      const ropeMat = new THREE.MeshBasicMaterial({ color: 0x8d5b4c });
      [[-0.65, -0.65], [0.65, -0.65], [-0.65, 0.65], [0.65, 0.65]].forEach(([rx, rz]) => {
        const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.75, 6), ropeMat);
        rope.position.set(rx, 2.0, rz);
        root.add(rope);
      });

      flame.position.y = 1.95;
      root.add(flame);

      const bands = [
        { y: 2.75, rBottom: 0.75, rTop: 1.45, h: 0.85 },
        { y: 3.65, rBottom: 1.45, rTop: 2.15, h: 0.95 },
        { y: 4.65, rBottom: 2.15, rTop: 2.45, h: 1.05 },
        { y: 5.65, rBottom: 2.45, rTop: 2.15, h: 0.95 },
        { y: 6.45, rBottom: 2.15, rTop: 1.25, h: 0.65 },
        { y: 6.90, rBottom: 1.25, rTop: 0.30, h: 0.35 }
      ];
      bands.forEach((b, idx) => {
        const colorHex = hexPalette[idx % hexPalette.length];
        const cylGeo = new THREE.CylinderGeometry(b.rTop, b.rBottom, b.h, 16);
        const cylMat = this.createPastelVehicleMaterial(colorHex, true);
        const bandMesh = new THREE.Mesh(cylGeo, cylMat);
        bandMesh.position.y = b.y;
        bandMesh.castShadow = true;
        root.add(bandMesh);
      });
    } else if (craftType === 'blimp') {
      const hullGroup = new THREE.Group();
      hullGroup.position.y = 3.2;

      const hullSlices = [
        { z: -2.2, rFront: 0.35, rBack: 1.35, len: 1.3 },
        { z: -0.9, rFront: 1.35, rBack: 1.85, len: 1.3 },
        { z:  0.4, rFront: 1.85, rBack: 1.85, len: 1.3 },
        { z:  1.7, rFront: 1.85, rBack: 1.25, len: 1.3 },
        { z:  2.9, rFront: 1.25, rBack: 0.30, len: 1.1 }
      ];
      hullSlices.forEach((s, idx) => {
        const col = hexPalette[idx % hexPalette.length];
        const geo = new THREE.CylinderGeometry(s.rFront, s.rBack, s.len, 18);
        geo.rotateX(Math.PI / 2);
        const mat = this.createPastelVehicleMaterial(col, true);
        const slice = new THREE.Mesh(geo, mat);
        slice.position.z = s.z;
        slice.castShadow = true;
        hullGroup.add(slice);
      });

      const finColor = hexPalette[(hexPalette.length - 1) % hexPalette.length];
      const finMat = this.createPastelVehicleMaterial(finColor);
      const vFin = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.5, 1.4), finMat);
      vFin.position.set(0, 0, 2.65);
      const hFin = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.18, 1.4), finMat);
      hFin.position.set(0, 0, 2.65);
      hullGroup.add(vFin, hFin);

      const gondolaMat = this.createPastelVehicleMaterial(hexPalette[1 % hexPalette.length]);
      const glassMat = new THREE.MeshBasicMaterial({ color: 0x7dd3fc });
      const gondola = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.85, 2.4), gondolaMat);
      gondola.position.set(0, -1.85, 0.1);
      const windowStrip = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.38, 1.9), glassMat);
      windowStrip.position.set(0, -1.78, 0.1);
      hullGroup.add(gondola, windowStrip);

      const propMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
      [-0.85, 0.85].forEach(px => {
        const pod = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.5, 8), propMat);
        pod.rotation.x = Math.PI / 2;
        pod.position.set(px, -1.75, 0.8);
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.12, 0.06), propMat);
        blade.position.set(px, -1.75, 1.08);
        hullGroup.add(pod, blade);
        if (propList) propList.push(blade);
      });

      flame.rotation.x = Math.PI / 2;
      flame.position.set(0, 3.2, 3.75);
      root.add(hullGroup, flame);
    } else if (craftType === 'aircraft') {
      const planeGroup = new THREE.Group();
      planeGroup.position.y = 2.6;

      const c0 = hexPalette[0];
      const c1 = hexPalette[1 % hexPalette.length];
      const c2 = hexPalette[2 % hexPalette.length];

      const fuselageMat = this.createPastelVehicleMaterial(c0);
      const wingMat = this.createPastelVehicleMaterial(c1);
      const accentMat = this.createPastelVehicleMaterial(c2);
      const glassMat = new THREE.MeshBasicMaterial({ color: 0xbae6fd });
      const darkMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });

      const fuselage = new THREE.Mesh(new THREE.BoxGeometry(1.15, 1.05, 4.2), fuselageMat);
      fuselage.castShadow = true;
      const noseCone = new THREE.Mesh(new THREE.ConeGeometry(0.65, 1.1, 12), accentMat);
      noseCone.rotation.x = -Math.PI / 2;
      noseCone.position.z = -2.55;

      const mainWing = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.18, 1.35), wingMat);
      mainWing.position.set(0, 0.05, -0.35);
      mainWing.castShadow = true;

      [-2.8, 2.8].forEach(wx => {
        const tipTank = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.5, 10), accentMat);
        tipTank.rotation.x = Math.PI / 2;
        tipTank.position.set(wx, 0.08, -0.35);
        planeGroup.add(tipTank);
      });

      const canopy = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.58, 1.65), glassMat);
      canopy.position.set(0, 0.72, -0.15);

      const tailV = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.25, 1.1), accentMat);
      tailV.position.set(0, 0.85, 1.65);
      const tailH = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.16, 0.85), wingMat);
      tailH.position.set(0, 0.35, 1.7);

      const propHub = new THREE.Group();
      propHub.position.set(0, 0, -3.12);
      const blade1 = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.18, 0.06), darkMat);
      const blade2 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.85, 0.06), darkMat);
      propHub.add(blade1, blade2);
      if (propList) propList.push(propHub);

      planeGroup.add(fuselage, noseCone, mainWing, canopy, tailV, tailH, propHub);

      flame.rotation.x = Math.PI / 2;
      flame.position.set(0, 2.55, 2.5);
      root.add(planeGroup, flame);
    } else if (craftType === 'paperplane') {
      const paperGroup = new THREE.Group();
      paperGroup.position.y = 2.6;

      const c0 = hexPalette[0];
      const c1 = hexPalette[1 % hexPalette.length];
      const c2 = hexPalette[2 % hexPalette.length];

      const leftWingMat = this.createPastelVehicleMaterial(c0, true, true);
      const rightWingMat = this.createPastelVehicleMaterial(c1, true, true);
      const keelMat = this.createPastelVehicleMaterial(c2, true, true);
      const trimMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });

      const leftWingGeo = new THREE.BufferGeometry();
      const lwVertices = new Float32Array([
        0, 0.25, -2.85,
        -2.95, 0.58, 2.2,
        -0.32, 0.22, 2.15
      ]);
      leftWingGeo.setAttribute('position', new THREE.BufferAttribute(lwVertices, 3));
      leftWingGeo.computeVertexNormals();
      const leftWing = new THREE.Mesh(leftWingGeo, leftWingMat);

      const rightWingGeo = new THREE.BufferGeometry();
      const rwVertices = new Float32Array([
        0, 0.25, -2.85,
        0.32, 0.22, 2.15,
        2.95, 0.58, 2.2
      ]);
      rightWingGeo.setAttribute('position', new THREE.BufferAttribute(rwVertices, 3));
      rightWingGeo.computeVertexNormals();
      const rightWing = new THREE.Mesh(rightWingGeo, rightWingMat);

      const keelLeftGeo = new THREE.BufferGeometry();
      const klVertices = new Float32Array([
        0, 0.25, -2.85,
        -0.32, 0.22, 2.15,
        0, -0.78, 2.2
      ]);
      keelLeftGeo.setAttribute('position', new THREE.BufferAttribute(klVertices, 3));
      keelLeftGeo.computeVertexNormals();
      const keelLeft = new THREE.Mesh(keelLeftGeo, keelMat);

      const keelRightGeo = new THREE.BufferGeometry();
      const krVertices = new Float32Array([
        0, 0.25, -2.85,
        0, -0.78, 2.2,
        0.32, 0.22, 2.15
      ]);
      keelRightGeo.setAttribute('position', new THREE.BufferAttribute(krVertices, 3));
      keelRightGeo.computeVertexNormals();
      const keelRight = new THREE.Mesh(keelRightGeo, keelMat);

      const spineCrease = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 5.0), trimMat);
      spineCrease.position.set(0, 0.25, -0.35);

      paperGroup.add(leftWing, rightWing, keelLeft, keelRight, spineCrease);

      flame.rotation.x = Math.PI / 2;
      flame.position.set(0, 2.25, 2.45);
      root.add(paperGroup, flame);
    }

    return { root, flame };
  }

  renderPastelColorGrid() {
    const grid = document.getElementById('pastel-color-grid');
    if (!grid) return;
    grid.innerHTML = '';

    PASTEL_PALETTE.forEach(p => {
      const isSelected = this.selectedPastelKeys.includes(p.key);
      const orderIdx = this.selectedPastelKeys.indexOf(p.key) + 1;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.onclick = () => this.togglePastelColor(p.key);
      btn.className = `spatial-subcard rounded-xl px-2.5 py-2 flex items-center justify-between gap-1.5 transition ${
        isSelected ? 'active-selection-ring scale-[1.02]' : ' hover:scale-[1.01]'
      }`;
      btn.innerHTML = `
        <div class="flex items-center gap-2 min-w-0">
          <span class="w-5 h-5 rounded-lg border-2 border-slate-900/20 shadow-sm shrink-0" style="background-color: ${p.css};"></span>
          <span class="text-[11px] font-extrabold hud-text-primary truncate">${p.name}</span>
        </div>
        ${
          isSelected
            ? `<span class="w-4 h-4 rounded-full bg-pink-500 text-white text-[9px] font-black flex items-center justify-center shrink-0 shadow-sm">${orderIdx}</span>`
            : `<span class="w-4 h-4 rounded-full border border-slate-400/50 shrink-0"></span>`
        }
      `;
      grid.appendChild(btn);
    });
  }

  togglePastelColor(colorKey) {
    this.audio.playUITap(690);
    const idx = this.selectedPastelKeys.indexOf(colorKey);
    if (idx > -1) {
      if (this.selectedPastelKeys.length > 1) {
        this.selectedPastelKeys.splice(idx, 1);
      } else {
        this.selectedPastelKeys = [colorKey];
      }
    } else {
      this.selectedPastelKeys.push(colorKey);
    }
    this.renderPastelColorGrid();
    this.rebuildAllPlayerMeshes();
  }

  selectMultiPastelPreset() {
    this.audio.playUITap(740);
    this.selectedPastelKeys = ['sakura', 'mint', 'lavender', 'babyblue', 'butter'];
    this.renderPastelColorGrid();
    this.rebuildAllPlayerMeshes();
  }

  selectSinglePastelPreset() {
    this.audio.playUITap(620);
    this.selectedPastelKeys = [this.selectedPastelKeys[0] || 'sakura'];
    this.renderPastelColorGrid();
    this.rebuildAllPlayerMeshes();
  }

  setPlayerBodyType(bodyType) {
    if (!PLAYER_BODY_TYPES[bodyType]) return;
    this.audio.playUITap(640);
    this.playerBodyType = bodyType;
    this.rebuildAllPlayerMeshes();
    this.updateStudioUI();
  }

  setSkyCraftType(craftType) {
    if (!SKY_CRAFT_TYPES[craftType]) return;
    this.audio.playUITap(660);
    this.skyCraftType = craftType;
    this.rebuildAllPlayerMeshes();
    this.updateStudioUI();
  }

  applyDefaultCameraForMode(mode) {
    if (mode === 'balloon') {
      if (this.cameraViewIndex !== 1 && this.cameraViewIndex !== 2) {
        this.cameraViewIndex = 2;
      }
    } else {
      if (this.cameraViewIndex === 1) {
        this.cameraViewIndex = 0;
      }
    }
    this.syncCameraUI();
  }

  selectCameraFromStudio(index) {
    this.audio.playUITap(720);
    this.cameraViewIndex = index;
    this.syncCameraUI();
  }

  syncCameraUI() {
    const view = CAMERA_VIEWS[this.cameraViewIndex];
    const labelEl = document.getElementById('hud-cam-label');
    if (labelEl) labelEl.textContent = view.name;

    for (let i = 0; i < 4; i++) {
      const btn = document.getElementById(`studio-cam-${i}`);
      if (btn) btn.classList.toggle('active-selection-ring', i === this.cameraViewIndex);
      const pauseCamBtn = document.getElementById(`pause-cam-${i}`);
      if (pauseCamBtn) pauseCamBtn.classList.toggle('active-selection-ring', i === this.cameraViewIndex);
    }
  }

  updateStudioUI() {
    const isCar = this.gameMode === 'car';
    const badgeEl = document.getElementById('studio-mode-badge');
    const launchBtnText = document.getElementById('studio-launch-btn-text');
    const tabCar = document.getElementById('studio-tab-car');
    const tabSky = document.getElementById('studio-tab-sky');
    const carSelector = document.getElementById('garage-car-selector');
    const skySelector = document.getElementById('garage-sky-selector');

    if (badgeEl) badgeEl.textContent = isCar ? 'The Endless Highway' : 'Beyond the Fearless Sky';
    if (launchBtnText) {
      launchBtnText.textContent = isCar ? 'INITIATE THE ENDLESS HIGHWAY' : 'INITIATE BEYOND THE FEARLESS SKY';
    }
    if (tabCar && tabSky) {
      tabCar.className = isCar
        ? 'px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-extrabold transition bg-pink-500 text-white shadow-sm'
        : 'px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-extrabold transition hud-text-secondary';
      tabSky.className = !isCar
        ? 'px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-extrabold transition bg-sky-500 text-white shadow-sm'
        : 'px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-extrabold transition hud-text-secondary';
    }
    if (carSelector && skySelector) {
      carSelector.classList.toggle('hidden', !isCar);
      skySelector.classList.toggle('hidden', isCar);
    }

    Object.keys(PLAYER_BODY_TYPES).forEach(k => {
      const btn = document.getElementById(`body-btn-${k}`);
      if (btn) btn.classList.toggle('active-selection-ring', k === this.playerBodyType);
    });

    Object.keys(SKY_CRAFT_TYPES).forEach(k => {
      const btn = document.getElementById(`sky-btn-${k}`);
      if (btn) btn.classList.toggle('active-selection-ring', k === this.skyCraftType);
    });

    const specData = isCar ? PLAYER_BODY_TYPES[this.playerBodyType] : SKY_CRAFT_TYPES[this.skyCraftType];
    const titleEl = document.getElementById('spec-vehicle-title');
    const classEl = document.getElementById('spec-vehicle-class');
    const descEl = document.getElementById('spec-vehicle-desc');
    const speedEl = document.getElementById('spec-stat-speed');
    const handEl = document.getElementById('spec-stat-handling');
    const powEl = document.getElementById('spec-stat-power');

    if (titleEl) titleEl.textContent = specData.name;
    if (classEl) classEl.textContent = specData.classBadge;
    if (descEl) descEl.textContent = specData.desc;
    if (speedEl) speedEl.textContent = specData.speed;
    if (handEl) handEl.textContent = specData.handling;
    if (powEl) powEl.textContent = specData.power;

    this.syncCameraUI();
  }

  setUITheme(theme) {
    this.audio.playUITap(620);
    const nextTheme = theme === 'dark' ? 'dark' : 'light';
    const isDark = nextTheme === 'dark';

    if (this.uiTheme === nextTheme) return;
    this.uiTheme = nextTheme;

    if (this.themeTransitionTimer) {
      clearTimeout(this.themeTransitionTimer);
      this.themeTransitionTimer = null;
    }

    document.body.classList.remove('theme-to-dark', 'theme-to-light');
    void document.body.offsetWidth;

    document.body.classList.toggle('dark-ui', isDark);
    document.body.classList.add(isDark ? 'theme-to-dark' : 'theme-to-light');

    this.themeTransitionTimer = setTimeout(() => {
      document.body.classList.remove('theme-to-dark', 'theme-to-light');
      this.themeTransitionTimer = null;
    }, 720);

    const lightBtn = document.getElementById('init-theme-light');
    const darkBtn = document.getElementById('init-theme-dark');
    if (lightBtn) lightBtn.classList.toggle('active-selection-ring', !isDark);
    if (darkBtn) darkBtn.classList.toggle('active-selection-ring', isDark);

    const pauseLightBtn = document.getElementById('pause-theme-light');
    const pauseDarkBtn = document.getElementById('pause-theme-dark');
    if (pauseLightBtn) pauseLightBtn.classList.toggle('active-selection-ring', !isDark);
    if (pauseDarkBtn) pauseDarkBtn.classList.toggle('active-selection-ring', isDark);

    const hudThemeLabel = document.getElementById('hud-theme-label');
    if (hudThemeLabel) hudThemeLabel.textContent = isDark ? 'Dark UI' : 'White UI';
  }

  toggleUITheme() {
    this.setUITheme(this.uiTheme === 'light' ? 'dark' : 'light');
    this.showToast(this.uiTheme === 'dark' ? 'DARK GLASS UI ACTIVATED' : 'WHITE GLASS UI ACTIVATED');
  }

  goToStep1() {
    if (this.state === 'PLAYING' || this.state === 'PAUSED' || this.state === 'COUNTDOWN') {
      this.saveCurrentGameplayProgress(true);
    }
    this.audio.playUITap(540);
    this.state = 'DEVICE_SELECT';
    document.getElementById('screen-device').classList.remove('hidden');
    document.getElementById('screen-mode').classList.add('hidden');
    document.getElementById('screen-garage').classList.add('hidden');
    document.getElementById('screen-pause').classList.add('hidden');
    document.getElementById('screen-countdown').classList.add('hidden');
    document.getElementById('screen-gameover').classList.add('hidden');
    document.getElementById('gameplay-hud').classList.add('hidden');
    document.getElementById('hud-pause-btn').classList.add('hidden');
    this.syncControlOverlays();
  }

  selectDeviceAndGoToStep2(type) {
    this.audio.playUITap(640);
    this.setDeviceType(type);
    this.goToStep2();
  }

  goToStep2() {
    if (this.state === 'PLAYING' || this.state === 'PAUSED' || this.state === 'COUNTDOWN') {
      this.saveCurrentGameplayProgress(true);
    }
    this.audio.playUITap(580);
    this.state = 'MODE_SELECT';
    this.audio.stopEngineSound();
    this.updateRecordDisplays();
    document.getElementById('screen-device').classList.add('hidden');
    document.getElementById('screen-mode').classList.remove('hidden');
    document.getElementById('screen-garage').classList.add('hidden');
    document.getElementById('screen-pause').classList.add('hidden');
    document.getElementById('screen-countdown').classList.add('hidden');
    document.getElementById('screen-gameover').classList.add('hidden');
    document.getElementById('gameplay-hud').classList.add('hidden');
    document.getElementById('hud-menu-btn').classList.add('hidden');
    document.getElementById('hud-pause-btn').classList.add('hidden');
    this.syncControlOverlays();
  }

  selectModeAndGoToStep3(mode) {
    this.audio.playUITap(680);
    this.switchStudioMode(mode);
    this.openGarageScreen();
  }

  switchStudioMode(mode) {
    this.audio.playUITap(650);
    this.gameMode = mode;

    const isCar = mode === 'car';
    this.highwayGroup.visible = isCar;
    this.riverValleyGroup.visible = !isCar;

    this.applyDefaultCameraForMode(mode);
    this.generateDistantMountains();
    this.rebuildAllPlayerMeshes();
    this.updateStudioUI();
  }

  openGarageScreen() {
    if (this.state === 'PLAYING' || this.state === 'PAUSED' || this.state === 'COUNTDOWN') {
      this.saveCurrentGameplayProgress(true);
    }
    this.audio.playUITap(600);
    this.audio.stopEngineSound();
    this.state = 'GARAGE';
    this.updateRecordDisplays();
    document.getElementById('screen-device').classList.add('hidden');
    document.getElementById('screen-mode').classList.add('hidden');
    document.getElementById('screen-pause').classList.add('hidden');
    document.getElementById('screen-countdown').classList.add('hidden');
    document.getElementById('screen-gameover').classList.add('hidden');
    document.getElementById('gameplay-hud').classList.add('hidden');
    document.getElementById('hud-menu-btn').classList.add('hidden');
    document.getElementById('hud-pause-btn').classList.add('hidden');
    document.getElementById('screen-garage').classList.remove('hidden');
    this.syncControlOverlays();
    setTimeout(() => this.resizePreviewRenderer(), 30);
  }

  saveAndLeaveGameplay() {
    const savedPts = Math.floor(this.score);
    const savedSecs = this.formatTime(this.survivalTime);
    this.saveCurrentGameplayProgress(true);
    this.openGarageScreen();
    this.showToast(`SCORE SAVED UNTIL PAUSE: ${savedPts} PTS • ${savedSecs}`);
  }

  togglePause() {
    if (this.state === 'PLAYING') {
      this.pauseGame();
    } else if (this.state === 'PAUSED') {
      this.resumeGameWithCountdown();
    }
  }

  pauseGame() {
    if (this.state !== 'PLAYING') return;
    this.audio.playUITap(520);
    this.audio.stopEngineSound();
    this.state = 'PAUSED';

    this.saveCurrentGameplayProgress(true);

    document.getElementById('pause-score').textContent = Math.floor(this.score);
    document.getElementById('pause-time').textContent = this.formatTime(this.survivalTime);
    document.getElementById('pause-blasts').textContent = `${this.blasts} 💥`;
    const pCredEl = document.getElementById('pause-credits');
    if (pCredEl) pCredEl.textContent = `${this.credits} 💎`;
    this.updateShieldVisuals();

    const pauseIcon = document.getElementById('hud-pause-icon');
    const pauseLabel = document.getElementById('hud-pause-label');
    if (pauseIcon) pauseIcon.className = 'fa-solid fa-play text-emerald-400';
    if (pauseLabel) pauseLabel.textContent = 'Resume';

    this.syncCameraUI();
    document.getElementById('screen-pause').classList.remove('hidden');
    this.syncControlOverlays();
  }

  resumeGameWithCountdown() {
    if (this.state !== 'PAUSED') return;
    this.audio.playUITap(680);
    document.getElementById('screen-pause').classList.add('hidden');

    const countdownScreen = document.getElementById('screen-countdown');
    countdownScreen.classList.remove('hidden');

    this.state = 'COUNTDOWN';
    this.countdownRemaining = 3.0;
    this.countdownLastInt = 4;
    this.countdownRimAngle = 0;

    const pauseIcon = document.getElementById('hud-pause-icon');
    const pauseLabel = document.getElementById('hud-pause-label');
    if (pauseIcon) pauseIcon.className = 'fa-solid fa-pause text-amber-400';
    if (pauseLabel) pauseLabel.textContent = 'Pause';

    const rimEl = document.getElementById('countdown-rim-rotator');
    if (rimEl) {
      rimEl.style.transition = 'none';
      rimEl.style.transform = 'rotate(0deg)';
      void rimEl.offsetWidth;
      rimEl.style.transition = 'transform 0.95s cubic-bezier(0.22, 1, 0.36, 1)';
    }

    this.triggerCountdownTick(3);
  }

  triggerCountdownTick(num) {
    const numEl = document.getElementById('countdown-numeral');
    const rimEl = document.getElementById('countdown-rim-rotator');
    const subEl = document.getElementById('countdown-subtext');

    if (numEl) {
      numEl.textContent = num;
      numEl.classList.remove('countdown-numeral-anim');
      void numEl.offsetWidth;
      numEl.classList.add('countdown-numeral-anim');
    }

    if (subEl) {
      subEl.textContent =
        num === 3 ? 'Synchronizing Telemetry' :
        num === 2 ? 'Spooling Thrusters' : 'Full Throttle Ready';
    }

    this.countdownRimAngle += 120;
    if (rimEl) {
      rimEl.style.transform = `rotate(${this.countdownRimAngle}deg)`;
    }

    const toneMap = { 3: 523.25, 2: 659.25, 1: 783.99 };
    this.audio.playUITap(toneMap[num] || 660);
  }

  setPreviewAngle(yaw, pitch) {
    this.audio.playUITap(600);
    this.previewAutoSpin = false;
    this.previewYaw = yaw;
    this.previewPitch = pitch;
  }

  togglePreviewAutoSpin() {
    this.audio.playUITap(640);
    this.previewAutoSpin = !this.previewAutoSpin;
  }

  launchFromStudio() {
    this.startGame(this.gameMode);
  }

  pickDistinctTrafficColor() {
    const playerHexes = this.getSelectedPastelHexes();
    const filtered = TRAFFIC_COLOR_POOL.filter(c => !playerHexes.includes(c.hex));
    return (filtered.length > 0 ? filtered : TRAFFIC_COLOR_POOL)[
      Math.floor(Math.random() * (filtered.length || TRAFFIC_COLOR_POOL.length))
    ].hex;
  }

  createTerrainProp(type) {
    const group = new THREE.Group();

    if (type === 'sakura' || type === 'pine' || type === 'snowPine') {
      const trunkMat = new THREE.MeshLambertMaterial({ color: 0x9c6644 });
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, 2.2, 7), trunkMat);
      trunk.position.y = 1.1;
      trunk.castShadow = this.graphicsQuality !== 'ld';
      group.add(trunk);

      const foliageColor =
        type === 'sakura' ? 0xffb3c6 :
        type === 'snowPine' ? 0xe0fbfc : 0x80ed99;
      const foliageMat = new THREE.MeshLambertMaterial({ color: foliageColor, flatShading: true });

      if (type === 'sakura') {
        const crown = new THREE.Mesh(new THREE.DodecahedronGeometry(2.2, 0), foliageMat);
        crown.position.y = 3.2;
        crown.castShadow = this.graphicsQuality !== 'ld';
        group.add(crown);
      } else {
        for (let l = 0; l < 3; l++) {
          const cone = new THREE.Mesh(new THREE.ConeGeometry(2.2 - l * 0.45, 2.4, 7), foliageMat);
          cone.position.y = 2.4 + l * 1.35;
          cone.castShadow = this.graphicsQuality !== 'ld';
          group.add(cone);
        }
      }
    } else if (type === 'snowman') {
      const snowMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
      const b1 = new THREE.Mesh(new THREE.SphereGeometry(1.3, 8, 8), snowMat);
      b1.position.y = 1.2;
      const b2 = new THREE.Mesh(new THREE.SphereGeometry(0.95, 8, 8), snowMat);
      b2.position.y = 2.9;
      const nose = new THREE.Mesh(
        new THREE.ConeGeometry(0.18, 0.8, 5),
        new THREE.MeshLambertMaterial({ color: 0xff9f1c })
      );
      nose.rotation.x = Math.PI / 2;
      nose.position.set(0, 2.9, 0.95);
      group.add(b1, b2, nose);
    } else if (type === 'crystal') {
      const crysMat = new THREE.MeshLambertMaterial({ color: 0x72efdd, flatShading: true });
      const mainCrys = new THREE.Mesh(new THREE.OctahedronGeometry(1.8, 0), crysMat);
      mainCrys.scale.set(0.7, 2.2, 0.7);
      mainCrys.position.y = 2.2;
      group.add(mainCrys);
    } else if (type === 'coral' || type === 'kelp' || type === 'seaArch') {
      const coralColors = [0xff70a6, 0x70d6ff, 0xff9770, 0xc77dff];
      const cMat = new THREE.MeshLambertMaterial({
        color: coralColors[Math.floor(Math.random() * coralColors.length)],
        flatShading: true
      });
      for (let k = 0; k < 3; k++) {
        const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.55, 3.8 + k * 1.1, 6), cMat);
        branch.position.set((k - 1) * 0.9, 1.9 + k * 0.4, 0);
        branch.rotation.z = (k - 1) * 0.28;
        group.add(branch);
      }
    } else if (type === 'mesa' || type === 'cactus' || type === 'arch') {
      if (type === 'cactus') {
        const cacMat = new THREE.MeshLambertMaterial({ color: 0x52b788 });
        const mainStem = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 4.5, 7), cacMat);
        mainStem.position.y = 2.25;
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.8, 7), cacMat);
        arm.position.set(0.75, 2.6, 0);
        arm.rotation.z = Math.PI / 4;
        group.add(mainStem, arm);
      } else {
        const mesaMat = new THREE.MeshLambertMaterial({ color: 0xf4a261, flatShading: true });
        const mesa = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 3.8, 5.2, 6), mesaMat);
        mesa.position.y = 2.6;
        mesa.castShadow = this.graphicsQuality !== 'ld';
        group.add(mesa);
      }
    } else {
      const bushMat = new THREE.MeshLambertMaterial({ color: 0x95d5b2, flatShading: true });
      const bush = new THREE.Mesh(new THREE.DodecahedronGeometry(1.5, 0), bushMat);
      bush.position.y = 1.2;
      group.add(bush);
    }

    const scale = 0.85 + Math.random() * 0.7;
    group.scale.set(scale, scale, scale);
    return group;
  }

  randomizeTerrainProps() {
    this.terrainProps.forEach(p => this.scene.remove(p));
    this.terrainProps = [];

    const geoConfig = GEOTYPES[this.currentGeotype];
    const propTypes = geoConfig.propTypes;
    const count = this.graphicsQuality === 'ld' ? 32 : 65;

    for (let i = 0; i < count; i++) {
      const pType = propTypes[Math.floor(Math.random() * propTypes.length)];
      const prop = this.createTerrainProp(pType);

      const side = i % 2 === 0 ? -1 : 1;
      const x = side * (this.WORLD_WRAP_LIMIT + 3.8 + Math.random() * 68);
      const z = 20 - Math.random() * 350;
      prop.position.set(x, 0, z);
      prop.rotation.y = Math.random() * Math.PI * 2;
      this.scene.add(prop);
      this.terrainProps.push(prop);
    }

    this.generateDistantMountains();
  }

  createTrafficObstacle(zPos) {
    const group = new THREE.Group();
    const vehicleClass = TRAFFIC_CLASSES[Math.floor(Math.random() * TRAFFIC_CLASSES.length)];
    const color = this.pickDistinctTrafficColor();
    const primaryMat = new THREE.MeshLambertMaterial({ color });
    const whiteMat = new THREE.MeshLambertMaterial({ color: 0xf8fafc });
    const glassMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });
    const wheelMat = new THREE.MeshLambertMaterial({ color: 0x0f172a });
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });

    let hitRadius = 2.0;
    let speedOffset = 12 + Math.random() * 20;

    if (vehicleClass === 'semiTruck') {
      const trailer = new THREE.Mesh(new THREE.BoxGeometry(2.9, 2.85, 6.6), whiteMat);
      trailer.position.set(0, 1.75, -0.8);
      trailer.castShadow = this.graphicsQuality !== 'ld';

      const sideStripe = new THREE.Mesh(new THREE.BoxGeometry(2.94, 0.55, 6.4), primaryMat);
      sideStripe.position.set(0, 1.75, -0.8);

      const cab = new THREE.Mesh(new THREE.BoxGeometry(2.75, 2.15, 2.3), primaryMat);
      cab.position.set(0, 1.4, 3.8);
      cab.castShadow = this.graphicsQuality !== 'ld';

      const windshield = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.65, 0.2), glassMat);
      windshield.position.set(0, 1.9, 4.92);

      group.add(trailer, sideStripe, cab, windshield);
      hitRadius = 2.6;
      speedOffset = 8 + Math.random() * 14;
    } else if (vehicleClass === 'cityBus') {
      const busBody = new THREE.Mesh(new THREE.BoxGeometry(2.85, 2.55, 8.2), primaryMat);
      busBody.position.y = 1.6;
      busBody.castShadow = this.graphicsQuality !== 'ld';

      const roof = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.25, 7.9), whiteMat);
      roof.position.y = 2.95;

      const windowBand = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.78, 7.6), glassMat);
      windowBand.position.y = 2.05;

      group.add(busBody, roof, windowBand);
      hitRadius = 2.65;
      speedOffset = 10 + Math.random() * 15;
    } else if (vehicleClass === 'motorcycle') {
      const bikeFrame = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 2.5), primaryMat);
      bikeFrame.position.y = 0.72;
      bikeFrame.castShadow = this.graphicsQuality !== 'ld';

      const wheelGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.26, 8);
      wheelGeo.rotateZ(Math.PI / 2);
      const frontW = new THREE.Mesh(wheelGeo, wheelMat);
      frontW.position.set(0, 0.42, 1.05);
      const rearW = new THREE.Mesh(wheelGeo, wheelMat);
      rearW.position.set(0, 0.42, -1.05);

      const riderTorso = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.85, 0.65),
        new THREE.MeshLambertMaterial({ color: 0x1e293b })
      );
      riderTorso.position.set(0, 1.38, -0.1);
      const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.34, 6, 6), whiteMat);
      helmet.position.set(0, 1.92, 0.05);

      group.add(bikeFrame, frontW, rearW, riderTorso, helmet);
      hitRadius = 1.35;
      speedOffset = 20 + Math.random() * 26;
    } else if (vehicleClass === 'pickup') {
      const bed = new THREE.Mesh(new THREE.BoxGeometry(2.45, 0.85, 4.8), primaryMat);
      bed.position.y = 0.72;
      bed.castShadow = this.graphicsQuality !== 'ld';

      const cab = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.85, 2.1), primaryMat);
      cab.position.set(0, 1.5, 0.8);
      const glass = new THREE.Mesh(new THREE.BoxGeometry(2.34, 0.62, 1.9), glassMat);
      glass.position.set(0, 1.52, 0.8);

      group.add(bed, cab, glass);
      hitRadius = 2.15;
    } else {
      const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.25, 0.8, 3.7), primaryMat);
      chassis.position.y = 0.65;
      chassis.castShadow = this.graphicsQuality !== 'ld';

      const topCab = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.72, 2.3), whiteMat);
      topCab.position.set(0, 1.36, -0.15);

      const glass = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.52, 2.0), glassMat);
      glass.position.set(0, 1.34, -0.15);

      group.add(chassis, topCab, glass);
      hitRadius = 1.95;
    }

    if (vehicleClass !== 'motorcycle') {
      const zLamp = vehicleClass === 'semiTruck' ? 4.96 : vehicleClass === 'cityBus' ? 4.12 : 1.95;
      [-0.82, 0.82].forEach(lx => {
        const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.26, 0.14), lightMat);
        lamp.position.set(lx, 0.75, zLamp);
        group.add(lamp);
      });
    }

    const xPos = (Math.random() - 0.5) * (this.WORLD_WRAP_LIMIT * 1.72);
    group.position.set(xPos, 0, zPos);

    group.userData = {
      type: 'traffic',
      vehicleClass,
      color,
      primaryMaterials: [primaryMat],
      speedOffset,
      driftX: (Math.random() - 0.5) * 2.5,
      hitRadius,
      flapPhase: 0
    };

    this.scene.add(group);
    this.obstacles.push(group);
  }

  createBirdObstacle(zPos) {
    const group = new THREE.Group();
    const birdColors = [0xff8fab, 0x72efdd, 0xffd166, 0xbdb2ff, 0xff9f1c];
    const color = birdColors[Math.floor(Math.random() * birdColors.length)];
    const bodyMat = new THREE.MeshLambertMaterial({ color, flatShading: true });
    const wingMat = new THREE.MeshLambertMaterial({ color: 0xffffff, flatShading: true });

    const body = new THREE.Mesh(new THREE.ConeGeometry(0.75, 2.5, 4), bodyMat);
    body.rotation.x = Math.PI / 2;
    group.add(body);

    const head = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55, 0), bodyMat);
    head.position.set(0, 0.35, 1.15);
    const beak = new THREE.Mesh(
      new THREE.ConeGeometry(0.24, 0.75, 4),
      new THREE.MeshLambertMaterial({ color: 0xffbe0b })
    );
    beak.rotation.x = Math.PI / 2;
    beak.position.set(0, 0.32, 1.65);
    group.add(head, beak);

    const leftWingPivot = new THREE.Group();
    const leftWingMesh = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.12, 1.15), wingMat);
    leftWingMesh.position.x = -1.15;
    leftWingPivot.add(leftWingMesh);

    const rightWingPivot = new THREE.Group();
    const rightWingMesh = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.12, 1.15), wingMat);
    rightWingMesh.position.x = 1.15;
    rightWingPivot.add(rightWingMesh);

    group.add(leftWingPivot, rightWingPivot);
    group.scale.set(1.25, 1.25, 1.25);

    const xPos = (Math.random() - 0.5) * (this.WORLD_WRAP_LIMIT * 1.75);
    const yPos = 6.2 + (Math.random() - 0.5) * 3.8;
    group.position.set(xPos, yPos, zPos);

    group.userData = {
      type: 'bird',
      color,
      leftWing: leftWingPivot,
      rightWing: rightWingPivot,
      speedOffset: 15 + Math.random() * 26,
      driftX: (Math.random() - 0.5) * 6.5,
      flapPhase: Math.random() * Math.PI * 2,
      baseY: yPos,
      hitRadius: 2.35
    };

    this.scene.add(group);
    this.obstacles.push(group);
  }

  resetObstacles() {
    this.obstacles.forEach(obs => this.scene.remove(obs));
    this.obstacles = [];

    const initialClearDistance = -205;
    const count = 16;
    for (let i = 0; i < count; i++) {
      const z = initialClearDistance - i * 19;
      if (this.gameMode === 'car') {
        this.createTrafficObstacle(z);
      } else {
        this.createBirdObstacle(z);
      }
    }
  }

  createCollectible(zPos) {
    const group = new THREE.Group();
    const isShield = Math.random() < 0.28;

    if (isShield) {
      const core = new THREE.Mesh(this.sharedShieldCoreGeo, new THREE.MeshBasicMaterial({ color: 0x34d399 }));
      const shell = new THREE.Mesh(this.sharedShieldShellGeo, new THREE.MeshBasicMaterial({ color: 0x6ee7b7, wireframe: true, transparent: true, opacity: 0.65 }));
      group.add(core, shell);
      group.scale.set(0.9, 0.9, 0.9);
      group.userData = { type: 'shield', hitRadius: 2.1 };
    } else {
      const orb = new THREE.Mesh(this.sharedOrbGeo, new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
      const ring = new THREE.Mesh(this.sharedOrbRingGeo, new THREE.MeshBasicMaterial({ color: 0x7dd3fc, side: THREE.DoubleSide }));
      ring.rotation.x = Math.PI / 2;
      group.add(orb, ring);
      group.scale.set(0.85, 0.85, 0.85);
      group.userData = { type: 'credit', hitRadius: 1.9 };
    }

    const xPos = (Math.random() - 0.5) * (this.WORLD_WRAP_LIMIT * 1.6);
    const yPos = this.gameMode === 'car' ? 1.4 : 6.8;
    group.position.set(xPos, yPos, zPos);

    this.scene.add(group);
    this.collectibles.push(group);
  }

  resetCollectibles() {
    this.collectibles.forEach(c => this.scene.remove(c));
    this.collectibles = [];

    const count = 10;
    for (let i = 0; i < count; i++) {
      const z = -130 - i * 25;
      this.createCollectible(z);
    }
  }

  updateShieldVisuals() {
    const shieldEl = document.getElementById('hud-shield');
    const pauseShieldEl = document.getElementById('pause-shield');
    const shieldText = this.shields > 0 ? `${this.shields} 🛡️` : '0 🛡️';

    if (shieldEl) {
      shieldEl.textContent = shieldText;
      shieldEl.className = this.shields > 0
        ? 'hud-stat-val font-black text-emerald-400 tabular-nums leading-tight'
        : 'hud-stat-val font-black text-slate-400 tabular-nums leading-tight';
    }
    if (pauseShieldEl) pauseShieldEl.textContent = shieldText;

    if (this.playerShieldMesh) {
      this.playerShieldMesh.visible = this.shields > 0;
    }
  }

  cycleCameraView() {
    this.audio.playUITap(760);
    this.cameraViewIndex = (this.cameraViewIndex + 1) % CAMERA_VIEWS.length;
    this.syncCameraUI();
    const view = CAMERA_VIEWS[this.cameraViewIndex];
    this.showToast(`CAMERA VIEW: ${view.name.toUpperCase()}`);
  }

  cycleBiome() {
    const keys = ['meadow', 'snow', 'underwater', 'canyon'];
    const currentIdx = keys.indexOf(this.currentGeotype);
    const nextKey = keys[(currentIdx + 1) % keys.length];
    this.setGeotype(nextKey);
  }

  hideUIElement(panelKey) {
    const modeMap = this.hiddenUIs[this.deviceType];
    if (!modeMap || !(panelKey in modeMap)) return;

    this.audio.playUITap(500);
    modeMap[panelKey] = true;
    this.applyUIVisibilityState();
  }

  unhideAllUI() {
    const modeMap = this.hiddenUIs[this.deviceType];
    if (!modeMap) return;

    this.audio.playUITap(740);
    Object.keys(modeMap).forEach(k => {
      modeMap[k] = false;
    });
    this.applyUIVisibilityState();
    this.showToast('ALL HUD PANELS RESTORED');
  }

  applyUIVisibilityState() {
    const modeMap = this.hiddenUIs[this.deviceType] || {};

    const panelConfig = [
      { key: 'brand', id: 'hud-panel-brand', hideClass: 'ui-hidden-left' },
      { key: 'controls', id: 'hud-panel-controls', hideClass: 'ui-hidden-up' },
      { key: 'telemetryLeft', id: 'hud-panel-telemetry-left', hideClass: 'ui-hidden-left' },
      { key: 'telemetryRight', id: 'hud-panel-telemetry-right', hideClass: 'ui-hidden-right' },
      { key: 'pcHint', id: 'hud-panel-pc-hint', hideClass: 'ui-hidden-down' }
    ];

    let hiddenCount = 0;
    panelConfig.forEach(cfg => {
      const el = document.getElementById(cfg.id);
      if (!el) return;

      const isHidden = Boolean(modeMap[cfg.key]);
      el.classList.toggle(cfg.hideClass, isHidden);

      if (isHidden) {
        const isTelemetry = cfg.key === 'telemetryLeft' || cfg.key === 'telemetryRight';
        const isPcBar = cfg.key === 'pcHint';
        if (isPcBar && this.deviceType === 'keyboard' && this.state === 'PLAYING') {
          hiddenCount++;
        } else if (isTelemetry && this.state === 'PLAYING') {
          hiddenCount++;
        } else if (!isTelemetry && !isPcBar) {
          hiddenCount++;
        }
      }
    });

    const unhideRow = document.getElementById('hud-unhide-row');
    const unhideBtn = document.getElementById('hud-unhide-all-btn');
    const countBadge = document.getElementById('hud-unhide-count');

    if (unhideRow) {
      unhideRow.classList.toggle('hud-unhide-row-active', hiddenCount > 0);
      unhideRow.classList.toggle('hud-unhide-row-collapsed', hiddenCount === 0);
    }
    if (unhideBtn) {
      unhideBtn.classList.toggle('ui-unhide-hidden', hiddenCount === 0);
    }
    if (countBadge) {
      countBadge.textContent = String(hiddenCount);
    }
  }

  setSkyTimeMode(mode) {
    if (mode !== 'day' && mode !== 'night') return;
    this.audio.playUITap(660);
    this.skyTimeMode = mode;
    this.applyGeotype(this.currentGeotype, false);

    const isNight = this.skyTimeMode === 'night';
    const hudIcon = document.getElementById('hud-sky-icon');
    const hudLabel = document.getElementById('hud-sky-label');
    if (hudIcon) {
      hudIcon.className = isNight
        ? 'fa-solid fa-moon text-indigo-300'
        : 'fa-solid fa-sun text-amber-400';
    }
    if (hudLabel) hudLabel.textContent = isNight ? 'Night' : 'Day';

    const pauseDayBtn = document.getElementById('pause-sky-day');
    const pauseNightBtn = document.getElementById('pause-sky-night');
    if (pauseDayBtn) pauseDayBtn.classList.toggle('active-selection-ring', !isNight);
    if (pauseNightBtn) pauseNightBtn.classList.toggle('active-selection-ring', isNight);

    this.showToast(isNight ? 'NIGHT SKY MODE • STARLIGHT HORIZON' : 'DAY SKY MODE • LUMINOUS HORIZON');
  }

  toggleSkyTimeMode() {
    this.setSkyTimeMode(this.skyTimeMode === 'day' ? 'night' : 'day');
  }

  fireBlaster() {
    if (this.state !== 'PLAYING') return;
    const now = performance.now() / 1000;
    if (now - this.lastShotTime < this.shotCooldown) return;
    this.lastShotTime = now;

    this.audio.playLaserPew();

    const orbGroup = new THREE.Group();
    const coreGeo = new THREE.OctahedronGeometry(0.48, 0);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xff8fab });
    const haloGeo = new THREE.OctahedronGeometry(0.72, 0);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xa2d2ff,
      transparent: true,
      opacity: 0.45
    });
    orbGroup.add(new THREE.Mesh(coreGeo, coreMat), new THREE.Mesh(haloGeo, haloMat));

    const spawnY = this.gameMode === 'car' ? 1.45 : 7.0;
    orbGroup.position.set(this.playerX, spawnY, -2.5);
    this.scene.add(orbGroup);
    this.projectiles.push(orbGroup);
  }

  spawnVoxelExplosion(position, baseColor = 0xff8fab, count = 28) {
    if (this.graphicsQuality === 'ld') count = Math.floor(count * 0.5);
    const palette = [baseColor, 0xffffff, 0xffd166, 0x72efdd, 0xbdb2ff];

    for (let i = 0; i < count; i++) {
      const col = palette[i % palette.length];
      const mat = new THREE.MeshLambertMaterial({ color: col });
      const voxel = new THREE.Mesh(this.sharedVoxelGeo, mat);
      voxel.position.copy(position);
      voxel.position.x += (Math.random() - 0.5) * 1.5;
      voxel.position.y += (Math.random() - 0.5) * 1.5;
      voxel.position.z += (Math.random() - 0.5) * 1.5;

      const scale = 0.6 + Math.random() * 1.1;
      voxel.scale.set(scale, scale, scale);

      voxel.userData = {
        vx: (Math.random() - 0.5) * 28,
        vy: 6 + Math.random() * 20,
        vz: (Math.random() - 0.5) * 28,
        rx: (Math.random() - 0.5) * 12,
        ry: (Math.random() - 0.5) * 12,
        life: 1.0 + Math.random() * 0.45
      };

      this.scene.add(voxel);
      this.voxelParticles.push(voxel);
    }
  }

  setDeviceType(type) {
    this.deviceType = type;
    const iconEl = document.getElementById('hud-device-icon');
    const labelEl = document.getElementById('hud-device-label');
    if (type === 'touch') {
      iconEl.className = 'fa-solid fa-mobile-screen-button text-pink-400';
      labelEl.textContent = 'Touch UI';
    } else {
      iconEl.className = 'fa-solid fa-laptop text-purple-400';
      labelEl.textContent = 'PC / Keys';
    }
    this.syncControlOverlays();
    this.applyUIVisibilityState();
  }

  toggleDeviceType() {
    this.audio.playUITap(540);
    this.setDeviceType(this.deviceType === 'keyboard' ? 'touch' : 'keyboard');
    this.showToast(
      this.deviceType === 'touch'
        ? 'SWITCHED TO SMARTPHONE / TABLET TOUCH CONTROLS'
        : 'SWITCHED TO LAPTOP / PC KEYBOARD CONTROLS'
    );
  }

  syncControlOverlays() {
    const touchOverlay = document.getElementById('touch-controls-overlay');
    const pcHint = document.getElementById('pc-controls-hint');

    if (this.state !== 'PLAYING') {
      touchOverlay.classList.add('hidden');
      pcHint.classList.add('hidden');
      this.applyUIVisibilityState();
      return;
    }

    if (this.deviceType === 'touch') {
      touchOverlay.classList.remove('hidden');
      pcHint.classList.add('hidden');
    } else {
      touchOverlay.classList.add('hidden');
      pcHint.classList.remove('hidden');
    }
    this.applyUIVisibilityState();
  }

  toggleAudio() {
    const muted = this.audio.toggleMute();
    const icon = document.getElementById('hud-audio-icon');
    icon.className = muted
      ? 'fa-solid fa-volume-xmark text-slate-400'
      : 'fa-solid fa-volume-high text-pink-400';
  }

  toggleRandomizeGeotype(checked) {
    this.randomizeOnRespawn = checked;
    this.audio.playUITap(520);
  }

  setGeotype(key) {
    this.audio.playUITap(680);
    this.applyGeotype(key, true);
  }

  applyGeotype(key, notify = true) {
    if (!GEOTYPES[key]) return;
    this.currentGeotype = key;
    const cfg = GEOTYPES[key];
    const isNight = this.skyTimeMode === 'night';

    const skyTop = isNight ? cfg.night.skyTop : cfg.skyTop;
    const skyBottom = isNight ? cfg.night.skyBottom : cfg.skyBottom;
    const fogColor = isNight ? cfg.night.fogColor : cfg.fogColor;
    const groundColor = isNight ? cfg.night.groundColor : cfg.groundColor;
    const ambientColor = isNight ? cfg.night.ambientColor : cfg.ambientColor;
    const sunColor = isNight ? cfg.night.sunColor : cfg.sunColor;
    const riverWaterColor = isNight ? cfg.night.riverWaterColor : cfg.riverWaterColor;
    const riverShallowColor = isNight ? cfg.night.riverShallowColor : cfg.riverShallowColor;
    const riverBankColor = isNight ? cfg.night.riverBankColor : cfg.riverBankColor;

    document.body.style.background = `linear-gradient(180deg, ${skyTop} 0%, ${skyBottom} 100%)`;
    this.scene.fog.color.setHex(fogColor);

    this.groundMat.color.setHex(groundColor);
    this.roadMat.color.setHex(isNight ? 0x1e2430 : cfg.roadColor);
    this.shoulderMat.color.setHex(cfg.roadShoulderColor);
    this.stripeMat.color.setHex(cfg.roadLineColor);
    this.railMat.color.setHex(cfg.roadLineColor);

    if (this.riverWaterMat) this.riverWaterMat.color.setHex(riverWaterColor);
    if (this.riverShallowMat) this.riverShallowMat.color.setHex(riverShallowColor);
    if (this.riverBankMat) this.riverBankMat.color.setHex(riverBankColor);

    this.hemiLight.color.setHex(ambientColor);
    this.hemiLight.intensity = isNight ? 0.58 : 0.85;
    this.dirLight.color.setHex(sunColor);
    this.dirLight.intensity = isNight ? 0.62 : 0.88;

    if (this.celestialMat && this.celestialHaloMat) {
      this.celestialMat.color.setHex(isNight ? 0xe0e7ff : 0xfff3b0);
      this.celestialHaloMat.color.setHex(isNight ? 0x818cf8 : 0xffd166);
      this.celestialHaloMat.opacity = isNight ? 0.36 : 0.26;
    }
    if (this.starField) {
      this.starField.visible = isNight;
    }
    if (this.cloudMat) {
      this.cloudMat.color.setHex(0xffffff);
      this.cloudMat.opacity = isNight ? 0.26 : 0.42;
    }

    if (key === 'snow') {
      this.weatherMat.color.setHex(0xffffff);
      this.weatherMat.size = 0.85;
    } else if (key === 'underwater') {
      this.weatherMat.color.setHex(0x9bf6ff);
      this.weatherMat.size = 0.95;
    } else if (key === 'canyon') {
      this.weatherMat.color.setHex(0xffd166);
      this.weatherMat.size = 0.6;
    } else {
      this.weatherMat.color.setHex(0xffb3c6);
      this.weatherMat.size = 0.7;
    }

    ['meadow', 'snow', 'underwater', 'canyon'].forEach(g => {
      const hudBtn = document.getElementById(`hud-geo-${g}`);
      const menuBtn = document.getElementById(`menu-geo-${g}`);
      const pauseBtn = document.getElementById(`pause-geo-${g}`);
      if (hudBtn) {
        hudBtn.className =
          g === key
            ? 'geo-pill hud-geo-btn rounded-full font-bold transition-all flex items-center bg-pink-500/20 text-pink-500 shadow-sm'
            : 'geo-pill hud-geo-btn rounded-full font-semibold transition-all flex items-center hud-text-secondary hover:bg-white/20';
      }
      if (menuBtn) menuBtn.classList.toggle('active-selection-ring', g === key);
      if (pauseBtn) pauseBtn.classList.toggle('active-selection-ring', g === key);
    });

    const pauseBiomeBadge = document.getElementById('pause-current-biome-badge');
    if (pauseBiomeBadge) pauseBiomeBadge.textContent = cfg.name;

    this.randomizeTerrainProps();

    if (notify && this.state === 'PLAYING') {
      this.showToast(`GEOTYPE CHANGED: ${cfg.name.toUpperCase()}`);
    }
  }

  showToast(message) {
    const toast = document.getElementById('hud-toast');
    const text = document.getElementById('hud-toast-text');
    if (!toast || !text) return;
    text.textContent = message;
    toast.classList.remove('opacity-0', '-translate-y-2');
    toast.classList.add('opacity-100', 'translate-y-0');

    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove('opacity-100', 'translate-y-0');
      toast.classList.add('opacity-0', '-translate-y-2');
    }, 2400);
  }

  startGame(mode) {
    this.audio.playUITap(740);
    this.gameMode = mode;
    this.state = 'PLAYING';

    this.playerX = 0;
    this.playerVX = 0;
    this.currentSpeed = this.baseSpeed;
    this.score = 0;
    this.survivalTime = 0;
    this.blasts = 0;
    this.credits = 0;
    this.shields = 0;

    const isCar = mode === 'car';
    this.highwayGroup.visible = isCar;
    this.riverValleyGroup.visible = !isCar;
    this.carModel.visible = isCar;
    this.balloonModel.visible = !isCar;

    this.applyDefaultCameraForMode(mode);

    const modeIcon = document.getElementById('hud-mode-icon');
    const speedUnit = document.getElementById('hud-speed-unit');
    if (isCar) {
      modeIcon.className = 'fa-solid fa-car-side hud-mini-icon text-pink-400';
      speedUnit.textContent = 'SPEED (KM/H)';
    } else {
      modeIcon.className = 'fa-solid fa-cloud-sun hud-mini-icon text-sky-400';
      speedUnit.textContent = 'AIRSPEED (KTS)';
    }

    document.getElementById('screen-device').classList.add('hidden');
    document.getElementById('screen-mode').classList.add('hidden');
    document.getElementById('screen-garage').classList.add('hidden');
    document.getElementById('screen-pause').classList.add('hidden');
    document.getElementById('screen-countdown').classList.add('hidden');
    document.getElementById('screen-gameover').classList.add('hidden');
    document.getElementById('gameplay-hud').classList.remove('hidden');
    document.getElementById('hud-menu-btn').classList.remove('hidden');
    document.getElementById('hud-menu-btn').classList.add('flex');
    document.getElementById('hud-pause-btn').classList.remove('hidden');
    document.getElementById('hud-pause-btn').classList.add('flex');

    const pauseIcon = document.getElementById('hud-pause-icon');
    const pauseLabel = document.getElementById('hud-pause-label');
    if (pauseIcon) pauseIcon.className = 'fa-solid fa-pause text-amber-400';
    if (pauseLabel) pauseLabel.textContent = 'Pause';

    document.getElementById('hud-time').textContent = '0.0s';
    const credEl = document.getElementById('hud-credits');
    if (credEl) credEl.textContent = '0 💎';
    this.updateShieldVisuals();
    this.updateRecordDisplays();

    this.syncControlOverlays();
    this.rebuildAllPlayerMeshes();
    this.randomizeTerrainProps();
    this.resetObstacles();
    this.resetCollectibles();
    this.audio.startEngineSound(mode);

    const activeVehicleName = isCar
      ? PLAYER_BODY_TYPES[this.playerBodyType].name
      : SKY_CRAFT_TYPES[this.skyCraftType].name;

    this.showToast(
      isCar
        ? `THE ENDLESS HIGHWAY • ${activeVehicleName.toUpperCase()}`
        : `BEYOND THE FEARLESS SKY • ${activeVehicleName.toUpperCase()}`
    );
  }

  respawnAndRandomize() {
    this.audio.playWrapChime();
    if (this.randomizeOnRespawn) {
      const keys = Object.keys(GEOTYPES);
      const nextGeo = keys[Math.floor(Math.random() * keys.length)];
      this.applyGeotype(nextGeo, false);
    }
    this.startGame(this.gameMode);
    this.showToast('RESPAWNED WITH RANDOMIZED TERRAIN!');
  }

  triggerGameOver(obstaclePos, color) {
    this.state = 'GAMEOVER';
    this.audio.stopEngineSound();
    this.audio.playVoxelExplosion(true);

    this.spawnVoxelExplosion(obstaclePos, color, 55);

    const finalScoreInt = Math.floor(this.score);
    if (finalScoreInt > this.highScore) {
      this.highScore = finalScoreInt;
    }
    if (this.survivalTime > this.bestTime) {
      this.bestTime = Number(this.survivalTime.toFixed(1));
    }
    this.clearSavedSession();
    this.saveRecords();
    this.updateRecordDisplays();

    document.getElementById('final-score').textContent = finalScoreInt;
    document.getElementById('final-time').textContent = this.formatTime(this.survivalTime);
    document.getElementById('final-blasts').textContent = this.blasts;
    const fCredEl = document.getElementById('final-credits');
    if (fCredEl) fCredEl.textContent = `${this.credits} 💎`;
    document.getElementById('final-best').textContent = this.highScore;
    document.getElementById('final-best-time').textContent = this.formatTime(this.bestTime);
    const fTotalCredEl = document.getElementById('final-total-credits');
    if (fTotalCredEl) fTotalCredEl.textContent = `${this.totalCredits} 💎`;

    this.syncControlOverlays();
    setTimeout(() => {
      if (this.state === 'GAMEOVER') {
        document.getElementById('screen-gameover').classList.remove('hidden');
      }
    }, 480);
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.resizePreviewRenderer();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && (this.state === 'PLAYING' || this.state === 'PAUSED' || this.state === 'COUNTDOWN')) {
        if (this.state === 'PLAYING') {
          this.pauseGame();
        } else {
          this.saveCurrentGameplayProgress(true);
        }
      }
    });

    window.addEventListener('beforeunload', () => {
      if (this.state === 'PLAYING' || this.state === 'PAUSED' || this.state === 'COUNTDOWN') {
        this.saveCurrentGameplayProgress(true);
      }
    });

    const previewContainer = document.getElementById('preview-canvas-container');
    if (previewContainer) {
      const onPointerDown = (clientX, clientY) => {
        this.isDraggingPreview = true;
        this.previewAutoSpin = false;
        this.dragStartX = clientX;
        this.dragStartY = clientY;
      };
      const onPointerMove = (clientX, clientY) => {
        if (!this.isDraggingPreview) return;
        const dx = clientX - this.dragStartX;
        const dy = clientY - this.dragStartY;
        this.dragStartX = clientX;
        this.dragStartY = clientY;
        this.previewYaw += dx * 0.012;
        this.previewPitch = THREE.MathUtils.clamp(this.previewPitch + dy * 0.01, -0.35, 1.25);
      };
      const onPointerUp = () => {
        this.isDraggingPreview = false;
      };

      previewContainer.addEventListener('mousedown', e => {
        if (e.target.tagName === 'BUTTON') return;
        onPointerDown(e.clientX, e.clientY);
      });
      window.addEventListener('mousemove', e => onPointerMove(e.clientX, e.clientY));
      window.addEventListener('mouseup', onPointerUp);

      previewContainer.addEventListener(
        'touchstart',
        e => {
          if (e.target.tagName === 'BUTTON') return;
          if (e.touches.length === 1) {
            onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
          }
        },
        { passive: true }
      );
      previewContainer.addEventListener(
        'touchmove',
        e => {
          if (e.touches.length === 1) {
            onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
          }
        },
        { passive: true }
      );
      previewContainer.addEventListener('touchend', onPointerUp);
    }

    window.addEventListener('keydown', e => {
      const key = e.key.toLowerCase();

      if (this.deviceType === 'keyboard') {
        if ((key === 'p' || e.code === 'Escape') && !e.repeat) {
          if (this.state === 'PLAYING' || this.state === 'PAUSED') {
            e.preventDefault();
            this.togglePause();
            return;
          }
        }

        if (key === 'c' && !e.repeat && this.state !== 'DEVICE_SELECT') {
          e.preventDefault();
          this.cycleCameraView();
          return;
        }

        if (key === 'b' && !e.repeat && this.state !== 'DEVICE_SELECT') {
          e.preventDefault();
          this.cycleBiome();
          return;
        }

        if (key === 'n' && !e.repeat && this.state !== 'DEVICE_SELECT') {
          e.preventDefault();
          this.toggleSkyTimeMode();
          return;
        }

        if (key === 't' && !e.repeat && this.state !== 'DEVICE_SELECT') {
          e.preventDefault();
          this.toggleUITheme();
          return;
        }

        if (key === 'g' && !e.repeat && this.state !== 'DEVICE_SELECT') {
          e.preventDefault();
          this.toggleGraphicsQuality();
          return;
        }

        if (key === 'm' && !e.repeat) {
          e.preventDefault();
          this.toggleAudio();
          return;
        }

        if ((key === 'u' || key === 'h') && !e.repeat) {
          e.preventDefault();
          this.unhideAllUI();
          return;
        }
      }

      if ((e.code === 'Space' || e.code === 'Enter') && this.state === 'GAMEOVER') {
        e.preventDefault();
        this.respawnAndRandomize();
        return;
      }

      if (e.code === 'ArrowLeft' || key === 'a') this.keys.left = true;
      if (e.code === 'ArrowRight' || key === 'd') this.keys.right = true;
      if (e.code === 'ArrowUp' || key === 'w') {
        e.preventDefault();
        this.keys.up = true;
      }
      if (e.code === 'ArrowDown' || key === 's') {
        e.preventDefault();
        this.keys.down = true;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        this.keys.space = true;
        this.fireBlaster();
      }
    });

    window.addEventListener('keyup', e => {
      const key = e.key.toLowerCase();
      if (e.code === 'ArrowLeft' || key === 'a') this.keys.left = false;
      if (e.code === 'ArrowRight' || key === 'd') this.keys.right = false;
      if (e.code === 'ArrowUp' || key === 'w') this.keys.up = false;
      if (e.code === 'ArrowDown' || key === 's') this.keys.down = false;
      if (e.code === 'Space') this.keys.space = false;
    });

    const bindTouchHold = (btnId, keyProp) => {
      const btn = document.getElementById(btnId);
      if (!btn) return;
      const start = ev => {
        ev.preventDefault();
        this.keys[keyProp] = true;
        btn.classList.add('active-press');
      };
      const end = ev => {
        ev.preventDefault();
        this.keys[keyProp] = false;
        btn.classList.remove('active-press');
      };
      btn.addEventListener('touchstart', start, { passive: false });
      btn.addEventListener('touchend', end, { passive: false });
      btn.addEventListener('touchcancel', end, { passive: false });
      btn.addEventListener('mousedown', start);
      btn.addEventListener('mouseup', end);
      btn.addEventListener('mouseleave', end);
    };

    bindTouchHold('touch-left', 'left');
    bindTouchHold('touch-right', 'right');
    bindTouchHold('touch-up', 'up');
    bindTouchHold('touch-down', 'down');

    const fireBtn = document.getElementById('touch-fire');
    if (fireBtn) {
      const triggerFire = ev => {
        ev.preventDefault();
        this.fireBlaster();
      };
      fireBtn.addEventListener('touchstart', triggerFire, { passive: false });
      fireBtn.addEventListener('mousedown', triggerFire);
    }

    const camBtn = document.getElementById('touch-cam');
    if (camBtn) {
      const triggerCam = ev => {
        ev.preventDefault();
        this.cycleCameraView();
      };
      camBtn.addEventListener('touchstart', triggerCam, { passive: false });
      camBtn.addEventListener('mousedown', triggerCam);
    }
  }

  update(dt) {
    const elapsed = this.clock.getElapsedTime();

    this.spinningPropellers.forEach(p => (p.rotation.z += dt * 24));
    this.previewPropellers.forEach(p => (p.rotation.z += dt * 18));

    if (this.state === 'GARAGE' && this.previewStageGroup && this.previewRenderer) {
      if (this.previewAutoSpin && !this.isDraggingPreview) {
        this.previewYaw += dt * 0.65;
      }
      this.previewStageGroup.rotation.y = this.previewYaw;
      this.previewStageGroup.rotation.x = this.previewPitch;
      this.previewCamera.position.set(0, 1.35, 8.2);
      this.previewCamera.lookAt(0, 0.1, 0);
      this.previewRenderer.render(this.previewScene, this.previewCamera);
    }

    if (this.state === 'PAUSED') {
      return;
    }

    if (this.state === 'COUNTDOWN') {
      this.countdownRemaining -= dt;
      const currentCeil = Math.ceil(this.countdownRemaining);

      if (currentCeil >= 1 && currentCeil < this.countdownLastInt) {
        this.countdownLastInt = currentCeil;
        this.triggerCountdownTick(currentCeil);
      }

      const sweepEl = document.getElementById('countdown-sweep-circle');
      if (sweepEl) {
        const progress = Math.max(0, Math.min(1, (3.0 - this.countdownRemaining) / 3.0));
        sweepEl.style.strokeDashoffset = `${progress * 477.5}`;
      }

      if (this.countdownRemaining <= 0) {
        document.getElementById('screen-countdown').classList.add('hidden');
        this.state = 'PLAYING';
        this.audio.playWrapChime();
        this.audio.startEngineSound(this.gameMode);
        this.syncControlOverlays();
        this.showToast('ODYSSEY RESUMED • FULL THROTTLE!');
      }
      return;
    }

    for (let i = this.voxelParticles.length - 1; i >= 0; i--) {
      const v = this.voxelParticles[i];
      const u = v.userData;
      v.position.x += u.vx * dt;
      v.position.y += u.vy * dt;
      v.position.z += u.vz * dt;
      u.vy -= 38 * dt;

      if (v.position.y < 0.25) {
        v.position.y = 0.25;
        u.vy *= -0.55;
      }

      v.rotation.x += u.rx * dt;
      v.rotation.y += u.ry * dt;
      u.life -= dt;
      v.scale.setScalar(Math.max(0.01, u.life));

      if (u.life <= 0) {
        this.scene.remove(v);
        this.voxelParticles.splice(i, 1);
      }
    }

    if (this.weatherParticles && this.weatherParticles.visible) {
      const posAttr = this.weatherParticles.geometry.attributes.position;
      const isUnderwater = this.currentGeotype === 'underwater';
      for (let i = 0; i < posAttr.count; i++) {
        let py = posAttr.getY(i);
        let pz = posAttr.getZ(i);
        py += (isUnderwater ? 4.5 : -6.5) * dt;
        pz += this.currentSpeed * 0.65 * dt;

        if (py < 0) py = 52;
        if (py > 55) py = 1;
        if (pz > 25) pz = -195;

        posAttr.setY(i, py);
        posAttr.setZ(i, pz);
      }
      posAttr.needsUpdate = true;
    }

    if (this.playerShieldMesh && this.playerShieldMesh.visible) {
      this.playerShieldMesh.rotation.y += dt * 2.2;
      this.playerShieldMesh.rotation.x += dt * 1.4;
    }

    if (this.state !== 'PLAYING') {
      this.carModel.visible = this.gameMode === 'car';
      this.balloonModel.visible = this.gameMode === 'balloon';
      this.playerRoot.position.x = Math.sin(elapsed * 0.6) * 2.2;
      this.carModel.rotation.y = Math.sin(elapsed * 0.8) * 0.35;
      this.balloonModel.position.y = 4.2 + Math.sin(elapsed * 1.8) * 0.35;

      const targetCamY = this.gameMode === 'car' ? 5.6 : 12.0;
      const targetCamZ = this.gameMode === 'car' ? 12.8 : 22.5;
      this.camera.position.lerp(new THREE.Vector3(0, targetCamY, targetCamZ), 0.06);
      this.camera.lookAt(0, this.gameMode === 'car' ? 1.2 : 7.0, -4);
      return;
    }

    const damp = (a, b, lambda) => THREE.MathUtils.lerp(a, b, 1 - Math.exp(-lambda * dt));

    if (this.keys.up) {
      this.currentSpeed = damp(this.currentSpeed, this.maxSpeed, 3.6);
      document.getElementById('hud-throttle-state').textContent = 'BOOST ↑';
      document.getElementById('hud-throttle-state').className = 'hud-badge-pill font-extrabold rounded-md bg-pink-500/20 text-pink-500 border border-pink-400/40';
    } else if (this.keys.down) {
      this.currentSpeed = damp(this.currentSpeed, this.minSpeed, 4.2);
      document.getElementById('hud-throttle-state').textContent = 'BRAKE ↓';
      document.getElementById('hud-throttle-state').className = 'hud-badge-pill font-extrabold rounded-md bg-amber-500/20 text-amber-500 border border-amber-400/40';
    } else {
      this.currentSpeed = damp(this.currentSpeed, this.baseSpeed, 2.4);
      document.getElementById('hud-throttle-state').textContent = 'CRUISE';
      document.getElementById('hud-throttle-state').className = 'hud-badge-pill font-extrabold rounded-md bg-emerald-500/20 text-emerald-500 border border-emerald-400/40';
    }

    const normSpeed = (this.currentSpeed - this.minSpeed) / (this.maxSpeed - this.minSpeed);
    this.audio.updateEnginePitch(normSpeed, this.gameMode);

    const activeCamId = CAMERA_VIEWS[this.cameraViewIndex].id;
    const baseFov = activeCamId === 'action' ? 64 : activeCamId === 'hood' ? 60 : 52;
    const targetFov = baseFov + normSpeed * 12;
    this.camera.fov = damp(this.camera.fov, targetFov, 6.0);
    this.camera.updateProjectionMatrix();

    const flameScale = 0.65 + normSpeed * 1.35 + Math.sin(elapsed * 28) * 0.15;
    if (this.carFlames) this.carFlames.scale.set(1, 1, flameScale);
    if (this.balloonFlame) this.balloonFlame.scale.set(flameScale, flameScale, flameScale);

    const steerInput = (this.keys.right ? 1 : 0) - (this.keys.left ? 1 : 0);
    const steerSpeed = 29;
    this.playerVX = damp(this.playerVX, steerInput * steerSpeed, 10.5);
    this.playerX += this.playerVX * dt;

    if (this.playerX > this.WORLD_WRAP_LIMIT) {
      this.playerX = -this.WORLD_WRAP_LIMIT + 0.8;
      this.onPlayerWorldWrap(new THREE.Vector3(this.playerX, this.gameMode === 'car' ? 1.2 : 7.0, 0));
    } else if (this.playerX < -this.WORLD_WRAP_LIMIT) {
      this.playerX = this.WORLD_WRAP_LIMIT - 0.8;
      this.onPlayerWorldWrap(new THREE.Vector3(this.playerX, this.gameMode === 'car' ? 1.2 : 7.0, 0));
    }

    this.playerRoot.position.x = this.playerX;

    if (this.gameMode === 'car') {
      this.carModel.rotation.z = damp(this.carModel.rotation.z, -steerInput * 0.14, 12);
      this.carModel.rotation.y = damp(this.carModel.rotation.y, -steerInput * 0.18, 12);
      this.carWheels.forEach(w => (w.rotation.x -= this.currentSpeed * dt * 0.35));
    } else {
      this.balloonModel.position.y = 4.2 + Math.sin(elapsed * 2.2) * 0.32 + normSpeed * 0.55;
      const bankFactor = this.skyCraftType === 'aircraft' || this.skyCraftType === 'paperplane' ? 0.36 : 0.18;
      this.balloonModel.rotation.z = damp(this.balloonModel.rotation.z, -steerInput * bankFactor, 8.5);
      this.balloonModel.rotation.y = damp(this.balloonModel.rotation.y, -steerInput * 0.15, 8.5);
    }

    const aspect = window.innerWidth / window.innerHeight;
    const portraitPullback = aspect < 1 ? (1 - aspect) * 9.5 : 0;
    const camLerpFactor = 1 - Math.exp(-9.5 * dt);

    if (this.gameMode === 'car') {
      if (activeCamId === 'hood') {
        const hoodPos = new THREE.Vector3(this.playerX, 1.95, -1.35);
        this.camera.position.lerp(hoodPos, 1 - Math.exp(-20 * dt));
        this.camera.lookAt(this.playerX + steerInput * 2.5, 1.6, -45);
      } else if (activeCamId === 'top') {
        const topPos = new THREE.Vector3(this.playerX * 0.55, 29 + portraitPullback, 9);
        this.camera.position.lerp(topPos, camLerpFactor);
        this.camera.lookAt(this.playerX * 0.65, 0, -18);
      } else if (activeCamId === 'action') {
        const actionPos = new THREE.Vector3(this.playerX * 0.9, 3.1, 8.8 + portraitPullback * 0.6);
        this.camera.position.lerp(actionPos, camLerpFactor);
        this.camera.lookAt(this.playerX, 1.4, -22);
      } else {
        const chasePos = new THREE.Vector3(
          this.playerX * 0.72,
          5.8 + portraitPullback * 0.35,
          13.2 + portraitPullback
        );
        this.camera.position.lerp(chasePos, camLerpFactor);
        this.camera.lookAt(this.playerX * 0.85, 1.4, -10);
      }
    } else {
      if (activeCamId === 'hood') {
        const hoodY = this.skyCraftType === 'balloon' ? 5.8 : 7.2;
        const basketCam = new THREE.Vector3(this.playerX, hoodY, -1.2);
        this.camera.position.lerp(basketCam, 1 - Math.exp(-18 * dt));
        this.camera.lookAt(this.playerX + steerInput * 3, hoodY - 0.2, -45);
      } else if (activeCamId === 'top') {
        const topCam = new THREE.Vector3(this.playerX * 0.55, 34 + portraitPullback, 14);
        this.camera.position.lerp(topCam, camLerpFactor);
        this.camera.lookAt(this.playerX * 0.65, 5.5, -16);
      } else if (activeCamId === 'action') {
        const lowSkyCam = new THREE.Vector3(this.playerX * 0.85, 6.5, 15.5 + portraitPullback);
        this.camera.position.lerp(lowSkyCam, camLerpFactor);
        this.camera.lookAt(this.playerX, 7.2, -20);
      } else {
        const desiredCamPos = new THREE.Vector3(
          this.playerX * 0.72,
          10.2 + portraitPullback * 0.4,
          21.5 + portraitPullback * 1.35
        );
        this.camera.position.lerp(desiredCamPos, camLerpFactor);
        this.camera.lookAt(this.playerX * 0.85, 7.0, -12);
      }
    }

    this.roadStripes.forEach(stripe => {
      stripe.position.z += this.currentSpeed * dt;
      if (stripe.position.z > 25) stripe.position.z -= 340;
    });

    this.riverSegments.forEach(seg => {
      seg.position.z += this.currentSpeed * dt;
      if (seg.position.z > 30) {
        seg.position.z -= 374;
      }
    });

    this.terrainProps.forEach(prop => {
      prop.position.z += this.currentSpeed * dt;
      if (prop.position.z > 28) {
        prop.position.z -= 360;
        const side = Math.random() < 0.5 ? -1 : 1;
        prop.position.x = side * (this.WORLD_WRAP_LIMIT + 3.8 + Math.random() * 68);
      }
    });

    this.clouds.forEach(cloud => {
      cloud.position.z += this.currentSpeed * 0.35 * dt;
      if (cloud.position.z > 30) {
        cloud.position.z = -360;
        cloud.position.x = (Math.random() - 0.5) * 280;
      }
    });

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const orb = this.projectiles[i];
      orb.position.z -= 115 * dt;
      orb.rotation.y += 10 * dt;
      orb.rotation.x += 8 * dt;

      if (orb.position.z < -260) {
        this.scene.remove(orb);
        this.projectiles.splice(i, 1);
      }
    }

    for (let i = this.collectibles.length - 1; i >= 0; i--) {
      const item = this.collectibles[i];
      item.position.z += this.currentSpeed * dt;
      item.rotation.y += dt * 3.5;

      const distZ = Math.abs(item.position.z - 0);
      const distX = Math.abs(item.position.x - this.playerX);

      if (distZ < 2.2 && distX < 1.8) {
        if (item.userData.type === 'shield') {
          this.shields = Math.min(this.maxShields, this.shields + 1);
          this.audio.playShieldPowerup();
          this.showToast('🛡️ AEGIS SHIELD ACQUIRED! ACCIDENT PROTECTED.');
        } else {
          this.credits += 1;
          this.totalCredits += 1;
          this.score += 50;
          this.audio.playCreditChime();
          this.showToast('💎 CREDIT ORB COLLECTED (+50 PTS)!');
        }

        this.updateShieldVisuals();
        this.updateRecordDisplays();

        this.scene.remove(item);
        this.collectibles.splice(i, 1);
        this.createCollectible(-210 - Math.random() * 40);
        continue;
      }

      if (item.position.z > 24) {
        this.scene.remove(item);
        this.collectibles.splice(i, 1);
        this.createCollectible(-210 - Math.random() * 40);
      }
    }

    const playerCenterY = this.gameMode === 'car' ? 1.0 : 7.0;

    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      const u = obs.userData;

      obs.position.z += (this.currentSpeed + u.speedOffset) * dt;
      obs.position.x += u.driftX * dt;

      if (obs.position.x > this.WORLD_WRAP_LIMIT - 1.5) u.driftX *= -1;
      if (obs.position.x < -this.WORLD_WRAP_LIMIT + 1.5) u.driftX *= -1;

      if (u.type === 'bird') {
        u.flapPhase += dt * 15;
        const wingAngle = Math.sin(u.flapPhase) * 0.62;
        u.leftWing.rotation.z = wingAngle;
        u.rightWing.rotation.z = -wingAngle;
        obs.position.y = u.baseY + Math.sin(u.flapPhase * 0.5) * 0.55;
      }

      let destroyedByBlaster = false;
      for (let j = this.projectiles.length - 1; j >= 0; j--) {
        const proj = this.projectiles[j];
        const dx = proj.position.x - obs.position.x;
        const dz = proj.position.z - obs.position.z;
        if (Math.hypot(dx, dz) < u.hitRadius + 1.1) {
          this.audio.playVoxelExplosion(false);
          const expPos = obs.position.clone();
          if (u.type === 'traffic') expPos.y += 1.0;
          this.spawnVoxelExplosion(expPos, u.color, 34);

          this.scene.remove(proj);
          this.projectiles.splice(j, 1);

          this.scene.remove(obs);
          this.obstacles.splice(i, 1);
          const nextZ = -310 - Math.random() * 60;
          if (this.gameMode === 'car') {
            this.createTrafficObstacle(nextZ);
          } else {
            this.createBirdObstacle(nextZ);
          }

          this.blasts++;
          this.score += 25;
          destroyedByBlaster = true;
          break;
        }
      }
      if (destroyedByBlaster) continue;

      const distZ = Math.abs(obs.position.z - 0);
      const distX = Math.abs(obs.position.x - this.playerX);
      if (distZ < u.hitRadius + 1.15 && distX < u.hitRadius + 0.72) {
        if (this.shields > 0) {
          this.shields--;
          this.updateShieldVisuals();
          this.audio.playShieldDeflect();
          this.spawnVoxelExplosion(obs.position.clone(), 0x34d399, 24);

          this.scene.remove(obs);
          this.obstacles.splice(i, 1);
          const nextZ = -310 - Math.random() * 50;
          if (this.gameMode === 'car') {
            this.createTrafficObstacle(nextZ);
          } else {
            this.createBirdObstacle(nextZ);
          }

          this.showToast('🛡️ AEGIS SHIELD DEFLECTED ACCIDENT!');
          continue;
        } else {
          const impactPos = new THREE.Vector3(this.playerX, playerCenterY, 0);
          this.triggerGameOver(impactPos, u.color);
          return;
        }
      }

      if (obs.position.z > 24) {
        this.scene.remove(obs);
        this.obstacles.splice(i, 1);
        const nextZ = -310 - Math.random() * 50;
        if (this.gameMode === 'car') {
          this.createTrafficObstacle(nextZ);
        } else {
          this.createBirdObstacle(nextZ);
        }
      }
    }

    this.survivalTime += dt;
    this.score += this.currentSpeed * dt * 0.45;

    document.getElementById('hud-score').textContent = Math.floor(this.score);
    document.getElementById('hud-time').textContent = this.formatTime(this.survivalTime);
    document.getElementById('hud-blasts').textContent = `${this.blasts} 💥`;
    const credEl = document.getElementById('hud-credits');
    if (credEl) credEl.textContent = `${this.credits} 💎`;

    if (Math.floor(this.score) > this.highScore) {
      this.highScore = Math.floor(this.score);
      const hsEl = document.getElementById('hud-high-score');
      if (hsEl) hsEl.textContent = this.highScore;
    }
    if (this.survivalTime > this.bestTime) {
      this.bestTime = Number(this.survivalTime.toFixed(1));
      const btEl = document.getElementById('hud-best-time');
      if (btEl) btEl.textContent = this.formatTime(this.bestTime);
    }

    const displaySpeed = Math.round(this.currentSpeed * (this.gameMode === 'car' ? 2.6 : 1.1));
    document.getElementById('hud-speed').textContent = displaySpeed;
    document.getElementById('hud-speed-bar').style.height = `${Math.min(100, Math.max(12, normSpeed * 100))}%`;
  }

  onPlayerWorldWrap(wrapPos) {
    this.audio.playWrapChime();
    this.spawnVoxelExplosion(wrapPos, 0x72efdd, 18);
    this.randomizeTerrainProps();
    this.showToast('CONTINUOUS WORLD WRAPPED • TERRAIN RANDOMIZED!');
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const rawDt = Math.min(this.clock.getDelta(), 0.05);
    this.smoothedDt = THREE.MathUtils.lerp(this.smoothedDt, rawDt, 0.35);
    this.update(this.smoothedDt);
    this.renderer.render(this.scene, this.camera);
  }
}

window.gameApp = new TrafficRGame();
