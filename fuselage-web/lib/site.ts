// Company content, taken from the Fuselage Resources company profile (Nov 2026).

export const company = {
  name: "Fuselage Resources",
  tagline: "Your needs, our priority",
  phones: ["+263 773 239 084", "+263 712 821 973"],
  email: "fuselageresources@outlook.com",
  address: "5686 Knowe, Norton, Zimbabwe",
  vision:
    "To be the leading and most trusted supplier of essential goods and services in our region, contributing to sustainable development and improved livelihoods.",
  mission:
    "To deliver high-quality, affordable and reliable products and services, with a focus on customer satisfaction, innovation and community development.",
};

export type TeamKey = "webster" | "darleen" | "janet";

export const team: Record<
  TeamKey,
  { name: string; first: string; role: string; summary: string; handles: string; photo: string }
> = {
  webster: {
    name: "Webster Tapiwanashe Chinyoka",
    first: "Webster",
    role: "CEO & Managing Director",
    summary:
      "Leads strategy, client relationships and overall direction, and is the accountable contact for tenders, major orders and partnerships.",
    handles: "Tenders and partnerships",
    photo: "/img/webster.jpg",
  },
  darleen: {
    name: "Darleen Tawananyasha Nyakuyedzwa",
    first: "Darleen",
    role: "Sales & Marketing Director",
    summary:
      "Leads sales, marketing and client development, overseeing enquiries, quotations and key accounts.",
    handles: "Quotations and new accounts",
    photo: "/img/darleen.jpg",
  },
  janet: {
    name: "Janet Danai Chinyoka",
    first: "Janet",
    role: "Operations Manager",
    summary:
      "Manages day-to-day operations, sourcing, logistics and delivery coordination across all supply divisions.",
    handles: "Orders and deliveries",
    photo: "/img/janet.jpg",
  },
};

// Enquiry types and who handles them (profile, "Who to contact").
export const enquiryTypes = [
  { value: "quote", label: "A quotation", owner: "darleen" as TeamKey },
  { value: "tender", label: "A tender or partnership", owner: "webster" as TeamKey },
  { value: "account", label: "A new supply account", owner: "darleen" as TeamKey },
  { value: "order", label: "An existing order or delivery", owner: "janet" as TeamKey },
] as const;

export type EnquiryType = (typeof enquiryTypes)[number]["value"];

export type Division = {
  slug: string;
  name: string;
  short: string;
  strap: string;
  photo: string;
  intro: string;
  listTitle: string;
  items: string[];
  extraTitle?: string;
  extra?: string[] | string;
  idealFor: string[];
  askTitle: string;
  ask: string;
};

