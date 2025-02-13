const locationInput = document.getElementById("location-input");
const body = document.getElementById("body");
import stars from "../assets/stars.png";

export function handleFront(datetime, timeDiv, temperatureDiv, conditionsDiv) {
  const hours = datetime.substring(0, 2);
  console.log(hours);



  // remove classes before reassigning
  body.classList.remove("body-default", "body-night", "body-day");

  if (hours > 18 || hours < 5) {
    body.classList.add("body-night");
    timeDiv.classList.add("text-white");
    temperatureDiv.classList.add("text-white");
    conditionsDiv.classList.add("text-white");
    locationInput.classList.add("border-white");
    locationInput.classList.add("text-white");
    const starsBg = document.createElement("img");
    starsBg.id = "stars-bg"
    starsBg.src = stars;
    starsBg.className = "absolute w-full h-screen object-cover -z-5"
    body.appendChild(starsBg);
  } else {
    const starsBg = document.getElementById("stars-bg");
    if(starsBg) {
      starsBg.remove();
    };

    body.classList.add("body-day");
    timeDiv.classList.remove("text-white");
    temperatureDiv.classList.remove("text-white");
    conditionsDiv.classList.remove("text-white");
    locationInput.classList.remove("border-white");
    locationInput.classList.remove("text-white");
  }
}
