// declare API key
const APIkey = "12197a025c93ca0e295dc1dd5f7a68c1";

// For each city construct a list item and append to the list group
const renderCities = (citiesFromLocalStorage) => {
  citiesFromLocalStorage.reverse();
  $(citiesFromLocalStorage).each(constructListItem);
};

const constructListItem = () => {};

const getCurrentData = (opeApiData) => {
  // from object extract the data points you need for the return data
  return {
    name: "",
    date: "",
    iconURL: "",
    temperature: "",
    humidity: "",
    windSpeed: "",
    uvIndex: 0,
  };
};

const getForecastData = (opeApiData) => {
  // iterate and construct the return data array
  return [
    {
      date: "",
      iconURL: "",
      temperature: "",
      humidity: "",
    },
  ];
};

const renderCurrentCardComponent = (currentData) => {
  // from current data build the current card component
};

const renderForecastCardComponent = (forecastData) => {
  // from current data build the current card component
};

const fetchAllWeatherData = (cityName) => {
  // construct URL for http://api.openweathermap.org/data/2.5/weather?q={CITY_NAME}&appid={API_KEY} and store in variable called as weatherApiUrl
  const weatherApiUrl = new URL(
    "http://api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&appid=" +
      APIkey
  );

  const functionForJSON = (responseObject) => {
    // unless you have some logic here do that before you return
    return responseObject.json();
  };
  const functionForApplication = (dataFromServer) => {
    // whatever your application code is goes here
    // 1. from the dataFromServer get the lat and lon
    const lat = dataFromServer.coord.lat;
    const lon = dataFromServer.coord.lon;
    // 2. use lat lon to construct https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&appid={API_KEY} and store in variable called oneApiUrl
    const oneApiUrl = new URL(
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        APIkey
    );

    const functionForJSON = (responseObject) => {
      // unless you have some logic here do that before you return
      return responseObject.json();
    };
    const functionForApplication = (dataFromServer) => {
      // call a function getCurrentData() to get the current data from dataFromServer
      // getCurrentData()  and store in currentData
      // getForecastData() and store in forecastData
      const currentData = getCurrentData(cityName, dataFromServer.current);
      const forecastData = dataFromServer.daily.map(getForecastData);

      // renderCurrentCardComponent(currentData);
      // renderForecastCardComponent(forecastData);
      renderCurrentCard(currentData);
      forecastData.forEach(renderForecastCard);
    };

    const functionToHandleError = (errorObject) => {
      // handle your error here according to your application
    };
    fetch(oneApiUrl)
      .then(functionForJSON)
      .then(functionForApplication)
      .catch(functionToHandleError);
  };
  const functionToHandleError = (errorObject) => {
    // handle your error here according to your application
  };
  fetch(weatherApiUrl)
    .then(functionForJSON)
    .then(functionForApplication)
    .catch(functionToHandleError);
};

// function called on load of the document
const onLoad = () => {
  // read from local storage amd store data in variable called citiesFromLocalStorage
  // if data is present call renderCities and pass the data from local storage
  // renderCities(citiesFromLocalStorage)
  // get the last city name from citiesFromLocalStorage and store in variable called cityName
  // fetchAllWeatherData(cityName)
};

// function called when the form is submitted
const onSubmit = (event) => {
  event.preventDefault();
  // get city name and store in variable called cityName
  const cityName = $("#city-name");

  // fetchAllWeatherData(cityName)
};

const onClick = () => {
  // get city name from the list item that was clicked and store in variable called cityName
  fetchAllWeatherData(cityName);
};

$("#target-your-list-items").click(onClick);

$("#your-form-id").submit(onSubmit);

$(document).ready(onLoad);
