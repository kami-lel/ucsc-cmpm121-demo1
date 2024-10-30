import "./style.css";

// constant declaration
const GAME_NAME = "Burger Cooking Mania";
const INITIAL_BURGER_COUNT = 0;
const PURCHASE_GROWTH_RATE = 1.15;

// set up HTML document & app
document.title = GAME_NAME;
const app: HTMLDivElement = document.querySelector("#app")!;
const header = document.createElement("h1");
header.innerHTML = GAME_NAME;
app.append(header);

// create count number
const burgerCounter = {
  html_element: document.createElement("div"),
  value: INITIAL_BURGER_COUNT,

  updateDisplay(): void {
    this.html_element.innerText = `${this.value.toFixed(5)} burgers`;
  },
};
app.append(burgerCounter.html_element);

// burger button
const burgerButtonElement = document.createElement("button");
burgerButtonElement.innerText = "🍔";
burgerButtonElement.className = "button"; // for style

burgerButtonElement.addEventListener("click", () => {
  console.log("Burger button clicked!");
  burgerCounter.value++;
});

app.append(burgerButtonElement);

// upgradable
const upgradableTableElement = document.createElement("table");
upgradableTableElement.innerHTML = `
  <thead>
    <tr>
      <th></th>
      <th>Purchase\n(burgers/purchase)</th>
      <th>Owned</th>
      <th>Contribution\n(burgers/sec)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td id='name-a'></td>
      <td>
        <button class='button' id='button-a'></button>
      </td>
      <td id='count-a'></td>
      <td id='rate-a'></td>
      <td>🛒 Keep your pantry perpetually stocked with all the essentials for endless culinary creativity.</td>
    </tr>
    <tr>
      <td id='name-b'></td>
      <td>
        <button class='button' id='button-b'></button>
      </td>
      <td id='count-b'></td>
      <td id='rate-b'></td>
      <td>👨‍🍳 Gain a virtual sous-chef to help streamline your kitchen tasks and elevate your cooking game.</td>
    </tr>
    <tr>
      <td id='name-c'></td>
      <td>
        <button class='button' id='button-c'></button>
      </td>
      <td id='count-c'></td>
      <td id='rate-c'></td>
      <td>📜 Unlock exclusive recipes from top chefs to transform your menu into a gourmet paradise.</td>
    </tr>
    <tr>
      <td id='name-d'></td>
      <td>
        <button class='button' id='button-d'></button>
      </td>
      <td id='count-d'></td>
      <td id='rate-d'></td>
      <td>📜 Unlock exclusive recipes from top chefs to transform your menu into a gourmet paradise.</td>
    </tr>
    <tr>
      <td id='name-e'></td>
      <td>
        <button class='button' id='button-e'></button>
      </td>
      <td id='count-e'></td>
      <td id='rate-e'></td>
      <td>🍴 Revamp your kitchen with premium appliances and decor that redefine culinary elegance.</td>
    </tr>
    <tr>
      <td>Total</td>
      <td></td>
      <td></td>
      <td id='rate-total'></td>
      <td></td>
    </tr>
  </tbody>
`;

app.append(upgradableTableElement);

interface Item {
  name: string;
  cost: number;
  rate: number;
}

class Upgradable implements Item {
  public name: string;
  public cost: number;
  public rate: number;

  private count: number = 0; // make count private
  private codeName: string;
  private buttonElement: HTMLButtonElement | null;
  private countElement: HTMLElement | null;
  private rateElement: HTMLElement | null;

  constructor(name: string, codeName: string, cost: number, rate: number) {
    this.name = name;
    this.codeName = codeName;
    this.cost = cost;
    this.rate = rate;

    this.buttonElement = document.getElementById(
      `button-${codeName}`,
    ) as HTMLButtonElement;
    if (this.buttonElement) {
      this.buttonElement.addEventListener("click", () => {
        console.log(`Purchase button ${this.codeName} clicked!`);
        burgerCounter.value -= this.cost;
        this.count++;
        this.cost *= PURCHASE_GROWTH_RATE;
      });
    }

    this.countElement = document.getElementById(`count-${codeName}`);
    this.rateElement = document.getElementById(`rate-${codeName}`);

    // update header name
    const headerElement = document.getElementById(`name-${codeName}`);
    if (headerElement) {
      headerElement.innerText = this.name;
    }
  }

  public get perSecondRate(): number {
    // make accessor public
    return this.count * this.rate;
  }

  public calculateAddition(timeDelta: number): number {
    // make method public
    return timeDelta * this.perSecondRate;
  }

  public update(): void {
    // make method public
    if (this.buttonElement) {
      this.buttonElement.disabled = burgerCounter.value < this.cost;

      this.buttonElement.innerText = `${this.cost.toFixed(3)}`;
    }
    if (this.countElement) {
      this.countElement.innerText = this.count.toString();
    }
    if (this.rateElement) {
      this.rateElement.innerText = `${this.perSecondRate.toFixed(3)}`;
    }
  }
}

const PURCHASE_COSTS = [
  10, // cost for purchase A
  100, // cost for purchase B
  1000, // cost for purchase C
  5000, // cost for purchase D
  25000, // cost for purchase E
];

const upgradables = [
  new Upgradable("Grill Booster Pack", "a", PURCHASE_COSTS[0], 0.1),
  new Upgradable("Ingredient Refill Bundle", "b", PURCHASE_COSTS[1], 2),
  new Upgradable("Chef Assistant Boost", "c", PURCHASE_COSTS[2], 50),
  new Upgradable("Gourmet Recipe Collection", "d", PURCHASE_COSTS[3], 200),
  new Upgradable("Luxury Kitchen Upgrade", "e", PURCHASE_COSTS[4], 1000),
];

// main update loop

let lastTime: number = performance.now();
let timeDelta: number = 0;

const totalRateElement = document.getElementById("rate-total");
if (!totalRateElement) {
  console.error("Total rate element not found.");
}

function update() {
  timeDelta = (performance.now() - lastTime) / 1000; // sec since last update
  lastTime = performance.now();

  let totalAddition = 0;
  let totalRate = 0;
  for (const upgradable of upgradables) {
    upgradable.update();
    totalAddition += upgradable.calculateAddition(timeDelta);
    totalRate += upgradable.perSecondRate;
  }

  burgerCounter.value += totalAddition;

  if (totalRateElement) {
    totalRateElement.innerText = `${totalRate.toFixed(3)}`;
  }

  burgerCounter.updateDisplay();

  requestAnimationFrame(update);
}

requestAnimationFrame(update);
