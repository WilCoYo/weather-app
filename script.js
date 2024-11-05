function getWeatherData(latitude, longitude) {
    const apiKey = '48eae176860388e00dd35a01cd7de287';
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;
  
    return Promise.all([
      fetch(currentWeatherUrl).then(response => response.json()),
      fetch(forecastUrl).then(response => response.json())
    ]);
  }
  
  function displayWeather(currentWeather, forecast) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
  
    // Clear previous content
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';
  
    if (currentWeather.cod === '404') {
      weatherInfoDiv.innerHTML = `<p>${currentWeather.message}</p>`;
    } else {
      const cityName = currentWeather.name;
      const temperature = Math.round(currentWeather.main.temp);
      const description = currentWeather.weather[0].description;
      const iconCode = currentWeather.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  
      const temperatureHTML = `
        <p>${temperature}°F</p>
      `;
  
      const weatherHtml = `
        <p id="city-name">${cityName}</p>
        <p id="weather-description">${description}</p>
      `;
  
      tempDivInfo.innerHTML = temperatureHTML;
      weatherInfoDiv.innerHTML = weatherHtml;
      weatherIcon.src = iconUrl;
      weatherIcon.alt = description;
  
      showImage();
      displayHourlyForecast(forecast.list);
    }
  }
  
  function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
  
    const next24Hours = hourlyData.slice(0, 8); // Display the next 24 hours (3-hour intervals)
  
    next24Hours.forEach(item => {
      const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
      const hour = dateTime.getHours();
      const temperature = Math.round(item.main.temp);
      const iconCode = item.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
  
      const hourlyItemHtml = `
        <div class="hourly-item">
          <span>${hour}:00</span>
          <img src="${iconUrl}" alt="Hourly Weather Icon">
          <span>${temperature}°F</span>
        </div>
      `;
  
      hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
  }
  
  function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block'; // Make the image visible once it's loaded
  }
  
  const hourlyForecast = document.getElementById("hourly-forecast");
  
  hourlyForecast.addEventListener("wheel", (event) => {
    // Prevent default vertical scroll
    event.preventDefault();
    // Scroll horizontally based on the delta
    hourlyForecast.scrollLeft += event.deltaY;
  });
  
  window.addEventListener('DOMContentLoaded', () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        getWeatherData(position.coords.latitude, position.coords.longitude)
          .then(([currentWeather, forecast]) => {
            displayWeather(currentWeather, forecast);
          })
          .catch((error) => {
            console.error('Error fetching weather data:', error);
            alert('Error fetching weather data. Please try again later.');
          });
      },
      (error) => {
        console.error('Error getting user location:', error);
        alert('Error getting user location. Please check your location settings.');
      }
    );
  });
  
  VANTA.CLOUDS({
    el: "#vanta",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00
  });