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

//Search for specific museum name
const autoCompleteSearch = (event) => {
  suggestions.innerHTML = ``;
  const inputValue = event.target.value;
  //As long as the input has a length (= input exists)
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

//Cities, categories and areas using this function (these three filters are selectors)
const populateSelector = (element, object) => {
  Object.values(object).forEach((item) => {
    const option = document.createElement("option");
    option.value = item;
    option.innerHTML = item;
    element.appendChild(option);
  });
};

//When clicking on an icon on the map - a new window will open with a comprehensive description of the selected museum
//Name of the museum, picture, short description, city, category, price, etc
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
    `<h1 style="text-align:center;" >${name}</h1>` +
    '<div style="display:flex;justify-content:center;"  id="Image content">' +
    `<img src=${image}>` +
    "</div>" +
    '<div style="padding:10px;" id="bodyContent">' +
    "<p>" +
    "<b>" +
    "Discription - " +
    "</b>" +
    `${discription}` +
    "</p>" +
    "<p>" +
    "<b>" +
    "City - " +
    "</b>" +
    `${city}` +
    "</p>" +
    "<p>" +
    "<b>" +
    "Phone Number - " +
    "</b>" +
    `${phone}` +
    "</p>" +
    "<p>" +
    "<b>" +
    "Museum Category - " +
    "</b>" +
    `${category}` +
    "</p>" +
    "<p>" +
    "<b>" +
    "Rating - " +
    "</b>" +
    "People who visited this museum gave it a rating of " +
    `${rating}` +
    " stars out of 5" +
    "</p>" +
    "<p>" +
    "<b>" +
    "Regular Price - " +
    "</b>" +
    `${price}` +
    "₪" +
    "</p>" +
    "<p>" +
    "<b>" +
    "Open On Weekends - " +
    "</b>" +
    `${openAtWeekends}` +
    "</p>" +
    "<p>" +
    "<b>" +
    "Website Link - " +
    "</b>" +
    `<a href=${website}>Click here to check the museum website</a>` +
    "</div>" +
    "</div>";
  return contentString;
};

//Function that clear all the current markers on the map
//We will call this function when we get all the museums
//To mention, the initial state of our application and the state reached when the reset filters button is pressed
const clearMarkers = () => {
  markers.forEach((marker) => {
    marker.setMap(null);
  });
};

//When the user click on "Clear Filters" all of the fillters reset
//The map returns to the initial state with all the museums on it
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
  //After pressing the reset button - all the museums will be shown on the map again (this was the initial state)
  getMuseums();
};

//A formula used to calculate which museums are within the radius entered by the user
//The square root of - (x1-x2)^2 + (y1-y2)^2
//The first part (x) represent the lat of the museum and the lat of the user
//The second part (y) represent the lng of the museum and the lng of the user
//The formula gives us the distance between this two point - while this distance in NOT BIGGER than the radius the user chose - this museum is ok

const isValidRadius = ({ lat, lng }) => {
  const radius = +radiusSlider.value / 100;

  if (!userLocation || !radius) return true;

  const latDistance = Math.pow(lat - userLocation.lat, 2);
  const lngDistance = Math.pow(lng - userLocation.lng, 2);
  const distance = Math.sqrt(latDistance + lngDistance);

  return distance <= radius;
};

//The main function
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
      (price < museum.price && price != 0) ||
      (isOpenAtweekends && !museum.openAtWeekends) ||
      (rating && rating > museum.rating) ||
      (city && city !== museum.city) ||
      (category && category !== museum.category) ||
      (area && area !== museum.area) ||
      (museumName && museumName !== museum.name);

    if (isNotValidMeuseum) return;

    //Creating markers on the map - each category got its own marker/
    //Children's museum got a children's museum icon, music museum got a music icon, etc.
    const marker = new google.maps.Marker({
      map,
      position: museum.position,
      title: museum.name,
      icon: iconOnMap[museum.category],
    });
    markers.push(marker);

    //When you click on one of the icons on the map - a small window will open with information about the selected museum.
    marker.addListener("click", () => {
      infoWindow.setContent(generateContentString(museum));
      infoWindow.open({
        map,
        anchor: marker,
      });
    });
  });
};

//Initializing the map - the values ​​given are the map of Israel
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

//A function from the internet where stars are used to represent the ratings
//The fifth star represents the highest rating while the first star represents the lowest rating
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

//A built-in function from the Internet through which the user's location can be obtained (after approval)
window.navigator.geolocation.getCurrentPosition((response) => {
  const { latitude, longitude } = response.coords;
  userLocation = { lat: latitude, lng: longitude };
  radiusCircle.setCenter(userLocation);
});

populateSelector(citySelector, cities);
populateSelector(categorySelector, categories);
populateSelector(areaSelector, areas);

//EventListener for each of the actions we performed
searchButton.addEventListener("click", getMuseums);
clearButton.addEventListener("click", clearFilters);
radiusSlider.addEventListener("click", onRadiusChange);
searchByName.addEventListener("input", autoCompleteSearch);
suggestions.addEventListener("click", onAutoCompleteSelect);

//The Maps JavaScript API - https://developers.google.com/maps/documentation/javascript/overview
//This is how we init the google map into our project
window.initMap = initMap;
