import { worldCapitals } from "../capitals";
import "./style.css";
import { CONFIG } from "../../config";
import Fuse from "fuse.js";
import { handleFront } from "./handleFront";
import { toCelsius, toFarenheit } from "../utils";
import { createLoadingPage, removeLoadingPage } from "./resultsLoading";

//get api key with vite
const apiKey = import.meta.env.VITE_API_KEY;

const fuse = new Fuse(worldCapitals, { keys: ["country", "capital"] });

//getting elements
const locationInput = document.getElementById("location-input");
const searchBtn = document.getElementById("search-btn");
const searchDiv = document.getElementById("search-div");
const suggestions = document.getElementById("suggestions");
const app1 = document.getElementById("app-1");
const app3 = document.getElementById("app-3");
const tempToggle = document.getElementById("switch");
const body = document.getElementById("body");

let resultsDiv;
resultsDiv = document.createElement("div");
let lastResult = null;

let tempScale = "°F";

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
  resultsDiv.className =
    "absolute max-sm:left-[65px] left-[515px] w-[250px] flex flex-col max-w-[250px] bg-indigo-200 mr-25 rounded-b-xl gap-2";
  app3.appendChild(resultsDiv);
}

// search engine implementation
let resultsDivChildren;
function updateSearch(userInput) {
  clearSEResults();
  const results = fuse.search(userInput, { limit: 5 });

  results.forEach((element, index) => {
    const div = document.createElement("div");
    div.innerHTML = `<p id="result-${index}" class="hover:cursor-pointer text-xl p-1  hover-delay-bg hover:bg-indigo-300">${element.item.capital}, ${element.item.country}</p>`;
    resultsDiv.appendChild(div);
  });

  suggestions.className = "flex relative";
  resultsDiv.className =
    "absolute max-sm:left-[65px] left-[515px] w-[250px] flex flex-col max-w-[250px] bg-indigo-200 mr-25 rounded-b-xl gap-2";
  app3.appendChild(resultsDiv);
  lastResult = resultsDiv.innerHTML;
}

//handles removing search results after clicking on one of the pTags and sets value of input
locationInput.addEventListener("blur", () => {
  resultsDivChildren = resultsDiv.children;
  console.log("unfocused");
  if (resultsDiv) {
    for (let i = 0; i < resultsDivChildren.length; i++) {
      const pTag = document.getElementById(`result-${i}`);
      pTag.addEventListener("click", () => {
        // make id=input-location the value of selected pTag
        locationInput.value = `${pTag.innerText}`;
        resultsDiv.remove();
      });
    }
  }
});

//clear search engine results
function clearSEResults() {
  if (suggestions) {
    resultsDiv.innerHTML = ``;
    resultsDiv.className = ``;
  }
  return;
}

//clear weather results
function clearWeatherResults() {
  if (app1) {
    app1.innerHTML = ``;
    app3.innerHTML = ``;
    console.log("EXECUTED");
  }
}

let originalTemperature;
let temperature;
//handle search button behavior
searchBtn.addEventListener("click", () => {
  clearWeatherResults();
  handleSearchBtn(locationInput.value);
});

async function handleSearchBtn(locationInput) {
  createLoadingPage();

  try {
    const queryData = locationInput.split(",")[0].trim();
    const queryResult = await handleSearch(queryData);
    const [datetime, conditions] = [
      queryResult.currentConditions.datetime,
      queryResult.currentConditions.conditions,
    ];
    originalTemperature = queryResult.currentConditions.temp;

    temperature =
      tempScale === "°C" ? toCelsius(originalTemperature) : originalTemperature;

    const timeDiv = document.createElement("div");
    timeDiv.id = "time-div";
    const temperatureDiv = document.createElement("div");
    temperatureDiv.id = "temp-div";
    const conditionsDiv = document.createElement("div");
    conditionsDiv.id = "con-div";
    timeDiv.className = "flex justify-center text-2xl";
    timeDiv.innerHTML = `Time: ${datetime}`;
    temperatureDiv.className = "flex justify-center text-6xl";

    temperatureDiv.innerHTML = `${temperature} ${tempScale}`;
    conditionsDiv.className = "flex h-full text-2xl";
    conditionsDiv.innerHTML = `<div class="flex p-25">${conditions}</div>`;
    app1.appendChild(temperatureDiv);
    app1.appendChild(timeDiv);
    app3.appendChild(conditionsDiv);

    handleFront(datetime, timeDiv, temperatureDiv, conditionsDiv);
  } catch (error) {
    console.error(error);
  } finally {
    setTimeout(() => {
      removeLoadingPage();
    }, 2000);
  }
}

function handleSearch(queryData) {
  return fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${queryData}?key=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((error) => console.log(error));
}

//listener for toggle
tempToggle.addEventListener("change", (event) => {
  const temperatureDiv = document.getElementById("temp-div");
  if (event.target.checked) {
    tempScale = "°C";
    console.log("Switched to C!");
    temperature = toCelsius(originalTemperature);
  } else {
    tempScale = "°F";
    console.log("Switched to F!");
    temperature = originalTemperature;
  }
  if (temperatureDiv) {
    temperatureDiv.innerHTML = `${temperature} ${tempScale}`;
  }
});
