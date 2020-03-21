let numberOfPeople = 200;
const INITIAL_INFECTED_PEOPLE = 1;
const CONTAMINATION_RADIUS = 5;
const INCUBATION_PERIOD = 5;
const NUMBER_OF_HOMES = 100;
let SOCIAL_DISTANCING_TIME = 1;

let persons = [];
let homes = [];
let totalSeconds = 0;
let time = 0;
let homeImg;

class Home {
  constructor() {
    let x = random(10, windowWidth - 10);
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

class Person {
  constructor(infected = false) {
    this.pos = new p5.Vector(
      random() * windowWidth,
      random() * windowHeight
    );

    this.angle = new p5.Vector(random(), random()).normalize();
    this.infectedAt = infected ? 0 : null;
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

  update() {
    this.move();
    this.checkContamination();
    this.draw();
  }

  checkContamination() {
    persons.forEach(person => {
      if (this.isInfected() || person.isHealthy() || this === person) {
        return
      }
      if (this.pos.dist(person.pos) < CONTAMINATION_RADIUS) {
        this.infectedAt = time;
      }
    })
  }

  draw() {
    noStroke();
    if (this.isIll()) {
      fill(color(255, 0, 0, 50));
      ellipse(
        Math.floor(this.pos.x),
        Math.floor(this.pos.y), CONTAMINATION_RADIUS);
      fill(color("red"));
    } else if (this.isInfected()) {
      fill(color(255, 165, 0, 50));
      ellipse(
        Math.floor(this.pos.x),
        Math.floor(this.pos.y), CONTAMINATION_RADIUS);
      fill(color(255, 165, 0));
    } else {
      fill(color("green"));
    }
    ellipse(Math.floor(this.pos.x), Math.floor(this.pos.y), 2);
  }

  move() {
    if (this.isIll()) {
      if (this.pos.y > 50) {
        const x = random(0, windowWidth);
        const y = random(0, 50);
        this.pos = new p5.Vector(x, y);
      }

      return;
    } else if (SOCIAL_DISTANCING_TIME <= time) {
      const home = this.getClosestHome();
      this.angle = home.pos.copy().sub(this.pos).normalize()
    } else {
      this.angle.rotate(random(-1, 1) * PI / 10);
    }
    this.pos.add(this.angle);

    this.pos.x = max(0, this.pos.x);
    this.pos.y = max(55, this.pos.y);
    this.pos.x = min(windowWidth, this.pos.x);
    this.pos.y = min(windowHeight, this.pos.y);
  }
}

function drawStats() {
  fill(50);

  let s = `People: ${persons.length}`;
  text(s, windowWidth - 150, 10, 150, 50);

  const infectedPeople = persons.filter(p => p.isInfected()).length
  s = `Infected: ${infectedPeople} (${Math.floor(infectedPeople / persons.length * 100)}%)`;
  text(s, windowWidth - 150, 25, 150, 50);

  s = `Cases: ${persons.filter(p => p.isIll()).length}`;
  text(s, windowWidth - 150, 40, 150, 50);

  s = `Day: ${time}`;
  text(s, windowWidth - 150, 55, 150, 50);
}

function createInputs() {
  createElement('p', "Number of people").position(10, 0)
  let inp = createInput(numberOfPeople);
  inp.position(10, 35);
  inp.input(numberOfPeopleInputEvent);

  createElement('p', "Social Distancing at day").position(10, 40)
  let sd_time = createInput(SOCIAL_DISTANCING_TIME);
  sd_time.position(10, 75);

  button = createButton('Start simulation');
  button.position(10, 95);
  button.mousePressed(() => {
    SOCIAL_DISTANCING_TIME = sd_time.value()
    setup()
  });
}

function numberOfPeopleInputEvent() {
  numberOfPeople = this.value();
}

function preload() {
  homeImg = loadImage('home.png');
}

function setup() {
  createInputs();

  createCanvas(windowWidth, windowHeight);

  totalSeconds = 0;
  persons = [];
  for (let i = 0; i < numberOfPeople; i++) {
    const isInfected = i < INITIAL_INFECTED_PEOPLE;
    persons.push(new Person(isInfected));
  }

  homes = [];
  for (let i = 0; i < NUMBER_OF_HOMES; i++) {
    homes.push(new Home());
  }
}

function drawHospital() {
  fill(color(30, 180, 22, 50));
  rect(0, 0, windowWidth, 50);
}

function draw() {
  background(220);

  drawHospital();

  totalSeconds += deltaTime;
  time = Math.floor(totalSeconds / (60 * 60));
  homes.forEach(home => home.draw());
  persons.forEach(person => person.update());

  drawStats();

}
