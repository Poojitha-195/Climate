const API_KEY = 'b1fd6e14799699504191b6bdbcadfc35';
const BASE_URL = `https://api.openweathermap.org/data/2.5/weather`;

const form = document.getElementById('form');
const cityInput = document.getElementById('city');
const infoDiv = document.getElementById('information');
const favoriteList = document.getElementById('Favorite');

// Load favorites from localStorage
window.onload = function () {
  const savedCities = JSON.parse(localStorage.getItem('favoriteCities')) || [];
  savedCities.forEach(city => addToFavorites(city));
};

// Form submission
form.addEventListener('submit', function(event) {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
    cityInput.value = '';
  }
});

// Fetch weather data
function fetchWeather(city) {
  const url = `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`;
  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("City not found");
      return response.json();
    })
    .then(data => {
      displayWeather(data);
      addToFavorites(data.name);
    })
    .catch(error => {
      infoDiv.innerHTML = `<p style="color:red;">${error.message}</p>`;
    });
}

// Display weather
function displayWeather(data) {
  infoDiv.innerHTML = `
    <h3>${data.name}, ${data.sys.country}</h3>
    <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
    <p><strong>Weather:</strong> ${data.weather[0].description}</p>
    <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
  `;
}

// Add to favorites
function addToFavorites(cityName) {
  const existing = Array.from(favoriteList.children).some(li => li.dataset.city === cityName);
  if (!existing) {
    const li = document.createElement('li');
    li.dataset.city = cityName;
    li.innerHTML = `
      <strong>${cityName}</strong>
      <button class="remove">Remove</button>
      <button class="edit">Edit</button>
      <button class="show">Show Weather</button>
    `;
    favoriteList.appendChild(li);
    saveToLocalStorage(cityName);
  }
}

// Save to localStorage
function saveToLocalStorage(cityName) {
  const savedCities = JSON.parse(localStorage.getItem('favoriteCities')) || [];
  if (!savedCities.includes(cityName)) {
    savedCities.push(cityName);
    localStorage.setItem('favoriteCities', JSON.stringify(savedCities));
  }
}

// Remove from localStorage
function removeFromLocalStorage(cityName) {
  let savedCities = JSON.parse(localStorage.getItem('favoriteCities')) || [];
  savedCities = savedCities.filter(city => city !== cityName);
  localStorage.setItem('favoriteCities', JSON.stringify(savedCities));
}

// Handle button clicks in favorite list
favoriteList.addEventListener('click', function(event) {
  const li = event.target.closest('li');
  const cityName = li.dataset.city;

  if (event.target.classList.contains('remove')) {
    li.remove();
    removeFromLocalStorage(cityName);
  }

  if (event.target.classList.contains('edit')) {
    const newCity = prompt('Edit city name:', cityName);
    if (newCity && newCity.trim() !== '') {
      li.remove();
      removeFromLocalStorage(cityName);
      fetchWeather(newCity.trim());
    }
  }

  if (event.target.classList.contains('show')) {
    fetchWeather(cityName);
  }
});
