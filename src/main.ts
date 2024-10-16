import "./style.css";

// constant declaration
const GAMENAME = "Burger Cooking Mania";
const INIT_BURGER_CNT = 0;
const PURHCASE_GROWTH_RATE = 1.15;














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













// upgradable realted
const upgradable_table_element = document.createElement("table");
upgradable_table_element.innerHTML = `
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
    </tr>
    <tr>
      <td id='name-b'></td>
      <td>
        <button class='button' id='button-b'></button>
      </td>
      <td id='count-b'></td>
      <td id='rate-b'></td>
    </tr>
    <tr>
      <td id='name-c'></td>
      <td>
        <button class='button' id='button-c'></button>
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


interface Item {
  name: string,
  cost: number,
  rate: number
};


class Upgradable implements Item {
  name: string;
  cost: number;
  rate: number;

  count: number = 1;
  code_name: string;
  button_element: HTMLButtonElement | null;
  count_element: HTMLElement | null;
  rate_element: HTMLElement | null;

  constructor(name: string, code_name: string, cost: number, rate: number) {
    this.name = name;
    this.code_name = code_name;
    this.cost = cost;
    this.rate = rate;


    this.button_element = document.getElementById(`button-${code_name}`) as HTMLButtonElement;
    if (this.button_element) {
      this.button_element.addEventListener("click", () => {
        console.log(`purchase button ${this.code_name} clicked!`);
        burger_count.value -= this.cost;
        this.count++;
        this.cost *= PURHCASE_GROWTH_RATE;
      });
    }

    this.count_element = document.getElementById(`count-${code_name}`);
    this.rate_element = document.getElementById(`rate-${code_name}`);


    // update header name
    const header_element = document.getElementById(`name-${code_name}`);
    if (header_element) {
      header_element.innerText = this.name;
    }

  }

  get per_sec_rate(): number {
    return this.count * this.rate;
  }

  calc_addition(time_delta: number): number {
    return time_delta * this.per_sec_rate;
  }

  update(): void {
    if (this.button_element) {
      this.button_element.disabled = burger_count.value < this.cost;

      this.button_element.innerText = `${this.cost.toFixed(3)}`;
    }
    if (this.count_element) {
      this.count_element.innerText = this.count.toString();
    }
    if (this.rate_element) {
      this.rate_element.innerText = `${this.per_sec_rate.toFixed(3)}`;
    }
  }
}


const upgradables : Upgradable[] = [
  new Upgradable('Grill Booster Pack', 'a', 10, 0.1),
  new Upgradable('Ingredient Refill Bundle', 'b', 100, 2),
  new Upgradable('Chef Assistant Boost', 'c', 1000, 50)
];















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

  let total_addition = 0
  let total_rate = 0
  for (const upgradable of upgradables) {
    upgradable.update();
    total_addition += upgradable.calc_addition(time_delta);
    total_rate += upgradable.per_sec_rate;
  }

  burger_count.value += total_addition;

  if (total_rate_element) {
    total_rate_element.innerText = `${total_rate.toFixed(3)}`;
  }

  burger_count.update();

  requestAnimationFrame(update);
}

requestAnimationFrame(update);
