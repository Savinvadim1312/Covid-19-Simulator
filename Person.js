class Person {

  constructor(isInfected = false) {
    this.pos = new p5.Vector(
      random() * (windowWidth - 200) + 200,
      random() * windowHeight
    );

    this.angle = new p5.Vector(random(), random()).normalize();
    this.infectedAt = null;

    if (isInfected) {
      this.infectedAt = 0;
      this.pos = new p5.Vector(
        windowWidth / 2,
        windowHeight / 2
      );
    }
  }

  isInfected() {
    return this.infectedAt !== null;
  }

  isIll() {
    return this.isInfected() && this.infectedAt + INCUBATION_PERIOD < time
  }

  isHealthy() {
    return this.infectedAt === null;
  }

  update() {
    this.move();
    this.checkIfInfected();
    this.draw();
  }

  move() {
    if (this.isIll()) {
      if (this.pos.y > 50) {
        const x = random(0, windowWidth);
        const y = random(0, 50);
        this.pos = new p5.Vector(x, y);
      }
      else {
        this.angle.rotate(random(-1, 1) * PI / 10);
        this.pos.add(this.angle);
      }
    }
    else if (SOCIAL_DISTANCING_TIME <= time) {
      const home = this.getClosestHome();
      this.angle = home.pos.copy().sub(this.pos).normalize();
      this.pos.add(this.angle);
    }
    else {
      this.angle.rotate(random(-1, 1) * PI / 10);
      this.pos.add(this.angle);
    }
    this.limitPosition();
  }

  limitPosition () {
    const minY = this.isIll() ? 0 : 55;
    const maxY = this.isIll() ? 45 : windowHeight;
    this.pos.x = max(200, this.pos.x);
    this.pos.y = max(minY, this.pos.y);
    this.pos.x = min(windowWidth, this.pos.x);
    this.pos.y = min(maxY, this.pos.y);
  }

  checkIfInfected() {
    if (this.isInfected()) {
      return;
    }

    persons.forEach(person => {
      if (this === person || !person.isInfected()) {
        return;
      }
      if (this.pos.dist(person.pos) < CONTAMINATION_RADIUS) {
        this.infectedAt = time;
      }
    })
  }

  draw() {
    const x = Math.floor(this.pos.x);
    const y = Math.floor(this.pos.y);
    noStroke();
    if (this.isIll()) {
      fill(color(255, 0, 0, 50));
      ellipse(x, y, CONTAMINATION_RADIUS);
      fill(color("red"));
    } else if (this.isInfected()) {
      fill(color(255, 165, 0, 50));
      ellipse(x, y, CONTAMINATION_RADIUS);
      fill(color(255, 165, 0));
    } else {
      fill(color("green"));
    }
    ellipse(x, y, 2);
  }

  getClosestHome() {
    let closest = null;
    let dist = 99999;
    homes.forEach(home => {
      if (this.pos.dist(home.pos) < dist) {
        dist = this.pos.dist(home.pos);
        closest = home
      }
    });

    return closest;
  }
}
