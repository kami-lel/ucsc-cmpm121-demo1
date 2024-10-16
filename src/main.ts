import "./style.css";

// constant declaration
const GAMENAME = "My not so amazing game";
const INIT_BURGER_CNT = 1000;
const PURCHASE_A_COST = 10;
const PURCHASE_B_COST = 100;
const PURCHASE_C_COST = 1000;

// set up HTML document & app
document.title = GAMENAME;
const app: HTMLDivElement = document.querySelector("#app")!;
const header = document.createElement("h1");
header.innerHTML = GAMENAME;
app.append(header);

// create count number
const burger_count = {
  html_element: document.createElement("div"),
  value: INIT_BURGER_CNT,

  update(): void {
    this.html_element.innerText = `${this.value.toFixed(5)} burgers`;
  },
};
app.append(burger_count.html_element);

// burger button
const burger_button_element = document.createElement("button");
burger_button_element.innerText = "🍔";
burger_button_element.className = "button"; // for style

burger_button_element.addEventListener("click", () => {
  console.log("Burger button clicked!");
  burger_count.value++;
});

app.append(burger_button_element);

// upgradable
const upgradable_table_element = document.createElement("table");
upgradable_table_element.innerHTML = `
  <thead>
    <tr>
      <th></th>
      <th>Purchase</th>
      <th>Owned</th>
      <th>Contribution\n(burges/sec)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>A</td>
      <td>
        <button class='button' id='button-a'>
          ${PURCHASE_A_COST} burgers/purchase
        </button>
      </td>
      <td id='count-a'></td>
      <td id='rate-a'></td>
    </tr>
    <tr>
      <td>B</td>
      <td>
        <button class='button' id='button-b'>
          ${PURCHASE_B_COST} burgers/purchase
        </button>
      </td>
      <td id='count-b'></td>
      <td id='rate-b'></td>
    </tr>
    <tr>
      <td>C</td>
      <td>
        <button class='button' id='button-c'>
          ${PURCHASE_C_COST} burgers/purchase
        </button>
      </td>
      <td id='count-c'></td>
      <td id='rate-c'></td>
    </tr>
    <tr>
      <td>total</td>
      <td></td>
      <td></td>
      <td id='rate-total'></td>
    </tr>
  </tbody>
`;
app.append(upgradable_table_element);

class Upgradable {
  count: number = 0;
  cost: number;
  name: string;

  multiplier: number;
  button_element: HTMLButtonElement | null;
  count_element: HTMLElement | null;
  rate_element: HTMLElement | null;

  constructor(cost: number, multiplier: number, name: string) {
    this.cost = cost;
    this.multiplier = multiplier;
    this.name = name;

    this.button_element = document.getElementById(`button-${name}`) as HTMLButtonElement;
    if (this.button_element) {
      this.button_element.addEventListener("click", () => {
        console.log(`purchase button ${this.name} clicked!`);
        burger_count.value -= this.cost;
        this.count++;
      });
    }

    this.count_element = document.getElementById(`count-${name}`);
    this.rate_element = document.getElementById(`rate-${name}`);
  }

  get per_sec_rate(): number {
    return this.count * this.multiplier;
  }

  calc_addition(time_delta: number): number {
    return time_delta * this.per_sec_rate;
  }

  update(): void {
    if (this.button_element) {
      this.button_element.disabled = burger_count.value < this.cost;
    }
    if (this.count_element) {
      this.count_element.innerText = this.count.toString();
    }
    if (this.rate_element) {
      this.rate_element.innerText = `${this.per_sec_rate.toFixed(3)}`;
    }
  }
}

const upgradable_a = new Upgradable(PURCHASE_A_COST, 0.1, "a");
const upgradable_b = new Upgradable(PURCHASE_B_COST, 2, "b");
const upgradable_c = new Upgradable(PURCHASE_C_COST, 50, "c");













// main update loop

let _last_time: number = performance.now();
let time_delta: number = 0;

const total_rate_element = document.getElementById("rate-total");
if (!total_rate_element) {
  console.error("Total rate element not found.");
}

function update() {
  time_delta = (performance.now() - _last_time) / 1000; // sec since last update
  _last_time = performance.now();

  upgradable_a.update();
  upgradable_b.update();
  upgradable_c.update();
  burger_count.update();

  const total_addition =
    upgradable_a.calc_addition(time_delta) +
    upgradable_b.calc_addition(time_delta) +
    upgradable_c.calc_addition(time_delta);
    burger_count.value += total_addition;

  const total_rate =
    upgradable_a.per_sec_rate +
    upgradable_b.per_sec_rate +
    upgradable_c.per_sec_rate;
  if (total_rate_element) {
    total_rate_element.innerText = `${total_rate.toFixed(3)}`;
  }

  requestAnimationFrame(update);
}

requestAnimationFrame(update);
