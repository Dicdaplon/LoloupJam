let backgroundSketch = (p) => {
  let notes = [];
  const noteChars = ['♪', '♫', '♩', '♬'];

  class NoteParticle {
    constructor() {
      this.x = p.random(p.width);
      this.y = p.height + 20;
      this.speed = p.random(0.5, 2);
      this.alpha = 255;
      this.char = p.random(noteChars);
      this.size = p.random(16, 24);
      this.color = p.color(p.random(200, 255), p.random(100, 255), p.random(200, 255));
    }

    update() {
      this.y -= this.speed;
      this.alpha -= 1.5;
    }

    display() {
      p.push();
      p.textFont('Georgia');
      p.fill(p.red(this.color), p.green(this.color), p.blue(this.color), this.alpha);
      p.textSize(this.size);
      p.text(this.char, this.x, this.y);
      p.pop();
    }

    isDead() {
      return this.alpha <= 0;
    }
  }

  p.setup = () => {
    let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    canvas.parent("background-holder");
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('left', '0');
    canvas.style('pointer-events', 'none');
  };

  p.draw = () => {
    p.background(28, 32, 37, 180);

    if (p.random(1) < 0.1) {
      notes.push(new NoteParticle());
    }

    for (let i = notes.length - 1; i >= 0; i--) {
      notes[i].update();
      notes[i].display();
      if (notes[i].isDead()) {
        notes.splice(i, 1);
      }
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

new p5(backgroundSketch);
