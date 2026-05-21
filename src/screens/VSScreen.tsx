// src/screens/VSScreen.tsx
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SW, height: SH } = Dimensions.get("window");

const C = {
  green: "#14532D",
  greenLight: "#2D6A4F",
  gold: "#B8860B",
  goldLight: "#D4A017",
  white: "#FFFFFF",
  offWhite: "#F5F5F5",
  lavender: "#F0EEF5",
  gray: "#6B7280",
  grayLight: "#E5E7EB",
  dark: "#0D1B12",
};

// ─── Types ────────────────────────────────────────────────────────────────────
type CarouselItem = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  fallbackBg: string;
  accentColor: string;
  url: string;
  images: any[];
};

type Partner = {
  id: string;
  name: string;
  floor: string;
  phone?: string;
  facebook?: string;
  facebookUrl?: string;
  logo?: any;
};

type RetailCategory = {
  id: string;
  title: string;
  subtitle: string;
  tags: string[];
  description: string;
  bg: string;
  image: any; // ← background photo for the card
  icon: React.ReactNode;
  partners: Partner[];
};

type Job = {
  id: string;
  title: string;
  type: string;
  shift: string | null;
  duties: string[];
};

// ─── Carousel Data ────────────────────────────────────────────────────────────
const CAROUSEL_ITEMS: CarouselItem[] = [
  {
    id: "vsclub",
    title: "Victoria Sports Club",
    subtitle: "Sports & Fitness",
    description:
      "Victoria Sports Club is the largest indoor sports club in the country. The first of its kind, our space offers you access to a multitude of sports facilities and state-of-the-art fitness equipment to cater to your active lifestyle.",
    fallbackBg: "#0F2318",
    accentColor: "#1A3D28",
    url: "https://www.victoriasportsclub.com/",
    images: [
      require("../assets/vsscreen/vsclub-1.jpg"),
      require("../assets/vsscreen/vsclub-2.jpg"),
      require("../assets/vsscreen/vsclub-3.jpg"),
      require("../assets/vsscreen/vsclub-4.jpg"),
      require("../assets/vsscreen/vsclub-5.jpg"),
    ],
  },
  {
    id: "vskin",
    title: "Victoria Skin",
    subtitle: "Beauty & Aesthetics",
    description:
      "Designed to address top skin concerns in one's continuous pursuit of beauty, Victoria Skin is the new destination to visit. With its luxurious and relaxing facilities, Victoria Skin houses state-of-the-art equipment and offers excellent solutions for maintaining the skin's youthful beauty.",
    fallbackBg: "#2D1B0E",
    accentColor: "#4A2E14",
    url: "https://www.vshotel.com.ph/vskin",
    images: [
      require("../assets/vsscreen/vskin-1.jpg"),
      require("../assets/vsscreen/vskin-2.jpg"),
      require("../assets/vsscreen/vskin-3.jpg"),
      require("../assets/vsscreen/vskin-4.jpg"),
      require("../assets/vsscreen/vskin-5.jpg"),
    ],
  },
  {
    id: "vstogo",
    title: "VS to Go",
    subtitle: "Café & Dining",
    description:
      "Our dining venues are synonymous with living well and quality dining experience. Flavorful, freshly prepared choices take center stage for your dining enjoyment.",
    fallbackBg: "#0D2B1B",
    accentColor: "#1A4028",
    url: "https://www.vshotel.com.ph/vstogo",
    images: [
      require("../assets/vsscreen/vstogo-cafe-1.jpg"),
      require("../assets/vsscreen/vstogo-cafe-2.jpg"),
      require("../assets/vsscreen/vstogo-cafe-3.jpg"),
      require("../assets/vsscreen/vstogo-cafe-4.jpg"),
    ],
  },
];

