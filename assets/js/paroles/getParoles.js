// === Paramètres rythme / animation ===
let notes = [];
let bpm = 90;
let beatMs = 60000 / bpm;
let lastClickTime = 0;
let lastBeat = 0;

// === Setup p5.js ===
function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  textFont('Arial');
  textAlign(CENTER, CENTER);
  console.log("✔ p5 setup lancé");
}

// === Boucle principale ===
function draw() {
  background(0, 60); // semi-transparent = effet de traînée
  drawSmoothPulse();

  // Notes animées
  for (let note of notes) {
    note.update();
    note.display();
  }

  // Génère automatiquement une note visuelle toutes les ~20 frames
  if (frameCount % 20 === 0) {
    notes.push(new Note());
  }

  // Limite le nombre de notes
  if (notes.length > 100) {
    notes.splice(0, 1);
  }
}

// === Clics → feedback visuel + message flottant ===
function mousePressed() {
  let now = millis();
  let delta = now - lastClickTime;
  lastClickTime = now;
  let rhythmData = evaluateTiming(delta);

  notes.push(new Note(true, rhythmData.label, rhythmData.color));

  // Optionnel : message flottant si chat.js est chargé
  if (typeof showFloatingMessage === 'function') {
    showFloatingMessage(rhythmData.label);
  }
}

// === Effet pulsation centrale ===
function drawSmoothPulse() {
  let t = (millis() - lastBeat) % beatMs;
  let pct = t / beatMs;
  let glow = sin(pct * TWO_PI);
  let size = map(glow, 0, 1, 80, 240);
  let alpha = map(glow, 0, 1, 10, 60);

  push();
  translate(width / 2, height / 2);
  fill(0, 255, 255, alpha);
  ellipse(0, 0, size);
  pop();
}

// === Évaluation du rythme tapé ===
function evaluateTiming(delta) {
  let grid = [
    { label: '1 temps', ms: beatMs },
    { label: '½ temps', ms: beatMs / 2 },
    { label: '⅓ temps', ms: beatMs / 3 },
    { label: '¼ temps', ms: beatMs / 4 },
    { label: '2 temps', ms: beatMs * 2 }
  ];

  let closest = grid.reduce((a, b) =>
    Math.abs(delta - a.ms) < Math.abs(delta - b.ms) ? a : b
  );

  let relativeError = Math.abs(delta - closest.ms) / closest.ms * 100;

  let color;
  if (relativeError <= 5) {
    color = colorFromHex("#00ff00");
  } else if (relativeError <= 15) {
    color = colorFromHex("#ffff00");
  } else {
    color = colorFromHex("#ff3333");
  }

  let label = `${closest.label} | ${relativeError.toFixed(1)}%`;
  return { label, color };
}

// === Convertisseur hex vers p5.Color ===
function colorFromHex(hex) {
  if (typeof window.color !== "function") {
    console.warn("⚠️ p5.color() n'est pas encore dispo");
    return [255, 255, 255]; // fallback blanc
  }

  hex = hex.replace(/^#/, "");
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return window.color(r, g, b);
}

// === Classe Note ===
class Note {
  constructor(fromClick = false, rhythm = '', customColor = null) {
    this.x = random(width);
    this.y = fromClick ? random(height * 0.4, height * 0.6) : height + 20;
    this.size = fromClick ? 64 : random(24, 48);
    this.speed = fromClick ? 0.8 : random(1.5, 2.5);
    this.alpha = 255;
    this.symbols = ['♪', '♩', '♫', '♬'];
    this.char = random(this.symbols);
    this.color = customColor || window.color(random(100, 255), random(100, 255), 255);
    this.fromClick = fromClick;
    this.rhythm = rhythm;
  }

  update() {
    this.y -= this.speed;
    this.alpha -= 2;
  }

  display() {
    push();
    textSize(this.size);
    for (let i = 3; i >= 1; i--) {
      fill(red(this.color), green(this.color), blue(this.color), this.alpha / i);
      text(this.char, this.x, this.y);
    }

    if (this.fromClick && this.alpha > 100) {
      textSize(14);
      fill(255, 255, 255, this.alpha);
      text(this.rhythm, this.x, this.y - this.size);
    }
    pop();
  }
}

console.log("✔ visual.js bien chargé");
