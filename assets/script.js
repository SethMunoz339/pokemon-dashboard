

// Load search history from localStorage
var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

// Display search and clear search history
function displaySearchHistory() {
  $('#search-history').empty();
  var uniqueHistory = new Set(searchHistory); // Create a Set to store unique entries

  uniqueHistory.forEach(function (entry) {
    var li = $('<li>').addClass('list-group-item').text(entry);
    $('#search-history').append(li);
  });
}

displaySearchHistory();

document.getElementById('clearButton').addEventListener('click', function () {
  localStorage.clear();
  alert('Your Pokedex storage has been emptied.');
  location.reload();
});

// Handle form submission
$('#search-form').submit(function (event) {
  event.preventDefault();
  var pokemonName = $('#search-input').val().trim();

  if (pokemonName === '') {
    return;
  }

  // Clear input field
  $('#search-input').val('');

  // Add pokemon name to search history
  searchHistory.push(pokemonName);
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  displaySearchHistory();

  // Fetch data of a pokemon by name
  var pokemonCallURL = 'https://pokeapi.co/api/v2/pokemon/' + pokemonName;

  fetch(pokemonCallURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      var pokeId = data.id;
      var pokeName = data.name;
      console.log(pokeId);
      console.log(pokeName);
      localStorage.setItem('pokeGo', JSON.stringify(pokeId));

      var pokeInfo = $('#pokeAPI');

      pokeInfo.empty();
      var pokeTitle = $('<h1>').text('Gotta Catch em All!');
      pokeInfo.append(pokeTitle);
      var pokeName = $('<h2>').text(data.name);
      pokeInfo.append(pokeName);
      var pokeId = $('<h3>').text(data.id);
      pokeInfo.append(pokeId);
      var sprite = $('<img>').attr('src', data.sprites.front_default);
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

      var pokeGo = JSON.parse(localStorage.getItem('pokeGo')) || [];
      fetchPokemonGoData(pokeGo);
    });
});

function fetchPokemonGoData(pokeGo) {
  var pokemonGoCallURL = 'https://pogoapi.net/api/v1/pokemon_stats.json';

  fetch(pokemonGoCallURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
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

      fetchRarePokemonGoData(pokeGo);
    });
}

function fetchRarePokemonGoData(pokeGo) {
  var rarePokemonGoCallURL = 'https://pogoapi.net/api/v1/pokemon_rarity.json';

  fetch(rarePokemonGoCallURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var rarityInfo = $('#rarity');
      rarityInfo.empty();
      var pokeGo = JSON.parse(localStorage.getItem('pokeGo')) || [];

      var legendaryIndex = 0;
      var mythicIndex = 0;
      var standardIndex = 0;
      var ultraBeastIndex = 0;

      // for (var i = 0; i < pokeGo.length; i++) {
      //   var currentPokemon = pokeGo[i];
      //   console.log(currentPokemon)

        for (var j = 0; j < data.Legendary.length; j++) {
          if (data.Legendary[j].form == 'Normal' && data.Legendary[j].pokemon_id === pokeGo) {
            var Legendary = $('<h1>').text('Rarity: ' + data.Legendary[j].rarity);
            rarityInfo.append(Legendary);
            legendaryIndex++;
            break;
          }
        }

        for (var k = 0; k < data.Mythic.length; k++) {
          if (data.Mythic[k].form == 'Normal' && data.Mythic[k].pokemon_id === pokeGo) {
            var Mythic = $('<h1>').text('Rarity: ' + data.Mythic[k].rarity);
            rarityInfo.append(Mythic);
            mythicIndex++;
            break;
          }
        }

        for (var l = 0; l < data.Standard.length; l++) {
          if (data.Standard[l].form == 'Normal' && data.Standard[l].pokemon_id === pokeGo) {
            var Standard = $('<h1>').text('Rarity: ' + data.Standard[l].rarity);
            rarityInfo.append(Standard);
            standardIndex++;
            break;
          }
        }

        for (var m = 0; m < data["Ultra beast"].length; m++) {
          if (data["Ultra beast"][m].form == 'Normal' && data["Ultra beast"][m].pokemon_id === pokeGo) {
            var Ultrabeast = $('<h1>').text('Rarity: ' + data["Ultra beast"][m].rarity);
            rarityInfo.append(Ultrabeast);
            ultraBeastIndex++;
            break;
          }
        }
      }
    )};



$(document).on('click', '.list-group-item', function () {
  var pokemonName = $(this).text();
  $('#search-input').val(pokemonName);
  $('#search-form').submit();
});