// ─── Retail Data ──────────────────────────────────────────────────────────────
const RETAIL_CATEGORIES: RetailCategory[] = [
  {
    id: "retail-dining",
    title: "Dining & Food",
    subtitle: "Restaurant • Café • Bar",
    tags: ["Restaurant", "Café", "Bar"],
    description: "Curated restaurants, cafés, and bars inside VS Tower.",
    bg: "#1C1008",
    image: require("../assets/categories/dining-and-food.jpg"),
    icon: <FontAwesome5 name="utensils" size={18} color="#D4A017" />,
    partners: [
      {
        id: "cafe-mido",
        name: "Cafe Mido",
        floor: "UG Floor",
        phone: "0960 426 2018",
        facebook: "café mido",
        facebookUrl: "https://www.facebook.com/cafemidomnl",
        logo: require("../assets/retail/cafe-mido.png"),
      },
      {
        id: "hannahs",
        name: "Hannah's",
        floor: "UG Floor",
        facebook: "Hannah's",
        facebookUrl: "https://www.facebook.com/hannahscoffeeshop",
        logo: require("../assets/retail/hannahs.jpg"),
      },
      {
        id: "paulino",
        name: "Paulino's Food Station",
        floor: "6th Floor",
        phone: "0998 864 6213",
        facebook: "Paulino's Food Station",
        facebookUrl: "https://www.facebook.com/profile.php?id=61573140856788",
        logo: require("../assets/retail/paulino.png"),
      },
      {
        id: "siomai-king",
        name: "Siomai King",
        floor: "6th Floor",
        phone: "0966 582 4003",
        logo: require("../assets/retail/siomai-king.png"),
      },
      {
        id: "waymadjax",
        name: "Waymadjax Kitchen",
        floor: "6th Floor",
        phone: "+63 955 322 5720",
        facebook: "Waymadjax Kitchen",
        facebookUrl: "https://www.facebook.com/profile.php?id=100086645736287",
        logo: require("../assets/retail/waymadjax-kitchen.jpg"),
      },
      {
        id: "tiera",
        name: "Tiera by Victoria Sports Bar",
        floor: "8th Floor",
        logo: require("../assets/retail/tiera-vsb.png"),
      },
    ],
  },
  {
    id: "retail-shopping",
    title: "Shopping",
    subtitle: "Conbini • Lifestyle • Gifts",
    tags: ["Conbini", "Lifestyle", "Gifts"],
    description: "Premium shops and lifestyle brands right at your doorstep.",
    bg: "#0E1218",
    image: require("../assets/categories/shopping.jpg"),
    icon: <FontAwesome5 name="shopping-bag" size={18} color="#D4A017" />,
    partners: [
      {
        id: "alfamart",
        name: "Alfamart",
        floor: "UG Floor",
        phone: "0915 887 2871 / 0917 803 8238",
        logo: require("../assets/retail/alfamart.jpg"),
      },
      {
        id: "seven-eleven",
        name: "7/11 Convenient Store",
        floor: "UG Floor",
        phone: "0945 243 9329",
        logo: require("../assets/retail/seven-eleven.jpg"),
      },
      {
        id: "vias-jewelry",
        name: "Via's Handcrafted Jewelry",
        floor: "7th Floor",
        phone: "0962 808 6216",
        facebook: "Via's Handcrafted Jewelry",
        facebookUrl: "https://www.facebook.com/ViasHandcraftedJewelry",
        logo: require("../assets/retail/vias-handcrafted-jewelry.png"),
      },
      {
        id: "racket-md",
        name: "Racket MD",
        floor: "UG Floor",
        phone: "+63 931 144 9531",
        facebook: "Racket MD",
        facebookUrl: "https://www.facebook.com/profile.php?id=61578127165991",
        logo: require("../assets/retail/racket-md.jpg"),
      },
    ],
  },
  {
    id: "retail-health",
    title: "Health & Wellness",
    subtitle: "Clinic • Spa • Wellness",
    tags: ["Clinic", "Spa", "Wellness"],
    description:
      "Trusted health clinics and wellness centers to keep you at your best.",
    bg: "#0E1C12",
    image: require("../assets/categories/health-and-wellness.jpg"),
    icon: <FontAwesome5 name="heartbeat" size={18} color="#D4A017" />,
    partners: [
      {
        id: "george-b",
        name: "George B Plastic Surgery",
        floor: "7th Floor",
        facebook: "George B Aesthetic & Plastic Surgery",
        facebookUrl: "https://www.facebook.com/georgeBaestheticplasticsurgery",
        logo: require("../assets/retail/george-b.jpg"),
      },
      {
        id: "ptexperts",
        name: "Ptexperts Orthopedic, Spine And Sports Center",
        floor: "UG Floor",
        phone: "0917 574 9910",
        facebook: "Ptxperts Quezon City",
        facebookUrl: "https://www.facebook.com/PTxpertsQuezon/",
        logo: require("../assets/retail/ptexperts.png"),
      },
      {
        id: "realign",
        name: "Realign Physiotherapy",
        floor: "UG Floor",
        phone: "0917 173 4863",
        facebook: "Realign Physiotherapy",
        facebookUrl: "https://www.facebook.com/drjesuszulueta",
        logo: require("../assets/retail/realign.png"),
      },
    ],
  },
  {
    id: "retail-offices",
    title: "Offices",
    subtitle: "Co-working • Corporate • Business",
    tags: ["Co-working", "Corporate", "Business"],
    description:
      "Professional office spaces and business centers within VS Tower.",
    bg: "#12181C",
    image: require("../assets/categories/offices.jpg"),
    icon: (
      <MaterialCommunityIcons
        name="office-building-outline"
        size={20}
        color="#D4A017"
      />
    ),
    partners: [
      {
        id: "altin",
        name: "Altin Conceirge Services Inc.",
        floor: "7th Floor",
        phone: "0917 186 1010",
        logo: require("../assets/retail/altin.png"),
      },
      {
        id: "alona",
        name: "Alona Tolentino Kim",
        floor: "8th Floor",
        phone: "0917 120 7789",
      },
      {
        id: "jnr",
        name: "JNR Stone Work Trading Inc.",
        floor: "7th Floor",
        phone: "0915 622 0335",
      },
      {
        id: "novannie",
        name: "Novannie Trading Corp.",
        floor: "UG Floor",
        phone: "0916 847 8193",
        facebook: "Novannie Trading",
        facebookUrl:
          "https://www.facebook.com/people/Novannie-Trading/100088522100749/",
        logo: require("../assets/retail/novannie.png"),
      },
      {
        id: "onward",
        name: "ONWARD Communications & Services",
        floor: "UG Floor",
        phone: "0951 937 8388",
        logo: require("../assets/retail/onward.png"),
      },
      {
        id: "sadsad",
        name: "Sadsad Tamesis Legal and Accountancy Firm",
        floor: "7th Floor",
        phone: "0936 470 8485 / 0961 218 2656",
        logo: require("../assets/retail/sadsad.png"),
      },
      {
        id: "atanante",
        name: "Atanante & Ilagan - AI Law",
        floor: "7th Floor",
        phone: "+63 283702894",
        facebook: "Atanante & Ilagan - AI Law",
        facebookUrl: "https://www.facebook.com/profile.php?id=61587753053627",
        logo: require("../assets/retail/atanante.jpg"),
      },
      {
        id: "titan-ultra",
        name: "Maxxx Velocity Titan Ultra",
        floor: "7th Floor",
        facebook: "Maxxx Velocity Titan Ultra",
        facebookUrl: "https://www.facebook.com/titanultragiantrisers",
        logo: require("../assets/retail/titan-ultra.jpg"),
      },
      {
        id: "francommunication",
        name: "Francommunication",
        floor: "7th Floor",
        facebook: "Francommunication",
        facebookUrl: "https://www.vshotel.com.ph/offices",
      },
      {
        id: "bayan-family",
        name: "Bayan Family of Foundations",
        floor: "6th Floor",
        facebook: "Bayan Family of Foundations",
        facebookUrl: "https://www.facebook.com/bayanfamilyph",
        logo: require("../assets/retail/bayan-family.jpg"),
      },
      {
        id: "nacc",
        name: "National Authority for Child Care",
        floor: "7th Floor",
        phone: "+63 917 322 6222",
        facebook: "National Authority for Child Care",
        facebookUrl: "https://www.facebook.com/nacc.gov.ph",
        logo: require("../assets/retail/national-authority-for-child-care.jpg"),
      },
      {
        id: "coa",
        name: "Commission on Audit",
        floor: "6th Floor",
        facebook: "Commission on Audit",
        facebookUrl: "https://www.vshotel.com.ph/offices",
      },
    ],
  },
  {
    id: "retail-sports",
    title: "Sports Programs",
    subtitle: "Training • Coaching • Classes",
    tags: ["Training", "Coaching", "Classes"],
    description:
      "Structured sports programs and coaching for all ages and skill levels.",
    bg: "#101820",
    image: require("../assets/categories/sports-programs.jpg"),
    icon: <FontAwesome5 name="running" size={18} color="#D4A017" />,
    partners: [
      {
        id: "deftac",
        name: "DEFTAC",
        floor: "6th Floor",
        phone: "0917 532 2967",
        facebook: "Deftac Victoria Sports",
        facebookUrl: "https://www.facebook.com/deftacvictoriasports/",
        logo: require("../assets/retail/deftac.png"),
      },
      {
        id: "dinks-and-bangs",
        name: "DINKS & BANGS",
        floor: "6th & 8th Floor",
        phone: "0916 436 3444",
        facebook: "Dinks and Bangs Pickleball Center PH",
        facebookUrl: "https://www.facebook.com/groups/927329408887803/",
        logo: require("../assets/retail/dinks-and-bangs.png"),
      },
      {
        id: "powerdance",
        name: "Douglas Nierras Powerdance",
        floor: "5th Floor",
        phone: "0915 125 8645",
        facebook: "Douglas Nierras Powerdance",
        facebookUrl: "https://www.facebook.com/dnpd88",
        logo: require("../assets/retail/powerdance.png"),
      },
      {
        id: "fad-modeling",
        name: "FAD Modeling Center",
        floor: "UG Floor",
        phone: "0917 326 1200 / 0917 185 1300",
        logo: require("../assets/retail/fad-modeling-center.png"),
      },
      {
        id: "aq-prime",
        name: "AQ Prime",
        floor: "6th Floor",
        facebook: "AQ Prime",
        facebookUrl: "https://www.facebook.com/aqprimestream/",
        logo: require("../assets/retail/aq-prime.jpg"),
      },
      {
        id: "vs-swimming",
        name: "VS Swimming School Supremos",
        floor: "6G Floor",
        facebook: "VS Swimming School Supremos",
        facebookUrl: "https://www.vshotel.com.ph/sportprogram",
      },
      {
        id: "swim-central",
        name: "Swim Central",
        floor: "6th Floor",
        facebook: "Swim Central",
        facebookUrl: "https://www.facebook.com/swimcentralph",
        logo: require("../assets/retail/swim-central.jpg"),
      },
      {
        id: "tumble-icon",
        name: "Tumble Icon Academy",
        floor: "6G Floor",
        facebook: "Tumble Icon Academy",
        facebookUrl: "https://www.facebook.com/profile.php?id=61580094232596",
        logo: require("../assets/retail/tumble-icon-academy.jpg"),
      },
      {
        id: "club-spin-zone",
        name: "Club Spin Zone",
        floor: "8th Floor",
        phone: "+63 917 567 0168",
        facebook: "Club Spin Zone",
        facebookUrl: "https://www.facebook.com/clubspinzone",
        logo: require("../assets/retail/club-spin-zone.jpg"),
      },
    ],
  },
  {
    id: "retail-services",
    title: "Services",
    subtitle: "Laundry • Concierge",
    tags: ["Laundry", "Concierge"],
    description:
      "Everyday services you need, all conveniently located within VS Tower.",
    bg: "#1A1010",
    image: require("../assets/categories/services.jpg"),
    icon: <FontAwesome5 name="concierge-bell" size={18} color="#D4A017" />,
    partners: [
      {
        id: "brainwash",
        name: "Brainwash Laundry Shop",
        floor: "1st Floor",
        phone: "0945 615 4455",
        facebook: "BrainWash",
        facebookUrl: "https://www.facebook.com/profile.php?id=100085352726343",
        logo: require("../assets/retail/brainwash-laundry-shop.png"),
      },
      {
        id: "gods-grace",
        name: "God's Grace Purified Water Refilling Station",
        floor: "3rd Floor",
        phone: "0956 195 6195",
        logo: require("../assets/retail/gods-grace.jpg"),
      },
      {
        id: "bridgecom",
        name: "Bridgecom It Services",
        floor: "UG Floor",
        phone: "0906 719 5713",
        logo: require("../assets/retail/bridgecome.png"),
      },
      {
        id: "book-bike",
        name: "Book Bike Corporation",
        floor: "1st Floor",
        facebook: "Book Bike Corporation",
        facebookUrl: "https://www.vshotel.com.ph/services",
      },
      {
        id: "8-point",
        name: "8 Point Self Photo Studio",
        floor: "UG Floor",
        facebook: "8 Point Self Photo Studio",
        facebookUrl: "https://www.vshotel.com.ph/services",
      },
      {
        id: "reeplay",
        name: "Reeplay Arcade Claw Machine",
        floor: "UG Floor",
        facebook: "Reeplay Arcade Claw Machine",
        facebookUrl: "https://www.vshotel.com.ph/services",
      },
      {
        id: "pegasus",
        name: "The Pegasus International Venture",
        floor: "7th Floor",
        phone: "+63 953 388 8296",
        facebook: "The Pegasus International Venture",
        facebookUrl:
          "https://www.facebook.com/ThePegasusHealthandBeautyProductsTrading",
        logo: require("../assets/retail/pegasus.jpg"),
      },
    ],
  },
];

