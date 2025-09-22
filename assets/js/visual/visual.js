let accueilSketch = (p) => {
  let buttons = [];
  let baloo;
  let logo;
  let cameraIcon;

  class CircleButton {
    constructor(label, link, x, y, c) {
      this.label = label;
      this.link = link;
      this.x = x;
      this.y = y;
      this.baseSize = 100;
      this.c = c;
      this.pulse = p.random(p.TWO_PI);
    }

    update() {
      this.pulse += 0.05;
    }

    display() {
      let size = this.baseSize + p.sin(this.pulse) * 10;
      let jitterX = p.random(-1, 1);
      let jitterY = p.random(-1, 1);

      p.push();
      p.noStroke();
      for (let i = 8; i >= 1; i--) {
        p.fill(p.red(this.c), p.green(this.c), p.blue(this.c), 8);
        p.ellipse(this.x + p.random(-0.5, 0.5), this.y + p.random(-0.5, 0.5), size + i * 6);
      }
      p.pop();

      p.push();
      p.noStroke();
      p.fill(255, 0, 0, 100);
      p.ellipse(this.x + 2, this.y - 1, size);
      p.fill(0, 255, 255, 100);
      p.ellipse(this.x - 2, this.y + 1, size);
      p.pop();

      p.fill(this.c);
      p.ellipse(this.x, this.y, size);

      p.push();
      p.fill(0, 180);
      p.text(this.label, this.x + 2, this.y + 2);
      p.fill(255);
      p.text(this.label, this.x, this.y);
      p.pop();
    }

    isHovered(px, py) {
      let size = this.baseSize + p.sin(this.pulse) * 10;
      let d = p.dist(px, py, this.x, this.y);
      return d < size / 2;
    }
  }

  class MinorButton {
    constructor(label, link, x, y, c) {
      this.label = label;
      this.link = link;
      this.x = x;
      this.y = y;
      this.baseSize = 60;
      this.c = c;
      this.pulse = p.random(p.TWO_PI);
    }

    update() {
      this.pulse += 0.05;
    }

    display() {
      let size = this.baseSize + p.sin(this.pulse) * 5;
      let jitterX = p.random(-0.8, 0.8);
      let jitterY = p.random(-0.8, 0.8);

      p.push();
      p.noFill();
      p.strokeWeight(1.5);
      for (let i = 3; i >= 1; i--) {
        p.stroke(p.red(this.c), p.green(this.c), p.blue(this.c), 10 * i);
        p.ellipse(this.x + jitterX, this.y + jitterY, size + i * 6);
      }
      p.pop();

      p.push();
      p.stroke(this.c);
      p.strokeWeight(1.5);
      p.noFill();
      p.ellipse(this.x, this.y, size);
      p.pop();

      p.push();
      let iconSize = size * 0.9;
      p.imageMode(p.CENTER);
      p.image(cameraIcon, this.x, this.y, iconSize, iconSize);
      p.pop();
    }

    isHovered(px, py) {
      let size = this.baseSize + p.sin(this.pulse) * 10;
      let d = p.dist(px, py, this.x, this.y);
      return d < size / 2;
    }
  }

  function repositionButtons() {
    let isPortrait = p.height > p.width;
    if (buttons.length === 5) {
      if (!isPortrait) {
        buttons[0].x = p.width * 0.25;
        buttons[0].y = p.height / 2;
        buttons[1].x = p.width * 0.41;
        buttons[1].y = p.height / 2;
        buttons[2].x = p.width * 0.57;
        buttons[2].y = p.height / 2;
        buttons[3].x = p.width * 0.73;
        buttons[3].y = p.height / 2;
        buttons[4].x = p.width * 0.88;
        buttons[4].y = p.height / 1.4;
      } else {
        buttons[0].x = p.width / 2;
        buttons[0].y = p.height * 0.35;
        buttons[1].x = p.width / 2;
        buttons[1].y = p.height * 0.51;
        buttons[2].x = p.width / 2;
        buttons[2].y = p.height * 0.67;
        buttons[3].x = p.width / 2;
        buttons[3].y = p.height * 0.83;
        buttons[4].x = p.width * 0.83;
        buttons[4].y = p.height / 1.69;
      }
    }
  }

  p.preload = () => {
    baloo = p.loadFont(PATHS.fonts + 'Baloo2-Regular.ttf');
    logo = p.loadImage(PATHS.data + 'HDexportLogo.png');
    cameraIcon = p.loadImage(PATHS.image + "Photo.png");
  };

  p.setup = () => {
    let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    canvas.style('z-index', '5');
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('left', '0');
    canvas.style('pointer-events', 'auto');
    canvas.parent(document.body);

    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(16);
    p.textFont(baloo);

    buttons = [
      new CircleButton("Grilles", "tablatures.html", p.width * 0.3, p.height / 2, p.color('#FF5F9E')),
      new CircleButton("Paroles", "paroles.html", p.width * 0.5, p.height / 2, p.color('#00F0FF')),
      new CircleButton("Tabs", "paroleChords.html", p.width * 0.5, p.height / 2, p.color('#c353daff')),
      new CircleButton("Infos", "info.html", p.width * 0.7, p.height / 2, p.color('#FFF275')),
      new MinorButton("Photo !", "camera.html", p.width * 0.9, p.height / 1.4, p.color('#B388EB')),
    ];
         repositionButtons();
  };

  p.draw = () => {
    p.clear();

    p.push();
    p.textFont(baloo);
    p.textSize(36);
    p.fill(0, 180);
    p.text("Loloup Jam LIVE", p.width / 2 + 2, 32 + 2);
    p.fill(255);
    p.text("Loloup Jam LIVE", p.width / 2, 32);
    p.pop();

    for (let btn of buttons) {
      btn.update();
      btn.display();
    }
  };

  p.mousePressed = () => {
    for (let btn of buttons) {
      if (btn.isHovered(p.mouseX, p.mouseY)) {
        window.location.href = btn.link;
      }
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    repositionButtons();
  };

  window.addEventListener("orientationchange", () => {
    setTimeout(() => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
      repositionButtons();
    }, 200);
  });
};

new p5(accueilSketch);
