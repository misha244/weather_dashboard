// declare API key
const APIkey = "12197a025c93ca0e295dc1dd5f7a68c1";

const renderCities = (city) => {
  // For each city construct a list item and append to the list group
  const listItem = `<li class="list-item" id="city">${city}</li>`;
  $(".list").prepend(listItem);
};
const getCurrentData = (cityName, currentData) => {
  // from object extract the data points you need for the return data
  const data = {
    name: cityName,
    date: getDate(currentData.dt),
    iconURL: getIconUrl(currentData.weather),
    temperature: currentData.temp,
    humidity: currentData.humidity,
    windSpeed: currentData.wind_speed,
    uvIndex: currentData.uvi,
  };
  return data;
};
const getForecastData = (oneApiData) => {
  // iterate and construct the return data array
  const data = {
    date: getDate(oneApiData.dt),
    iconURL: getIconUrl(oneApiData.weather),
    temperature: oneApiData.temp.day,
    humidity: oneApiData.humidity,
  };
  return data;
};

const getDate = (datetime) => {
  // convert to date
  const date = new Date(0);
  date.setUTCSeconds(datetime);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
};

const getIconUrl = (weather) => {
  // get icon code and construct url
  const iconCode = weather[0].icon;
  const url = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  return url;
};

const renderCurrentCardComponent = (currentData) => {
  // from current data build the current card component
  const currentWeather = `<div class="d-flex justify-content-center">
  <h2>${currentData.name}, ${currentData.date} <img src="${currentData.iconURL}" /></h2>
  </div>
<div class="mx-4">
  <div class="m-1">Temperature: ${currentData.temperature} °C</div>
  <div class="m-1">Humidity: ${currentData.humidity}%</div>
  <div class="m-1">Wind Speed: ${currentData.windSpeed} m/h </div>
  <div class="m-1">UV Index: <span class="uv-index" id="uv-index">${currentData.uvIndex}</span></div>
</div>`;

  $("#current-weather").append(currentWeather);
};

const renderForecastCardComponent = (forecastData) => {
  // from current data build the forecast card component
  const forecastWeather = `<div
    class="card text-white bg-primary m-1 text-center"
    style="width: 11rem"
  >
    <div class="card-header bg-light text-dark">${forecastData.date}</div>
    <div class="card-body">
      <h5 class="card-title"><img src="${forecastData.iconURL}" /></h5>
      <p class="card-text">Temperature: ${forecastData.temperature} °C</p>
      <p class="card-text">Humidity: ${forecastData.humidity} %</p>
    </div>
  </div>`;

  $("#5-day-forecast").append(forecastWeather);
};

const fetchAllWeatherData = (cityName) => {
  // construct URL for http://api.openweathermap.org/data/2.5/weather?q={CITY_NAME}&appid={API_KEY} and store in variable called as weatherApiUrl
  const weatherApiUrl = new URL(
    "http://api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&appid=" +
      APIkey +
      "&units=metric"
  );

  const functionForJSON = (responseObject) => responseObject.json();

  const functionForApplication = (dataFromServer) => {
    // whatever your application code is goes here
    // 1. from the dataFromServer get the lat and lon
    const cityName = dataFromServer.name;
    const lat = dataFromServer.coord.lat;
    const lon = dataFromServer.coord.lon;

    // 2. use lat lon to construct https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&appid={API_KEY} and store in variable called oneApiUrl
    const oneApiUrl = new URL(
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        APIkey +
        "&units=metric"
    );

    const functionForJSON = (responseObject) => {
      // unless you have some logic here do that before you return
      return responseObject.json();
    };

    const functionForApplication = (dataFromServer) => {
      // getCurrentData()  and store in currentData
      // getForecastData() and store in forecastData
      const currentData = getCurrentData(cityName, dataFromServer.current);
      const forecastData = dataFromServer.daily.map(getForecastData);

      // renderCurrentCardComponent(currentData);
      // renderForecastCardComponent(forecastData);
      renderCurrentCardComponent(currentData);
      forecastData.forEach(renderForecastCardComponent);
    };

    fetch(oneApiUrl)
      .then(functionForJSON)
      .then(functionForApplication)
      .catch(functionToHandleError);
  };

  fetch(weatherApiUrl)
    .then(functionForJSON)
    .then(functionForApplication)
    .catch(functionToHandleError);
};

const getCitiesFromLocalStorage = () => {
  // get cities from local storage
  const citiesFromLocalStorage = localStorage.getItem("cities");

  if (citiesFromLocalStorage) {
    return JSON.parse(citiesFromLocalStorage);
  } else {
    return [];
  }
};

const onLoad = () => {
  // read from local storage and store data in variable called citiesFromLocalStorage
  const citiesFromLocalStorage = getCitiesFromLocalStorage();

  // if data is present and pass the data from local storage
  if (citiesFromLocalStorage) {
    citiesFromLocalStorage.forEach(renderCities);
  }

  // get the last city name from citiesFromLocalStorage and store in variable called cityName
  const length = citiesFromLocalStorage.length;
  const index = length - 1;
  const lastCity = citiesFromLocalStorage[index];

  // fetch data for last searched city
  fetchAllWeatherData(lastCity);
};

const onSubmit = (event) => {
  event.preventDefault();
  // get city name and store in variable called cityName
  const cityName = $(".form-control").val();
  fetchAllWeatherData(cityName);
  renderCities(cityName);
  $(".form-control").val("");

  // save to local storage
  const citiesFromLocalStorage = getCitiesFromLocalStorage();
  citiesFromLocalStorage.push(cityName);
  localStorage.setItem("cities", JSON.stringify(citiesFromLocalStorage));
};

const onClick = (event) => {
  const target = $(event.target);
  if (target.is("li")) {
    // get city name from the list item that was clicked and store in variable called cityName
    const cityName = target.text();
    fetchAllWeatherData(cityName);
  }
};

$(".list").click(onClick);
$("#form").submit(onSubmit);
$(document).ready(onLoad);
