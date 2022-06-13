// Global Variables
var formEl = document.querySelector("#search-form");
var currentContainerEl = document.querySelector("#current-container");
var citySearchedEl = document.querySelector("#city-searched");
var pastCityBtnEl = document.querySelector("#past-cities-btns");
var futureContainerEl = document.querySelector("#forecast-container");
var forecastHeading = document.querySelector("#weather-forecast");


// API variables
var apiKey = "7b6408f8c7e6faa6a358eb8a39178c50"
var city;


// grab data from the Search form and put it in the 'city' variable to concatenate in the 'queryURL' variable
var searchFormHandler = function(event) {
  event.preventDefault();
  // assign value to the 'city' variable
  searchInfo = document.querySelector("#searched-city").value;
  
  // check for valid input
  if (!searchInfo) {
    alert("Please enter a city.")
    return false;
  }
  
  // reset form for next search
  document.querySelector("input[id='searched-city']").value = "";
  
  // CALL API WITH SEARCH CRITERIA
  // remove any spaces from 'searchInfo' and place in 'city' variable
  searchInfo = searchInfo.trim();
  city = searchInfo.replace(" ", "+");
  
  // query API
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + apiKey +"&units=imperial";
  
  // make a request to the url
  fetch(queryURL)
  .then(function(response) {
    // as long as it's a valid city ...
    if (response.ok) {
      response.json().then(function(data) {
        // ... send to current weather function
        displayCurrentWeather(data, city);
      });
      // otherwise, return error message
    } else {
      alert("Error: City Not Found.");
    }
  })
  // in case internet or API is down, let the user know
  .catch(function(error) {
    alert("Unable to connect to OpenWeather API");
  });
  
  // call 'save to localStorage' function
  // saveInfo();
  
  pastSearches(city);
}

// display the current weather
var displayCurrentWeather = function(conditions, location) {
  //clear old content
  currentContainerEl.textContent = "";
  location = location.replace("+", " ");
  // display city name from search criteria
  citySearchedEl.textContent = location;
  
  // display the current date
  var currentDate = document.createElement("span")
  currentDate.textContent=" (" + moment(conditions.dt.value).format("MMM D, YYYY") + ") ";
  citySearchedEl.appendChild(currentDate);
  
  // display the icon for current conditions
  var currentIcon = document.createElement("img")
  currentIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + conditions.weather[0].icon + "@2x.png");
  currentDate.appendChild(currentIcon);
  
  
  // ... the temperature, the humidity, the wind speed, and the UV index
  // display span for the temp data
  var tempEl = document.createElement("span");
  tempEl.textContent = "Current Temperature: " + conditions.main.temp + " °F";
  currentContainerEl.appendChild(tempEl);
  
  // display span for humidity data
  var humidEl = document.createElement("span");
  humidEl.textContent = "Humidity: " + conditions.main.humidity + "%";
  currentContainerEl.appendChild(humidEl);
  
  // display span for wind speed
  var windEl = document.createElement("span");
  windEl.textContent = "Wind Speed: " + conditions.wind.speed + " miles/hour";
  currentContainerEl.appendChild(windEl);

  // calling UV index
  var lat = conditions.coord.lat;
  var lon = conditions.coord.lon;
  getUvIndex(lat, lon);

  // calling 5-day forecast
  city = location.replace(" ", "+");
  getForecast(city);
}

// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
var getUvIndex = function(lat, lon) {
  var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + lat + "&lon=" + lon;
  fetch(uvURL)
  .then(function(response) {
    response.json().then(function(data) {
      displayUv(data)
    });
  });
}

var displayUv = function(uvIndex) {
  var uvIndexEl = document.createElement("div");
  uvIndexEl.textContent = "UV Index: "
  currentContainerEl.appendChild(uvIndexEl);

  var indexNum = document.createElement("span");
  indexNum.textContent = uvIndex.value;
  
  // assign CSS classes to the spans to indicate the background colors
  if (uvIndex.value <= 3) {
    indexNum.className = "favorable"
  } else if (uvIndex.value > 3 && uvIndex.value <= 7) {
    indexNum.className = "moderate"
  } else {
    indexNum.className = "severe"
  };
  
  uvIndexEl.appendChild(indexNum);
}

// get the future weather 
var getForecast = function(city) {
  var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + apiKey;
  fetch(forecastURL) 
  .then(function(response) {
    response.json().then(function(data) {
      displayForecast(data);
    });
  });
}

// build cards dynamically to show the 5-day forecast
var displayForecast = function(forecastConditions) {
  futureContainerEl.textContent = "";
  forecastHeading.textContent = "5-Day Forecast:";

  // loop through list 
  var weather = forecastConditions.list;

    // the list object has an iteration every 3 hours on a 24-hour cycle (8 iterations)
    // this is how I figured out how to loop through them and get 5 days worth of data
    for (var i = 5; i < weather.length; i = i+8) {
      var dailyWeather = weather[i];

      console.log(dailyWeather);
      // create div element for each card
      var dailyWeatherEl = document.createElement("div");
      dailyWeatherEl.classList = "card m-2";
      futureContainerEl.appendChild(dailyWeatherEl);

      // display date on card
      var weatherDate = document.createElement("h4");
      weatherDate.textContent = moment.unix(dailyWeather.dt).format("MMM D, YYYY");
      weatherDate.classList = "text-center card-header";
      dailyWeatherEl.appendChild(weatherDate);

      // display icon on card
      var weatherIcon = document.createElement("img");
      weatherIcon.classList = "text-center card-item";
      weatherIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + dailyWeather.weather[0].icon + "@2x.png")
      dailyWeatherEl.appendChild(weatherIcon);

      // display temp
      var dailyTempEl = document.createElement("span");
      dailyTempEl.classList = "text-center card-item";
      dailyTempEl.textContent = "Temp: " + dailyWeather.main.temp + " °F"
      dailyWeatherEl.appendChild(dailyTempEl);

      // display humidity
      var dailyHumidityEl = document.createElement("span");
      dailyHumidityEl.classList = "text-center card-item";
      dailyHumidityEl.textContent = "Humidity: " + dailyWeather.main.humidity + "%";
      dailyWeatherEl.appendChild(dailyHumidityEl);

      // display wind
      var dailyWindEl = document.createElement("span");
      dailyWindEl.classList = "text-center card-item";
      dailyHumidityEl.textContent = "Wind: " + dailyWeather.wind.speed + " MPH";
      dailyWeatherEl.appendChild(dailyWindEl);
    }
};

// build the cards for Past Searches
var pastSearches = function(pastCity) {
  pastCity = pastCity.replace("+", " ");
  
  var pastCityEl = document.createElement("button")
  pastCityEl.textContent = pastCity;
  pastCityEl.classList = "d-flex w-100 border text-center btn p-2";
  pastCityEl.setAttribute("past-city", pastCity);
  pastCityEl.setAttribute("type", "submit");
  
  pastCityBtnEl.prepend(pastCityEl)
}

// this should be refactored for DRY code, but I would have to build two more functions up top
// fetches queryURL to display weather for the past searched city cards
var pastSearchesHandler = function(event) {
  var searchedCity = event.target.getAttribute("past-city");
  if (searchedCity) {
    city = searchedCity.replace(" ", "+");
    queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + apiKey +"&units=imperial&cnt=5";
    fetch(queryURL)
    .then(function(response) {
      response.json().then(function(data) {
        displayCurrentWeather(data, city);
      });
    });
  }
}

// get the search info from the form on button "submit"
formEl.addEventListener("submit", searchFormHandler);
// event listener for Past Searches
pastCityBtnEl.addEventListener("click", pastSearchesHandler);