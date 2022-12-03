const cities = {
  RishonLeZion: "Rishon Le-Zion",
  Ashdod: "Ashdod",
  Holon: "Holon",
  TelAviv: "Tel-Aviv",
  BeerShava: "Beer-Sheva",
  Haifa: "Haifa",
  Jerusalem: "Jerusalem",
  Jafa: "Jafa",
  BatYam: "Bat-Yam",
};

const categories = {
  Science: "Science",
  Children: "Children",
  Memory: "Memory",
  Holocaust: "Holocaust",
  IDF: "IDF",
  Music: "Music",
  Art: "Art",
};

const areas = {
  Center: "Center",
  North: "North",
  South: "South",
};

const museums = [
  {
    name: "Rishon Lezion Museum",
    city: cities.RishonLeZion,
    position: { lat: 31.96567782722123, lng: 34.80739408344208 },
    website: "http://rlzm.co.il/",
    phone: "039598862",
    area: areas.North,
    category: categories.Art,
    rating: 2,
    price: 55,
    openAtWeekends: true,
  },
  {
    name: "Design Museum Holon",
    city: cities.Holon,
    position: { lat: 32.0128798761661, lng: 34.77740342205919 },
    website: "http://www.dmh.org.il/",
    phone: "0732151515",
    area: areas.South,
    category: categories.Children,
    rating: 4,
    price: 80,
    openAtWeekends: true,
  },
  {
    name: "YOVEL THE MAN MUSEUM ( nudes included )",
    city: cities.Holon,
    position: { lat: 32.0128798761661, lng: 33.77740342205919 },
    website: "http://www.dmh.org.il/",
    phone: "0732151515",
    area: areas.Center,
    category: categories.Holocaust,
    rating: 5,
    price: 23,
    openAtWeekends: false,
  },
  {
    name: "Darling Museum ( lots of nudes )",
    city: cities.Holon,
    position: { lat: 34.0128798761661, lng: 34.77740342205919 },
    website: "http://www.dmh.org.il/",
    phone: "0732151515",
    area: areas.South,
    category: categories.Children,
    rating: 4,
    price: 80,
    openAtWeekends: false,
  },
];
