import { worldCapitals } from "../../capitals";
import "./style.css";
import { CONFIG } from "../../config";
import Fuse from 'fuse.js'
import { handleFront } from "./handleFront";


console.log("API Key:", CONFIG.API_KEY);

const fuse = new Fuse(worldCapitals, {keys: ["country", "capital"]});


//getting elements
const locationInput = document.getElementById("location-input");
const searchBtn = document.getElementById("search-btn");
const searchDiv = document.getElementById("search-div");
const suggestions = document.getElementById("suggestions");
const app1 = document.getElementById("app-1");
const app3 = document.getElementById("app-3");
const tempToggle = document.getElementById("switch");


let resultsDiv;
resultsDiv = document.createElement("div");
let lastResult = null;

let tempScale = "°F";


function toCelsius(temperature) {
  let result;
  result = (temperature - 32) * (5/9);
  result = result.toFixed(1);
  return result;
};

function toFarenheit(temperature) {
  let result;
  result = (temperature * (5/9)) + 32;
  result = result.toFixed(1);
  return result;
};




//listener for input field
locationInput.addEventListener("input", (event) => {

  updateSearch(event.target.value);
  console.log("User input:", event.target.value);

});


//listener for getting last 
locationInput.addEventListener("focus", () => {
  handleLastResult(lastResult);
});



function handleLastResult(lastResult) {
  console.log(typeof lastResult);
  resultsDiv.innerHTML = lastResult;
  resultsDiv.className = "absolute left-[135px] -top-[60px] w-[250px] flex flex-col max-w-[250px] bg-zinc-300 mr-25";
  app3.appendChild(resultsDiv);
}



// search engine implementation
let resultsDivChildren;
function updateSearch(userInput) {
  clearSEResults();
  const results = fuse.search(userInput, {limit: 5});

  results.forEach((element, index) => {
    const div = document.createElement("div");
    div.innerHTML = `<p id="result-${index}" class="hover:cursor-pointer">${element.item.capital}, ${element.item.country}</p>`;
    resultsDiv.appendChild(div);
  });

  resultsDivChildren = resultsDiv.children;

  console.log(resultsDivChildren);

  suggestions.className = "flex flex-col relative";
  resultsDiv.className = "absolute left-[135px] -top-[60px] w-[250px] flex flex-col max-w-[250px] bg-zinc-300 mr-25";
  app3.appendChild(resultsDiv);
  lastResult = resultsDiv.innerHTML;
};


//handles removing search results after clicking on one of the pTags and sets value of input
locationInput.addEventListener("blur", () => {
  console.log("unfocused");
  if(resultsDiv) {
    for(let i = 0; i < resultsDivChildren.length; i++) {
      const pTag = document.getElementById(`result-${i}`);
      pTag.addEventListener("click", () => {
        // make id=input-location the value of selected pTag
        locationInput.value = `${pTag.innerText}`;
        resultsDiv.remove();
      });
    };
  };
});


//clear search engine results
function clearSEResults() {
  if(suggestions){
    resultsDiv.innerHTML = ``;
    resultsDiv.className = ``;
  };
  return;
};

//clear weather results
function clearWeatherResults() {
  if(app1) {
    app1.innerHTML = ``;
    app3.innerHTML = ``;
    console.log("EXECUTED")
  }
};


let finalTemperature;
//handle search button behavior
searchBtn.addEventListener("click", () => {
  clearWeatherResults();
  handleSearchBtn(locationInput.value);
});

async function handleSearchBtn(locationInput) {
  const queryData = locationInput.split(",")[0].trim();
  const queryResult = await handleSearch(queryData);
  const [datetime, temperature, conditions] = [queryResult.currentConditions.datetime,
     queryResult.currentConditions.temp, queryResult.currentConditions.conditions];
  console.log(queryResult.currentConditions.datetime);
  



  const timeDiv = document.createElement("div");
  timeDiv.id = "time-div";
  const temperatureDiv = document.createElement("div");
  temperatureDiv.id = "temp-div";
  const conditionsDiv = document.createElement("div");
  conditionsDiv.id = "con-div";
  timeDiv.className = "flex justify-center text-2xl"
  timeDiv.innerHTML = `Time: ${datetime}`;
  temperatureDiv.className = "flex justify-center text-6xl";
  if(tempScale === "°C") {
    finalTemperature = toCelsius(temperature);
  } else {
    finalTemperature = temperature;
  }
  temperatureDiv.innerHTML = `${finalTemperature} ${tempScale}`;
  conditionsDiv.className = "flex justify-center text-2xl";
  conditionsDiv.innerHTML = `${conditions}`
  app1.append(temperatureDiv);
  app1.append(timeDiv);
  app3.append(conditions);

  handleFront(datetime, temperature, conditions);
}



function handleSearch(queryData) {

  return fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${queryData}?key=${CONFIG.API_KEY}`)
  .then(response => response.json())
  .then(data => {
    console.log(data)
    return data;
  })
  .catch(error => console.log(error));  

}



//listener for toggle
tempToggle.addEventListener("change", (event) => {
  if (event.target.checked) {
    tempScale = "°C";
    console.log("Switched to C!");
    const temperatureDiv = document.getElementById("temp-div");
    const result = toCelsius(finalTemperature);
    if(temperatureDiv) {
      temperatureDiv.innerHTML = `${result} ${tempScale}`;
    }
  } else {
    tempScale = "°F";
    console.log("Switched to F!");
    const temperatureDiv = document.getElementById("temp-div");
    const result = toFarenheit(finalTemperature);
    if(temperatureDiv) {
      temperatureDiv.innerHTML = `${result} ${tempScale}`;
    };
  };
});


