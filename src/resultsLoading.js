import raindrop from "../assets/raindrop.svg";

export function createLoadingPage() {
  const loading = document.createElement("div");
  loading.id = "loading";
  loading.classList = " flex fixed w-full h-full items-center justify-center bg-gray-900 bg-opacity-50 z-50 pointer-events-none opacity-0 transition-opacity duration-300"
  const img = document.createElement("img");
  img.src = raindrop;
  img.className = "w-60 animate-pulse"
  loading.appendChild(img);
  body.appendChild(loading);
  console.log(body);
  loadingOpacity();
};

//makes fade in fade out animation
function loadingOpacity() {
  const loading = document.getElementById("loading");
  loading.classList.remove("opacity-0");
  loading.classList.add("opacity-100");
}

 export function removeLoadingPage() {
  const loading = document.getElementById("loading");
  loading.classList.remove("opacity-100");
  loading.classList.add("opacity-0");
};