// Load search history from localStorage
var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
// Display search history
function displaySearchHistory() {
  $('#search-history').empty();
  var uniqueHistory = new Set(searchHistory);
  uniqueHistory.forEach(function(entry) {
    var li = $('<li>').addClass('list-group-item').text(entry);
    $('#search-history').append(li);
  });
}

displaySearchHistory();

// modal calls and functions
function openClearModal() {
  document.getElementById("modal-clear").classList.add("is-active");
}

function closeClearModal() {
  document.getElementById("modal-clear").classList.remove("is-active");
}

function openErrorModal() {
  document.getElementById("modal-error").classList.add("is-active");
}

function closeErrorModal() {
  document.getElementById("modal-error").classList.remove("is-active");
}

function clearLocalStorage() {
  localStorage.clear();
  document.getElementById("modal-clear").classList.remove("is-active");
  location.reload();
}


document.getElementById('clearButton').addEventListener('click', openClearModal);
document.getElementById('modal-delete').addEventListener('click', closeClearModal);
document.getElementById('modal-error-delete').addEventListener('click', closeErrorModal);
document.getElementById('clearLocalStorage').addEventListener('click', clearLocalStorage);
// submit search form
$('#search-form').submit(function(event) {
  event.preventDefault();
  var pokemonName = $('#search-input').val().toLowerCase().trim();
  if (pokemonName === '') {
    return;
  }
  $('#search-input').val('');
  // add search to search history
  searchHistory.push(pokemonName);
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  displaySearchHistory();
  var pokemonCallURL = 'https://pokeapi.co/api/v2/pokemon/' + pokemonName;
  fetch(pokemonCallURL)
    .then(function(response) {
      // handle 404 errors for bad searches (see .catch)
      if (!response.ok) {
        throw new Error('Pokemon not found');
      }
      return response.json();
    })
    // set pokeAPI data to local storage
    .then(function (data) {
      console.log(data);
      var pokeId = data.id;
      var pokeName = data.name;
      console.log(pokeId);
      console.log(pokeName);
      localStorage.setItem('pokeGo', JSON.stringify(pokeId));
      localStorage.setItem('pokeName', JSON.stringify(pokeName));
      // Code to display Pokemon information from pokeAPI in first info container
      var pokeInfo = $('#pokeAPI');
      pokeInfo.empty();
      var pokeTitle = $('<h1>').text('Gotta Catch em All!');
      pokeInfo.append(pokeTitle);
      var pokeName = $('<h2>').text(data.name);
      pokeInfo.append(pokeName);
      var pokeId = $('<h3>').text(data.id);
      pokeInfo.append(pokeId);
      var sprite = $('<img id=sprite>').attr('src', data.sprites.front_default);
      pokeInfo.append(sprite);
      var xp = $('<p>').text('Base Experience: ' + data.base_experience);
      pokeInfo.append(xp);
      var size = $('<p>').text('Height: ' + data.height + ' Weight: ' + data.weight);
      pokeInfo.append(size);
      var stats = $('<ul>').text('Base Stats');
      pokeInfo.append(stats);
      var HP = $('<li>').text('HP: ' + data.stats[0].base_stat);
      pokeInfo.append(HP);
      var attack = $('<li>').text('Attack: ' + data.stats[1].base_stat);
      pokeInfo.append(attack);
      var defense = $('<li>').text('Defense: ' + data.stats[2].base_stat);
      pokeInfo.append(defense);
      var specialAttack = $('<li>').text('Special Attack: ' + data.stats[3].base_stat);
      pokeInfo.append(specialAttack);
      var specialDefense = $('<li>').text('Special Defense: ' + data.stats[4].base_stat);
      pokeInfo.append(specialDefense);
      var speed = $('<li>').text('Speed: ' + data.stats[5].base_stat);
      pokeInfo.append(speed);
      var typeUl = $('<ul>').text('Type:');
      pokeInfo.append(typeUl);
      for (var i = 0; i < data.types.length; i++) {
        var type = $('<li>').text(data.types[i].type.name);
        pokeInfo.append(type);
      }
      // calls the next function
      fetchPokemonGoData();
    })
    // handle 404 errors for bad searches
    .catch(function(error) {
      openErrorModal()
      console.error(error);

      var index = searchHistory.indexOf(pokemonName);
      if (index > -1) {
        searchHistory.splice(index, 1);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        displaySearchHistory();
      }
    });
});