export const divisions: Division[] = [
  {
    slug: "borehole-drilling",
    name: "Borehole drilling & water solutions",
    short: "Borehole drilling",
    strap: "Clean water for a healthier tomorrow",
    photo: "/img/borehole.jpg",
    intro:
      "Professional borehole drilling for residential, commercial, agricultural and industrial use. Our technicians use modern equipment to deliver reliable, long-lasting water sources, and we coordinate the right rig and resources for each site.",
    listTitle: "Services",
    items: [
      "Borehole drilling, various depths and sizes",
      "Pump installation and maintenance",
      "Bulk water supply",
      "Water storage tanks, various sizes",
      "Water reticulation",
      "Project coordination: site access, scope and schedule",
    ],
    idealFor: ["Farms and agribusiness", "Schools and hospitals", "Local authorities", "Businesses and industry", "Property developers", "Private households"],
    askTitle: "Planning a borehole?",
    ask: "Share your site location, intended water use and storage needs. Site assessments, permits and testing are confirmed with you before work begins.",
  },
  {
    slug: "construction-materials",
    name: "Construction materials supply",
    short: "Construction materials",
    strap: "Building stronger communities",
    photo: "/img/construction.jpg",
    intro:
      "Construction and infrastructure materials for every size of project, from small developments to civil works and road construction. We work to your specifications, quantities, delivery location and schedule.",
    listTitle: "Products",
    items: [
      "River sand and pit sand",
      "Cement, various brands",
      "Timber",
      "Bricks",
      "Roofing tiles and sheets",
      "Culvert pipes",
      "Catmix",
      "Stable 60 for road construction",
      "Bitumen and other construction materials",
    ],
    idealFor: ["Government and councils", "Road contractors", "Building contractors", "Property developers", "Hardware resellers", "Individual builders"],
    askTitle: "Need a materials quote?",
    ask: "Send your bill of quantities or material list with grades, preferred brands, delivery address, required date and any tender documents.",
  },
  {
    slug: "butchery",
    name: "Butchery & meat products",
    short: "Butchery & meat",
    strap: "Fresh meat from our own butchery",
    photo: "/img/butchery.jpg",
    intro:
      "Every cut comes directly from our own butchery. Our cold chain keeps products chilled or frozen as appropriate, hygienically handled and suitably packed, from the butchery to your kitchen.",
    listTitle: "Meat products",
    items: ["Beef", "Pork", "Chicken", "Lamb", "Goat", "Processed meat products"],
    extraTitle: "Cold chain commitment",
    extra:
      "Chilled or frozen storage as appropriate, hygienic handling, suitable packaging and coordinated delivery.",
    idealFor: ["Institutional kitchens", "Schools and hospitals", "Hotels and restaurants", "Caterers and events", "Retailers", "Households"],
    askTitle: "Supplying an institution?",
    ask: "We agree product type, temperature requirements, packaging, quantities, delivery frequency and food-safety documentation with you before the first delivery.",
  },
  {
    slug: "fresh-produce",
    name: "Fruit & vegetables",
    short: "Fruit & vegetables",
    strap: "Fresh produce, sourced and handled with care",
    photo: "/img/produce.jpg",
    intro:
      "Fresh fruit and vegetables for individuals, institutions and businesses, from daily needs to bulk supply, sourced from trusted growers and suppliers.",
    listTitle: "Fresh produce",
    items: ["Tomatoes", "Potatoes", "Onions", "Carrots", "Cabbage", "Green vegetables", "Apples, bananas and citrus", "Other seasonal produce"],
    idealFor: ["Schools and hospitals", "Hotels and restaurants", "Caterers and events", "Retailers", "Households"],
    askTitle: "Ordering in bulk?",
    ask: "Send your shopping list or tender schedule. Pack sizes, substitutions and delivery days are agreed in advance for institutional orders.",
  },
  {
    slug: "groceries",
    name: "Groceries & provisions",
    short: "Groceries & provisions",
    strap: "Everyday essentials, one supply partner",
    photo: "/img/produce.jpg",
    intro:
      "A full range of groceries and household provisions alongside our fresh produce, so institutions can place one order with one supplier.",
    listTitle: "Groceries & provisions",
    items: ["Maize meal", "Wheat flour", "Cooking oil", "Sugar", "Rice", "Tea and coffee", "Tinned foods and beverages", "Household essentials"],
    idealFor: ["Government entities", "Schools and hospitals", "Churches and NGOs", "Corporates", "Households"],
    askTitle: "Ordering in bulk?",
    ask: "Send your shopping list or tender schedule. Brands, pack sizes, expiry dates, substitutions and delivery days are agreed in advance for institutional orders.",
  },
];

export const clientGroups = [
  { name: "Government entities", who: "Ministries, departments and local authorities" },
  { name: "Institutions", who: "Schools, hospitals, churches, NGOs and corporates" },
  { name: "Contractors & construction", who: "Infrastructure, road and building projects" },
  { name: "Agricultural sector", who: "Farmers, co-operatives and agribusinesses" },
  { name: "Private individuals", who: "Households, farmers and entrepreneurs" },
];

export const process = [
  { title: "Request & enquiry", body: "You send us your requirements, bill of quantities or tender schedule." },
  { title: "Quotation", body: "We confirm specifications and provide a competitive quote." },
  { title: "Order confirmation", body: "We confirm and process your order, with agreed lead times." },
  { title: "Delivery", body: "We deliver on time to your location, including phased deliveries." },
];

export const values = [
  { name: "Integrity", body: "We do what is right, with transparent communication and professional conduct." },
  { name: "Reliability", body: "We deliver on agreed specifications, quantities and timelines." },
  { name: "Quality", body: "We never compromise on product suitability, handling and standards." },
  { name: "Customer focus", body: "Every supply plan is shaped around our clients' needs." },
  { name: "Teamwork", body: "We grow together with our people, suppliers and clients." },
  { name: "Sustainability", body: "We build for future generations and the communities we serve." },
];
