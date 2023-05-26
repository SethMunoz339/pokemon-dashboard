

// Load search history from localStorage
var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
 
  
// Display search and clear search history
function displaySearchHistory() {
  $('#search-history').empty();
  for (var i = 0; i < searchHistory.length; i++) {
    var li = $('<li>').addClass('list-group-item').text(searchHistory[i]);
    $('#search-history').append(li);
  }
}

displaySearchHistory();

document.getElementById('clearButton').addEventListener('click', function() {
    localStorage.clear();
    alert('Your Pokedex storage has been emptied.');
    location.reload();
  });

  // Handle form submission
  $('#search-form').submit(function(event) {
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
        console.log(data)
        
    var pokeId = data.id
    var pokeName = data.name
    console.log(pokeId)
    console.log(pokeName)

    var pokeInfo = $('#pokeAPI');
   
      pokeInfo.empty()
      var pokeName = $('<h2>').text(data.name);
      pokeInfo.append( pokeName);
      var pokeId = $('<h3>').text(data.id);
      pokeInfo.append( pokeId);
      var sprite = $('<img>').attr('src', data.sprites.front_default);
      pokeInfo.append( sprite);
      var xp = $('<p>').text('Base Experience: ' + data.base_experience);
      pokeInfo.append( xp);
      var size = $('<p>').text('Height: ' + data.height + ' Weight: ' + data. weight);
      pokeInfo.append( size);
      var stats = $('<ul>').text('Base Stats');
        pokeInfo.append( stats);
      var HP = $('<li>').text('HP: ' + data.stats[0].base_stat)
      pokeInfo.append( HP);
      var attack = $('<li>').text('Attack: ' + data.stats[1].base_stat)
      pokeInfo.append( attack);
      var defense = $('<li>').text('Defense: ' + data.stats[2].base_stat)
      pokeInfo.append( defense)
      var specialAttack = $('<li>').text('Special Attack: ' + data.stats[3].base_stat)
      pokeInfo.append( specialAttack)
      var specialDefense = $('<li>').text('Special Defense: ' + data.stats[4].base_stat)
      pokeInfo.append( specialDefense)
      var speed = $('<li>').text('Speed: ' + data.stats[5].base_stat)
      pokeInfo.append( speed)
      var typeUl = $('<ul>').text('Type:');
      pokeInfo.append( typeUl);
      for (var i = 0; i < data.types.length; i++) {
        var type = $('<li>').text(data.types[i].type.name);
        pokeInfo.append( type)
      }

        


    })});