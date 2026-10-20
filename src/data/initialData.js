const CATEGORY_COLORS = {
  motorcycle: '#f7931e', automotive: '#1167b1', cng: '#2f8a52', 'heavy-duty': '#b68818',
  transmission: '#b91c1c', 'gear-oil': '#475569', 'brake-fluid': '#ea580c',
  monograde: '#1d4ed8', 'bulk-pack': '#2563eb',
};

const product = ({ id, name, category, viscosity, standard = '', packing, image, badge, description, featured = false, benefits = [], extraSpecs = {}, selectionGuidance }) => ({
  id, name, category, viscosity, apiGrade: standard, packing, image, badge, description, featured, benefits,
  imageColor: CATEGORY_COLORS[category] || '#1167b1',
  specs: {
    'Product line': name.replace('Orbit ', ''),
    ...(viscosity ? { 'Viscosity / fluid grade': viscosity } : {}),
    ...(standard ? { 'Label-stated classification': standard } : {}),
    'Pack size': packing,
    ...extraSpecs,
    'Selection guidance': selectionGuidance || 'Follow the vehicle or equipment manufacturer recommendation',
  },
});

const xpower = (grade) => product({
  id: `xpower-${grade.toLowerCase().replace('-', '')}-1l`, name: `Orbit XPower ${grade}`, category: 'motorcycle',
  viscosity: grade, standard: 'API SL / JASO MA2', packing: '1 litre', image: `/products/xpower-${grade.toLowerCase().replace('-', '')}-1l.webp`,
  badge: 'Mineral 4T Engine Oil', description: `Mineral four-stroke motorcycle engine oil labelled API SL and JASO MA2, available in SAE ${grade}.`,
  benefits: ['Wear protection', 'Smooth clutch performance', 'Heat stability'], featured: grade === '10W-30',
});

const supreme = (grade, standard, packing, image, featured = false) => product({
  id: `supreme-${grade.toLowerCase().replace('-', '')}-${packing.replace(/\s/g, '').toLowerCase()}`, name: `Orbit Supreme ${grade}`, category: 'automotive',
  viscosity: grade, standard, packing, image, badge: 'Premium Engine Oil',
  description: `Passenger-vehicle engine oil labelled SAE ${grade} and ${standard}. Confirm the required grade in the vehicle owner’s manual.`,
  benefits: ['Superior protection', 'Enhanced performance', 'Cleaner engine'], featured,
});

const gearx = (grade, packing, image, featured = false) => product({
  id: `gearx-${grade.toLowerCase().replace('-', '')}-${packing.replace(/\s/g, '').toLowerCase()}`, name: `Orbit GearX ${grade}`, category: 'gear-oil',
  viscosity: grade, standard: 'EP Gear Oil – GL-4', packing, image, badge: 'EP Gear Oil',
  description: `GearX EP gear oil labelled SAE ${grade} and GL-4 for compatible gear and transmission applications.`, featured,
});

const bulkPack = (id, name, packing, image, color) => product({
  id, name, category: 'bulk-pack', viscosity: packing, packing, image, badge: 'Bulk Packaging',
  description: `Orbit-branded ${packing.toLowerCase()} shown in ${color}. Contact the sales team for available fill, capacity and supply details.`,
  extraSpecs: { 'Container colour': color }, selectionGuidance: 'Confirm product fill, capacity and order quantity with Orbit sales',
});

