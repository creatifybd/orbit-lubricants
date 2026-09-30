const product = (id, name, category, viscosity, standard, packing, image, badge, description, featured = false) => ({
  id, name, category, viscosity, apiGrade: standard, packing, image, badge, description, featured,
  imageColor: category === 'motorcycle' ? '#f7931e' : category === 'heavy-duty' ? '#b68818' : '#1167b1',
  specs: {
    'Product line': name.replace('Orbit ', ''),
    'Viscosity / fluid grade': viscosity,
    'Label-stated classification': standard,
    'Pack size': packing,
    'Selection guidance': 'Follow the vehicle or equipment manufacturer recommendation',
  },
});

const xpower = (grade) => product(
  `xpower-${grade.toLowerCase().replace('-', '')}-1l`, `Orbit XPower ${grade}`, 'motorcycle', grade,
  'API SL / JASO MA2', '1 litre', `/products/xpower-${grade.toLowerCase().replace('-', '')}-1l.webp`,
  'Mineral 4T Engine Oil',
  `Mineral four-stroke motorcycle engine oil labelled API SL and JASO MA2, available in SAE ${grade}. Select the viscosity specified by the motorcycle manufacturer.`,
  grade === '10W-30' || grade === '20W-50',
);

export const initialData = {
  hero: {
    eyebrow: 'Automotive & heavy-duty lubricants',
    title: 'Engineered protection for every journey.',
    subtitle: 'Explore Orbit lubricants for motorcycles, passenger vehicles, CNG engines, heavy-duty diesel fleets and automatic transmissions.',
    ctaPrimary: 'Explore Products', ctaSecondary: 'Contact Sales',
    stat1: { number: '14', label: 'Current products' },
    stat2: { number: '6', label: 'Application groups' },
    stat3: { number: '1L–5L', label: 'Pack sizes' },
    slides: [
      { image: '/images/custom/home-hero-automotive.webp', productId: 'supreme-20w50-4l', eyebrow: 'Passenger vehicle lubricants', title: 'Protection designed for the road ahead.', description: 'Explore Orbit passenger-vehicle oils by viscosity grade and label-stated performance classification.' },
      { image: '/images/custom/home-hero-heavy-duty.webp', productId: 'elite-hde-15w40-5l', eyebrow: 'Commercial & heavy-duty', title: 'A focused range for demanding operations.', description: 'Heavy-duty and monograde diesel oils for compatible trucks, fleets and equipment.' },
      { image: '/images/custom/home-hero-manufacturing.webp', productId: 'xpower-10w30-1l', eyebrow: 'Motorcycle & transmission fluids', title: 'The right product starts with the right specification.', description: 'Browse motorcycle oils, CNG engine oil and automatic transmission fluid in one clear catalog.' },
    ],
  },
  about: {
    heroTitle: 'Lubrication solutions built around real applications',
    heroSubtitle: 'Orbit Lubricant Industries supplies automotive and heavy-duty lubricants for the operating needs of Bangladesh.',
    story: 'Our current portfolio covers four-stroke motorcycle oils, passenger-car motor oil, CNG engine oil, heavy-duty diesel engine oils and automatic transmission fluid. Product selection should always follow the vehicle or equipment manufacturer’s manual.',
    mission: 'To supply clearly specified, dependable lubricant choices for drivers, workshops, fleets and distributors.',
    vision: 'To earn long-term confidence through consistent products, transparent specifications and responsive service.',
    qualityCommitment: 'The product catalog publishes only the viscosity grades and performance classifications stated on Orbit product labels. No unstated OEM approval, drain interval or laboratory value is claimed.',
    ourCommitment: 'We support distributors, workshops, transport operators and end users with straightforward product information and professional enquiry handling.',
    values: [
      { title: 'Clarity', desc: 'Product information that is easy to verify and understand.' },
      { title: 'Consistency', desc: 'A focused portfolio for everyday and commercial applications.' },
      { title: 'Service', desc: 'Responsive support for product and distribution enquiries.' },
    ],
  },
  categories: [
    { id: 'motorcycle', name: 'Motorcycle Oils', icon: 'Bike' },
    { id: 'automotive', name: 'Passenger Car Oils', icon: 'Car' },
    { id: 'cng', name: 'CNG Engine Oils', icon: 'Zap' },
    { id: 'heavy-duty', name: 'Heavy-Duty Diesel Oils', icon: 'Truck' },
    { id: 'transmission', name: 'Transmission Fluids', icon: 'Sliders' },
    { id: 'monograde', name: 'Monograde Diesel Oils', icon: 'Factory' },
  ],
  productRangeList: ['Motorcycle engine oil', 'Passenger-car motor oil', 'CNG engine oil', 'Heavy-duty diesel engine oil', 'Monograde diesel engine oil', 'Automatic transmission fluid'],
  whyUs: [
    { id: 'w1', icon: 'ShieldCheck', title: 'Application-led range', desc: 'Products organized by vehicle, equipment and transmission application.' },
    { id: 'w2', icon: 'FileCheck', title: 'Label-verified specifications', desc: 'Viscosity and performance classifications are taken directly from product labels.' },
    { id: 'w3', icon: 'Layers', title: 'Practical pack sizes', desc: 'One-to-five-litre packs for riders, drivers, workshops and fleet operators.' },
    { id: 'w4', icon: 'Users', title: 'Sales support', desc: 'A direct enquiry route for product selection, distribution and bulk orders.' },
  ],
  products: [
    product('nova-hd40-1l', 'Orbit Nova HD40', 'monograde', 'SAE 40', 'Not stated on product label', '1 litre', '/products/nova-hd40-1l.webp', 'Heavy-Duty Diesel', 'Monograde heavy-duty diesel engine oil. Use only where the equipment manufacturer recommends SAE 40 oil.'),
    product('nova-hd50-1l', 'Orbit Nova HD50', 'monograde', 'SAE 50', 'Not stated on product label', '1 litre', '/products/nova-hd50-1l.webp', 'Heavy-Duty Diesel', 'Monograde heavy-duty diesel engine oil. Use only where the equipment manufacturer recommends SAE 50 oil.'),
    product('revx-atf-dex-iii-1l', 'Orbit RevX ATF Dex III', 'transmission', 'ATF', 'Dex III (label statement)', '1 litre', '/products/revx-atf-dex-iii-1l.webp', 'Automatic Transmission Fluid', 'Automatic transmission fluid identified on the label as Dex III. Confirm the required fluid specification in the vehicle manual.', true),
    xpower('10W-30'), xpower('10W-40'), xpower('20W-40'), xpower('20W-50'),
    product('boostx-cng-20w50-2l', 'Orbit BoostX CNG 20W-50', 'cng', '20W-50', 'CNG vehicle application', '2 litres', '/products/boostx-cng-20w50-2l.webp', 'CNG Premium Engine Oil', 'Premium engine oil presented for CNG vehicles in SAE 20W-50. Confirm grade compatibility with the vehicle manufacturer.', true),
    product('nova-hd50-3l', 'Orbit Nova HD50', 'monograde', 'SAE 50', 'Not stated on product label', '3 litres', '/products/nova-hd50-3l.webp', 'Heavy-Duty Diesel', 'Monograde SAE 50 heavy-duty diesel engine oil for engines and equipment specifying this viscosity grade.'),
    product('supreme-20w50-4l', 'Orbit Supreme 20W-50', 'automotive', '20W-50', 'API SL', '4 litres', '/products/supreme-20w50-4l.webp', 'Premium Engine Oil', 'Passenger-vehicle engine oil labelled SAE 20W-50 and API SL. Check the owner’s manual before selecting this grade.', true),
    product('elite-hde-15w40-5l', 'Orbit Elite HDE 15W-40', 'heavy-duty', '15W-40', 'API CI-4', '5 litres', '/products/elite-hde-15w40-5l.webp', 'Heavy-Duty Engine Oil', 'Heavy-duty diesel engine oil labelled SAE 15W-40 and API CI-4 for compatible commercial applications.', true),
    product('nova-hd40-5l', 'Orbit Nova HD40', 'monograde', 'SAE 40', 'Not stated on product label', '5 litres', '/products/nova-hd40-5l.webp', 'Heavy-Duty Diesel', 'Monograde SAE 40 heavy-duty diesel engine oil for applications that specify this grade.'),
    product('nova-hd50-5l', 'Orbit Nova HD50', 'monograde', 'SAE 50', 'Not stated on product label', '5 litres', '/products/nova-hd50-5l.webp', 'Heavy-Duty Diesel', 'Monograde SAE 50 heavy-duty diesel engine oil for applications that specify this grade.'),
    product('optima-hde-20w50-5l', 'Orbit Optima HDE 20W-50', 'heavy-duty', '20W-50', 'API CF-4', '5 litres', '/products/optima-hde-20w50-5l.webp', 'Heavy-Duty Engine Oil', 'Heavy-duty diesel engine oil labelled SAE 20W-50 and API CF-4 for compatible commercial applications.', true),
  ],
  standards: [
    { code: 'API SL', name: 'Stated on XPower and Supreme product labels', status: 'Label stated' },
    { code: 'JASO MA2', name: 'Stated on XPower motorcycle-oil labels', status: 'Label stated' },
    { code: 'API CI-4', name: 'Stated on the Elite HDE product label', status: 'Label stated' },
    { code: 'API CF-4', name: 'Stated on the Optima HDE product label', status: 'Label stated' },
  ],
  contactInfo: {
    address: 'AHN Tower, 9th Floor, 13 Biponon Commercial Area, Bir Uttam C.R. Dutta Road, Bangla Motor, Dhaka-1215, Bangladesh',
    phone: '01709643307', email: 'info@orbit-lubricants.com', salesEmail: 'info@orbit-lubricants.com', hours: 'Saturday – Thursday: 9:00 AM – 6:00 PM',
  },
  inquiries: [],
  settings: {
    siteTitle: 'Orbit Lubricants | Automotive & Heavy-Duty Lubricants',
    siteDescription: 'Orbit Lubricants product catalog for motorcycles, passenger vehicles, CNG engines, heavy-duty diesel fleets and automatic transmissions.',
    bannerText: 'Product selection support and distributor enquiries: 01709643307',
    showBanner: true, logoUrl: '/logo.png', primaryColor: '#f7931e', secondaryColor: '#1167b1',
    socialLinks: { facebook: '', linkedin: '', youtube: '', instagram: '' },
  },
};
