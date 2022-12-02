let map;
let infoWindow;
let radiusCircle;
let rating = 0;
let userLocation;
const markers = [];

const citySelector = document.getElementById("citySelector");
const categorySelector = document.getElementById("categorySelector");
const areaSelector = document.getElementById("areaSelector");
const searchButton = document.getElementById("searchButton");
const clearButton = document.getElementById("clearButton");
const searchByName = document.getElementById("searchByName");
const suggestions = document.getElementById("suggestions");
const starRarting = document.getElementById("starRarting");
const priceSlider = document.getElementById("priceSlider");
const radiusSlider = document.getElementById("radiusSlider");

const autoCompleteSearch = (event) => {
  suggestions.innerHTML = ``;
  const inputValue = event.target.value;

  if (inputValue.length) {
    const matchingValues = museums.filter((value) =>
      value.name.toLowerCase().includes(inputValue.toLowerCase())
    );

    matchingValues.forEach((value) => {
      suggestions.innerHTML = suggestions.innerHTML + `<li>${value.name}</li>`;
    });
  }
};

const onAutoCompleteSelect = (value) => {
  if (value.target.tagName === "LI") {
    searchByName.value = value.target.textContent;
    suggestions.innerHTML = ``;
  }
};

const onRadiusChange = (event) => {
  if (event.target.value) {
    radiusCircle.setRadius(+event.target.value * 1000);
  }
};

const populateSelector = (element, object) => {
  Object.values(object).forEach((item) => {
    const option = document.createElement("option");
    option.value = item;
    option.innerHTML = item;
    element.appendChild(option);
  });
};

const generateContentString = () => {
  const contentString =
    '<div id="content">' +
    '<div id="siteNotice">' +
    "</div>" +
    '<h1 id="firstHeading" class="firstHeading">blaaa</h1>' +
    '<div id="bodyContent">' +
    "<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large " +
    "sandstone rock formation in the southern part of the " +
    "Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) " +
    "south west of the nearest large town, Alice Springs; 450&#160;km " +
    "(280&#160;mi) by road. Kata Tjuta and Uluru are the two major " +
    "features of the Uluru - Kata Tjuta National Park. Uluru is " +
    "sacred to the Pitjantjatjara and Yankunytjatjara, the " +
    "Aboriginal people of the area. It has many springs, waterholes, " +
    "rock caves and ancient paintings. Uluru is listed as a World " +
    "Heritage Site.</p>" +
    '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
    "https://en.wikipedia.org/w/index.php?title=Uluru</a> " +
    "(last visited June 22, 2009).</p>" +
    "</div>" +
    "</div>";

  return contentString;
};

const clearMarkers = () => {
  markers.forEach((marker) => {
    marker.setMap(null);
  });
};

const clearFilters = () => {
  citySelector.value = "";
  categorySelector.value = "";
  areaSelector.value = "";
  searchByName.value = "";
  suggestions.innerHTML = "";

  getMuseums();
};

const isValidRadius = ({ lat, lng }) => {
  if (!userLocation) return true;

  const radius = +radiusSlider.value;

  const latDistance = (lat - userLocation.lat) * 10000;
  const lngDistance = (lng - userLocation.lng) * 10000;

  console.log(lat, userLocation.lat);

  if (
    Math.abs(latDistance) - radius >= 0 &&
    Math.abs(lngDistance) - radius >= 0
  ) {
    return true;
  }

  return false;
};

const getMuseums = () => {
  clearMarkers();

  const city = citySelector.value;
  const category = categorySelector.value;
  const area = areaSelector.value;
  const museumName = searchByName.value;
  const price = priceSlider.value;

  museums.forEach((museum) => {
    const isNotValidMeuseum =
      !isValidRadius(museum.position) ||
      price >= museum.price ||
      (rating && rating > museum.rating) ||
      (city && city !== museum.city) ||
      (category && category !== museum.category) ||
      (area && area !== museum.area) ||
      (museumName && museumName !== museum.name);

    if (isNotValidMeuseum) return;

    const marker = new google.maps.Marker({
      map,
      position: museum.position,
      title: museum.name,
    });

    markers.push(marker);

    marker.addListener("click", () => {
      infoWindow.setContent(generateContentString());
      infoWindow.open({
        map,
        anchor: marker,
      });
    });
  });
};

const initMap = () => {
  const israelLocation = { lat: 31.5, lng: 35.32813184265719 };

  const mapElement = document.getElementById("map");

  map = new google.maps.Map(mapElement, {
    zoom: 8,
    center: israelLocation,
  });

  infoWindow = new google.maps.InfoWindow();

  radiusCircle = new google.maps.Circle({
    map: map,
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    strokeColor: "#FF0000",
    fillOpacity: 0.35,
    radius: 0,
  });

  getMuseums();
};

Object.values(starRarting.children).forEach((star, i) => {
  const handleOnClick = () => {
    rating = i + 1;

    Object.values(starRarting.children).forEach((star, i) => {
      if (rating >= i + 1) {
        star.classList.add("checkedStar");
      } else {
        star.classList.remove("checkedStar");
      }
    });
  };

  star.addEventListener("click", handleOnClick);
});

window.navigator.geolocation.getCurrentPosition((response) => {
  const { latitude, longitude } = response.coords;
  userLocation = { lat: latitude, lng: longitude };
  radiusCircle.setCenter(userLocation);
});

populateSelector(citySelector, cities);
populateSelector(categorySelector, categories);
populateSelector(areaSelector, areas);

searchButton.addEventListener("click", getMuseums);
clearButton.addEventListener("click", clearFilters);
radiusSlider.addEventListener("click", onRadiusChange);
searchByName.addEventListener("input", autoCompleteSearch);
suggestions.addEventListener("click", onAutoCompleteSelect);

window.initMap = initMap;