// ─── Career Data ──────────────────────────────────────────────────────────────
const JOBS: Job[] = [
  {
    id: "housekeeping",
    title: "Housekeeping",
    type: "Fulltime",
    shift: null,
    duties: [
      "Keeping facilities and common areas clean and maintained.",
      "Vacuuming, sweeping, and mopping floors.",
      "Cleaning and stocking restrooms.",
      "Cleaning up spills with appropriate equipment.",
      "Notifying managers of necessary repairs.",
      "Collecting and disposing of trash.",
      "Assisting guests when necessary.",
      "Keeping the linen room stocked.",
      "Properly cleaning upholstered furniture.",
    ],
  },
  {
    id: "server",
    title: "Server",
    type: "Fulltime",
    shift: "8hr shift",
    duties: [
      "Welcome and greet guests in a warm and friendly manner.",
      "Present, promote and sell menu items.",
      "Take accurate food and drinks orders.",
      "Communicate order details to the kitchen staff.",
      "Serve food and drink orders.",
      "Check dishes and kitchenware for cleanliness and presentation.",
      "Arrange table settings and maintain a tidy dining area.",
      "Deliver checks and collect bill payments.",
    ],
  },
  {
    id: "front-desk",
    title: "Front Desk Officer",
    type: "Fulltime",
    shift: "8hr shift",
    duties: [
      "Welcome guests and check them in and out of the hotel.",
      "Answer all client questions and incoming calls.",
      "Redirect phone calls to the appropriate department.",
      "Accept all letters and packages, and distribute them to their appropriate departments.",
      "Monitor, organize and forward emails.",
      "Track and order office equipment and supplies.",
      "Maintain records and files.",
    ],
  },
  {
    id: "pr-intern",
    title: "PR & Communications Intern",
    type: "Internship",
    shift: null,
    duties: [
      "Assist in developing and executing PR campaigns and strategies.",
      "Draft and distribute press releases, media pitches, and other PR materials.",
      "Handle event logistics, including invitations, venue coordination, and promotional materials.",
      "Assist in managing social media accounts by creating and scheduling posts related to PR campaigns.",
      "Assist in creating content for blogs, newsletters, and company websites.",
      "Conduct research on industry trends, key media outlets, and competitor activity.",
      "Create reports on the performance of PR campaigns and media engagement.",
      "Assist in building relationships with journalists, influencers, and bloggers.",
    ],
  },
  {
    id: "account-executive",
    title: "Account Executive",
    type: "Fulltime",
    shift: "8hr shift",
    duties: [
      "Act as the primary point of contact for key accounts, including event organizers and corporate clients.",
      "Build and maintain strong relationships with clients, ensuring a high level of customer satisfaction.",
      "Develop and implement public relations strategies to boost the bar's visibility and reputation.",
      "Collaborate with local media, bloggers, and influencers to generate press coverage.",
      "Manage the bar's social media presence by creating content and promoting events.",
      "Coordinate and host events at the bar, including special promotions and themed nights.",
      "Generate new leads and cultivate relationships with potential corporate clients.",
      "Track and report on sales performance, PR coverage, and event outcomes.",
    ],
  },
  {
    id: "sales-associate",
    title: "Sales Associate (Leasing)",
    type: "Fulltime",
    shift: "Day shift",
    duties: [
      "Create financial forecasts, budgets, and financial models.",
      "Provide strategic recommendations to the CEO and executive team.",
      "Oversee financial planning, analysis, and reporting activities.",
      "Ensure accurate and timely financial reporting to stakeholders.",
      "Manage cash flow, investment strategies, and capital structure.",
      "Supervise accounting, auditing, tax, and treasury functions.",
      "Identify and manage financial risks.",
      "Lead and develop the finance team, fostering a culture of high performance.",
    ],
  },
  {
    id: "barista-mixologist",
    title: "Bar Barista / Mixologist",
    type: "Fulltime",
    shift: "8hr shift",
    duties: [
      "Prepare and serve cocktails and other beverages.",
      "Interact with customers, take orders and suggest drinks.",
      "Maintain the bar area and keep it clean and organized.",
      "Check customers' identification to ensure they meet minimum age requirements.",
      "Restock and replenish bar inventory and supplies.",
      "Mix ingredients to prepare cocktails according to recipes.",
      "Follow safety and sanitation policies when handling food and beverage.",
      "Garnish and present drinks attractively; create a visually appealing experience.",
    ],
  },
  {
    id: "property-manager",
    title: "Property Manager (Engineer)",
    type: "Fulltime",
    shift: "Day shift",
    duties: [
      "Maintain property rentals by advertising and filling vacancies, negotiating and enforcing leases.",
      "Screening and selecting tenants, handling lease agreements, and managing move-ins and move-outs.",
      "Ensuring that the property complies with local, state, and federal laws.",
      "Hiring and supervising vendors or contractors for services such as landscaping, cleaning, and repairs.",
      "Maintaining accurate records of property operations, including financial transactions.",
      "Negotiate leases, secure contracts from tenants, and collect security deposits.",
      "Secure property by contracting with security patrol service and establishing precautionary policies.",
    ],
  },
  {
    id: "massage-therapist",
    title: "Massage Therapist",
    type: "Fulltime",
    shift: null,
    duties: [
      "Conduct thorough consultations with clients to assess their skincare needs and goals.",
      "Collaborate with dermatologists and estheticians to develop customized treatment plans.",
      "Communicate effectively with clients to explain treatment procedures and discuss expected outcomes.",
      "Maintain detailed records of client consultations, treatment plans, and progress notes.",
      "Adhere to all clinic policies, including sanitation and hygiene standards.",
      "Stay informed about developments in skincare and massage therapy through ongoing education.",
      "Perform professional quality massage within scope of practice and licensing.",
      "Design specific sessions based on members or guests individual needs.",
    ],
  },
  {
    id: "social-media-specialist",
    title: "Social Media Specialist",
    type: "Fulltime",
    shift: null,
    duties: [
      "Develop and curate compelling content for social media platforms (Facebook, Instagram, TikTok, etc.).",
      "Manage daily operations of social media channels, including posting and responding to comments.",
      "Foster a positive online community by engaging with followers and encouraging user participation.",
      "Track and analyze social media performance metrics using tools like Google Analytics or Hootsuite.",
      "Work closely with the marketing team to ensure social media aligns with overall marketing strategies.",
      "Stay up-to-date with the latest social media trends and best practices.",
      "Assist in planning and executing digital marketing campaigns, including influencer partnerships.",
    ],
  },
  {
    id: "graphic-designer",
    title: "Graphic Designer",
    type: "Fulltime",
    shift: "Day shift",
    duties: [
      "Planning concepts by studying relevant information and materials.",
      "Illustrating concepts by designing examples of art arrangement, size, and type style.",
      "Preparing finished art by operating necessary equipment and software.",
      "Coordinating with outside agencies, art services, web designers, and colleagues.",
      "Creating a wide range of graphics and layouts for product illustrations, company logos, and websites.",
      "Communicating with clients about layout and design.",
      "Reviewing final layouts and suggesting improvements when necessary.",
    ],
  },
  {
    id: "accounting-assistant",
    title: "Accounting Assistant",
    type: "Fulltime",
    shift: "8hr shift",
    duties: [
      "Accurately record financial transactions, including accounts payable, receivable, and general ledger entries.",
      "Process vendor invoices, ensure timely payments, and maintain accurate records.",
      "Perform regular bank reconciliations and assist in reconciling other financial accounts.",
      "Organize and maintain both digital and physical financial records.",
      "Prepare invoices for clients, follow up on outstanding payments.",
      "Assist in generating financial reports, including profit and loss statements and balance sheets.",
      "Support the accounting team in preparing budgets and forecasts.",
      "Assist with internal and external audits by providing necessary documentation.",
    ],
  },
  {
    id: "derma-doctor",
    title: "Derma Doctor",
    type: "Fulltime",
    shift: "8hr shift",
    duties: [
      "Provide dermatological consultations to patients with various skin, hair, and nail conditions.",
      "Diagnose and treat skin diseases, infections, and cosmetic dermatological issues.",
      "Perform minor dermatological procedures, such as skin biopsies, excisions, and treatments of lesions.",
      "Prescribe appropriate medication, therapies, and skincare routines tailored to patient needs.",
      "Conduct cosmetic dermatology procedures (e.g., Botox, fillers, chemical peels) if qualified.",
      "Educate patients on proper skincare, sun protection, and treatment plans.",
      "Maintain accurate patient records, ensuring confidentiality and compliance with medical standards.",
    ],
  },
  {
    id: "aircon-technician",
    title: "Aircon Technician",
    type: "Fulltime",
    shift: "8hr shift",
    duties: [
      "Install new air conditioning systems, including ductwork, refrigerant lines, and electrical connections.",
      "Ensure all installations comply with local building codes and regulations.",
      "Perform routine maintenance tasks on air conditioning units, including cleaning and inspection.",
      "Replace or repair defective parts, such as compressors, condensers, and thermostats.",
      "Diagnose and repair faults and malfunctions in air conditioning systems.",
      "Communicate effectively with customers to explain issues and provide estimates.",
      "Adhere to safety protocols and procedures while working on air conditioning systems.",
      "Maintain accurate records of service calls, repairs, and maintenance activities.",
    ],
  },
];

