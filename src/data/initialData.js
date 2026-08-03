export const initialData = {
  hero: {
    title: "Power in Every Drop",
    subtitle: "Orbit Lubricant Industries — premium automotive and industrial lubricants engineered for superior engine protection, maximum thermal efficiency, and peak operational performance.",
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
    mission: "To engineer and supply high-performance lubricants that maximize machinery lifespan, reduce maintenance downtime, and lower operational costs for automotive, industrial, and maritime clients.",
    vision: "To become South Asia's leading lubricant brand and a trusted export partner recognized globally for uncompromising quality, technical innovation, and environmental responsibility.",
    values: [
      { title: "Precision Chemistry", desc: "Every drop is blended using premium virgin base oils and internationally certified additive packages." },
      { title: "Customer-First Support", desc: "Comprehensive technical advisory, oil condition monitoring, and tailored industrial solutions." },
      { title: "Sustainability", desc: "Formulated to optimize fuel economy, minimize emissions, and extend drain intervals." }
    ]
  },

  categories: [
    { id: "automotive", name: "Passenger Car Motor Oils", icon: "Car" },
    { id: "heavy-duty", name: "Heavy Duty Diesel Engine Oils", icon: "Truck" },
    { id: "industrial", name: "Industrial & Gear Oils", icon: "Factory" },
    { id: "grease", name: "Greases & Specialty Lubricants", icon: "Zap" },
    { id: "motorcycle", name: "4T / 2T Motorcycle Oils", icon: "Bike" },
    { id: "hydraulic", name: "Hydraulic & Transmission Fluids", icon: "Sliders" }
  ],

  products: [
    {
      id: "orb-5w30-syn",
      name: "Orbit Ultra Synth 5W-30",
      category: "automotive",
      viscosity: "5W-30",
      apiGrade: "API SP / SN Plus / ILSAC GF-6",
      packing: "1L, 4L, 5L, 208L Barrel",
      featured: true,
      badge: "Fully Synthetic",
      imageColor: "#005AAB",
      description: "Ultra-premium fully synthetic engine oil engineered for modern turbocharged gasoline and hybrid passenger vehicles. Provides instantaneous cold-start lubrication and extreme high-temperature oxidation resistance.",
      specs: {
        "Base Type": "100% Synthetic Group III+",
        "Viscosity Index": "172",
        "Pour Point": "-42°C",
        "Flash Point": "228°C",
        "Recommended Drain": "12,000 km / 12 Months"
      }
    },
    {
      id: "orb-15w40-heavy",
      name: "Orbit Titan HD 15W-40",
      category: "heavy-duty",
      viscosity: "15W-40",
      apiGrade: "API CK-4 / CJ-4 / CI-4 Plus",
      packing: "5L, 20L, 208L Barrel",
      featured: true,
      badge: "Heavy Duty Commercial",
      imageColor: "#F7941D",
      description: "Heavy-duty diesel engine oil specially formulated for long-haul trucks, buses, construction equipment, and agricultural machinery operating under severe load and heat conditions.",
      specs: {
        "Base Type": "Premium Mineral Group II",
        "Viscosity Index": "140",
        "TBN (Base Number)": "10.5 mg KOH/g",
        "Pour Point": "-33°C",
        "Recommended Drain": "25,000 km (Highways)"
      }
    },
    {
      id: "orb-iso-68-ind",
      name: "Orbit Hydro-Tech ISO VG 68",
      category: "industrial",
      viscosity: "ISO VG 68",
      apiGrade: "DIN 51524 Part 2 (HLP) / ISO 11158",
      packing: "20L, 208L Barrel",
      featured: true,
      badge: "Industrial Grade",
      imageColor: "#0A2540",
      description: "Anti-wear industrial hydraulic fluid designed for high-pressure hydraulic systems in manufacturing plants, injection molding machines, presses, and heavy earthmoving machinery.",
      specs: {
        "Base Type": "High Viscosity Index Mineral",
        "ISO Grade": "68",
        "Demulsibility": "15 min (ASTM D1401)",
        "Pour Point": "-24°C",
        "Flash Point": "240°C"
      }
    },
    {
      id: "orb-ep2-grease",
      name: "Orbit Lithium Complex EP-2 Grease",
      category: "grease",
      viscosity: "NLGI 2",
      apiGrade: "DIN 51825: KP2K-30",
      packing: "500g, 1kg, 18kg Bucket, 180kg Drum",
      featured: false,
      badge: "High Temp EP",
      imageColor: "#D97706",
      description: "High-performance lithium complex grease enriched with extreme pressure (EP) additives for heavy wheel bearings, chassis points, industrial conveyors, and high-impact machinery.",
      specs: {
        "Thickener": "Lithium Complex",
        "Dropping Point": "280°C+",
        "Four Ball Weld Load": "315 kg",
        "Operating Temp": "-30°C to +160°C"
      }
    },
    {
      id: "orb-10w40-4t",
      name: "Orbit MotoRacer 4T 10W-40",
      category: "motorcycle",
      viscosity: "10W-40",
      apiGrade: "API SN / JASO MA2",
      packing: "1L Bottle",
      featured: true,
      badge: "Synthetic Blend",
      imageColor: "#E11D48",
      description: "Advanced 4-stroke motorcycle oil formulated for wet-clutch performance, crisp gear shifting, and maximum thermal protection during high-RPM city stop-and-go riding.",
      specs: {
        "Clutch Approval": "JASO MA2 Certified",
        "Base Type": "Synthetic Technology",
        "Pour Point": "-36°C",
        "Recommended Drain": "3,000 km"
      }
    },
    {
      id: "orb-atf-v",
      name: "Orbit TransGlide ATF VI",
      category: "hydraulic",
      viscosity: "Low Viscosity ATF",
      apiGrade: "Dexron VI / Mercon LV",
      packing: "1L, 4L, 20L",
      featured: false,
      badge: "Automatic Trans",
      imageColor: "#7C3AED",
      description: "Premium full synthetic automatic transmission fluid offering smooth shifting performance, anti-shudder stability, and extended fluid service life for modern 6-speed+ automatic gearboxes.",
      specs: {
        "Base Type": "100% Synthetic",
        "Viscosity @ 100°C": "6.0 cSt",
        "Flash Point": "215°C"
      }
    }
  ],

  whyUs: [
    {
      id: "w1",
      icon: "ShieldCheck",
      title: "Certified International Standards",
      desc: "Blended in compliance with API (American Petroleum Institute), SAE, and ISO 9001:2015 quality management benchmarks."
    },
    {
      id: "w2",
      icon: "Cpu",
      title: "Virgin Base Oil Chemistry",
      desc: "We exclusively use 100% pure virgin base stocks imported from Tier-1 refineries with zero recycled contaminants."
    },
    {
      id: "w3",
      icon: "Flame",
      title: "High Thermal & Oxidation Stability",
      desc: "Designed to resist viscosity breakdown under tropical temperatures and prolonged high-torque engine operations."
    },
    {
      id: "w4",
      icon: "Truck",
      title: "Nationwide Distribution",
      desc: "Dedicated logistics infrastructure ensuring timely deliveries to dealers, service centers, and industrial hubs across Bangladesh."
    },
    {
      id: "w5",
      icon: "Wrench",
      title: "B2B Technical Support",
      desc: "Our team of tribology engineers provides free oil analysis, lube surveys, and custom lubrication recommendations."
    }
  ],

  standards: [
    { code: "API SP/CK-4", name: "American Petroleum Institute", status: "Certified" },
    { code: "SAE J300", name: "Society of Automotive Engineers", status: "Compliant" },
    { code: "ISO 9001:2015", name: "Quality Management System", status: "Certified" },
    { code: "JASO MA2", name: "Japanese Automotive Standards Org", status: "Approved" },
    { code: "ACEA E9/A3/B4", name: "European Automobile Manufacturers", status: "Verified" }
  ],

  contactInfo: {
    address: "Orbit Lubricant Industries Ltd., Industrial Zone, Tejgaon, Dhaka-1208, Bangladesh",
    phone: "+880 1711-000000 / +880 2-9888888",
    email: "info@orbitlubricants.com",
    salesEmail: "sales@orbitlubricants.com",
    hours: "Saturday - Thursday: 9:00 AM - 6:00 PM (Friday Closed)",
    facebook: "https://facebook.com",
    linkedin: "https://linkedin.com"
  },

  inquiries: [
    {
      id: "inq-101",
      date: "2026-08-01 14:30",
      name: "Tariqul Islam",
      email: "tariqul@dhakatransport.com",
      phone: "+880 1819-123456",
      type: "Becoming a Distributor",
      message: "We operate a commercial transport dealership in Chittagong. We want to discuss regional distribution rights for Orbit Titan HD 15W-40.",
      status: "New"
    },
    {
      id: "inq-102",
      date: "2026-07-28 11:15",
      name: "Engr. Mahmudul Hasan",
      email: "mahmud@bengaltextiles.com",
      phone: "+880 1712-987654",
      type: "Industrial Lubricants",
      message: "We need bulk quotation for 10 barrels of Orbit Hydro-Tech ISO VG 68 hydraulic oil for our spinning mill machinery.",
      status: "Contacted"
    }
  ],

  settings: {
    siteTitle: "Orbit Lubricant Industries",
    tagline: "Power in Every Drop",
    bannerText: "📢 Now Expanding Distribution Network across Chittagong, Sylhet, and Bogra! Contact us today.",
    showBanner: true,
    maintenanceMode: false
  }
};
