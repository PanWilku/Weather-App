export function toCelsius(temperature) {
  let result;
  result = (temperature - 32) * (5 / 9);
  result = result.toFixed(1);
  return result;
}

export function toFarenheit(temperature) {
  let result;
  result = temperature * (5 / 9) + 32;
  result = result.toFixed(1);
  return result;
}