// call data from pogoAPI
function fetchPokemonGoData(pokeGo) {
  var pokemonGoCallURL = 'https://pogoapi.net/api/v1/pokemon_stats.json';
  fetch(pokemonGoCallURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Code to display Pokemon information from pokeAPI in second info container
      var pokeGoInfo = $('#pogoAPI');
      pokeGoInfo.empty();
      var pokeGoTitle = $('<h1>').text('Pokemon GO!');
      pokeGoInfo.append(pokeGoTitle);
      var typeUl = $('<ul>').text('Pokemon Go - Base Statistics:');
      pokeGoInfo.append(typeUl);
      for (var i = 0; i < data.length; i++) {
        if (data[i].pokemon_id === pokeGo) {
          var baseAttack = $('<li>').text('Base attack: ' + data[i].form + ' - ' + data[i].base_attack);
          pokeGoInfo.append(baseAttack);
          var baseDefense = $('<li>').text('Base defense: ' + data[i].form + ' - ' + data[i].base_defense);
          pokeGoInfo.append(baseDefense);
          var baseStamina = $('<li>').text('Base stamina: ' + data[i].form + ' - ' + data[i].base_stamina);
          pokeGoInfo.append(baseStamina);
          localStorage.removeItem(pokeGo);
        }
      }
      // calls the next function
      fetchRarePokemonGoData(pokeGo);
    });
}
// call data from pogoAPI
function fetchRarePokemonGoData(pokeGo) {
  var rarePokemonGoCallURL = 'https://pogoapi.net/api/v1/pokemon_rarity.json';
  fetch(rarePokemonGoCallURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Code to display Pokemon information from pogoAPI in first info container
      console.log(data);
      var rarityInfo = $('#rarity');
      rarityInfo.empty();
      var pokeGo = JSON.parse(localStorage.getItem('pokeGo')) || [];
      var legendaryIndex = 0;
      var mythicIndex = 0;
      var standardIndex = 0;
      var ultraBeastIndex = 0;
      // for loop cycles through several different arrays to find rarity
      for (var j = 0; j < data.Legendary.length; j++) {
        if (data.Legendary[j].form == 'Normal' && data.Legendary[j].pokemon_id === pokeGo) {
          var Legendary = $('<h2>').text('Rarity: ' + data.Legendary[j].rarity);
          rarityInfo.append(Legendary);
          legendaryIndex++;
          break;
        }
      }
      for (var k = 0; k < data.Mythic.length; k++) {
        if (data.Mythic[k].form == 'Normal' && data.Mythic[k].pokemon_id === pokeGo) {
          var Mythic = $('<h2>').text('Rarity: ' + data.Mythic[k].rarity);
          rarityInfo.append(Mythic);
          mythicIndex++;
          break;
        }
      }
      for (var l = 0; l < data.Standard.length; l++) {
        if (data.Standard[l].form == 'Normal' && data.Standard[l].pokemon_id === pokeGo) {
          var Standard = $('<h2>').text('Rarity: ' + data.Standard[l].rarity);
          rarityInfo.append(Standard);
          standardIndex++;
          break;
        }
      }
      for (var m = 0; m < data["Ultra beast"].length; m++) {
        if (data["Ultra beast"][m].form == 'Normal' && data["Ultra beast"][m].pokemon_id === pokeGo) {
          var Ultrabeast = $('<h2>').text('Rarity: ' + data["Ultra beast"][m].rarity);
          rarityInfo.append(Ultrabeast);
          ultraBeastIndex++;
          break;
        }
      }
      // calls the next function
      fetchEvolutionPokemonGoData(pokeGo)
    }
    )
};
// call data from pogoAPI
function fetchEvolutionPokemonGoData(pokeGo) {
  var evolutionPokemonGoCallURL = 'https://pogoapi.net/api/v1/pokemon_evolutions.json';
  fetch(evolutionPokemonGoCallURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      // Code to display Pokemon information from pogoAPI in first info container
      var evolveInfo = $('#evolve');
      evolveInfo.empty();
      // for loop cycles through data to find evolution
      var pokeGo = JSON.parse(localStorage.getItem('pokeGo')) || [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].form == 'Normal' && data[i].pokemon_id === pokeGo) {
          var evolutions = data[i].evolutions;
          for (var j = 0; j < evolutions.length; j++) {
            var evoName = evolutions[j].pokemon_name
            var evolution = $('<p>').text('This pokemon evolves into ' + evoName + '!');
            // on click the button "evolves" the pokemon by running a submit with the name of the pokemon from local storage
            var evolveButton = $('<button id=evoButton>').text(evoName)
              .on('click', evolveButton, function () {
                var evoName = $(this).text();
                $('#search-input').val(evoName);
                $('#search-form').submit();
              })
            evolveInfo.append(evolution)
            evolveInfo.append(evolveButton);
          }
        }
      }
    });
     // calls the next function
    fetchSpeciesData()
}
// call data from pokeAPI
function fetchSpeciesData(pokeName) {
  var pokeName = JSON.parse(localStorage.getItem('pokeName')) || [];
  var pokemonSpeciesCallURL = 'https://pokeapi.co/api/v2/pokemon-species/' + pokeName;
  fetch(pokemonSpeciesCallURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      // Code to display Pokemon information from pokeAPI in second info container
      var pokeGoInfo = $('#pogoAPI');
      for (var i = 0; i < data.flavor_text_entries.length; i++) {
        if (data.flavor_text_entries[i].language.name == 'en') {
          var flavor = $('<h1 id=flavor>').text(data.flavor_text_entries[i].flavor_text);
          pokeGoInfo.append(flavor);
          break;
        }}})}
// adds bulma css to information containers
function addCSS () {
  var element = document.getElementById('main')
  element.classList.add('column')

  var element = document.getElementById('main')
  element.classList.add('is-5')

  var element = document.getElementById('pogoAPI')
  element.classList.add('column')

  var element = document.getElementById('pogoAPI')
  element.classList.add('is-5')

  var element = document.getElementById('pogoAPI')
  element.classList.remove('hide')
}
// runs submit function from search history elements
$(document).on('click', '.list-group-item', function () {
  var pokemonName = $(this).text();
  $('#search-input').val(pokemonName);
  $('#search-form').submit();
  addCSS()
});