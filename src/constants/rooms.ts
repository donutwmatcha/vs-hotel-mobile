export interface RateOption {
  name: string;
  pricePerNight: number;
  originalPrice: number;
  inclusions: string[];
}

export interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  size: string;
  image: any;
  gallery: any[];
  bedding: string;
  facilities: { category: string; items: string[] }[];
  rates: RateOption[];
}

const FAMILY_KINGS_ESCAPE = null;

export const ROOMS: Room[] = [
  {
    id: "standard-junior",
    name: "Standard Junior Room",
    description:
      "Comfortably relaxing, 20-21 square meters with queen-size bed.",
    price: 5600,
    capacity: 4,
    size: "20 sqm",
    image: require("../assets/room-cards/standard-junior-room.jpg"),
    gallery: [
      require("../assets/room-gallery/standard-junior-room/standard-junior-room-1.jpg"),
      require("../assets/room-gallery/standard-junior-room/standard-junior-room-2.jpg"),
      require("../assets/room-gallery/standard-junior-room/standard-junior-room-3.jpg"),
      require("../assets/room-gallery/standard-junior-room/standard-junior-room-4.jpg"),
      require("../assets/room-gallery/standard-junior-room/standard-junior-room-5.jpg"),
      require("../assets/room-gallery/standard-junior-room/standard-junior-room-6.jpg"),
      require("../assets/room-gallery/standard-junior-room/standard-junior-room-7.jpg"),
    ],
    bedding: "1 Queen",
    facilities: [
      {
        category: "Bathroom Features",
        items: ["Shower", "Toiletries", "Towels"],
      },
      { category: "Climate Control", items: ["Air-conditioning"] },
      { category: "Entertainment", items: ["TV"] },
      { category: "General Amenities", items: ["Alarm Clock"] },
      { category: "Kitchen Features", items: ["Refrigerator - Bar Size"] },
      {
        category: "Room Features & Facilities",
        items: [
          "Electronic Door Lock",
          "In-room Safe Deposit Box",
          "Non Smoking Rooms",
        ],
      },
      { category: "Bedding Configuration", items: ["1 Queen"] },
    ],
    rates: [
      {
        name: "Best Available Rate",
        pricePerNight: 2348,
        originalPrice: 5600,
        inclusions: [
          "Room Accommodation",
          "Breakfast",
          "Use of Swimming Pool and Water Spa",
          "Use of Main Gym",
          "2 Cinema Tickets",
        ],
      },
      {
        name: "A King's Escape",
        pricePerNight: 3478,
        originalPrice: 5600,
        inclusions: [
          "Breakfast good for 2 Persons",
          "Access to pool 8am to 8pm",
          "Access to Gym 6am to 12 midnight",
          "2 bottles of Beer",
          "2 Massage",
          "2 Cinema Passes",
          "2 Dinners",
          "2 Passes",
        ],
      },
      {
        name: "Rack Rate",
        pricePerNight: 4870,
        originalPrice: 5600,
        inclusions: [
          "Room Accommodation",
          "Breakfast",
          "Use of Swimming Pool and Water Spa",
          "Use of Main Gym",
        ],
      },
    ],
  },
  {
    id: "standard-queen",
    name: "Standard Queen Room",
    description:
      "Cozy up in our Standard Queen Room, equipped with a queen-size bed.",
    price: 7500,
    capacity: 4,
    size: "27 sqm",
    image: require("../assets/room-cards/standard-queen-room.jpg"),
    gallery: [
      require("../assets/room-gallery/standard-queen-room/standard-queen-room-1.jpg"),
      require("../assets/room-gallery/standard-queen-room/standard-queen-room-2.jpg"),
      require("../assets/room-gallery/standard-queen-room/standard-queen-room-3.jpg"),
      require("../assets/room-gallery/standard-queen-room/standard-queen-room-4.jpg"),
      require("../assets/room-gallery/standard-queen-room/standard-queen-room-5.jpg"),
      require("../assets/room-gallery/standard-queen-room/standard-queen-room-6.jpg"),
    ],
    bedding: "1 Queen",
    facilities: [
      {
        category: "Bathroom Features",
        items: ["Shower", "Toiletries", "Towels"],
      },
      { category: "Climate Control", items: ["Air-conditioning"] },
      { category: "Entertainment", items: ["TV"] },
      { category: "Kitchen Features", items: ["Refrigerator - Bar Size"] },
      {
        category: "Room Features & Facilities",
        items: [
          "Electronic Door Lock",
          "In-room Safe Deposit Box",
          "Non Smoking Rooms",
        ],
      },
      { category: "Bedding Configuration", items: ["1 Queen"] },
    ],
    rates: [
      {
        name: "Best Available Rate",
        pricePerNight: 2609,
        originalPrice: 7500,
        inclusions: [
          "Room Accommodation",
          "Breakfast",
          "Use of Swimming Pool and Water Spa",
          "Use of Main Gym",
          "2 Cinema Tickets",
        ],
      },
      {
        name: "A King's Escape",
        pricePerNight: 3739,
        originalPrice: 7500,
        inclusions: [
          "Breakfast good for 2 Persons",
          "Access to pool 8am to 8pm",
          "Access to Gym 6am to 12 midnight",
          "2 bottles of Beer",
          "2 Massage",
          "2 Cinema Passes",
          "2 Dinners",
          "2 Passes",
        ],
      },
      {
        name: "Rack Rate",
        pricePerNight: 5217,
        originalPrice: 7500,
        inclusions: [
          "Room Accommodation",
          "Breakfast",
          "Use of Swimming Pool and Water Spa",
          "Use of Main Gym",
        ],
      },
    ],
  },
  {
    id: "premium-queen",
    name: "Premium Queen Room",
    description:
      "Spacious with 30-33 square meters, Premium Queen Room comes with a queen-size bed and contemporary amenities. *Each bathtub may vary depending on the room interior design.",
    price: 7000,
    capacity: 4,
    size: "33 sqm",
    image: require("../assets/room-cards/premium-queen-room.jpg"),
    gallery: [
      require("../assets/room-gallery/premium-queen-room/premium-queen-room-1.jpg"),
      require("../assets/room-gallery/premium-queen-room/premium-queen-room-2.jpg"),
      require("../assets/room-gallery/premium-queen-room/premium-queen-room-3.jpg"),
      require("../assets/room-gallery/premium-queen-room/premium-queen-room-4.jpg"),
    ],
    bedding: "1 Queen",
    facilities: [
      {
        category: "Bathroom Features",
        items: ["Bathtub", "Toiletries", "Towels"],
      },
      { category: "Climate Control", items: ["Air-conditioning"] },
      { category: "Entertainment", items: ["TV"] },
      { category: "Kitchen Features", items: ["Refrigerator - Bar Size"] },
      {
        category: "Room Features & Facilities",
        items: [
          "Electronic Door Lock",
          "In-room Safe Deposit Box",
          "Non Smoking Rooms",
        ],
      },
      { category: "Bedding Configuration", items: ["1 Queen"] },
    ],
    rates: [
      {
        name: "Best Available Rate",
        pricePerNight: 3043,
        originalPrice: 7000,
        inclusions: [
          "Room Accommodation",
          "Breakfast",
          "Use of Swimming Pool and Water Spa",
          "Use of Main Gym",
          "2 Cinema Tickets",
        ],
      },
      {
        name: "A King's Escape",
        pricePerNight: 4087,
        originalPrice: 7000,
        inclusions: [
          "Breakfast good for 2 Persons",
          "Access to pool 8am to 8pm",
          "Access to Gym 6am to 12 midnight",
          "2 bottles of Beer",
          "2 Massage",
          "2 Cinema Passes",
          "2 Dinners",
          "2 Passes",
        ],
      },
      {
        name: "Rack Rate",
        pricePerNight: 6087,
        originalPrice: 7000,
        inclusions: [
          "Room Accommodation",
          "Breakfast",
          "Use of Swimming Pool and Water Spa",
          "Use of Main Gym",
        ],
      },
    ],
  },
  {
    id: "king",
    name: "King Room",
    description:
      "Upgrade to King Room for a chic staycation. Unwind, curl up in a generous bed or revel in the modern bathroom with separate shower and bathtub. *Each bathtub may vary depending on the room interior design.",
    price: 7800,
    capacity: 4,
    size: "35 sqm",
    image: require("../assets/room-cards/king-room.jpg"),
    gallery: [
      require("../assets/room-gallery/king-room/king-room-1.jpg"),
      require("../assets/room-gallery/king-room/king-room-2.jpg"),
      require("../assets/room-gallery/king-room/king-room-3.jpg"),
      require("../assets/room-gallery/king-room/king-room-4.jpg"),
      require("../assets/room-gallery/king-room/king-room-5.jpg"),
      require("../assets/room-gallery/king-room/king-room-6.jpg"),
      require("../assets/room-gallery/king-room/king-room-7.jpg"),
      require("../assets/room-gallery/king-room/king-room-8.jpg"),
    ],
    bedding: "1 King",
    facilities: [
      {
        category: "Bathroom Features",
        items: ["Bathtub", "Toiletries", "Towels"],
      },
      { category: "Climate Control", items: ["Air-conditioning"] },
      { category: "Entertainment", items: ["TV"] },
      { category: "Kitchen Features", items: ["Refrigerator - Bar Size"] },
      {
        category: "Room Features & Facilities",
        items: [
          "Electronic Door Lock",
          "In-room Safe Deposit Box",
          "Non Smoking Rooms",
        ],
      },
      { category: "Bedding Configuration", items: ["1 King"] },
    ],
    rates: [
      {
        name: "Best Available Rate",
        pricePerNight: 3391,
        originalPrice: 7800,
        inclusions: [
          "Room Accommodation",
          "Breakfast",
          "Use of Swimming Pool and Water Spa",
          "Use of Main Gym",
          "2 Cinema Tickets",
        ],
      },
      {
        name: "A King's Escape",
        pricePerNight: 4348,
        originalPrice: 7800,
        inclusions: [
          "Breakfast good for 2 Persons",
          "Access to pool 8am to 8pm",
          "Access to Gym 6am to 12 midnight",
          "2 bottles of Beer",
          "2 Massage",
          "2 Cinema Passes",
          "2 Dinners",
          "2 Passes",
        ],
      },
      {
        name: "Rack Rate",
        pricePerNight: 6783,
        originalPrice: 7800,
        inclusions: [
          "Room Accommodation",
          "Breakfast",
          "Use of Swimming Pool and Water Spa",
          "Use of Main Gym",
        ],
      },
    ],
  },
  {
    id: "family",
    name: "Family Room",
    description:
      "Our Family Room is one of the most spacious in the city. Inviting and relaxing connecting rooms with separate bathroom shower and bathtub.",
    price: 19000,
    capacity: 6,
    size: "70 sqm",
    image: require("../assets/room-cards/family-room.jpg"),
    gallery: [
      require("../assets/room-gallery/family-room/family-room-1.jpg"),
      require("../assets/room-gallery/family-room/family-room-2.jpg"),
      require("../assets/room-gallery/family-room/family-room-3.jpg"),
      require("../assets/room-gallery/family-room/family-room-4.jpg"),
      require("../assets/room-gallery/family-room/family-room-5.jpg"),
    ],
    bedding: "1 King and 2 Singles",
    facilities: [
      {
        category: "Bathroom Features",
        items: ["Bathtub", "Hand Soap", "Shower", "Toiletries", "Towels"],
      },
      { category: "Climate Control", items: ["Air-conditioning"] },
      { category: "Entertainment", items: ["Satellite / Cable TV", "TV"] },
      { category: "General Amenities", items: ["Alarm Clock"] },
      { category: "Internet", items: ["FREE WiFi", "Wireless / WiFi"] },
      { category: "Kitchen Features", items: ["Refrigerator - Bar Size"] },
      {
        category: "Room Features & Facilities",
        items: [
          "Electronic Door Lock",
          "Flat Screen TV",
          "In-room Safe Deposit Box",
          "Non Smoking Rooms",
          "Windows",
        ],
      },
      { category: "Bedding Configuration", items: ["1 King and 2 Singles"] },
    ],
    rates: [
      {
        name: "Rack Rate",
        pricePerNight: 10087,
        originalPrice: 19000,
        inclusions: [
          "Room Accommodation",
          "Breakfast",
          "Use of Swimming Pool and Water Spa",
          "Use of Main Gym",
        ],
      },
      {
        name: "Best Available Rate",
        pricePerNight: 12443,
        originalPrice: 19000,
        inclusions: [
          "Room Accommodation",
          "Breakfast",
          "Use of Swimming Pool and Water Spa",
          "Use of Main Gym",
          "2 Cinema Tickets",
        ],
      },
    ],
  },
  {
    id: "suite",
    name: "Suite Room",
    description:
      "Retreat to a perfect sanctuary in the heart of the city and experience a luxurious stay in our Suite Room. The expansive suite offers stylish amenities, a separate lounge and living room with garden views.",
    price: 11000,
    capacity: 4,
    size: "78 sqm",
    image: require("../assets/room-cards/suite-room.jpg"),
    gallery: [
      require("../assets/room-gallery/suite-room/suite-room-1.jpg"),
      require("../assets/room-gallery/suite-room/suite-room-2.jpg"),
      require("../assets/room-gallery/suite-room/suite-room-3.jpg"),
      require("../assets/room-gallery/suite-room/suite-room-4.jpg"),
      require("../assets/room-gallery/suite-room/suite-room-5.jpg"),
      require("../assets/room-gallery/suite-room/suite-room-6.jpg"),
      require("../assets/room-gallery/suite-room/suite-room-7.jpg"),
      require("../assets/room-gallery/suite-room/suite-room-8.jpg"),
      require("../assets/room-gallery/suite-room/suite-room-9.jpg"),
      require("../assets/room-gallery/suite-room/suite-room-10.jpg"),
    ],
    bedding: "1 King",
    facilities: [
      {
        category: "Bathroom Features",
        items: ["Shower", "Toiletries", "Towels"],
      },
      { category: "Climate Control", items: ["Air-conditioning"] },
      { category: "Entertainment", items: ["TV"] },
      { category: "Kitchen Features", items: ["Refrigerator - Bar Size"] },
      {
        category: "Room Features & Facilities",
        items: [
          "Electronic Door Lock",
          "Flat Screen TV",
          "In-room Safe Deposit Box",
          "Non Smoking Rooms",
          "Separate Living Area",
          "Sofa",
        ],
      },
      { category: "Bedding Configuration", items: ["1 King"] },
    ],
    rates: [
      {
        name: "Best Available Rate",
        pricePerNight: 4783,
        originalPrice: 11000,
        inclusions: [
          "Room Accommodation",
          "Breakfast",
          "Use of Swimming Pool and Water Spa",
          "Use of Main Gym",
          "2 Cinema Tickets",
        ],
      },
      {
        name: "A King's Escape",
        pricePerNight: 5652,
        originalPrice: 11000,
        inclusions: [
          "Breakfast good for 2 Persons",
          "Access to pool 8am to 8pm",
          "Access to Gym 6am to 12 midnight",
          "2 bottles of Beer",
          "2 Massage",
          "2 Cinema Passes",
          "2 Dinners",
          "2 Passes",
        ],
      },
      {
        name: "Rack Rate",
        pricePerNight: 9565,
        originalPrice: 11000,
        inclusions: [
          "Room Accommodation",
          "Breakfast",
          "Use of Swimming Pool and Water Spa",
          "Use of Main Gym",
        ],
      },
    ],
  },
];
