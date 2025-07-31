

let buttons = [];
let notes = [];
const noteChars = ['♪', '♫', '♩', '♬'];
let baloo;

function preload() {
  baloo = loadFont(PATHS.fonts + 'Baloo2-Regular.ttf');
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("background-holder");
  canvas.style('z-index', '-1');
  canvas.style('position', 'fixed');
  canvas.style('top', '0');
  canvas.style('left', '0');
  canvas.style('pointer-events', 'none');
}
function draw() {
  // Fond avec transparence pour trainées
    background(28,32,37,180);
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
