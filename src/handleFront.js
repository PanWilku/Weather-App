const timeDiv = document.getElementById("time-div");
const temperatureDiv = document.getElementById("temp-div");
const conditionsDiv = document.getElementById("con-div");
const body = document.getElementById("body");

export function handleFront(datetime, temperature, conditions) {
  const hours = datetime.substring(0, 2);
  console.log(hours);

  // remove classes before reassigning
  body.classList.remove("body-default", "body-night", "body-day");

  if (hours > 18 || hours < 5) {
    body.classList.add("body-night");
  } else {
    body.classList.add("body-day");
  };
};
