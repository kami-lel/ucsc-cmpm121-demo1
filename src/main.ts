import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;
const GAMENAME = "My not so amazing game";

document.title = GAMENAME;

// create header
const header = document.createElement("h1");
header.innerHTML = GAMENAME;
app.append(header);

// button
const start_button = document.createElement("button");
start_button.innerHTML = "🍔";
start_button.className = "button"; // for style
app.append(start_button);

// create a div element
const burger_counter_element = document.createElement("div");
burger_counter_element.innerHTML = "0 burgers";
app.append(burger_counter_element);

// changing
let burger_cnt: number = 0;

start_button.addEventListener("click", () => {
  console.log("Burger button clicked!");
  burger_cnt++;
  burger_counter_element.innerHTML = `${burger_cnt} burgers`;
});


// infinite loop using setInterval
setInterval(() => {
    burger_cnt++;
    burger_counter_element.innerHTML = `${burger_cnt} burgers`;
}, 1000); // updates every 1000 ms (1 second)
