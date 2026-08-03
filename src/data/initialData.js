export const initialData = {
  hero: {
    title: "Power in Every Drop",
    subtitle: "Orbit Lubricant Industries — premium automotive, motorcycle, CNG, and heavy-duty industrial lubricants engineered for superior engine protection, maximum thermal efficiency, and peak performance.",
    ctaPrimary: "Explore Product Range",
    ctaSecondary: "Become a Distributor",
    stat1: { number: "50+", label: "Formulated Lubricants" },
    stat2: { number: "100%", label: "ISO & API Certified" },
    stat3: { number: "250+", label: "Distributors & Dealers" }
  },

  about: {
    heroTitle: "Protecting Engines. Powering Global Industry.",
    heroSubtitle: "Engineered in Bangladesh for tough road conditions, extreme climates, and heavy-duty industrial demands.",
    story: "Orbit Lubricant Industries is a premier lubricant manufacturer dedicated to formulating high-performance engine oils, gear fluids, hydraulic oils, and specialized greases. Founded with a vision to deliver world-class tribological solutions, Orbit combines advanced synthetic additive chemistry with refined base stocks to provide unmatched anti-wear and thermal stability.",
    mission: "To engineer and supply high-performance lubricants that maximize machinery lifespan, reduce maintenance downtime, and lower operational costs for automotive, industrial, and motorcycle clients.",
    vision: "To become South Asia's leading lubricant brand and a trusted export partner recognized globally for uncompromising quality, technical innovation, and environmental responsibility.",
    values: [
      { title: "Precision Chemistry", desc: "Every drop is blended using premium virgin base oils and internationally certified additive packages." },
      { title: "Customer-First Support", desc: "Comprehensive technical advisory, oil condition monitoring, and tailored industrial solutions." },
      { title: "Sustainability", desc: "Formulated to optimize fuel economy, minimize emissions, and extend drain intervals." }
    ]
  },

  categories: [
    { id: "motorcycle", name: "4T / 2T Motorcycle Oils", icon: "Bike" },
    { id: "cng", name: "CNG Special Engine Oils", icon: "Zap" },
    { id: "automotive", name: "Passenger Car Motor Oils", icon: "Car" },
    { id: "heavy-duty", name: "Heavy Duty Commercial Engine Oils", icon: "Truck" },
    { id: "industrial", name: "Industrial & Gear Oils", icon: "Factory" },
    { id: "hydraulic", name: "Hydraulic & Transmission Fluids", icon: "Sliders" }
  ],

  products: [
    {
      id: "orb-20w50-cng-gold",
      name: "Orbit 20W50 CNG Premium Engine Oil",
      category: "cng",
      viscosity: "20W-50",
      apiGrade: "CNG Compatible Special Grade",
      packing: "2L Net Volume",
      featured: true,
      badge: "CNG Vehicle Special",
      image: "/products/Selected.png",
      imageColor: "#007A3D",
      description: "Specially formulated premium engine oil designed for CNG vehicles and auto-rickshaws. Offers superior engine protection, excellent thermal stability, cleaner engine operation, and enhanced fuel efficiency.",
      specs: {
        "Base Type": "Refined Mineral Base + CNG Additives",
        "Target Vehicles": "CNG Auto-Rickshaws, CNG Cars & Commercial",
        "Viscosity Index": "135",
        "Thermal Stability": "High Heat Resistant",
        "Recommended Drain": "4,000 km / 3 Months"
      }
    },
    {
      id: "orb-15w40-truck",
      name: "Orbit Fusion-Tech 15W-40 Heavy Duty Engine Oil",
      category: "heavy-duty",
      viscosity: "15W-40",
      apiGrade: "API CI-4 / ACEA E7",
      packing: "5 Liters",
      featured: true,
      badge: "Commercial Heavy Duty",
      image: "/products/Selected4.png",
      imageColor: "#D97706",
      description: "Fusion-Tech synthetic technology heavy duty engine oil engineered for commercial trucks, buses, and industrial equipment. Delivers advanced wear protection, engine cleanliness, thermal stability, and fuel economy support.",
      specs: {
        "Base Type": "Synthetic Technology",
        "OEM Level": "CI-4 / ACEA E7 Approved",
        "Viscosity Index": "145",
        "Pour Point": "-36°C",
        "Recommended Drain": "15,000 km / Heavy Duty"
      }
    },
    {
      id: "orb-20w50-fusion-silver",
      name: "Orbit Fusion-Tech 20W-50 Synthetic Tech Engine Oil",
      category: "automotive",
      viscosity: "20W-50",
      apiGrade: "API CI-4 / ACEA E7",
      packing: "4 Liters",
      featured: true,
      badge: "Synthetic Technology",
      image: "/products/Selected5.png",
      imageColor: "#005AAB",
      description: "Premium Fusion-Tech synthetic technology engine oil engineered for modern passenger cars, SUVs, and light commercial vehicles. Ensures advanced wear protection, engine cleanliness, and fuel economy support.",
      specs: {
        "Base Type": "Synthetic Technology Blend",
        "Viscosity Index": "140",
        "Pour Point": "-33°C",
        "Flash Point": "230°C",
        "Recommended Drain": "8,000 km"
      }
    },
    {
      id: "orb-20w50-fusion-car",
      name: "Orbit Fusion-Tech 20W-50 Passenger Motor Oil",
      category: "automotive",
      viscosity: "20W-50",
      apiGrade: "API CI-4 / ACEA E7",
      packing: "4 Liters",
      featured: true,
      badge: "Fusion-Tech Performance",
      image: "/products/Selected6.png",
      imageColor: "#0A2540",
      description: "High-performance motor oil formulated with synthetic technology for smooth engine operation, thermal stability, and prolonged engine durability under tough operating conditions.",
      specs: {
        "Base Type": "Synthetic Technology",
        "Viscosity Index": "138",
        "Pour Point": "-30°C",
        "Recommended Drain": "7,500 km"
      }
    },
    {
      id: "orb-10w30-xpower-black",
      name: "Orbit XPower 10W30 4T Mineral Motorcycle Oil",
      category: "motorcycle",
      viscosity: "10W-30",
      apiGrade: "JASO MA2 / API SL",
      packing: "1L Net Volume",
      featured: true,
      badge: "4T Motorcycle Oil",
      image: "/products/Selected7.png",
      imageColor: "#0A2540",
      description: "High-performance 4T mineral engine oil engineered for 4-stroke motorcycles. Delivers reliable protection against wear, smooth clutch engagement, and excellent heat stability.",
      specs: {
        "Engine Type": "4-Stroke Motorcycle",
        "JASO Standard": "JASO MA2 (Wet Clutch)",
        "API Standard": "API SL",
        "Viscosity Index": "130",
        "Recommended Drain": "2,500 km"
      }
    },
    {
      id: "orb-10w30-xpower-green",
      name: "Orbit XPower 10W30 4T Performance & Protection",
      category: "motorcycle",
      viscosity: "10W-30",
      apiGrade: "JASO MA2 / API SL",
      packing: "1L Net Volume",
      featured: true,
      badge: "Smooth Acceleration",
      image: "/products/Selected8.png",
      imageColor: "#007A3D",
      description: "Mineral 4T engine oil engineered for maximum reliability, smooth acceleration, engine durability, and optimal clutch performance under urban and highway riding.",
      specs: {
        "Engine Type": "4-Stroke Motorcycle",
        "JASO Standard": "JASO MA2",
        "API Standard": "API SL",
        "Viscosity Index": "132",
        "Recommended Drain": "2,500 km"
      }
    },
    {
      id: "orb-10w40-xpower-red",
      name: "Orbit XPower 10W40 4T Mineral Engine Oil",
      category: "motorcycle",
      viscosity: "10W-40",
      apiGrade: "JASO MA2 / API SL",
      packing: "1L Net Volume",
      featured: true,
      badge: "10W-40 4T Mineral",
      image: "/products/Selected9.png",
      imageColor: "#EF4444",
      description: "Premium mineral 4T motorcycle oil formulated for bikes requiring 10W40 grade. Ensures reliable wear protection, smooth clutch response, and high thermal endurance.",
      specs: {
        "Engine Type": "4-Stroke Motorcycle",
        "JASO Standard": "JASO MA2",
        "API Standard": "API SL",
        "Viscosity Index": "135",
        "Recommended Drain": "3,000 km"
      }
    },
    {
      id: "orb-20w40-xpower-blue",
      name: "Orbit XPower 20W40 4T Mineral Engine Oil",
      category: "motorcycle",
      viscosity: "20W-40",
      apiGrade: "JASO MA2 / API SL",
      packing: "1L Net Volume",
      featured: true,
      badge: "20W-40 Heavy Duty 4T",
      image: "/products/Selected10.png",
      imageColor: "#005AAB",
      description: "Heavy-duty mineral 4T engine oil designed for 4-stroke motorcycles operating in high ambient temperatures. Offers reliable engine protection, smooth clutch performance, and high heat stability.",
      specs: {
        "Engine Type": "4-Stroke Motorcycle",
        "JASO Standard": "JASO MA2",
        "API Standard": "API SL",
        "Viscosity Index": "128",
        "Recommended Drain": "2,500 km"
      }
    }
  ],

  standards: [
    { code: "API CI-4", name: "American Petroleum Institute Heavy Duty Diesel Standard", status: "Certified" },
    { code: "JASO MA2", name: "Japanese Automotive Standards Org 4T Motorcycle Wet-Clutch Standard", status: "Certified" },
    { code: "ACEA E7", name: "European Automobile Manufacturers Association Commercial Standard", status: "Compliant" },
    { code: "API SL", name: "API 4-Stroke Gasoline & Motorcycle Engine Service Specification", status: "Certified" }
  ],

  contactInfo: {
    address: "Orbit Lubricant Industries, Industrial Zone, Dhaka, Bangladesh",
    phone: "+880 1700-000000 / +880 1800-000000",
    email: "info@orbit-lubricants.com",
    salesEmail: "sales@orbit-lubricants.com",
    hours: "Saturday – Thursday: 9:00 AM – 6:00 PM"
  },

  inquiries: [
    {
      id: "inq-101",
      date: "2026-08-02 14:30",
      name: "Rafiqul Islam",
      email: "rafiq.motors@gmail.com",
      phone: "+8801711223344",
      product: "Orbit XPower 10W30 4T Mineral Motorcycle Oil",
      type: "Distributor Inquiry",
      status: "New",
      message: "We have 15 motorcycle workshops in Gazipur. Want bulk quotation for 100 cartons of 1L 10W30 4T oil."
    },
    {
      id: "inq-102",
      date: "2026-08-01 11:15",
      name: "Tariqul Alam",
      email: "tariq.transport@yahoo.com",
      phone: "+8801819887766",
      product: "Orbit Fusion-Tech 15W-40 Heavy Duty Engine Oil",
      type: "Bulk Order",
      status: "In Progress",
      message: "Looking for 5L cans and 208L barrels for our fleet of 25 commercial trucks."
    }
  ],

  whyUs: [
    {
      id: "w1",
      icon: "ShieldCheck",
      title: "Certified Quality Additives",
      desc: "Blended using Tier-1 global additive packages meeting API CI-4, JASO MA2, and ACEA specifications."
    },
    {
      id: "w2",
      icon: "Zap",
      title: "CNG & Tropical Climate Formulations",
      desc: "Engineered specifically for Bangladesh high heat, traffic gridlocks, and CNG fuel operation."
    },
    {
      id: "w3",
      icon: "Factory",
      title: "Direct Factory Distribution",
      desc: "Guaranteed authentic products with zero counterfeit risk and competitive margin structure for dealers."
    },
    {
      id: "w4",
      icon: "Truck",
      title: "Rapid Nationwide Supply Chain",
      desc: "Dedicated logistics network ensuring fast delivery to workshops, fleets, and retail networks."
    }
  ],

  settings: {
    siteTitle: "Orbit Lubricants | Power in Every Drop",
    bannerText: "⚡ Official Launch: Orbit XPower 4T Motorcycle & Fusion-Tech Engine Oils Now Available Nationwide!",
    showBanner: true,
    logoUrl: "/logo.png"
  }
};
