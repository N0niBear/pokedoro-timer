//FILTER 
let currentTypeFilter = "";

//RETREIVING FROM LOCAL STORAGE
function getPokedex() {
  return JSON.parse(localStorage.getItem("pokedex") || "[]");
}

function setPokedex(arr) {
  localStorage.setItem("pokedex", JSON.stringify(arr));
}

//MAKING THE POKEDEX
function renderPokedex() {
  let pokedex = getPokedex();
  const list = document.getElementById("pokedexList");
  const countEl = document.getElementById("pokedexCount");

  list.innerHTML = "";

  if (currentTypeFilter) {
    pokedex = pokedex.filter(p => 
      Array.isArray(p.types) && p.types.includes(currentTypeFilter)
    );
  }

  if (pokedex.length === 0) {
    list.textContent = "No Pokémon caught yet!";
    if (countEl) countEl.textContent = "0";
    return;
  }

  pokedex.forEach(p => {
    const card = document.createElement("div");
    card.className = "pokemon-card";
    card.innerHTML = `
      <img src="${p.sprite}" alt="${p.name}">
      <p>${p.shiny ? "✨ " : ""}${p.name}</p>
      <button class="release-btn" data-id="${p.id}" data-shiny="${p.shiny}">Release</button>`;
    list.appendChild(card);
  });

   if (countEl) countEl.textContent = pokedex.length;
}

document.addEventListener("click", e => {
  if (e.target.classList.contains("release-btn")) {
    const id = Number(e.target.dataset.id);
    const shiny = e.target.dataset.shiny === "true";
    let pokedex = getPokedex();
    pokedex = pokedex.filter(p => !(p.id === id && p.shiny === shiny));
    setPokedex(pokedex);
    renderPokedex();
  }
});

//CLEAR THE POKEDEX
document.getElementById("clearPokedex").addEventListener("click", () => {
  setPokedex([]);
  renderPokedex();
});

//FILTERING TYPES
document.getElementById("typeFilter").addEventListener("change", (e) => {
  currentTypeFilter = e.target.value;  
  renderPokedex();                      
});

renderPokedex();


