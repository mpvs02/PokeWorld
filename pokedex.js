let allPokemons = [];
let currentGenLimit = 151;
let currentGenOffset = 0;
let selectedType = "";

// Limpa a pesquisa
function resetSearchInput() {
  document.getElementById("search-input").value = "";
}

// Muda a geração
function changeGen(genNumber) {
  const genMap = {
    1: { limit: 151, offset: 0 },
    2: { limit: 100, offset: 151 },
    3: { limit: 135, offset: 251 },
    4: { limit: 107, offset: 386 },
    5: { limit: 156, offset: 493 },
    6: { limit: 72, offset: 649 },
    7: { limit: 88, offset: 721 },
    8: { limit: 96, offset: 809 },
    9: { limit: 120, offset: 905 },
  };

  const generation = genMap[genNumber];

  if (!generation) {
    return;
  }

  currentGenLimit = generation.limit;
  currentGenOffset = generation.offset;

  resetSearchInput();

  loadGen(currentGenLimit, currentGenOffset);
}

// Seleciona um tipo de Pokémon
function changeType(typeName) {
  selectedType = typeName;
  applyFilters();
}

// Filtra os Pokémon pelo tipo
function applyFilters() {
  let filteredPokemons = [];

  for (let i = 0; i < allPokemons.length; i++) {
    let pokemon = allPokemons[i];
    let hasType = false;

    if (selectedType === "") {
      hasType = true;
    } else {
      for (let j = 0; j < pokemon.types.length; j++) {
        if (pokemon.types[j].type.name === selectedType) {
          hasType = true;
        }
      }
    }

    if (hasType) {
      filteredPokemons.push(pokemon);
    }
  }

  if (filteredPokemons.length === 0) {
    showError("No Pokémon found for this type.");
  } else {
    displayPokemons(filteredPokemons);
  }
}

// Abre a janela com os detalhes do Pokémon
function openPokemonModal(pokemonId) {
  let selectedPokemon = null;

  // Procura o Pokémon pelo ID
  for (let i = 0; i < allPokemons.length; i++) {
    if (allPokemons[i].id === pokemonId) {
      selectedPokemon = allPokemons[i];
      break;
    }
  }

  if (selectedPokemon === null) {
    return;
  }

  const modalBody = document.getElementById("modal-body-content");

  // Procura a imagem do Pokémon
  let pokemonSprite = selectedPokemon.sprites.front_default;

  if (selectedPokemon.sprites.other) {
    if (selectedPokemon.sprites.other.showdown) {
      if (selectedPokemon.sprites.other.showdown.front_default) {
        pokemonSprite = selectedPokemon.sprites.other.showdown.front_default;
      }
    }
  }

  // Procura os atributos
  let hp = 0;
  let attack = 0;
  let defense = 0;

  for (let i = 0; i < selectedPokemon.stats.length; i++) {
    let stat = selectedPokemon.stats[i];

    if (stat.stat.name === "hp") {
      hp = stat.base_stat;
    } else if (stat.stat.name === "attack") {
      attack = stat.base_stat;
    } else if (stat.stat.name === "defense") {
      defense = stat.base_stat;
    }
  }

  // Junta os tipos numa única string
  let types = "";

  for (let i = 0; i < selectedPokemon.types.length; i++) {
    let typeName = selectedPokemon.types[i].type.name;
    typeName = typeName.charAt(0).toUpperCase() + typeName.slice(1);

    if (i > 0) {
      types += ", ";
    }

    types += typeName;
  }
  /* puxa os moves */
  let pokemonMoves = "";
  let maxMoves = Math.min(selectedPokemon.moves.length, 6);

  for (let i = 0; i < maxMoves; i++) {
    let moveName = selectedPokemon.moves[i].move.name;
    // Substitui hifens por espaços e capitaliza
    moveName = moveName.replace(/-/g, " ");
    moveName = moveName.charAt(0).toUpperCase() + moveName.slice(1);

    if (i > 0) {
      pokemonMoves += ", ";
    }

    pokemonMoves += moveName;
  }

  if (selectedPokemon.moves.length > 6) {
    pokemonMoves;
  }

  // Procura a descrição do Pokémon
  const speciesUrl = "https://pokeapi.co/api/v2/pokemon-species/" + selectedPokemon.id;

  fetch(speciesUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (speciesData) {
      let flavorText = "No description available.";

      for (let i = 0; i < speciesData.flavor_text_entries.length; i++) {
        let entry = speciesData.flavor_text_entries[i];

        if (entry.language.name === "en") {
          flavorText = entry.flavor_text;
          break;
        }
      }

      // Corrige o texto estranho
      flavorText = flavorText.replace(/[\n\f]/g, " ").replace(/pokémon/gi, "Pokémon");

      // Apresenta os detalhes na janela
      modalBody.innerHTML = `
      <div class="text-center">
          <h2 class="text-capitalize font-weight-bold mb-3">
            ${selectedPokemon.name}
          </h2>

          <img
            src="${pokemonSprite}"
            alt="${selectedPokemon.name}"
            class="img-fluid"
            style="height: 150px; object-fit: contain; image-rendering: pixelated;"
          >

          <p class="font-weight-bold mt-3">ID: #${selectedPokemon.id}</p>

          <hr>

          <p class="card-text small text-secondary mb-3">
            <strong>Type:</strong> ${types}
          </p>

          <hr>

          <h5 class="text-left font-weight-bold">Base Stats:</h5>

          <ul class="list-unstyled text-left">
            <li><strong>HP:</strong> ${hp}</li>
            <li><strong>Attack:</strong> ${attack}</li>
            <li><strong>Defense:</strong> ${defense}</li>
          </ul>

          <hr>

          <h5 class="text-left font-weight-bold">Description:</h5>

          <p class="card-text small text-secondary text-left mb-3">
            ${flavorText}
          </p>
          <hr>

          <h5 class="text-left font-weight-bold">Attacks / Moves:</h5>

          <p class="card-text small text-secondary text-left mb-3">
            ${pokemonMoves || "No moves available."}
          </p>
        </div>
      `;

      $("#pokemonModal").modal("show");
    })
    .catch(function (error) {
      console.error("Error loading Pokémon description:", error);
      showError("Error loading Pokémon details.");
    });
}