const POSITIONS = JOBS.map((j) => j.title);

// ─── Partner Logo ─────────────────────────────────────────────────────────────
function PartnerLogo({ logo, name }: { logo?: any; name: string }) {
  if (logo) return <Image source={logo} style={ps.logo} resizeMode="contain" />;
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <View style={[ps.logo, ps.logoPlaceholder]}>
      <Text style={ps.logoInitials}>{initials}</Text>
    </View>
  );
}

// ─── Partner Card ─────────────────────────────────────────────────────────────
function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <View style={ps.card}>
      <PartnerLogo logo={partner.logo} name={partner.name} />
      <View style={ps.cardInfo}>
        <Text style={ps.cardName}>{partner.name}</Text>
        <View style={ps.cardRow}>
          <Ionicons name="location-outline" size={13} color={C.gray} />
          <Text style={ps.cardDetail}>
            {partner.floor}, Victoria Sports Tower, EDSA South Triangle, Quezon
            City
          </Text>
        </View>
        {partner.phone && (
          <TouchableOpacity
            style={ps.cardRow}
            onPress={() => Linking.openURL(`tel:${partner.phone}`)}
          >
            <Ionicons name="call-outline" size={13} color={C.green} />
            <Text style={[ps.cardDetail, { color: C.green }]}>
              {partner.phone}
            </Text>
          </TouchableOpacity>
        )}
        {partner.facebookUrl && (
          <TouchableOpacity
            style={ps.cardRow}
            onPress={() => Linking.openURL(partner.facebookUrl!)}
          >
            <FontAwesome5 name="facebook" size={13} color="#1877F2" />
            <Text style={[ps.cardDetail, { color: "#1877F2" }]}>
              {partner.facebook ?? "Visit Page"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// ─── Partners Bottom Sheet ────────────────────────────────────────────────────
function PartnersBottomSheet({
  category,
  onClose,
}: {
  category: RetailCategory | null;
  onClose: () => void;
}) {
  const slideAnim = useRef(new Animated.Value(SH)).current;
  React.useEffect(() => {
    if (category)
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 60,
        friction: 11,
      }).start();
    else slideAnim.setValue(SH);
  }, [category]);
  const handleClose = () =>
    Animated.timing(slideAnim, {
      toValue: SH,
      duration: 260,
      useNativeDriver: true,
    }).start(onClose);
  if (!category) return null;
  return (
    <Modal
      transparent
      visible
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        style={bss.overlay}
        activeOpacity={1}
        onPress={handleClose}
      />
      <Animated.View
        style={[bss.sheet, { transform: [{ translateY: slideAnim }] }]}
      >
        <View style={bss.handle} />
        <View style={bss.sheetHeader}>
          <View style={{ flex: 1 }}>
            <Text style={bss.sheetEyebrow}>{category.subtitle}</Text>
            <Text style={bss.sheetTitle}>{category.title}</Text>
          </View>
          <TouchableOpacity onPress={handleClose} style={bss.closeBtn}>
            <Ionicons name="close" size={20} color={C.gray} />
          </TouchableOpacity>
        </View>
        <Text style={bss.partnerCount}>
          {`${category.partners.length} partner${category.partners.length !== 1 ? "s" : ""} in VS Tower`}
        </Text>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {category.partners.map((partner) => (
            <PartnerCard key={partner.id} partner={partner} />
          ))}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

// ─── Image Gallery ────────────────────────────────────────────────────────────
function ImageGallery({
  images,
  fallbackBg,
}: {
  images: any[];
  fallbackBg: string;
}) {
  const [active, setActive] = useState(0);
  if (!images || images.length === 0)
    return <View style={[gal.hero, { backgroundColor: fallbackBg }]} />;
  return (
    <View>
      <Image source={images[active]} style={gal.hero} resizeMode="cover" />
      {images.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={gal.thumbRow}
        >
          {images.map((img, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setActive(i)}
              activeOpacity={0.8}
            >
              <Image
                source={img}
                style={[gal.thumb, i === active && gal.thumbActive]}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

// ─── Carousel Bottom Sheet ────────────────────────────────────────────────────
function CarouselBottomSheet({
  item,
  onClose,
  onAction,
}: {
  item: CarouselItem | null;
  onClose: () => void;
  onAction: (item: CarouselItem) => void;
}) {
  const slideAnim = useRef(new Animated.Value(SH)).current;
  React.useEffect(() => {
    if (item)
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 60,
        friction: 11,
      }).start();
    else slideAnim.setValue(SH);
  }, [item]);
  const handleClose = () =>
    Animated.timing(slideAnim, {
      toValue: SH,
      duration: 260,
      useNativeDriver: true,
    }).start(onClose);
  if (!item) return null;
  return (
    <Modal
      transparent
      visible
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        style={bss.overlay}
        activeOpacity={1}
        onPress={handleClose}
      />
      <Animated.View
        style={[bss.sheet, { transform: [{ translateY: slideAnim }] }]}
      >
        <View style={bss.handle} />
        <ImageGallery images={item.images} fallbackBg={item.fallbackBg} />
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={bss.body}
          showsVerticalScrollIndicator={false}
        >
          <Text style={bss.sheetEyebrow}>{item.subtitle}</Text>
          <Text style={bss.sheetTitle}>{item.title}</Text>
          <Text style={bss.desc}>{item.description}</Text>
          <TouchableOpacity
            style={bss.actionBtn}
            onPress={() => onAction(item)}
            activeOpacity={0.85}
          >
            <Text style={bss.actionBtnText}>Learn More →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={bss.dismissBtn} onPress={handleClose}>
            <Text style={bss.dismissText}>Dismiss</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

// ─── Carousel Card ────────────────────────────────────────────────────────────
function CarouselCard({
  item,
  onPress,
}: {
  item: CarouselItem;
  onPress: (item: CarouselItem) => void;
}) {
  const CARD_W = SW - 48;
  const CARD_H = 230;
  const hasImages = item.images && item.images.length > 0;
  return (
    <TouchableOpacity
      style={[car.card, !hasImages && { backgroundColor: item.fallbackBg }]}
      onPress={() => onPress(item)}
      activeOpacity={0.88}
    >
      {hasImages && (
        <Image
          source={item.images[0]}
          style={{ width: CARD_W, height: CARD_H, position: "absolute" }}
          resizeMode="cover"
        />
      )}
      <View style={car.overlay} />
      {hasImages && item.images.length > 1 && (
        <View style={car.photoPill}>
          <Text style={car.photoPillText}>📷 {item.images.length} photos</Text>
        </View>
      )}
      <View style={car.info}>
        <Text style={car.eyebrow}>{item.subtitle}</Text>
        <Text style={car.title}>{item.title}</Text>
        <Text style={car.hint}>Tap to explore →</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Editorial Card — now with real background image + black gradient ─────────
function EditorialCard({
  item,
  onPress,
}: {
  item: RetailCategory;
  onPress: (item: RetailCategory) => void;
}) {
  return (
    <TouchableOpacity
      style={ed.card}
      onPress={() => onPress(item)}
      activeOpacity={0.88}
    >
      {/* Background photo */}
      <Image
        source={item.image}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
        resizeMode="stretch"
      />

      {/* Black gradient from transparent (top) → black (bottom) */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.55)", "rgba(0,0,0,0.92)"]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Text content sits on top */}
      <View style={ed.content}>
        <View style={ed.tagsRow}>
          {item.tags.map((t) => (
            <View key={t} style={ed.tag}>
              <Text style={ed.tagText}>{t}</Text>
            </View>
          ))}
        </View>
        <Text style={ed.title}>{item.title}</Text>
        <Text style={ed.desc}>{item.description}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text style={ed.link}>View {item.partners.length} partners</Text>
          <Ionicons name="chevron-forward" size={12} color="#D4A017" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Job Card ─────────────────────────────────────────────────────────────────
function JobCard({ job }: { job: Job }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <View style={jc.card}>
      <TouchableOpacity
        style={jc.header}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.8}
      >
        <View style={{ flex: 1 }}>
          <Text style={jc.title}>{job.title}</Text>
          <View style={jc.metaRow}>
            <View style={jc.badge}>
              <FontAwesome5 name="briefcase" size={9} color={C.green} />
              <Text style={jc.badgeText}>{job.type}</Text>
            </View>
            {job.shift && (
              <View style={jc.badge}>
                <Ionicons name="time-outline" size={10} color={C.green} />
                <Text style={jc.badgeText}>{job.shift}</Text>
              </View>
            )}
          </View>
        </View>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={18}
          color={C.gray}
        />
      </TouchableOpacity>
      {expanded && (
        <View style={jc.duties}>
          <Text style={jc.dutiesLabel}>Duties & Responsibilities</Text>
          {job.duties.map((duty, i) => (
            <View key={i} style={jc.dutyRow}>
              <View style={jc.bullet} />
              <Text style={jc.dutyText}>{duty}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Resume Form ──────────────────────────────────────────────────────────────
function ResumeForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [showPositionPicker, setShowPositionPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !position) {
      Alert.alert(
        "Missing Info",
        "Please fill in all required fields and select a position.",
      );
      return;
    }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      Alert.alert(
        "Application Sent! 🎉",
        "Thank you for your interest! We'll be in touch soon.",
        [
          {
            text: "OK",
            onPress: () => {
              setFirstName("");
              setLastName("");
              setEmail("");
              setPhone("");
              setPosition("");
            },
          },
        ],
      );
    } catch {
      Alert.alert("Error", "Could not send application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={rf.container}>
      <View style={rf.header}>
        <FontAwesome5 name="paper-plane" size={18} color={C.goldLight} />
        <Text style={rf.heading}>Send Us Your Resume</Text>
      </View>
      <Text style={rf.subtext}>
        Are you looking to advance your career with us? We're excited to hear
        from passionate and talented individuals like you.
      </Text>
      <View style={rf.row}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={rf.label}>First Name *</Text>
          <TextInput
            style={rf.input}
            placeholder="Juan"
            placeholderTextColor={C.gray}
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={rf.label}>Last Name *</Text>
          <TextInput
            style={rf.input}
            placeholder="Dela Cruz"
            placeholderTextColor={C.gray}
            value={lastName}
            onChangeText={setLastName}
          />
        </View>
      </View>
      <Text style={rf.label}>Email *</Text>
      <View style={rf.inputRow}>
        <Ionicons
          name="mail-outline"
          size={16}
          color={C.gray}
          style={rf.inputIcon}
        />
        <TextInput
          style={rf.inputWithIcon}
          placeholder="you@email.com"
          placeholderTextColor={C.gray}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <Text style={rf.label}>Phone Number</Text>
      <View style={rf.inputRow}>
        <Ionicons
          name="call-outline"
          size={16}
          color={C.gray}
          style={rf.inputIcon}
        />
        <TextInput
          style={rf.inputWithIcon}
          placeholder="+63 9XX XXX XXXX"
          placeholderTextColor={C.gray}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      </View>
      <Text style={rf.label}>Select Position *</Text>
      <TouchableOpacity
        style={rf.picker}
        onPress={() => setShowPositionPicker(!showPositionPicker)}
        activeOpacity={0.8}
      >
        <FontAwesome5
          name="briefcase"
          size={14}
          color={C.gray}
          style={rf.inputIcon}
        />
        <Text style={[rf.pickerText, !position && { color: C.gray }]}>
          {position || "Choose a position..."}
        </Text>
        <Ionicons
          name={showPositionPicker ? "chevron-up" : "chevron-down"}
          size={16}
          color={C.gray}
        />
      </TouchableOpacity>
      {showPositionPicker && (
        <View style={rf.dropdownContainer}>
          <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
            {POSITIONS.map((pos) => (
              <TouchableOpacity
                key={pos}
                style={[
                  rf.dropdownItem,
                  position === pos && rf.dropdownItemActive,
                ]}
                onPress={() => {
                  setPosition(pos);
                  setShowPositionPicker(false);
                }}
              >
                <Text
                  style={[
                    rf.dropdownText,
                    position === pos && rf.dropdownTextActive,
                  ]}
                >
                  {pos}
                </Text>
                {position === pos && (
                  <Ionicons name="checkmark" size={14} color={C.green} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      <TouchableOpacity
        style={[rf.submitBtn, loading && { opacity: 0.6 }]}
        onPress={handleSubmit}
        disabled={loading}
        activeOpacity={0.9}
      >
        {loading ? (
          <ActivityIndicator color={C.white} />
        ) : (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <FontAwesome5 name="paper-plane" size={14} color={C.white} />
            <Text style={rf.submitText}>Submit Application</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

// ─── Career Bottom Sheet ──────────────────────────────────────────────────────
function CareerBottomSheet({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const slideAnim = useRef(new Animated.Value(SH)).current;
  React.useEffect(() => {
    if (visible)
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 60,
        friction: 11,
      }).start();
    else slideAnim.setValue(SH);
  }, [visible]);
  const handleClose = () =>
    Animated.timing(slideAnim, {
      toValue: SH,
      duration: 260,
      useNativeDriver: true,
    }).start(onClose);
  if (!visible) return null;
  return (
    <Modal
      transparent
      visible
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        style={bss.overlay}
        activeOpacity={1}
        onPress={handleClose}
      />
      <Animated.View
        style={[bss.sheet, { transform: [{ translateY: slideAnim }] }]}
      >
        <View style={bss.handle} />
        <View style={bss.sheetHeader}>
          <View style={{ flex: 1 }}>
            <Text style={bss.sheetEyebrow}>VS Hotel Corp.</Text>
            <Text style={bss.sheetTitle}>Career Opportunities</Text>
          </View>
          <TouchableOpacity onPress={handleClose} style={bss.closeBtn}>
            <Ionicons name="close" size={20} color={C.gray} />
          </TouchableOpacity>
        </View>
        <Text style={bss.partnerCount}>
          {`${JOBS.length} open positions \u2022 Marivent Resort Hotel, Inc.`}
        </Text>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          {JOBS.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
          <View
            style={{
              height: 1,
              backgroundColor: "#D1D5DB",
              marginVertical: 24,
            }}
          />
          <ResumeForm />
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function VSScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCarousel, setSelectedCarousel] = useState<CarouselItem | null>(
    null,
  );
  const [selectedCategory, setSelectedCategory] =
    useState<RetailCategory | null>(null);
  const [showCareers, setShowCareers] = useState(false);

  const onScroll = (e: any) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / (SW - 48));
    setActiveIndex(Math.min(Math.max(idx, 0), CAROUSEL_ITEMS.length - 1));
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.green} />
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.headerTitle}>More from VS Hotel Corp.</Text>
          </View>
          <View style={s.vsCircle}>
            <Text style={s.vsCircleText}>VS</Text>
          </View>
        </View>

        {/* Carousel */}
        <View style={s.carouselWrap}>
          <FlatList
            data={CAROUSEL_ITEMS}
            keyExtractor={(i) => i.id}
            horizontal
            snapToInterval={SW - 48}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
            renderItem={({ item }) => (
              <CarouselCard item={item} onPress={setSelectedCarousel} />
            )}
            onScroll={onScroll}
            scrollEventThrottle={16}
          />
          <View style={s.dots}>
            {CAROUSEL_ITEMS.map((_, i) => (
              <View key={i} style={[s.dot, i === activeIndex && s.dotActive]} />
            ))}
          </View>
        </View>

        {/* Retail Partners */}
        <View style={s.editSection}>
          <Text style={s.sectionLabel}>RETAIL PARTNERS</Text>
          <Text style={s.sectionSub}>Shop, dine & more within VS Tower</Text>
          {RETAIL_CATEGORIES.map((item) => (
            <EditorialCard
              key={item.id}
              item={item}
              onPress={setSelectedCategory}
            />
          ))}
        </View>

        {/* Careers */}
        <View style={s.editSection}>
          <Text style={s.sectionLabel}>CAREERS</Text>
          <Text style={s.sectionSub}>Join the VS family</Text>
          <TouchableOpacity
            style={s.careerBtn}
            onPress={() => setShowCareers(true)}
            activeOpacity={0.88}
          >
            <FontAwesome5 name="briefcase" size={16} color={C.goldLight} />
            <Text style={s.careerBtnText}>View Career Opportunities</Text>
            <Ionicons name="chevron-forward" size={16} color={C.goldLight} />
          </TouchableOpacity>
        </View>

        {/* Contact */}
        <View style={ct.container}>
          <Text style={ct.heading}>Contact Information</Text>
          <Text style={ct.groupLabel}>For inquiries and reservations:</Text>
          <Text style={ct.line}>+63 917 825 9938 / +63 917 184 2777</Text>
          <Text style={ct.line}>(632) 8370-2892</Text>
          <Text style={ct.line}>reservations@vshotel.com.ph</Text>
          <Text style={ct.groupLabel}>For dine-in inquiries:</Text>
          <Text style={ct.line}>+63 945 461 5200</Text>
          <Text style={ct.groupLabel}>
            For corporate, weddings, & social events:
          </Text>
          <Text style={ct.line}>events@vshotel.com.ph</Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <CarouselBottomSheet
        item={selectedCarousel}
        onClose={() => setSelectedCarousel(null)}
        onAction={(item) => Linking.openURL(item.url).catch(() => {})}
      />
      <PartnersBottomSheet
        category={selectedCategory}
        onClose={() => setSelectedCategory(null)}
      />
      <CareerBottomSheet
        visible={showCareers}
        onClose={() => setShowCareers(false)}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const car = StyleSheet.create({
  card: {
    width: SW - 48,
    height: 230,
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "flex-end",
    padding: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.42)",
  },
  photoPill: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  photoPillText: { color: C.white, fontSize: 11, fontWeight: "600" },
  info: { gap: 4 },
  eyebrow: {
    color: "#D4A017",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  title: { color: C.white, fontSize: 24, fontWeight: "900" },
  hint: { color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 2 },
});

const ed = StyleSheet.create({
  card: {
    width: "100%",
    aspectRatio: 750 / 400,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
    justifyContent: "flex-end",
  },
  content: { padding: 16 },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 6 },
  tag: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  tagText: { color: "rgba(255,255,255,0.85)", fontSize: 10, fontWeight: "600" },
  title: { color: C.white, fontSize: 20, fontWeight: "800", marginBottom: 3 },
  desc: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 8,
  },
  link: { color: "#D4A017", fontSize: 12, fontWeight: "700" },
});

const bss = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)" },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: C.offWhite,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: SH * 0.92,
    overflow: "hidden",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#DDD",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
  },
  sheetEyebrow: {
    fontSize: 10,
    color: C.gold,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  sheetTitle: { fontSize: 22, fontWeight: "900", color: C.dark },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  partnerCount: {
    fontSize: 12,
    color: C.green,
    fontWeight: "700",
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  body: { paddingHorizontal: 24, paddingTop: 18, paddingBottom: 36 },
  desc: { fontSize: 14, color: C.gray, lineHeight: 22, marginBottom: 24 },
  actionBtn: {
    backgroundColor: C.green,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  actionBtnText: { color: C.white, fontSize: 15, fontWeight: "800" },
  dismissBtn: { paddingVertical: 10, alignItems: "center" },
  dismissText: { color: C.gray, fontSize: 14 },
});

const gal = StyleSheet.create({
  hero: {
    width: "100%",
    height: 220,
    marginTop: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#222",
    alignSelf: "center",
  },
  thumbRow: { paddingHorizontal: 20, paddingTop: 10, gap: 8 },
  thumb: {
    width: 58,
    height: 58,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },
  thumbActive: { borderColor: C.gold },
});

const ps = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: C.white,
    borderRadius: 14,
    marginBottom: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 10,
    marginRight: 14,
    backgroundColor: C.offWhite,
  },
  logoPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.green + "15",
    borderWidth: 1,
    borderColor: C.green + "30",
  },
  logoInitials: { fontSize: 22, fontWeight: "900", color: C.green },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 14, fontWeight: "800", color: C.dark, marginBottom: 6 },
  cardRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 5,
    marginBottom: 4,
  },
  cardDetail: { fontSize: 11, color: C.gray, flex: 1, lineHeight: 16 },
});

const jc = StyleSheet.create({
  card: {
    backgroundColor: C.white,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  header: { flexDirection: "row", alignItems: "center", padding: 16, gap: 10 },
  title: { fontSize: 15, fontWeight: "800", color: C.dark, marginBottom: 6 },
  metaRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EAF4EE",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: { fontSize: 10, fontWeight: "700", color: C.green },
  duties: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "#F8FAFC",
  },
  dutiesLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: C.green,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  dutyRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 6,
  },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: C.gold,
    marginTop: 6,
    flexShrink: 0,
  },
  dutyText: { fontSize: 12, color: "#374151", lineHeight: 18, flex: 1 },
});

const rf = StyleSheet.create({
  container: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1.5,
    borderColor: C.green,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  heading: { fontSize: 18, fontWeight: "900", color: C.dark },
  subtext: { fontSize: 13, color: C.gray, lineHeight: 20, marginBottom: 20 },
  row: { flexDirection: "row", marginBottom: 4 },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: C.dark,
    marginBottom: 6,
    marginTop: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: C.offWhite,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: C.dark,
    borderWidth: 1,
    borderColor: C.grayLight,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.offWhite,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.grayLight,
  },
  inputIcon: { paddingLeft: 12 },
  inputWithIcon: { flex: 1, padding: 12, fontSize: 14, color: C.dark },
  picker: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.offWhite,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.grayLight,
    padding: 12,
  },
  pickerText: { flex: 1, fontSize: 14, color: C.dark, marginLeft: 8 },
  dropdownContainer: {
    backgroundColor: C.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.grayLight,
    marginTop: 4,
    overflow: "hidden",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  dropdownItemActive: { backgroundColor: "#EAF4EE" },
  dropdownText: { fontSize: 13, color: C.dark },
  dropdownTextActive: { color: C.green, fontWeight: "700" },
  submitBtn: {
    backgroundColor: C.green,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: { color: C.white, fontSize: 15, fontWeight: "800" },
});

const ct = StyleSheet.create({
  container: {
    backgroundColor: C.green,
    marginHorizontal: 20,
    marginTop: 28,
    borderRadius: 16,
    padding: 20,
  },
  heading: {
    color: C.white,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 16,
  },
  groupLabel: {
    color: "#D4A017",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginTop: 14,
    marginBottom: 4,
  },
  line: { color: "rgba(255,255,255,0.85)", fontSize: 13, lineHeight: 20 },
});

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.green },
  scroll: { flex: 1, backgroundColor: C.lavender },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: C.green,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24, // ← bumped up from 22
    fontWeight: "900",
    color: C.white,
    marginTop: 2,
  },
  vsCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  vsCircleText: { color: C.white, fontWeight: "900", fontSize: 16 },
  carouselWrap: { paddingTop: 24, paddingBottom: 8 },
  // ─ Section labels — bigger ─
  sectionLabel: {
    fontSize: 20, // ← was 11 (tracking label style), now big heading
    fontWeight: "900",
    color: C.green,
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 13,
    color: C.gray,
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 14,
  },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#CCC" },
  dotActive: { backgroundColor: C.green, width: 20 },
  editSection: { paddingTop: 28, paddingHorizontal: 20 },
  careerBtn: {
    backgroundColor: C.green,
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  careerBtnText: {
    color: C.white,
    fontWeight: "800",
    fontSize: 15,
    flex: 1,
    textAlign: "center",
  },
});
