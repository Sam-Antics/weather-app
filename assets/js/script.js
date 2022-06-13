/******************* ACCEPTANCE CRITERIA FOR REFERENCE ***************************/
// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
/*********************************************************************************/

// Global Variables
var formEl = document.querySelector("#search-form");
var currentContainerEl = document.querySelector("#current-container");
var futureContainerEl = document.querySelector("#future-weather");
var citySearchedEl = document.querySelector("#city-searched");
var pastCityBtnEl = document.querySelector("#past-cities-btns");


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
  var city = searchInfo.replace(" ", "+");
  
  // query API
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + apiKey +"&units=imperial";
  console.log(queryURL);
  
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
  humidEl.textContent = "Humidity: " + conditions.main.humidity + " %";
  currentContainerEl.appendChild(humidEl);

  // display span for wind speed
  var windEl = document.createElement("span");
  windEl.textContent = "Wind Speed: " + conditions.wind.speed + " miles/hour";
  currentContainerEl.appendChild(windEl);

  // getting UV index
  var lat = conditions.coord.lat;
  var lon = conditions.coord.lon;
  getUvIndex(lat, lon);
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
  console.log(uvIndex);

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

// // put searched city in localStorage to pass to Past Cities area
// var saveInfo = function() {
//   localStorage.setItem("city", JSON.stringify(searchInfo));
// }

// put searched city in Searched Cities area from each search made
var pastSearches = function(pastCity) {
  pastCity = pastCity.replace("+", " ");
  console.log(pastCity);

  var pastCityEl = document.createElement("button")
  pastCityEl.textContent = pastCity;
  pastCityEl.classList = "d-flex w-100 border text-center btn p-2";
  pastCityEl.setAttribute("past-city", pastCity);
  pastCityEl.setAttribute("type", "submit");

  pastCityBtnEl.prepend(pastCityEl)
}

var pastSearchesHandler = function(event) {
  var searchedCity = event.target.getAttribute("past-city");
  if (searchedCity) {
    city = searchedCity.replace(" ", "+");
    queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + apiKey +"&units=imperial";
    fetch(queryURL)
      .then(function(response) {
    response.json().then(function(data) {
      displayCurrentWeather(data, city);
    });
  });
  }
}



// build cards dynamically to show the 5-day forecast


// get the search info from the form on button "submit"
formEl.addEventListener("submit", searchFormHandler);
// event listener for Past Searches
pastCityBtnEl.addEventListener("click", pastSearchesHandler);