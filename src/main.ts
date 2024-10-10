import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;
const GAMENAME = "My not so amazing game";


document.title = GAMENAME;

// create header
const header = document.createElement("h1");
header.innerHTML = GAMENAME;
app.append(header);


const start_button = document.createElement('button');
start_button.innerHTML = '🥤🥗🍔🍗🍟🥓'
start_button.className = 'button'  // for style
app.append(start_button)