export const initialData = {
  catalogVersion: 2,
  hero: {
    eyebrow: 'Automotive & heavy-duty lubricants', title: 'Engineered protection for every journey.',
    subtitle: 'Explore Orbit lubricants for motorcycles, passenger vehicles, CNG engines, heavy-duty diesel fleets and transmission systems.',
    ctaPrimary: 'Explore Products', ctaSecondary: 'Contact Sales',
    stat1: { number: '38', label: 'Product packs' }, stat2: { number: '9', label: 'Application groups' }, stat3: { number: '355ml–Bulk', label: 'Pack formats' },
    slides: [
      { image: '/images/custom/home-hero-automotive.webp', productId: 'supreme-5w40-4litres', eyebrow: 'Passenger vehicle lubricants', title: 'Protection designed for the road ahead.', description: 'Explore Orbit passenger-vehicle oils by viscosity grade and label-stated performance classification.' },
      { image: '/images/custom/home-hero-heavy-duty.webp', productId: 'elite-hde-15w40-5l', eyebrow: 'Commercial & heavy-duty', title: 'A focused range for demanding operations.', description: 'Heavy-duty and monograde diesel oils for compatible trucks, fleets and equipment.' },
      { image: '/images/custom/home-hero-manufacturing.webp', productId: 'revx-atf-dex-iii-4l', eyebrow: 'Transmission & driveline fluids', title: 'The right product starts with the right specification.', description: 'Browse automatic transmission fluid, CVTF and GL-4 gear-oil options in one clear catalog.' },
    ],
  },
  about: {
    heroTitle: 'Lubrication solutions built around real applications',
    heroSubtitle: 'Orbit Lubricant Industries supplies automotive and heavy-duty lubricants for the operating needs of Bangladesh.',
    story: 'Our portfolio covers motorcycle oils, passenger-car motor oils, CNG engine oil, heavy-duty diesel oils, transmission fluids, gear oils, brake fluid and bulk packaging formats. Product selection should always follow the vehicle or equipment manufacturer’s manual.',
    mission: 'To supply clearly specified, dependable lubricant choices for drivers, workshops, fleets and distributors.',
    vision: 'To earn long-term confidence through consistent products, transparent specifications and responsive service.',
    qualityCommitment: 'The product catalog publishes only the viscosity grades and performance classifications stated on Orbit product labels. No unstated OEM approval, drain interval or laboratory value is claimed.',
    ourCommitment: 'We support distributors, workshops, transport operators and end users with straightforward product information and professional enquiry handling.',
    values: [{ title: 'Clarity', desc: 'Product information that is easy to verify and understand.' }, { title: 'Consistency', desc: 'A focused portfolio for everyday and commercial applications.' }, { title: 'Service', desc: 'Responsive support for product and distribution enquiries.' }],
  },
  categories: [
    { id: 'motorcycle', name: 'Motorcycle Oils', icon: 'Bike' }, { id: 'automotive', name: 'Passenger Car Oils', icon: 'Car' },
    { id: 'cng', name: 'CNG Engine Oils', icon: 'Zap' }, { id: 'heavy-duty', name: 'Heavy-Duty Diesel Oils', icon: 'Truck' },
    { id: 'transmission', name: 'Transmission Fluids', icon: 'Sliders' }, { id: 'gear-oil', name: 'Gear Oils', icon: 'Settings' },
    { id: 'brake-fluid', name: 'Brake Fluids', icon: 'Disc' }, { id: 'monograde', name: 'Monograde Motor Oils', icon: 'Factory' },
    { id: 'bulk-pack', name: 'Bulk Packs', icon: 'Package' },
  ],
  productRangeList: ['Motorcycle engine oil', 'Passenger-car motor oil', 'CNG engine oil', 'Heavy-duty diesel engine oil', 'Monograde motor oil', 'Automatic transmission fluid', 'Continuously variable transmission fluid', 'EP gear oil', 'Brake fluid and bulk packs'],
  whyUs: [
    { id: 'w1', icon: 'ShieldCheck', title: 'Application-led range', desc: 'Products organized by vehicle, equipment and transmission application.' },
    { id: 'w2', icon: 'FileCheck', title: 'Label-verified specifications', desc: 'Viscosity and performance classifications are taken directly from product labels.' },
    { id: 'w3', icon: 'Layers', title: 'Practical pack formats', desc: 'Pack formats for riders, drivers, workshops, fleets and distributors.' },
    { id: 'w4', icon: 'Users', title: 'Sales support', desc: 'A direct enquiry route for product selection, distribution and bulk orders.' },
  ],
  products: [
    product({ id: 'nova-hd40-1l', name: 'Orbit Nova HD40', category: 'monograde', viscosity: 'SAE 40', packing: '1 litre', image: '/products/nova-hd40-1l.webp', badge: 'Heavy-Duty Diesel Engine Oil', description: 'Monograde heavy-duty diesel engine oil labelled SAE 40.', benefits: ['Engine cleanliness', 'Wear protection', 'Longer engine life'] }),
    product({ id: 'nova-hd50-1l', name: 'Orbit Nova HD50', category: 'monograde', viscosity: 'SAE 50', packing: '1 litre', image: '/products/nova-hd50-1l.webp', badge: 'Heavy-Duty Diesel Engine Oil', description: 'Monograde heavy-duty diesel engine oil labelled SAE 50.', benefits: ['Engine cleanliness', 'Wear protection', 'Longer engine life'] }),
    product({ id: 'revx-atf-dex-iii-1l', name: 'Orbit RevX ATF Dex III', category: 'transmission', viscosity: 'ATF', standard: 'Dex III (label statement)', packing: '1 litre', image: '/products/revx-atf-dex-iii-1l.webp', badge: 'Automatic Transmission Fluid', description: 'Automatic transmission fluid identified on the label as ATF Dex III.' }),
    xpower('10W-30'), xpower('10W-40'), xpower('20W-40'), xpower('20W-50'),
    product({ id: 'boostx-cng-20w50-2l', name: 'Orbit BoostX CNG 20W-50', category: 'cng', viscosity: '20W-50', standard: 'CNG vehicle application', packing: '2 litres', image: '/products/boostx-cng-20w50-2l.webp', badge: 'CNG Premium Engine Oil', description: 'Premium engine oil labelled SAE 20W-50 for compatible CNG vehicles.', featured: true }),
    product({ id: 'nova-hd50-3l', name: 'Orbit Nova HD50', category: 'monograde', viscosity: 'SAE 50', packing: '3 litres', image: '/products/nova-hd50-3l.webp', badge: 'Heavy-Duty Diesel Engine Oil', description: 'Monograde heavy-duty diesel engine oil labelled SAE 50.', benefits: ['Engine cleanliness', 'Wear protection', 'Longer engine life'] }),
    supreme('20W-50', 'API SL', '4 litres', '/products/supreme-20w50-api-sl-4l.webp'),
    product({ id: 'elite-hde-15w40-5l', name: 'Orbit Elite HDE 15W-40', category: 'heavy-duty', viscosity: '15W-40', standard: 'API CI-4', packing: '5 litres', image: '/products/elite-hde-15w40-5l.webp', badge: 'Heavy-Duty Engine Oil', description: 'Heavy-duty diesel engine oil labelled SAE 15W-40 and API CI-4.', benefits: ['Superior protection', 'Enhanced performance', 'Cleaner engine'] }),
    product({ id: 'nova-hd40-5l', name: 'Orbit Nova HD40', category: 'monograde', viscosity: 'SAE 40', packing: '5 litres', image: '/products/nova-hd40-5l.webp', badge: 'Heavy-Duty Diesel Engine Oil', description: 'Monograde heavy-duty diesel engine oil labelled SAE 40.', benefits: ['Engine cleanliness', 'Wear protection', 'Longer engine life'] }),
    product({ id: 'nova-hd50-5l', name: 'Orbit Nova HD50', category: 'monograde', viscosity: 'SAE 50', packing: '5 litres', image: '/products/nova-hd50-5l.webp', badge: 'Heavy-Duty Diesel Engine Oil', description: 'Monograde heavy-duty diesel engine oil labelled SAE 50.', benefits: ['Engine cleanliness', 'Wear protection', 'Longer engine life'] }),
    product({ id: 'optima-hde-20w50-5l', name: 'Orbit Optima HDE 20W-50', category: 'heavy-duty', viscosity: '20W-50', standard: 'API CF-4', packing: '5 litres', image: '/products/optima-hde-20w50-5l.webp', badge: 'Heavy-Duty Engine Oil', description: 'Heavy-duty diesel engine oil labelled SAE 20W-50 and API CF-4.', benefits: ['Superior protection', 'Enhanced performance', 'Cleaner engine'] }),
    product({ id: 'optima-hde-20w50-1l', name: 'Orbit Optima HDE 20W-50', category: 'heavy-duty', viscosity: '20W-50', standard: 'API CF-4', packing: '1 litre', image: '/products/optima-hde-20w50-1l.webp', badge: 'Heavy-Duty Engine Oil', description: 'Heavy-duty diesel engine oil labelled SAE 20W-50 and API CF-4.', benefits: ['Superior protection', 'Enhanced performance', 'Cleaner engine'], featured: true }),
    product({ id: 'elite-hde-15w40-1l', name: 'Orbit Elite HDE 15W-40', category: 'heavy-duty', viscosity: '15W-40', standard: 'API CI-4', packing: '1 litre', image: '/products/elite-hde-15w40-1l.webp', badge: 'Heavy-Duty Engine Oil', description: 'Heavy-duty diesel engine oil labelled SAE 15W-40 and API CI-4.', benefits: ['Superior protection', 'Enhanced performance', 'Cleaner engine'], featured: true }),
    supreme('20W-50', 'API SL', '1 litre', '/products/supreme-20w50-api-sl-1l.webp'),
    product({ id: 'revx-cvtf-tc-4l', name: 'Orbit RevX CVTF TC', category: 'transmission', viscosity: 'CVTF TC', standard: 'Continuously Variable Transmission Fluid', packing: '4 litres', image: '/products/revx-cvtf-tc-4l.webp', badge: 'CVT Fluid', description: 'Continuously variable transmission fluid presented as the RevX CVTF TC variant.' }),
    product({ id: 'revx-cvtf-fe-4l', name: 'Orbit RevX CVTF FE', category: 'transmission', viscosity: 'CVTF FE', standard: 'Continuously Variable Transmission Fluid', packing: '4 litres', image: '/products/revx-cvtf-fe-4l.webp', badge: 'CVT Fluid', description: 'Continuously variable transmission fluid presented as the RevX CVTF FE variant.' }),
    product({ id: 'brako-dot3-355ml', name: 'Orbit Brako DOT 3', category: 'brake-fluid', viscosity: 'DOT 3', standard: 'DOT 3', packing: '355 ml', image: '/products/brako-dot3-355ml.webp', badge: 'Brake Fluid', description: 'Brako brake fluid labelled DOT 3 in a 355 ml metal can.', benefits: ['High boiling point', 'Corrosion protection', 'Hydraulic brake & clutch use'] }),
    product({ id: 'brako-dot3-500ml', name: 'Orbit Brako DOT 3', category: 'brake-fluid', viscosity: 'DOT 3', standard: 'DOT 3', packing: '500 ml', image: '/products/brako-dot3-500ml.webp', badge: 'Brake Fluid', description: 'Brako brake fluid labelled DOT 3 in a 500 ml metal can.', benefits: ['High boiling point', 'Corrosion protection', 'Hydraulic brake & clutch use'] }),
    gearx('80W-90', '1 litre', '/products/gearx-80w90-gl4-1l.webp'), gearx('85W-140', '1 litre', '/products/gearx-85w140-gl4-1l.webp'),
    gearx('80W-90', '4 litres', '/products/gearx-80w90-gl4-4l.webp', true), gearx('85W-140', '4 litres', '/products/gearx-85w140-gl4-4l.webp'),
    bulkPack('orbit-pail-silver', 'Orbit Lubricants Silver Pail', 'Pail format', '/products/orbit-pail-silver.webp', 'Silver'),
    bulkPack('orbit-pail-gold', 'Orbit Lubricants Gold Pail', 'Pail format', '/products/orbit-pail-gold.webp', 'Gold'),
    bulkPack('orbit-pail-white', 'Orbit Lubricants White Pail', 'Pail format', '/products/orbit-pail-white.webp', 'White'),
    bulkPack('orbit-pail-blue', 'Orbit Lubricants Blue Pail', 'Pail format', '/products/orbit-pail-blue.webp', 'Cobalt blue'),
    bulkPack('orbit-drum-blue', 'Orbit Lubricants Blue Drum', 'Drum format', '/products/orbit-drum-blue.webp', 'Glossy blue'),
    product({ id: 'ride-sae40-600ml', name: 'Orbit RIDE Motor Oil', category: 'monograde', viscosity: 'SAE 40', standard: 'API SF/CD', packing: '600 ml', image: '/products/ride-sae40-api-sfcd-600ml.webp', badge: 'Motor Oil', description: 'RIDE motor oil labelled SAE 40 and API SF/CD in a 600 ml metal can.', benefits: ['Clean engine', 'Premium performance', 'Longer engine life'] }),
    product({ id: 'ride-sae40-1l', name: 'Orbit RIDE Motor Oil', category: 'monograde', viscosity: 'SAE 40', standard: 'API SF/CD', packing: '1 litre', image: '/products/ride-sae40-api-sfcd-1l.webp', badge: 'Motor Oil', description: 'RIDE motor oil labelled SAE 40 and API SF/CD in a 1 litre metal can.', benefits: ['Clean engine', 'Premium performance', 'Longer engine life'] }),
    supreme('0W-20', 'API SQ', '4 litres', '/products/supreme-0w20-api-sq-4l.webp'), supreme('10W-30', 'API SN', '4 litres', '/products/supreme-10w30-api-sn-4l.webp'),
    supreme('10W-40', 'API SN', '4 litres', '/products/supreme-10w40-api-sn-4l.webp'), supreme('5W-30', 'API SQ', '4 litres', '/products/supreme-5w30-api-sq-4l.webp'),
    supreme('5W-40', 'API SQ', '4 litres', '/products/supreme-5w40-api-sq-4l.webp', true),
    product({ id: 'revx-atf-dex-iii-4l', name: 'Orbit RevX ATF Dex III', category: 'transmission', viscosity: 'ATF', standard: 'Dex III (label statement)', packing: '4 litres', image: '/products/revx-atf-dex-iii-4l.webp', badge: 'Automatic Transmission Fluid', description: 'Automatic transmission fluid identified on the label as ATF Dex III.', featured: true }),
  ],
  standards: [
    { code: 'API SQ', name: 'Stated on selected Supreme product labels', status: 'Label stated' }, { code: 'API SN', name: 'Stated on selected Supreme product labels', status: 'Label stated' },
    { code: 'API SL', name: 'Stated on XPower and Supreme product labels', status: 'Label stated' }, { code: 'JASO MA2', name: 'Stated on XPower motorcycle-oil labels', status: 'Label stated' },
    { code: 'API CI-4', name: 'Stated on Elite HDE product labels', status: 'Label stated' }, { code: 'API CF-4', name: 'Stated on Optima HDE product labels', status: 'Label stated' },
    { code: 'GL-4', name: 'Stated on GearX EP gear-oil labels', status: 'Label stated' }, { code: 'DOT 3', name: 'Stated on Brako brake-fluid labels', status: 'Label stated' },
  ],
  contactInfo: { address: 'Kanchpur, Sonargaon, Narayanganj, Bangladesh', phone: '01709643307', email: 'info@orbit-lubricants.com', salesEmail: 'info@orbit-lubricants.com', hours: 'Saturday – Thursday: 9:00 AM – 6:00 PM' },
  inquiries: [],
  settings: {
    siteTitle: 'Orbit Lubricants | Automotive & Heavy-Duty Lubricants',
    siteDescription: 'Orbit Lubricants catalog for motorcycles, passenger vehicles, CNG engines, heavy-duty diesel fleets, transmission systems, gear oils and brake fluids.',
    bannerText: 'Product selection support and distributor enquiries: 01709643307', showBanner: true,
    logoUrl: '/logo.png', primaryColor: '#f7931e', secondaryColor: '#1167b1', socialLinks: { facebook: '', linkedin: '', youtube: '', instagram: '' },
  },
};
