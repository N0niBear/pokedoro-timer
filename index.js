//DATE AND TIME
function updateDateTime() {
    const now = new Date();

    const dateOptions = { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long',
        day: 'numeric' 
    };

    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // set to false for 24-hour time
    };
   
    const dateString = now.toLocaleDateString(undefined, dateOptions);
    const timeString = now.toLocaleTimeString(undefined, timeOptions);

    document.getElementById('date').textContent = dateString;
    document.getElementById('time').textContent = timeString;
}

updateDateTime();
setInterval(updateDateTime, 1000);

//POMODORO TIMER
let studyCountdown;
let studyTimeLeft = 60;
let isStudyPaused = false;

function updateStudyTimer() {
    let minutes = Math.floor(studyTimeLeft / 60);
    let seconds = studyTimeLeft % 60;
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    const formattedTime = minutes + ":" + seconds;
    
    document.getElementById("studyTimer").textContent = formattedTime;
}
//START BUTTON
function startStudyTimer() {
  if (studyCountdown || onBreak) return;
  isStudyPaused = false;
  studyCountdown = setInterval(() => {
    if (!isStudyPaused) {
      studyTimeLeft--;
      updateStudyTimer();

      if (studyTimeLeft <= 0) {
        clearInterval(studyCountdown);
        studyCountdown = null;
        showPokemonPopup();
      }
    }
  }, 1000);
}
//PAUSE BUTTON
function pauseStudyTimer() {
  isStudyPaused = !isStudyPaused;
  const pauseBtn = document.getElementById("pauseButton");
  pauseBtn.textContent = isStudyPaused ? "Resume" : "Pause";
}
//RESET BUTTON
function resetStudyTimer() {
  clearInterval(studyCountdown);
  studyCountdown = null;
  isStudyPaused = false;
  studyTimeLeft = 60;
  document.getElementById("pauseButton").textContent = "Pause";
  updateStudyTimer();
}


//BREAK TIMER
let breakCountdown;
let breakTimeLeft = 5 * 60;
let isBreakPaused = false;
let onBreak = false;

function updateBreakTimer() {
  let minutes = Math.floor(breakTimeLeft / 60);
  let seconds = breakTimeLeft % 60;
  if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    const formattedTime = minutes + ":" + seconds;
    
    document.getElementById("breakTimer").textContent = formattedTime;
}
//START BREAK
function startBreakTimer() {
  if (breakCountdown) return;
  onBreak = true;
  isBreakPaused = false;
  alert("You made it 25 minutes! Take your 5 minute break!")

  breakCountdown = setInterval(() => {
    if (!isBreakPaused) {
      breakTimeLeft--;
      updateBreakTimer();

      if (breakTimeLeft <= 0) {
        clearInterval(breakCountdown);
        breakCountdown = null;
        alert("Break's over! Get ready for another poke-venture!");
        resetAllTimers();
      }
    }
  }, 1000);
}
//PAUSE BREAK
function pauseBreakTimer() {
  isBreakPaused = !isBreakPaused;
  const pauseBtn = document.getElementById("pauseBreak");
  pauseBtn.textContent = isBreakPaused ? "Resume" : "Pause";
}
//RESET BREAK
function resetBreakTimer() {
  clearInterval(breakCountdown);
  breakCountdown = null;
  isBreakPaused = false;
  breakTimeLeft = 5 * 60;
  document.getElementById("pauseBreak").textContent = "Pause";
  updateBreakTimer();
}

//RESET BOTH
function resetAllTimers(){
  resetStudyTimer();
  resetBreakTimer();
  onBreak = false;
}

document.getElementById("startButton").addEventListener("click", startStudyTimer);
document.getElementById("pauseButton").addEventListener("click", pauseStudyTimer);
document.getElementById("resetButton").addEventListener("click", resetStudyTimer);

document.getElementById("startBreak").addEventListener("click", startBreakTimer);
document.getElementById("pauseBreak").addEventListener("click", pauseBreakTimer);
document.getElementById("resetBreak").addEventListener("click", resetBreakTimer);

updateStudyTimer();
updateBreakTimer();

//POKEMON CATCHER
//RANDOM POKEMON
async function getRandomPokemon() {
  const randomId = Math.floor(Math.random() * 1025) + 1;
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
  const data = await response.json();
  return data;
}

//POPUP
let currentPokemon = null;

async function showPokemonPopup() {
  const pokemon = await getRandomPokemon();
  const shiny = rollShiny();
  const spriteUrl = pickSprite(pokemon, shiny);
  const types = pokemon.types.map(t => t.type.name);
  const title = shiny 
  ? `A SHINY ${pokemon.name.toUpperCase()} appeared!`
  : `A wild ${pokemon.name.toUpperCase()} appeared!`;

  document.getElementById("pokemonName").textContent = title;
  document.getElementById("pokemonSprite").src = spriteUrl;
  document.getElementById("pokemonPopup").style.display = "block";

  currentPokemon = {
    id: pokemon.id,
    name: pokemon.name,
    type: pokemon.type,
    sprite: spriteUrl,
    shiny: shiny,
    types: types
  };
}

