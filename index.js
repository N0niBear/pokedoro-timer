//DATE AND TIME
function updateDateTime() {
    const now = new Date();

    const options = { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long',
        day: 'numeric' 
    };
   
    const dateString = now.toLocaleDateString(undefined, options);
    const timeString = now.toLocaleTimeString();

    document.getElementById('date').textContent = dateString;
    document.getElementById('time').textContent = timeString;
}

updateDateTime();
setInterval(updateDateTime, 1000);

//POMODORO TIMER
let studyCountdown;
let studyTimeLeft = 25 * 60;
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
        countdown = null;
        startBreakTimer();
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
  studyTimeLeft = 25 * 60;
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