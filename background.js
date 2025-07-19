// fond-anim.js
let noteChars = ['♪', '♫', '♩', '♬'];
let notes = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  textAlign(CENTER, CENTER);
  textFont('Georgia');
  textSize(16);
}

function draw() {
  background(0, 20);

  if (random(1) < 0.1) {
    notes.push(new NoteParticle());
  }

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
    fill(red(this.color), green(this.color), blue(this.color), this.alpha);
    text(this.char, this.x, this.y);
    pop();
  }

  isDead() {
    return this.alpha <= 0;
  }
}