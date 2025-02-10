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

locationInput.addEventListener("blur", () => {
  console.log("unfocused");
  if(resultsDiv) {
    resultsDiv.remove();
  }

});

locationInput.addEventListener("focus", () => {
  handleLastResult(lastResult);
});



function handleLastResult(lastResult) {
  console.log(typeof lastResult);
  resultsDiv.innerHTML = lastResult;
  suggestions.appendChild(resultsDiv);
}



function updateSearch(userInput) {
  clearResults();
  const results = fuse.search(userInput, {limit: 5});



  resultsDiv.innerHTML = results
  .map((item, index) => `<div id="${index}"><p>${item.item.capital}, ${item.item.country}</p><div>`)
  .join("");
  suggestions.className = "flex flex-col relative";
  resultsDiv.className = "absolute w-[250px] flex max-w-[250px] bg-zinc-300";
  suggestions.appendChild(resultsDiv);
  lastResult = resultsDiv.innerHTML;
};


function clearResults() {
  if(suggestions){
    suggestions.innerHTML = ``;
    suggestions.className = ``;
  };
  return;
};



function handleSearch() {

  fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${worldCapitals[0].capital}?key=${CONFIG.API_KEY}`)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.log(error));  

}


