// Global Variables
var formEl = document.querySelector("#search-form");
var pastSearch = document.querySelector("#past-cities");

// API variables
var apiKey = "7b6408f8c7e6faa6a358eb8a39178c50"
var city;

/****************/
/** PSEUDOCODE **/
/****************/
// grab data from the Search form and put it in the 'city' variable to concatenate in the 'queryURL' variable
// query API
// build cards dynamically to show the 5-day forecast

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
    var city = searchInfo.replace(" ", "");

  var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;
  console.log(queryURL);
  
  // fetch(queryURL)

  // call 'save to localStorage' function
  saveInfo();
}

// put searched city in localStorage 
var saveInfo = function() {
  localStorage.setItem("city", JSON.stringify(searchInfo));
}

// get the search info from the form on button "submit"
formEl.addEventListener("submit", searchFormHandler);