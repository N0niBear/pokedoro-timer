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

//NAVBAR
function myFunction() {
  var x = document.getElementById("myNavBar");
  if (x.className === "navBar") {
    x.className += " responsive";
  } else {
    x.className = "navBar";
  }
}

//POMODORO TIMER
let studyCountdown;
let studyTimeLeft = 60;
let isStudyPaused = false;
let onBreak = false;

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
  showMessage("Great job! Break time started!", "rgba(54, 162, 235, 0.8)");

  breakCountdown = setInterval(() => {
    if (!isBreakPaused) {
      breakTimeLeft--;
      updateBreakTimer();

      if (breakTimeLeft <= 0) {
        clearInterval(breakCountdown);
        breakCountdown = null;
        showMessage("Break’s over! Ready for another Poké-venture?", "rgba(255, 206, 86, 0.9)");
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
    sprite: spriteUrl,
    shiny: shiny,
    types: types
  };
}

//SHINY POKEMON CHANCE
const shiny_odds = 4096; //want to lower this near end for more chances

//for testing the shiny rolls - set to null when not testing
const shiny_test_odds = null; 

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

  let pokedex = JSON.parse(localStorage.getItem("pokedex")) || []; //let instead of const

  const alreadyCaught = pokedex.some(
    p => p.id === currentPokemon.id && p.shiny === currentPokemon.shiny
  );

  if (!alreadyCaught) {
    pokedex.push(currentPokemon);
    localStorage.setItem("pokedex", JSON.stringify(pokedex));
    const label = currentPokemon.shiny
      ? `SHINY ${currentPokemon.name.toUpperCase()}`
      : currentPokemon.name.toUpperCase();
    showMessage(`${label} was caught!`, "rgba(255, 206, 86, 0.8)");
  } else {
    const label = currentPokemon.shiny
      ? `SHINY ${currentPokemon.name.toUpperCase()}`
      : currentPokemon.name.toUpperCase();
    showMessage(`You already have ${label}!`, "rgba(153, 102, 255, 0.8)");
  }

  document.getElementById("pokemonPopup").style.display = "none";
  currentPokemon = null;
  startBreakTimer(); //automatically start break timer on catch
});

//RELEASE BUTTON
document.getElementById("releaseButton").addEventListener("click", () => {
  document.getElementById("pokemonPopup").style.display = "none";
  currentPokemon = null;
  startBreakTimer();
});

//MESSAGES INSTEAD OF ALERT
function showMessage(msg, color = "rgba(255, 99, 132, 0.7)") {
  const box = document.getElementById("messageBox");
  box.textContent = msg;
  box.style.background = color;
  box.classList.add("show");

  // Auto-hide message after 5 seconds
  setTimeout(() => {
    box.classList.remove("show");
  }, 5000);
}
