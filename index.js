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
const radiusOutput = document.getElementById("radiusOutput");
const priceOutput = document.getElementById("priceOutput");
const openAtWeekendsCheckbox = document.getElementById("isOpenInWeekends");

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

const generateContentString = ({
  name,
  discription,
  city,
  phone,
  image,
  website,
  category,
  rating,
  price,
  openAtWeekends,
}) => {
  const contentString =
    '<div id="content">' +
    '<div id="siteNotice">' +
    "</div>" +
    `<h1 style="color:blue;">${name}</h1>` +
    `<img src=${image}>` +
    '<div id="bodyContent">' +
    "<p>" +
    "Discription - " +
    `${discription}` +
    "</p>" +
    "<p>" +
    "City -" +
    `${city}` +
    "</p>" +
    "<p>" +
    "Phone Number - " +
    `${phone}` +
    "</p>" +
    "<p>" +
    "Museum Category - " +
    `${category}` +
    "</p>" +
    "<p>" +
    "People who visited this museum gave it a rating of " +
    `${rating}` +
    " stars out of 5" +
    "</p>" +
    "<p>" +
    "Regular Price - " +
    `${price}` +
    " ₪" +
    "</p>" +
    "<p>" +
    "Open On weekends - " +
    `${openAtWeekends}` +
    "</p>" +
    `<a href=${website}>Click here to check the museum website</a>` +
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
  openAtWeekendsCheckbox.checked = false;
  radiusOutput.value = "Max Radius From Your Home";
  priceOutput.value = "Max Price";
  priceSlider.value = 0;
  radiusSlider.value = 0;
  rating = 0;
  radiusCircle.setRadius(null);

  Object.values(starRarting.children).forEach((star, i) => {
    star.classList.remove("checkedStar");
  });

  getMuseums();
};

const isValidRadius = ({ lat, lng }) => {
  const radius = +radiusSlider.value / 100;

  if (!userLocation || !radius) return true;

  const latDistance = Math.pow(lat - userLocation.lat, 2);
  const lngDistance = Math.pow(lng - userLocation.lng, 2);
  const distance = Math.sqrt(latDistance + lngDistance);

  return distance <= radius;
};

const getMuseums = () => {
  clearMarkers();

  const city = citySelector.value;
  const category = categorySelector.value;
  const area = areaSelector.value;
  const museumName = searchByName.value;
  const price = priceSlider.value;
  const isOpenAtweekends = openAtWeekendsCheckbox.checked;

  museums.forEach((museum) => {
    const isNotValidMeuseum =
      !isValidRadius(museum.position) ||
      price > museum.price ||
      (isOpenAtweekends && !museum.openAtWeekends) ||
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
      icon: iconOnMap[museum.category],
    });

    markers.push(marker);

    marker.addListener("click", () => {
      infoWindow.setContent(generateContentString(museum));
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
