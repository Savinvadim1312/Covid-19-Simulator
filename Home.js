let homeImage;

function preload() {
  homeImg = loadImage('home.png');
}

class Home {
  constructor() {
    let x = random(210, windowWidth - 10);
    let y = random(60, windowHeight - 10);
    this.pos = new p5.Vector(x, y);
  }

  draw() {
    fill(color(3, 198, 252, 50));
    const x = Math.floor(this.pos.x);
    const y = Math.floor(this.pos.y);
    ellipse(x, y, 20);
    image(homeImg, x-5, y-5, 10, 10);
  }
}
