import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;
const GAMENAME = "My not so amazing game";

document.title = GAMENAME;

// create header
const header = document.createElement("h1");
header.innerHTML = GAMENAME;
app.append(header);


let burger_cnt: number = 0;
let growth_mux: number = 0;
// button
const start_button = document.createElement("button");
start_button.innerHTML = "🍔";
start_button.className = "button"; // for style
app.append(start_button);

start_button.addEventListener("click", () => {
  console.log("Burger button clicked!");
  burger_cnt++;
  burger_counter_element.innerHTML = `${burger_cnt} burgers`;
});


const PURCHASE_COST: number = 10
const purchase_button = document.createElement("button");
purchase_button.innerHTML = "Buy";
purchase_button.className = "button"; // for style
purchase_button.disabled = true; // disable the button
app.append(purchase_button);


purchase_button.addEventListener("click", () => {
  console.log("purchase button clicked!");
  burger_cnt -= PURCHASE_COST;
  growth_mux += 1;
});



// create a div element
const burger_counter_element = document.createElement("div");
burger_counter_element.innerHTML = "0 burgers";
app.append(burger_counter_element);

let _last_time: number = performance.now();
let _time_delta: number = 0;

function update() {
    _time_delta = (performance.now() - _last_time) / 1000
    _last_time = performance.now()

    if (burger_cnt >= PURCHASE_COST) {
        purchase_button.disabled = false; // enable the button
    } else {
        purchase_button.disabled = true; // disable the button
    }

    burger_cnt += growth_mux * _time_delta;
    burger_counter_element.innerHTML = `${burger_cnt.toFixed(3)} burgers`;

    requestAnimationFrame(update)
}

requestAnimationFrame(update);

