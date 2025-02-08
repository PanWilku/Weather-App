import { worldCapitals } from "../../capitals";
import "./style.css";
import { CONFIG } from "../../config";
import Fuse from 'fuse.js'


console.log("API Key:", CONFIG.API_KEY);

const fuse = new Fuse(worldCapitals, {keys: ["country", "capital"]});



const locationInput = document.getElementById("location-input");
const searchBtn = document.getElementById("search-btn");
const searchDiv = document.getElementById("search-div");


locationInput.addEventListener("input", (event) => {
  updateSearch(event.target.value);
  console.log("User input:", event.target.value);
});





let resultsDiv;

function updateSearch(userInput) {
  clearResults();
  const results = fuse.search(userInput, {limit: 5});
  resultsDiv = document.createElement("div");
  resultsDiv.className = "flex max-w-[250px] bg-zinc-300";

  resultsDiv.innerHTML = results
  .map((item, index) => `<div id="${index}"><p>${item.item.capital}, ${item.item.country}</p><div>`)
  .join("");
  searchDiv.className = "flex flex-col";
  searchDiv.appendChild(resultsDiv);
};


function clearResults() {
  if(resultsDiv){
    resultsDiv.innerHTML = ``;
    resultsDiv.className = ``;
  };
  return;
};



function handleSearch() {

  fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${worldCapitals[0].capital}?key=${CONFIG.API_KEY}`)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.log(error));  

}


