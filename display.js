//função para mostrar os pokemons na página + stats + tipos
function displayPokemons(listToDisplay) {
  const gridContainer = document.getElementById("pokedex-grid");
  gridContainer.innerHTML = "";

  listToDisplay.forEach((pokeData) => {
    const types = pokeData.types.map((t) => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)).join(", ");
    const sprite = pokeData.sprites.front_default;

    gridContainer.innerHTML += `
      <div class="col-md-3 mb-4">
        <div class="card text-center shadow-sm h-100" onclick="openPokemonModal(${pokeData.id})" style="cursor: pointer;">
          <img src="${sprite}" class="card-img-top p-2" alt="${pokeData.name}" style="height: 140px; object-fit: contain; image-rendering: pixelated;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title text-capitalize font-weight-bold">${pokeData.name}</h5>
            <p class="card-text text-muted mb-1">#${pokeData.id}</p>
            <p class="card-text small text-secondary mb-3"><strong>Type:</strong> ${types}</p>
            <div class="text-left small mt-auto border-top pt-2">
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

// funcao para mostrar que está a tentar carregar
function showLoading() {
  const gridContainer = document.getElementById("pokedex-grid");
  gridContainer.innerHTML = `<div class="col-12 text-center"><h3>Loading Pokémon...</h3></div>`;
}

function showError(message) {
  const gridContainer = document.getElementById("pokedex-grid");
  gridContainer.innerHTML = `<div class="col-12 text-center text-danger"><h3>${message}</h3></div>`;
}
