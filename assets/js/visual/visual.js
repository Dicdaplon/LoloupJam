

let buttons = [];
let notes = [];
const noteChars = ['♪', '♫', '♩', '♬'];
let baloo;

function preload() {
  baloo = loadFont(PATHS.fonts + 'Baloo2-Regular.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(16);
  textFont(baloo);

  buttons = [
    new CircleButton("Tablatures", "tablatures.html", width * 0.3, height / 2, color('#FF206E')),
    new CircleButton("Paroles", "paroles.html", width * 0.5, height / 2, color('#41EAD4')),
    new CircleButton("Infos", "info.html", width * 0.7, height / 2, color('#FBFF12')),
  ];

}

function draw() {
  // Fond avec transparence pour trainées
background(0, 20);

// Générer des notes aléatoires
if (random(1) < 0.1) {
  notes.push(new NoteParticle());
}

// Afficher les notes
for (let i = notes.length - 1; i >= 0; i--) {
  notes[i].update();
  notes[i].display();
  if (notes[i].isDead()) {
    notes.splice(i, 1);
  }
}

// Titre principal
push();
textFont(baloo);
textSize(36);
fill(255);
textAlign(CENTER, TOP);
fill(0, 180);
text("Loloup Jam LIVE", width / 2 + 2, 32 + 2); // ombre
fill(255);
text("Loloup Jam LIVE", width / 2, 32); // titre principal
pop();
  for (let btn of buttons) {
    btn.update();
    btn.display();
  }
}

function mousePressed() {
  for (let btn of buttons) {
    if (btn.isHovered(mouseX, mouseY)) {
      window.location.href = btn.link;
    }
  }
}



class CircleButton {
  constructor(label, link, x, y, c) {
    this.label = label;
    this.link = link;
    this.x = x;
    this.y = y;
    this.baseSize = 100;
    this.c = c;
    this.pulse = random(TWO_PI);
  }

  update() {
    this.pulse += 0.05;
  }

  display() {
  let size = this.baseSize + sin(this.pulse) * 10;

  // Shake léger
  let jitterX = random(-1, 1);
  let jitterY = random(-1, 1);

  // Glow (cercle flou derrière)
  push();
  noStroke();
  for (let i = 4; i >= 1; i--) {
    fill(red(this.c), green(this.c), blue(this.c), 20);
    ellipse(this.x + jitterX, this.y + jitterY, size + i * 10);
  }
  pop();

  // Déphasage RGB (légers cercles en couleur décalée)
  push();
  noStroke();
  fill(255, 0, 0, 100);
  ellipse(this.x + 2, this.y - 1, size);
  fill(0, 255, 255, 100);
  ellipse(this.x - 2, this.y + 1, size);
  pop();

  // Cercle principal
  fill(this.c);
  ellipse(this.x, this.y, size);

  // Texte avec ombre
  push();
  fill(0, 180);
text(this.label, this.x + 2, this.y + 2);
fill(255);
text(this.label, this.x, this.y);
pop(); // ✅ Manquait ici
}

isHovered(px, py) {
  let size = this.baseSize + sin(this.pulse) * 10;
  let d = dist(px, py, this.x, this.y);
  return d < size / 2;
}
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class NoteParticle {
  constructor() {
    this.x = random(width);
    this.y = height + 20;
    this.speed = random(0.5, 2);
    this.alpha = 255;
    this.char = random(noteChars);
    this.size = random(16, 24);
    this.color = color(random(200, 255), random(100, 255), random(200, 255));
  }

  update() {
    this.y -= this.speed;
    this.alpha -= 1.5;
  }

  display() {
  push();
  textFont('Georgia');  // ou 'Arial', ou autre police système compatible
  fill(red(this.color), green(this.color), blue(this.color), this.alpha);
  textSize(this.size);
  text(this.char, this.x, this.y);
  pop();
}

  isDead() {
    return this.alpha <= 0;
  }
}
