let map;

const searchButton = document.getElementById("search");
const citySelector = document.getElementById("cities");

const onSearchButtonPress = () => {
  const marker = new google.maps.Marker({
    position: { lat: 31.5, lng: 35.32813184265719 },
    map: map,
  });
};

Object.keys(cities).forEach((city) => {
  const option = document.createElement("option");
  option.value = city;
  option.innerHTML = city;
  citySelector.appendChild(option);
});

searchButton.addEventListener("click", onSearchButtonPress);

const initMap = () => {
  const israelLocation = { lat: 31.5, lng: 35.32813184265719 };

  const mapElement = document.getElementById("map");

  map = new google.maps.Map(mapElement, {
    zoom: 8,
    center: israelLocation,
  });
};

window.initMap = initMap;
