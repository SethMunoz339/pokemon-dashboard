

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
    alert('Your Pokedex storage has been emptied. Refresh the page.');
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

    // Fetch data of a pokemon by (name?) (ID#?)
    var pokemonCallURL = 'https://pokeapi.co/api/v2/pokemon/' + pokemonName;

    fetch(pokemonCallURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
        console.log(data)
    var pokeId = data[0].id
    var pokeName = data[0].name
    console.log(pokeId)
    console.log(pokeName)
    })});