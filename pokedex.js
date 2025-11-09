//RETREIVING FROM LOCAL STORAGE
function getPokedex() {
  return JSON.parse(localStorage.getItem("pokedex") || "[]");
}

function setPokedex(arr) {
  localStorage.setItem("pokedex", JSON.stringify(arr));
}

//MAKING THE POKEDEX
function renderPokedex() {
  const pokedex = getPokedex();
  const list = document.getElementById("pokedexList");
  list.innerHTML = "";

  if (pokedex.length === 0) {
    list.textContent = "No Pokémon caught yet!";
    return;
  }

  pokedex.forEach(p => {
    const card = document.createElement("div");
    card.className = "pokemon-card";
    card.innerHTML = `
      <img src="${p.sprite}" alt="${p.name}">
      <p>${p.shiny ? "✨ " : ""}${p.name}</p>
      <button class="release-btn" data-id="${p.id}" data-shiny="${p.shiny}">Release</button>
    `;
    list.appendChild(card);
  });

  document.getElementById("pokedexCount").textContent = pokedex.length;
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

renderPokedex();