// Pesquisa Pokémon pelo nome ou ID
function filterByNameOrId(searchTerm) {
  let query = searchTerm.toLowerCase().trim();

  // Se a pesquisa estiver vazia, volta à geração selecionada
  if (query === "") {
    applyFilters();
    return;
  }

  if (globalMasterList.length === 0) {
    showError("Please wait, loading Pokémon database...");
    return;
  }

  let matches = [];

  // Procura correspondências na lista global
  for (let i = 0; i < globalMasterList.length; i++) {
    let pokemon = globalMasterList[i];

    if (pokemon.name.toLowerCase().includes(query) || pokemon.id.toString() === query) {
      matches.push(pokemon);
    }
  }

  if (matches.length === 0) {
    showError('No Pokémon found matching "' + searchTerm + '".');
    return;
  }

  // Limita os resultados a 12 Pokémon
  let limit = matches.length;

  if (limit > 12) {
    limit = 12;
  }

  let promises = [];

  for (let i = 0; i < limit; i++) {
    let matchedPokemon = matches[i];
    let existingPokemon = null;

    // Verifica se já temos os dados deste Pokémon
    for (let j = 0; j < allPokemons.length; j++) {
      if (allPokemons[j].id === matchedPokemon.id) {
        existingPokemon = allPokemons[j];
        break;
      }
    }

    if (existingPokemon !== null) {
      promises.push(Promise.resolve(existingPokemon));
    } else {
      promises.push(
        fetch(matchedPokemon.url).then(function (response) {
          return response.json();
        }),
      );
    }
  }

  // Espera que todos os Pokémon sejam carregados
  Promise.all(promises)
    .then(function (pokemonData) {
      for (let i = 0; i < pokemonData.length; i++) {
        let pokemon = pokemonData[i];
        let alreadyExists = false;

        for (let j = 0; j < allPokemons.length; j++) {
          if (allPokemons[j].id === pokemon.id) {
            alreadyExists = true;
            break;
          }
        }

        if (!alreadyExists) {
          allPokemons.push(pokemon);
        }
      }

      displayPokemons(pokemonData);
    })
    .catch(function (error) {
      console.error("Error searching Pokémon:", error);
      showError("Error searching Pokémon.");
    });
}

// Inicia a página
window.onload = function () {
  changeGen(1);
  initGlobalSearch();
};
