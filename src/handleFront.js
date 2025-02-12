const timeDiv = document.getElementById("time-div");
const temperatureDiv = document.getElementById("temp-div");
const conditionsDiv = document.getElementById("con-div");
const body = document.getElementById("body");



export function handleFront(datetime, temperature, conditions) {

    const hours = datetime.substring(0,2);
    
    if(hours > 18 || hours < 5) {
        body.classList.replace("body-default", "body-night");
    } else {
        body.classList.replace("body-night", "body-day");
        body.classList.replace("body-default", "body-day");
    }

}