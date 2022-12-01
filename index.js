let map;
const markers = [];

const citySelector = document.getElementById("citySelector");
const categorySelector = document.getElementById("categorySelector");
const areaSelector = document.getElementById("areaSelector");
const searchButton = document.getElementById("searchButton");
const clearButton = document.getElementById("clearButton");

const initMap = () => {
  const israelLocation = { lat: 31.5, lng: 35.32813184265719 };

  const mapElement = document.getElementById("map");

  map = new google.maps.Map(mapElement, {
    zoom: 8,
    center: israelLocation,
  });
};

const populateSelector = (element, object) => {
  Object.keys(object).forEach((item) => {
    const option = document.createElement("option");
    option.value = item;
    option.innerHTML = item;
    element.appendChild(option);
  });
};

const getMuseums = () => {
  museums.forEach((museum) => {
    const contentString =
      '<div id="content">' +
      '<div id="siteNotice">' +
      "</div>" +
      `<h1 id="firstHeading" class="firstHeading">${museum.name}</h1>` +
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

    const infowindow = new google.maps.InfoWindow({
      content: contentString,
      ariaLabel: museum.name,
    });

    const marker = new google.maps.Marker({
      map,
      position: museum.position,
      title: museum.name,
    });

    markers.push(marker);

    marker.addListener("click", () => {
      infowindow.open({
        map,
        anchor: marker,
      });
    });
  });
};

const clearFilters = () => {
  markers.forEach((marker) => {
    marker.setMap(null);
  });

  citySelector.value = "";
  categorySelector.value = "";
  areaSelector.value = "";
};

populateSelector(citySelector, cities);
populateSelector(categorySelector, categories);
populateSelector(areaSelector, areas);

searchButton.addEventListener("click", getMuseums);
clearButton.addEventListener("click", clearFilters);

window.initMap = initMap;
