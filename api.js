// Carrega os Pokémon de uma geração
function loadGen(limit, offset) {
  const url = "https://pokeapi.co/api/v2/pokemon?limit=" + limit + "&offset=" + offset;

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let promises = [];

      // Carrega os detalhes de cada Pokémon
      for (let i = 0; i < data.results.length; i++) {
        let pokemonId = offset + i + 1;

        promises.push(
          fetch("https://pokeapi.co/api/v2/pokemon/" + pokemonId).then(function (response) {
            return response.json();
          }),
        );
      }

      // Espera que todos os Pokémon sejam carregados
      Promise.all(promises)
        .then(function (pokemonData) {
          allPokemons = pokemonData;
          applyFilters();
        })
        .catch(function (error) {
          console.error("Error loading Pokémon details:", error);
          showError("Error loading Pokémon.");
        });
    })
    .catch(function (error) {
      console.error("Error fetching Pokémon:", error);
      showError("Error loading Pokémon.");
    });
}

// Carrega a lista de nomes e IDs de todos os Pokémon
function initGlobalSearch() {
  fetch("https://pokeapi.co/api/v2/pokemon?limit=1025")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      globalMasterList = [];

      for (let i = 0; i < data.results.length; i++) {
        let pokemon = data.results[i];

        globalMasterList.push({
          name: pokemon.name,
          id: i + 1,
          url: pokemon.url,
        });
      }
    })
    .catch(function (error) {
      console.error("Error loading Pokémon list:", error);
    });
}
