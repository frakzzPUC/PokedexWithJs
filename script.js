const pokemonListElement = document.getElementById('pokemonList');

// Função para buscar informações do Pokemon na PokéAPI
async function getPokemonData(pokemonName) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Erro ao buscar dados do Pokemon: ${error}`);
  }
}

// Função para buscar informações de evolução do Pokemon na PokéAPI
async function getPokemonEvolution(pokemonSpeciesUrl) {
  try {
    const response = await fetch(pokemonSpeciesUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Erro ao buscar informações de evolução do Pokemon: ${error}`);
  }
}

// Função para converter a primeira letra de cada palavra para maiúscula
function capitalize(str) {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

// Função para criar e exibir o card do Pokemon
function displayPokemonCard(pokemonData) {
  const pokemonCardElement = document.createElement('div');
  pokemonCardElement.classList.add('pokemon-card');

  const pokemonImageElement = document.createElement('img');
  pokemonImageElement.classList.add('pokemon-image');
  pokemonImageElement.src = pokemonData.sprites.front_default;
  pokemonImageElement.alt = pokemonData.name;

  const pokemonNameElement = document.createElement('p');
  pokemonNameElement.classList.add('pokemon-name');
  pokemonNameElement.textContent = capitalize(pokemonData.name);

  const pokemonTypeElement = document.createElement('p');
  pokemonTypeElement.classList.add('pokemon-type');
  const types = pokemonData.types.map(type => capitalize(type.type.name)).join(', ');
  pokemonTypeElement.textContent = `Type(s): ${types}`;

  pokemonCardElement.appendChild(pokemonImageElement);
  pokemonCardElement.appendChild(pokemonNameElement);
  pokemonCardElement.appendChild(pokemonTypeElement);

  // Adiciona evento de clique para exibir detalhes do Pokemon
  pokemonCardElement.addEventListener('click', () => {
    alert(`Detalhes do Pokemon:\n\nNome: ${capitalize(pokemonData.name)}\nType(s): ${types}\nPeso: ${pokemonData.weight / 10} kg\nAltura: ${pokemonData.height / 10} m\nHabilidades: ${pokemonData.abilities.map(ability => capitalize(ability.ability.name)).join(', ')}\n`);
  });

  return pokemonCardElement;
}

// Função para exibir os Pokemons na lista
async function displayPokemonList() {
  try {
    // Limpa a lista de Pokemons antes de exibir
    pokemonListElement.innerHTML = '';

    // Busca os primeiros 50 Pokemons da PokéAPI
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
    const data = await response.json();

    // Para cada Pokemon, busca as informações de evolução e cria o card
    for (const pokemon of data.results) {
      const pokemonData = await getPokemonData(pokemon.name);
      const pokemonSpecies = await getPokemonEvolution(pokemonData.species.url);

      const pokemonCardElement = displayPokemonCard(pokemonData);
      pokemonListElement.appendChild(pokemonCardElement);

      // Se houver informações de evolução, adiciona ao card do Pokemon
      if (pokemonSpecies.evolves_from_species) {
        const evolutionData = await getPokemonData(pokemonSpecies.evolves_from_species.name);
        const evolutionNameElement = document.createElement('p');
        evolutionNameElement.classList.add('evolution-name');
        evolutionNameElement.textContent = `Evolves from: ${capitalize(evolutionData.name)}`;
        pokemonCardElement.appendChild(evolutionNameElement);
      }

      pokemonListElement.appendChild(pokemonCardElement);
    }
  } catch (error) {
    console.error(`Erro ao exibir a lista de Pokemons: ${error}`);
  }
}


// Função para obter a classe de estilo do tipo de Pokémon



// Função para criar o HTML dos cards dos Pokémons
function createPokemonCardHTML(pokemon) {
    const typeClasses = pokemon.types.map(type => getPokemonTypeStyle(type)).join(" ");
    const html = `
        <div class="pokemon-card">
            <div class="pokemon-image" style="background-image: url(${pokemon.image})">
            </div>
            <div class="pokemon-info">
                <h3 class="pokemon-name">${capitalizeFirstLetter(pokemon.name)}</h3>
                <p class="pokemon-type">${pokemon.types.join(", ")}</p>
            </div>
        </div>
    `;
    return html;
}

// Adiciona um evento de mouseover para alterar a cor de fundo do card do Pokémon
document.addEventListener("mouseover", function(event) {
    if (event.target.classList.contains("pokemon-card")) {
        event.target.style.backgroundColor = "lightgray";
    }
});

// Adiciona um evento de mouseout para restaurar a cor de fundo do card do Pokémon
document.addEventListener("mouseout", function(event) {
    if (event.target.classList.contains("pokemon-card")) {
        event.target.style.backgroundColor = "";
    }
});

// Chama a função para exibir a lista de Pokemons
displayPokemonList();