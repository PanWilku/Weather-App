import { worldCapitals } from "../../capitals";
import "./style.css";
import { CONFIG } from "../../config";
import Fuse from 'fuse.js'


console.log("API Key:", CONFIG.API_KEY);

const fuse = new Fuse(worldCapitals, {keys: ["country", "capital"]});



const locationInput = document.getElementById("location-input");
const searchBtn = document.getElementById("search-btn");
const searchDiv = document.getElementById("search-div");
const suggestions = document.getElementById("suggestions");


searchDiv.className = "flex flex-col h-full";

let resultsDiv;
resultsDiv = document.createElement("div");

let lastResult = null;


locationInput.addEventListener("input", (event) => {

  updateSearch(event.target.value);
  console.log("User input:", event.target.value);

});

locationInput.addEventListener("focus", () => {
  handleLastResult(lastResult);
});



function handleLastResult(lastResult) {
  console.log(typeof lastResult);
  resultsDiv.innerHTML = lastResult;
  suggestions.appendChild(resultsDiv);
}



// search engine implementation
let resultsDivChildren;
function updateSearch(userInput) {
  clearResults();
  const results = fuse.search(userInput, {limit: 5});

  results.forEach((element, index) => {
    const div = document.createElement("div");
    div.innerHTML = `<p id="result-${index}" class="hover:cursor-pointer">${element.item.capital}, ${element.item.country}</p>`;
    resultsDiv.appendChild(div);
  });

  resultsDivChildren = resultsDiv.children;

  console.log(resultsDivChildren);

  suggestions.className = "flex flex-col relative";
  resultsDiv.className = "absolute w-[250px] flex flex-col max-w-[250px] bg-zinc-300";
  suggestions.appendChild(resultsDiv);
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


function clearResults() {
  if(suggestions){
    resultsDiv.innerHTML = ``;
    resultsDiv.className = ``;
  };
  return;
};



searchBtn.addEventListener("click", () => {
  handleSearchBtn(locationInput.value);
});

async function handleSearchBtn(locationInput) {
  const queryData = locationInput.split(",")[0].trim();
  const queryResult = await handleSearch(queryData);
  const result = [queryResult.currentConditions.datetime, queryResult.currentConditions.temp];
  console.log(queryResult.currentConditions.datetime);
  



  const temperatureDiv = document.createElement("div");
  temperatureDiv.className = "flex absolute w-[350px] top-100 bg-red-200 justify-center"
  temperatureDiv.innerHTML = `Time:${result[0]}, Temperature: ${result[1]} Farenheit`;
  searchDiv.prepend(temperatureDiv);
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