//SHINY POKEMON CHANCE
const shiny_odds = 4096; //want to lower this near end for more chances

//for testing the shiny rolls - set to null when not testing
const shiny_test_odds = 1; 

function rollShiny() {
  const odds = shiny_test_odds ?? shiny_odds;
  return Math.floor(Math.random() * odds) === 0;
}

function pickSprite(pokemon, isShiny) {
  const s = pokemon.sprites;
  const candidates = isShiny
    ? [
        s.front_shiny,
        s.other?.home?.front_shiny,
        s.other?.["official-artwork"]?.front_shiny,
        s.other?.dream_world?.front_default,
        s.front_default
      ]
    : [
        s.front_default,
        s.other?.home?.front_default,
        s.other?.["official-artwork"]?.front_default,
        s.other?.dream_world?.front_default
      ];
  return candidates.find(Boolean) || "";
}

//CATCH BUTTON
document.getElementById("catchButton").addEventListener("click", () => {
  if (!currentPokemon) return;

  const pokedex = getPokedex();

  const alreadyCaught = pokedex.some(
    p => p.id === currentPokemon.id && p.shiny === currentPokemon.shiny
  );

  if (!alreadyCaught) {
    pokedex.push(currentPokemon);
    setPokedex(pokedex);
    const label = currentPokemon.shiny
      ? `SHINY ${currentPokemon.name.toUpperCase()}`
      : currentPokemon.name.toUpperCase();
    alert(`${label} was caught!`);
  } else {
    const label = currentPokemon.shiny
      ? `SHINY ${currentPokemon.name.toUpperCase()}`
      : currentPokemon.name.toUpperCase();
    alert(`You already have ${label}!`);
  }

  document.getElementById("pokemonPopup").style.display = "none";
  currentPokemon = null;
});

//RELEASE BUTTON
document.getElementById("releaseButton").addEventListener("click", () => {
  document.getElementById("pokemonPopup").style.display = "none";
});

function getPokedex() {
  return JSON.parse(localStorage.getItem("pokedex") || "[]");
}
function setPokedex(arr) {
  localStorage.setItem("pokedex", JSON.stringify(arr));
}

//TO DO LIST
//defining a key name for local storage
const STORAGE_KEY = "toDoList"; 
//retrieving from local storage
function getToDos() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; //gets it from the key, and nothing stored then [] returns empty array
  } catch {
    return [];
  }
}
//saving to storage
function setToDos(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); //turns into text for storage
}
//render the list
function render() {
  const listEl = document.getElementById("toDoList"); //grabs element from HTML
  const todos = getToDos(); //retrieving from storage

  listEl.innerHTML = ""; //clears

  todos.forEach((item, idx) => { //looping over each item
    const li = document.createElement("li"); //creating a new LI
    li.dataset.index = idx; //saves the position where it's at for deleting/checking later

    const checkbox = document.createElement("input"); //creating a checkbox for each new LI
    checkbox.type = "checkbox";
    checkbox.checked = item.checked; 
    checkbox.className = "todo-checkbox";
    li.appendChild(checkbox);

    //add the text
    const textSpan = document.createElement("span");
    textSpan.className = "todo-text";
    textSpan.textContent = item.text;
    li.appendChild(textSpan);

    const close = document.createElement("span");
    close.className = "close";
    close.textContent = "\u00D7"; //weird unicode for multiplication symbol for close button
    li.appendChild(close);

    listEl.appendChild(li);
  });
}

//ADDING NEW LI
function newElement() {
  const input = document.getElementById("listInput");
  const text = input.value.trim();

  if (!text) {
    alert("You have to type something!");
    return;
  }

  const todos = getToDos();
  todos.push({ text, checked: false });
  setToDos(todos);
  input.value = "";
  render();
}

//EVENT DELEGATING
document.getElementById("toDoList").addEventListener("click", function (ev) {
  const target = ev.target;

  if (target.classList.contains("close")) {
    const li = target.closest("li");
    const idx = Number(li.dataset.index);
    const todos = getToDos();
    todos.splice(idx, 1);
    setToDos(todos);
    render();
    return;
  } 
});

//checkbox changes
document.getElementById("toDoList").addEventListener("change", function (ev) {
  const target = ev.target;

  if (target.classList.contains("todo-checkbox")) {
    const li = target.closest("li");
    const idx = Number(li.dataset.index);
    const todos = getToDos();
    todos[idx].checked = target.checked;
    setToDos(todos);
  }
});


//USE ENTER KEY TO ADD - accessibility
document.getElementById("listInput").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    newElement();
  }
});

document.addEventListener("DOMContentLoaded", render);
