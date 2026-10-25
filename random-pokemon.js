// funcao para randomizar o pokemon
function getRandomPokemonId(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// funcao para fazer o fetch
function onLoad() {
  const container = document.getElementById("pokemon-container");
  if (container) {
    container.innerHTML = `
      <div class="col-12 text-center my-5">
        <p class="text-muted font-italic">Loading Pokémon data...</p>
      </div>
    `;
  }
  const randomId = getRandomPokemonId(1, 1025);

  const url = `https://pokeapi.co/api/v2/pokemon/${randomId}`;
  const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${randomId}`;

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      const pokemonName = data.name;
      const pokemonSprite = data.sprites.other?.showdown?.front_default || data.sprites.front_default;

      const pokemonTypes = data.types
        .map(function (typeObj) {
          return typeObj.type.name.charAt(0).toUpperCase() + typeObj.type.name.slice(1);
        })
        .join(", ");

      let hp = 0;
      let attack = 0;
      let defense = 0;

      for (let i = 0; i < data.stats.length; i++) {
        const statObj = data.stats[i];

        if (statObj.stat.name === "hp") {
          hp = statObj.base_stat;
        } else if (statObj.stat.name === "attack") {
          attack = statObj.base_stat;
        } else if (statObj.stat.name === "defense") {
          defense = statObj.base_stat;
        }
      }

      let pokemonMoves = "";
      const maxMoves = Math.min(data.moves.length, 6);

      for (let i = 0; i < maxMoves; i++) {
        let moveName = data.moves[i].move.name;
        // resolve os erros de texto
        moveName = moveName.replace(/-/g, " ");
        moveName = moveName.charAt(0).toUpperCase() + moveName.slice(1);

        if (i > 0) {
          pokemonMoves += ", ";
        }

        pokemonMoves += moveName;
      }

      data = {
        name: pokemonName,
        sprite: pokemonSprite,
        types: pokemonTypes,
        hp: hp,
        attack: attack,
        defense: defense,
      };

      const container = document.getElementById("pokemon-container");

      return fetch(speciesUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (speciesData) {
          const flavorTextEntry = speciesData.flavor_text_entries.find((entry) => entry.language.name === "en");

          const flavorText = flavorTextEntry ? flavorTextEntry.flavor_text.replace(/[\n\f\u00ad]/g, " ").replace(/\s+/g, " ") : "No description available.";

          container.innerHTML = `
        <div class="col-md-6 mb-3 mb-md-0">
          <h1 class="text-capitalize font-weight-bold mb-3">${pokemonName}</h1>
          <p class="font-weight-bold">Type: <span class="font-weight-normal text-capitalize">${pokemonTypes}</span></p>
          <hr>
          <h5 class="font-weight-bold">Base Stats:</h5>
          <ul class="list-unstyled">
            <li><strong>HP:</strong> ${hp}</li>
            <li><strong>Attack:</strong> ${attack}</li>
            <li><strong>Defense:</strong> ${defense}</li>
          </ul>
          <hr>
          <h5 class="font-weight-bold">Description:</h5>
          <p>${flavorText}</p>
          <h5 class="font-weight-bold">Moves:</h5>
          <p>${pokemonMoves}</p>
        </div>
        <div class="col-md-6 text-center">
          <img
            src="${pokemonSprite}"
            alt="${pokemonName}"
            class="img-fluid"
            style="height: 250px; width: 250px; object-fit: contain; image-rendering: pixelated;">
        </div>
       
      `;
        });
    })
    .catch(function (error) {
      console.error("Error fetching data:", error);
    });
}
