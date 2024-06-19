function getWeather() {
  const apiKey = "1a5b7c7a02dac0f3d1ec923eab3b5666";
  const unsplashApiKey = "4lqzfZVXciTYwwD7QF79SuM5xHeJFG1DcTzdxcSz7xQ";
  const city = document.getElementById("city").value;

  if (!city) {
    alert("please enter a city");
    return;
  }

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
  const unsplashUrl = `https://api.unsplash.com/photos/random?query=${city}&client_id=${unsplashApiKey}`;

  //console.log(currentWeatherUrl);
  //   console.log(forecastUrl);

  fetch(currentWeatherUrl)
    .then((response) => response.json())
    .then((data) => {
      displayWeather(data);
    })
    .catch((error) => {
      console.error("Error fetching current weather data:", error);
      alert("error fetching current weather data. please try again.");
    });
  //console.log(data.list);

  fetch(forecastUrl)
    .then((response) => response.json())
    .then((data) => {
      displayDailyForecast(data.list);
    })
    .catch((error) => {
      console.log("error fetching forecast data:", error);
      alert("error fetching forecast data. please try again");
    });

  fetch(unsplashUrl)
    .then((response) => response.json())
    .then((data) => {
      setBackgroundImage(data.urls.regular);
    })
    .catch((error) => {
      console.error("Background image not found:", error);
      document.body.style.backgroundImage = 'url("default-bg.png")';
    });
}

function displayWeather(data) {
  const tempDivInfo = document.getElementById("temp-div");
  const weatherInfoDiv = document.getElementById("weather-info");
  const weatherIcon = document.getElementById("weather-icon");
  const dailyForecastDiv = document.getElementById("daily-forecast");

  // Clear previous content
  weatherInfoDiv.innerHTML = "";
  dailyForecastDiv.innerHTML = "";
  tempDivInfo.innerHTML = "";

  if (data.cod === "404") {
    weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
  } else {
    const cityName = data.name;
    const temperature = Math.round(data.main.temp - 273.15);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    const temperatureHTML = `<p>${temperature}°C</p>`;
    const weatherHtml = `<span>${cityName}</span><span> | <span>${description}</span>`;

    tempDivInfo.innerHTML = temperatureHTML;
    weatherInfoDiv.innerHTML = weatherHtml;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;

    showImage();
  }
}

function displayDailyForecast(forecastData) {
  const dailyForecastDiv = document.getElementById("daily-forecast");

  const dailyData = forecastData.filter((item) =>
    item.dt_txt.includes("12:00:00")
  ); // Filter data to get daily forecasts at noon

  dailyData.forEach((item) => {
    const dateTime = new Date(item.dt * 1000); // Convert to milliseconds
    const day = dateTime.toLocaleDateString("en-US", { weekday: "long" });
    const temperature = Math.round(item.main.temp - 273.15); // Convert to Celsius
    const iconCode = item.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

    const dailyItemHtml = `
        <div class="daily-item">
          <span>${day}</span>
          <img src="${iconUrl}" alt="Daily Weather Icon">
          <span>${temperature}°C</span>
        </div>
      `;

    dailyForecastDiv.innerHTML += dailyItemHtml;
  });
}

function setBackgroundImage(imageUrl) {
  document.body.style.backgroundImage = `url(${imageUrl})`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
}

function showImage() {
  const weatherIcon = document.getElementById("weather-icon");
  weatherIcon.style.display = "block"; // Make the image visible once it's loaded
}
// function hideSearchButton(){
//   const searchButton = document.getElementById("search-button");
//   searchButton.style.display=none;
// }
