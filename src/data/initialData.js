export const initialData = {
  hero: {
    title: "Power in Every Drop",
    subtitle: "Orbit Lubricant Industries is a performance-driven lubricant company specializing in premium automotive and industrial oils. We combine advanced technology, high-quality raw materials, and strict quality control to deliver lubricants that provide superior engine protection, reliability, and efficiency for modern vehicles and machinery.",
    ctaPrimary: "Explore Product Range",
    ctaSecondary: "Become a Distributor",
    stat1: { number: "50+", label: "Formulated Lubricants" },
    stat2: { number: "100%", label: "ISO & API Certified" },
    stat3: { number: "250+", label: "Distributors & Dealers" }
  },

  about: {
    heroTitle: "Driving Performance Through Advanced Lubrication Technology",
    heroSubtitle: "Orbit Lubricant Industries is a modern lubricant manufacturing and marketing company committed to delivering premium-quality automotive and industrial lubrication solutions for local and international markets.",
    story: "With a strong focus on innovation, quality assurance, and customer satisfaction, we produce high-performance engine oils, gear oils, hydraulic oils, transmission fluids, greases, brake fluids, and specialty lubricants designed to meet the demanding requirements of modern engines and machinery. Our products are formulated using high-quality base oils and advanced additive technologies to ensure superior protection, longer engine life, enhanced fuel efficiency, and reliable performance under extreme operating conditions. At Orbit Lubricant Industries, we believe lubrication is not just about oil — it is about protecting engines, maximizing efficiency, and powering the future of mobility and industry.",
    mission: "To provide world-class lubricant solutions that deliver maximum engine protection, operational efficiency, and long-term value to customers through continuous innovation and uncompromising quality standards.",
    vision: "To become one of the most trusted and globally recognized lubricant brands by delivering technologically advanced, environmentally responsible, and performance-driven products.",
    qualityCommitment: "Quality is the foundation of our business. Every product is manufactured through strict quality control procedures and tested to ensure compliance with international performance standards. Our technical team continuously works on research and product development to deliver lubricants that perform efficiently in Bangladesh’s climate and road conditions as well as international operating environments.",
    ourCommitment: "Orbit Lubricant Industries is committed to building long-term relationships with distributors, workshops, industries, transport operators, and end users by delivering reliable products, technical support, and professional service. We are continuously expanding our distribution network and strengthening our presence in both domestic and export markets."
  },

  categories: [
    { id: "motorcycle", name: "4T / 2T Motorcycle Oils", icon: "Bike" },
    { id: "cng", name: "CNG Special Engine Oils", icon: "Zap" },
    { id: "automotive", name: "Passenger Car Motor Oils", icon: "Car" },
    { id: "heavy-duty", name: "Heavy Duty Commercial Engine Oils", icon: "Truck" },
    { id: "industrial", name: "Industrial & Gear Oils", icon: "Factory" },
    { id: "hydraulic", name: "Hydraulic & Transmission Fluids", icon: "Sliders" }
  ],

  productRangeList: [
    "Passenger Car Motor Oil",
    "Motorcycle Engine Oil",
    "Diesel Engine Oil",
    "Hydraulic Oil",
    "Gear Oil",
    "Automatic Transmission Fluid (ATF)",
    "Brake Fluid (DOT 3 / DOT 4)",
    "Greases",
    "Coolants",
    "Industrial Lubricants",
    "Specialty Performance Fluids"
  ],

  whyUs: [
    { id: "w1", icon: "ShieldCheck", title: "Premium Quality Lubricants", desc: "Blended using high-quality virgin base oils and Tier-1 additive chemistry." },
    { id: "w2", icon: "Zap", title: "Advanced Additive Technology", desc: "Formulated for extreme heat, heavy gridlock traffic, and high-load demands." },
    { id: "w3", icon: "Award", title: "International Standard Formulations", desc: "Strictly compliant with API, JASO, and ACEA international performance specifications." },
    { id: "w4", icon: "Flame", title: "Reliable Engine Protection", desc: "Ensures longer engine life, anti-wear protection, and enhanced fuel economy." },
    { id: "w5", icon: "CheckCircle2", title: "Consistent Product Quality", desc: "Manufactured under rigorous quality control procedures and batch testing." },
    { id: "w6", icon: "Layers", title: "Modern Packaging & Branding", desc: "Leak-proof, tamper-evident, world-class ergonomic bottle designs." },
    { id: "w7", icon: "Users", title: "Customer-Centric Service", desc: "Dedicated technical advisory, oil condition monitoring, and sales support." },
    { id: "w8", icon: "DollarSign", title: "Competitive Pricing", desc: "Maximum margin structures and commercial value for distributors and dealers." },
    { id: "w9", icon: "Factory", title: "Industrial & Automotive Solutions", desc: "Comprehensive product coverage for fleet, plant machinery, and consumer rides." },
    { id: "w10", icon: "Sparkles", title: "Commitment to Innovation", desc: "Continuous R&D focused on next-gen synthetic lubricants and lower emissions." }
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
      image: "/products/cng-20w50.jpg",
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
      image: "/products/fusion-15w40.jpg",
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
      image: "/products/fusion-20w50.jpg",
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
      image: "/products/fusion-motor.jpg",
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
      image: "/products/xpower-10w30-black.jpg",
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
      image: "/products/xpower-10w30-green.jpg",
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
      image: "/products/xpower-10w40-red.jpg",
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
      image: "/products/xpower-20w40-blue.jpg",
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

  settings: {
    siteTitle: "Orbit Lubricants | Power in Every Drop",
    bannerText: "⚡ Official Announcement: Orbit Lubricant Industries — Advanced Automotive & Industrial Solutions Nationwide!",
    showBanner: true,
    logoUrl: "/logo.png"
  }
};
