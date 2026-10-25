function getRandomPokemonId(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let attack1 = 0;
let defense1 = 0;
let pokemonName1 = "";
let pokemonName2 = "";

// Função para limpar o resultado da batalha
function limparResultadoBatalha() {
  const resultContainer = document.querySelector(".battle-result");
  if (resultContainer) {
    resultContainer.innerHTML = "";
  }
}

// Carregar Pokémon 1
function carregarPokemon1() {
  limparResultadoBatalha();

  const container = document.getElementById("pokemon-container");
  if (!container) return;

  container.innerHTML = `<div class="col-12 text-center my-5"><p class="text-muted font-italic">Loading P1...</p></div>`;

  const randomId1 = getRandomPokemonId(1, 151);
  const url1 = `https://pokeapi.co/api/v2/pokemon/${randomId1}`;

  return fetch(url1)
    .then((response) => response.json())
    .then((data) => {
      pokemonName1 = data.name;
      const pokemonSprite = data.sprites.other?.showdown?.front_default || data.sprites.front_default;
      const pokemonTypes = data.types.map((t) => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)).join(", ");

      let hp = 0,
        attack = 0,
        defense = 0;
      data.stats.forEach((statObj) => {
        if (statObj.stat.name === "hp") hp = statObj.base_stat;
        if (statObj.stat.name === "attack") attack = statObj.base_stat;
        if (statObj.stat.name === "defense") defense = statObj.base_stat;
      });

      attack1 = attack;

      container.innerHTML = `
        <div class="col-12 text-center">
            <h1 class="text-capitalize font-weight-bold mb-3">${pokemonName1}</h1>
            <img src="${pokemonSprite}" alt="${pokemonName1}" class="img-fluid" style="height: 140px; width: 140px; object-fit: contain; image-rendering: pixelated;">
            <p class="font-weight-bold mt-3">Type: <span class="font-weight-normal text-capitalize">${pokemonTypes}</span></p>
            <hr>
            <h5>Base Stats:</h5>
            <ul class="list-unstyled">
              <li><strong>HP:</strong> ${hp}</li>
              <li><strong>Attack:</strong> ${attack}</li>
              <li><strong>Defense:</strong> ${defense}</li>
            </ul>
        </div>
      `;
    })
    .catch((error) => console.error("Error loading Pokémon 1:", error));
}

// Carregar Pokémon 2
function carregarPokemon2() {
  limparResultadoBatalha();

  const container2 = document.getElementById("pokemon-container2");
  if (!container2) return;

  container2.innerHTML = `<div class="col-12 text-center my-5"><p class="text-muted font-italic">Loading P2...</p></div>`;

  const randomId2 = getRandomPokemonId(1, 151);
  const url2 = `https://pokeapi.co/api/v2/pokemon/${randomId2}`;

  return fetch(url2)
    .then((response) => response.json())
    .then((data) => {
      pokemonName2 = data.name;
      const pokemonSprite = data.sprites.other?.showdown?.front_default || data.sprites.front_default;
      const pokemonTypes = data.types.map((t) => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)).join(", ");

      let hp = 0,
        attack = 0,
        defense = 0;
      data.stats.forEach((statObj) => {
        if (statObj.stat.name === "hp") hp = statObj.base_stat;
        if (statObj.stat.name === "attack") attack = statObj.base_stat;
        if (statObj.stat.name === "defense") defense = statObj.base_stat;
      });

      defense1 = defense;

      container2.innerHTML = `
        <div class="col-12 text-center">
            <h1 class="text-capitalize font-weight-bold mb-3">${pokemonName2}</h1>
            <img src="${pokemonSprite}" alt="${pokemonName2}" class="img-fluid" style="height: 140px; width: 140px; object-fit: contain; image-rendering: pixelated;">
            <p class="font-weight-bold mt-3">Type: <span class="font-weight-normal text-capitalize">${pokemonTypes}</span></p>
            <hr>
            <h5>Base Stats:</h5>
            <ul class="list-unstyled">
              <li><strong>HP:</strong> ${hp}</li>
              <li><strong>Attack:</strong> ${attack}</li>
              <li><strong>Defense:</strong> ${defense}</li>
            </ul>
        </div>
      `;
    })
    .catch((error) => console.error("Error loading Pokémon 2:", error));
}

// Carregar ambos pokemons ao iniciar ou clicar em NEW BATTLE
function onLoad() {
  limparResultadoBatalha();
  Promise.all([carregarPokemon1(), carregarPokemon2()]);
}

// Lógica da Batalha
function fight() {
  var resultContainer = document.querySelector(".battle-result");
  if (!resultContainer) return;

  let winnerText = "";

  if (attack1 > defense1) {
    winnerText = `${pokemonName1} WINS THE BATTLE!`;
  } else if (defense1 > attack1) {
    winnerText = `${pokemonName2} WINS THE BATTLE!`;
  } else {
    winnerText = `IT'S A TIE!`;
  }

  resultContainer.innerHTML = `
    <div class="col-12 mt-4 d-flex justify-content-center">
      <div class="p-4 text-center w-100" style="max-width: 600px; background-color: var(--retro-bg); border: 3px solid var(--retro-dark); box-shadow: 4px 4px 0px var(--retro-dark); border-radius: 0px;">
        <div style="font-family: 'Outfit'; font-size: 20px; color: var(--retro-dark); line-height: 1.8; text-transform: uppercase;">
          <strong>${winnerText}</strong>
        </div>
      </div>
    </div>
  `;
}
