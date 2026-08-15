class Car {
  #brand;
  #model;
  speed = 0;
  isTrunkOpen = false;

  constructor(carDetails) {
    this.#brand = carDetails.brand;
    this.#model = carDetails.model;
  }

  displayInfo() {
    const trunkStatus = this.isTrunkOpen === true ? "Open" : "Close";

    console.log(
      `${this.#brand} ${this.#model}, Speed: ${this.speed} km/h, Trunk: ${trunkStatus}`,
    );
  }

  go() {
    if (this.speed <= 200 && this.isTrunkOpen === false) this.speed += 5;
  }

  brake() {
    if (this.speed > 0) this.speed -= 5;
  }

  openTrunk() {
    if (this.speed === 0) this.isTrunkOpen = true;
  }

  closeTrunk() {
    this.isTrunkOpen = false;
  }
}

class RaceCar extends Car {
  acceleration;

  constructor(carDetails) {
    super(carDetails);

    this.acceleration = carDetails.acceleration;
  }

  go() {
    this.speed += this.acceleration;

    if (this.speed > 300) {
      this.speed = 300;
    }
  }

  openTrunk() {
    console.log("Race cars do not have a trunk.");
  }

  closeTrunk() {
    console.log("Race cars do not have a trunk.");
  }
}

const car1 = new Car({
  brand: "Toyota",
  model: "Corolla",
});
const car2 = new Car({
  brand: "Peugeot",
  model: "207",
});

car1.go();
car1.go();
car1.brake();
car1.openTrunk();
car1.brake();
car1.openTrunk();

car1.displayInfo();
car2.displayInfo();

const raceCar = new RaceCar({
  brand: "McLaren",
  model: "F1",
  acceleration: 20,
});

raceCar.displayInfo();

raceCar.go();
raceCar.go();
raceCar.go();

raceCar.displayInfo();
raceCar.brake();
raceCar.displayInfo();
