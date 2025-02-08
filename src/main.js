import { worldCapitals } from "../../capitals";
import "./style.css";
import { CONFIG } from "../../config";


console.log("API Key:", CONFIG.API_KEY);




fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${worldCapitals[0].capital}?key=${CONFIG.API_KEY}`)
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.log(error));

