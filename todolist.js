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