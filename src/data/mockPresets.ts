import { HomePlan, PartyPlan, JewelryPlan } from '../types';

export const SAMPLE_OUTFIT_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
  <defs>
    <linearGradient id="lehengaBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%23064e3b" />
      <stop offset="50%" stop-color="%23047857" />
      <stop offset="100%" stop-color="%23022c22" />
    </linearGradient>
    <pattern id="goldEmbroidery" width="30" height="30" patternUnits="userSpaceOnUse">
      <circle cx="15" cy="15" r="3" fill="%23fbbf24" opacity="0.8"/>
      <path d="M5,15 Q15,5 25,15 Q15,25 5,15" stroke="%23f59e0b" fill="none" stroke-width="1.2"/>
    </pattern>
  </defs>
  <rect width="400" height="500" fill="url(%23lehengaBg)" rx="16"/>
  <!-- Blouse & Sweetheart Neckline -->
  <path d="M120,40 Q150,110 200,105 Q250,110 280,40 L310,130 Q200,170 90,130 Z" fill="%23065f46" stroke="%23fbbf24" stroke-width="2"/>
  <!-- Neckline trim -->
  <path d="M140,55 Q170,95 200,90 Q230,95 260,55" stroke="%23f59e0b" stroke-width="4" fill="none" stroke-dasharray="4,4"/>
  <!-- Dupatta drape -->
  <path d="M100,60 Q130,220 280,380 L320,360 Q190,180 140,50 Z" fill="%2310b981" opacity="0.6"/>
  <!-- Lehenga Skirt with Gold Zari -->
  <path d="M90,160 L310,160 L360,470 L40,470 Z" fill="url(%23goldEmbroidery)"/>
  <rect x="40" y="440" width="320" height="30" fill="%23d97706" opacity="0.9" rx="4"/>
  <text x="200" y="460" font-family="sans-serif" font-size="12" fill="%23fff" text-anchor="middle" font-weight="bold">HEAVY GOLD ZARI BORDER • SWEETHEART NECK</text>
  <text x="200" y="40" font-family="sans-serif" font-size="14" fill="%23a7f3d0" text-anchor="middle" font-weight="600">Sample Outfit: Emerald Green Lehenga</text>
</svg>`;

export const SAMPLE_HOME_PLAN: HomePlan = {
  summary: "A curated Scandi-modern living and dining interior plan distributed across IKEA and Amazon. High-contact comfort seating is prioritized with an ergonomic sofa, while smart ambient lighting and flat-pack minimalist storage keep total expenses 8% under your budget.",
  totalBudget: 48000,
  totalEstimatedSpend: 44200,
  savingsCushion: 3800,
  currency: 'INR',
  style: 'Modern Minimalist & Scandinavian',
  categoryBreakdown: [
    {
      category: 'Living Room Seating & Tables',
      allocatedAmount: 22000,
      estimatedSpend: 20499,
      percentage: 46
    },
    {
      category: 'Dining Setup',
      allocatedAmount: 13000,
      estimatedSpend: 11999,
      percentage: 27
    },
    {
      category: 'Lighting & Ceiling Fixtures',
      allocatedAmount: 7000,
      estimatedSpend: 6200,
      percentage: 14
    },
    {
      category: 'Accents, Rugs & Greenery',
      allocatedAmount: 6000,
      estimatedSpend: 5502,
      percentage: 13
    }
  ],
  recommendations: [
    {
      id: 'h-1',
      title: 'IKEA KIVIK Compact 2-Seater Sofa (Tibbleby Beige/Grey)',
      room: 'Living Room',
      category: 'Seating',
      platform: 'IKEA',
      quantity: 1,
      unitPrice: 16990,
      totalPrice: 16990,
      specs: '140x95x83 cm, High-resilience memory foam, washable cover',
      reasonForSelection: 'Delivers Scandinavian sleekness with superior lumbar support, anchors the living room without cluttering walkways.',
      tradeoffTier: 'splurge_worthy',
      alternativeOption: {
        title: 'Amazon Solimo 3-Seater Fabric Sofa',
        platform: 'Amazon',
        price: 13499,
        note: 'Budget alternative saving ₹3,491 with classic grey woven fabric.'
      },
      shoppingSearchUrl: 'https://www.ikea.com/in/en/search/?q=KIVIK+sofa'
    },
    {
      id: 'h-2',
      title: 'IKEA GLADOM Metal Removable Tray Coffee Table',
      room: 'Living Room',
      category: 'Tables',
      platform: 'IKEA',
      quantity: 2,
      unitPrice: 1750,
      totalPrice: 3500,
      specs: 'Diameter 45 cm, Height 53 cm, Powder-coated steel, Sage Green & White',
      reasonForSelection: 'Removable tray top doubles as a serving platter; grouping two creates an asymmetrical modern cluster.',
      tradeoffTier: 'budget_saver',
      alternativeOption: {
        title: 'Flipkart Perfect Homes Round Nested Metal Table',
        platform: 'Flipkart',
        price: 2899,
        note: 'Wooden top set of 2 nested tables'
      },
      shoppingSearchUrl: 'https://www.ikea.com/in/en/search/?q=GLADOM+tray+table'
    },
    {
      id: 'h-3',
      title: 'Amazon Basics 4-Seater Solid Sheesham Wood Dining Table',
      room: 'Dining Area',
      category: 'Dining',
      platform: 'Amazon',
      quantity: 1,
      unitPrice: 11999,
      totalPrice: 11999,
      specs: '115x75 cm, Honey finish solid wood with 4 cushioned chairs',
      reasonForSelection: 'High durability dining set with warm natural wood tones that balance the clean Scandi aesthetic at an unbeatable price point.',
      tradeoffTier: 'balanced_pick',
      alternativeOption: {
        title: 'IKEA MELLTORP / ADDE Dining Combo',
        platform: 'IKEA',
        price: 9490,
        note: 'Ultra-minimalist white melamine table with metal stacking chairs.'
      },
      shoppingSearchUrl: 'https://www.amazon.in/s?k=Amazon+Basics+Sheesham+Dining+Table+4+seater'
    },
    {
      id: 'h-4',
      title: 'Philips Hue / Wiz Warm Ambience Smart Pendant Light Kit',
      room: 'Dining & Living',
      category: 'Lighting',
      platform: 'Amazon',
      quantity: 2,
      unitPrice: 1850,
      totalPrice: 3700,
      specs: 'Matte black metal dome with smart Wi-Fi warm-to-cool LED bulb',
      reasonForSelection: 'Overhead focused illumination over dining and sofa corner with app/dimming control for mood lighting.',
      tradeoffTier: 'balanced_pick',
      alternativeOption: {
        title: 'Flipkart Smart Light Geometric Cage Pendant',
        platform: 'Flipkart',
        price: 1199,
        note: 'Saves ₹1,300 with standard E27 bulb sockets.'
      },
      shoppingSearchUrl: 'https://www.amazon.in/s?k=Smart+Pendant+Light+Matte+Black'
    },
    {
      id: 'h-5',
      title: 'IKEA TIPHEDE Recycled Cotton Flatwoven Rug (120x180 cm)',
      room: 'Living Room',
      category: 'Decor & Rugs',
      platform: 'IKEA',
      quantity: 1,
      unitPrice: 1290,
      totalPrice: 1290,
      specs: '120x180 cm, Natural unbleached cotton, reversible & machine washable',
      reasonForSelection: 'Grounds the living furniture with subtle earthy texture, extremely easy to vacuum and wash.',
      tradeoffTier: 'budget_saver',
      alternativeOption: {
        title: 'Amazon Geometric Jute Chindi Rug',
        platform: 'Amazon',
        price: 1450,
        note: 'Bohemian braided jute texture.'
      },
      shoppingSearchUrl: 'https://www.ikea.com/in/en/search/?q=TIPHEDE+rug'
    },
    {
      id: 'h-6',
      title: 'Atomberg Renesa 1200mm BLDC Energy-Saving Ceiling Fan',
      room: 'Living Room',
      category: 'Fixtures',
      platform: 'Amazon',
      quantity: 1,
      unitPrice: 3699,
      totalPrice: 3699,
      specs: 'BLDC 28W energy motor, remote control, matte brown finish',
      reasonForSelection: 'Saves up to 65% electricity on monthly bills while maintaining silent, elegant modern airflow.',
      tradeoffTier: 'balanced_pick',
      alternativeOption: {
        title: 'Crompton SilentPro BLDC Fan',
        platform: 'Flipkart',
        price: 3899,
        note: 'Aerodynamic blade design.'
      },
      shoppingSearchUrl: 'https://www.amazon.in/s?k=Atomberg+Renesa+BLDC+Ceiling+Fan'
    },
    {
      id: 'h-7',
      title: 'Pepperfry Wooden Floating Wall Shelves (Set of 3)',
      room: 'Living Room',
      category: 'Storage & Decor',
      platform: 'Pepperfry',
      quantity: 1,
      unitPrice: 1822,
      totalPrice: 1822,
      specs: 'Walnut engineered wood with concealed heavy-duty wall brackets',
      reasonForSelection: 'Utilizes vertical wall space for indoor plants and photo frames without taking up precious floor room.',
      tradeoffTier: 'budget_saver',
      alternativeOption: {
        title: 'Amazon Floating Shelf U-Shape',
        platform: 'Amazon',
        price: 999,
        note: 'Lighter weight MDF alternative.'
      },
      shoppingSearchUrl: 'https://www.pepperfry.com/site_product/search?q=floating+wall+shelves'
    },
    {
      id: 'h-8',
      title: 'IKEA FEJKA Artificial Potted Bamboo & Ceramic Planter',
      room: 'Balcony / Living',
      category: 'Decor & Rugs',
      platform: 'IKEA',
      quantity: 1,
      unitPrice: 1690,
      totalPrice: 1690,
      specs: 'Height 90 cm, lifelike botanic replication, matte white ceramic pot',
      reasonForSelection: 'Brings vibrant greenery indoors with zero watering or shedding maintenance.',
      tradeoffTier: 'budget_saver',
      alternativeOption: {
        title: 'Flipkart Faux Monstera Plant 3ft',
        platform: 'Flipkart',
        price: 1299,
        note: 'Broad leaf tropical look.'
      },
      shoppingSearchUrl: 'https://www.ikea.com/in/en/search/?q=FEJKA+artificial+plant'
    }
  ],
  proTips: [
    'Apply the 60-30-10 color rule: 60% neutral walls/sofa, 30% natural wood furniture, and 10% bold accent cushions or light fixtures.',
    'IKEA flat-pack items can be assembled in under 45 minutes using provided hex tools; save ₹1,500 on carpenter installation charges.',
    'Use warm white (2700K - 3000K) bulbs instead of cool daylight to create an inviting, cozy atmosphere that looks premium.'
  ]
};

export const SAMPLE_PARTY_PLAN: PartyPlan = {
  summary: "A vibrant 25-guest rooftop birthday bash optimized with Swiggy Gourmet bulk catering, an Amazon ambient neon balloon arch kit, and high-bass party sound. We've preserved a ₹2,200 emergency buffer for extra ice, mocktail syrups, and disposable refills.",
  totalBudget: 28000,
  totalEstimatedSpend: 25800,
  savingsCushion: 2200,
  currency: 'INR',
  guestCount: 25,
  costPerGuest: 1032,
  allocationBreakdown: {
    catering: {
      allocatedAmount: 13500,
      percentage: 52,
      platform: 'Swiggy / Zomato'
    },
    decoration: {
      allocatedAmount: 5500,
      percentage: 21,
      platform: 'Amazon / Flipkart'
    },
    entertainment: {
      allocatedAmount: 4800,
      percentage: 19,
      platform: 'Amazon / Instamart'
    },
    venueOrStay: {
      allocatedAmount: 2000,
      percentage: 8,
      platform: 'OYO Rooms / Rooftop Fee'
    }
  },
  recommendations: [
    {
      id: 'p-1',
      category: 'Catering (Appetizers & Starters)',
      title: 'Swiggy Gourmet Platter Combo: Tandoori Paneer Tikka & Crispy Chicken Sliders (25 pax)',
      platform: 'Swiggy',
      quantity: 1,
      unitPrice: 5800,
      totalPrice: 5800,
      details: 'Assorted finger foods: 50 skewers + 25 mini sliders with mint chutney and spicy mayo',
      reasonForSelection: 'Finger foods eliminate plate clutter and keep guests mingling easily throughout the evening.',
      alternativeOption: {
        title: 'Zomato Bulk Asian Dimsum & Spring Roll Box',
        platform: 'Zomato',
        price: 5200,
        note: 'Saves ₹600 with steamed dimsum and crispy rolls.'
      },
      shoppingSearchUrl: 'https://www.swiggy.com/search?query=party+starter+platter'
    },
    {
      id: 'p-2',
      category: 'Catering (Main Course & Biryani)',
      title: 'Behrouz Biryani / Cloud Kitchen Royal Dum Biryani Handi Combo (Veg & Non-Veg)',
      platform: 'Zomato',
      quantity: 2,
      unitPrice: 2850,
      totalPrice: 5700,
      details: 'Includes 2 big handis (feeds 25-28 people), raita, mirchi ka salan, and gulab jamuns',
      reasonForSelection: 'Biryani handis stay piping hot, require minimal serving gear, and are universally loved.',
      alternativeOption: {
        title: 'Swiggy Pizza Party Pack (8 Large Pizzas + Garlic Breads)',
        platform: 'Swiggy',
        price: 4900,
        note: 'Casual pizza slice alternative.'
      },
      shoppingSearchUrl: 'https://www.zomato.com/search?q=bulk+biryani+party+pack'
    },
    {
      id: 'p-3',
      category: 'Catering (Custom Cake)',
      title: 'Swiggy Minis / Local Bakery Belgian Dark Truffle Custom Drip Cake (1.5 kg)',
      platform: 'Swiggy',
      quantity: 1,
      unitPrice: 1650,
      totalPrice: 1650,
      details: '1.5 kg custom birthday cake with gold dust & acrylic cake topper',
      reasonForSelection: 'Rich chocolate truffle holds shape outdoors and caters up to 25 generous cake slices.',
      alternativeOption: {
        title: 'Bakingo Red Velvet Heart Cake (1.5kg)',
        platform: 'Zomato',
        price: 1499,
        note: 'Delicate cream cheese flavor.'
      },
      shoppingSearchUrl: 'https://www.swiggy.com/search?query=belgian+chocolate+truffle+cake'
    },
    {
      id: 'p-4',
      category: 'Decoration (Neon & Backdrop)',
      title: 'Amazon "Happy Birthday" LED Neon Flex Sign (Warm White / Pink Glow)',
      platform: 'Amazon',
      quantity: 1,
      unitPrice: 1499,
      totalPrice: 1499,
      specs: 'USB powered, 42x20 cm, acrylic backing with dimmer switch',
      reasonForSelection: 'Serves as the central Instagram photobooth focal point; can be reused for future birthdays.',
      alternativeOption: {
        title: 'Flipkart Metallic Foil Curtain & Balloon Backdrop Banner Kit',
        platform: 'Flipkart',
        price: 499,
        note: 'Budget disposable option saving ₹1,000.'
      },
      shoppingSearchUrl: 'https://www.amazon.in/s?k=Happy+Birthday+LED+Neon+Sign'
    },
    {
      id: 'p-5',
      category: 'Decoration (Balloon Arch Kit)',
      title: 'Amazon Party Propz 135-Piece Pastel Retro Balloon Garland Kit with Arch Strip',
      platform: 'Amazon',
      quantity: 1,
      unitPrice: 899,
      totalPrice: 899,
      specs: 'Includes balloon pump, dot glue, arch chain, retro sage & gold balloons',
      reasonForSelection: 'DIY assembly takes 30 mins and looks identical to ₹4,000 professional event planner balloon arches.',
      alternativeOption: {
        title: 'Flipkart 70-Piece Chrome Balloon Set',
        platform: 'Flipkart',
        price: 549,
        note: 'Quick balloon clusters without full arch strip.'
      },
      shoppingSearchUrl: 'https://www.amazon.in/s?k=Party+Propz+135+pcs+balloon+garland'
    },
    {
      id: 'p-6',
      category: 'Decoration (Fairy Lights & Tableware)',
      title: 'Flipkart Eco-Friendly Bamboo Palm Leaf Plates + 20m Warm Fairy Light Strings',
      platform: 'Flipkart',
      quantity: 1,
      unitPrice: 1100,
      totalPrice: 1100,
      specs: '50 heavy-duty compostable palm leaf plates, wooden forks + 2 fairy lights',
      reasonForSelection: 'Rigid eco-plates won’t buckle under heavy biryani; warm fairy lights drape easily across terrace railings.',
      alternativeOption: {
        title: 'Amazon Bagasse Sugarcane Plates (50 Pack)',
        platform: 'Amazon',
        price: 799,
        note: 'Classic white biodegradable plates.'
      },
      shoppingSearchUrl: 'https://www.flipkart.com/search?q=palm+leaf+party+plates+bamboo'
    },
    {
      id: 'p-7',
      category: 'Entertainment (Music Setup)',
      title: 'boAt PartyPal 60W Bluetooth Party Speaker with Wireless Karaoke Mic',
      platform: 'Amazon',
      quantity: 1,
      unitPrice: 3899,
      totalPrice: 3899,
      specs: '60W RMS, dynamic RGB flame LEDs, 6-hour battery, includes wireless mic',
      reasonForSelection: 'Loud enough for open rooftops; wireless mic powers hilarious karaoke battles after dinner.',
      alternativeOption: {
        title: 'Flipkart Mivi Roam 2 Dual Pair Speakers',
        platform: 'Flipkart',
        price: 2499,
        note: 'Ultra portable stereo sound.'
      },
      shoppingSearchUrl: 'https://www.amazon.in/s?k=boAt+PartyPal+speaker+karaoke+mic'
    },
    {
      id: 'p-8',
      category: 'Entertainment (Games)',
      title: 'Amazon "Who In The Room?" & "Secret Hitler / Mafia" Party Card Game Bundle',
      platform: 'Amazon',
      quantity: 1,
      unitPrice: 753,
      totalPrice: 753,
      specs: 'Icebreaker games tailored for 10-30 player group dynamics',
      reasonForSelection: 'Breaks the ice instantly between friend groups who might not know each other well.',
      alternativeOption: {
        title: 'Flipkart Jenga Classic Hardwood Blocks',
        platform: 'Flipkart',
        price: 699,
        note: 'Physical dexterity tower game.'
      },
      shoppingSearchUrl: 'https://www.amazon.in/s?k=Party+Games+Group+Adults+Cards'
    },
    {
      id: 'p-9',
      category: 'Venue & Stay (Guest Suite)',
      title: 'OYO Townhouse Room / Refresh Suite (Day & Evening Access)',
      platform: 'OYO',
      quantity: 1,
      unitPrice: 2000,
      totalPrice: 2000,
      specs: 'Air-conditioned room nearby venue for guest bag storage, touch-ups, and cake cooling',
      reasonForSelection: 'Gives the host a clean private sanctuary for makeup touch-ups and keeps clutter away from the party area.',
      alternativeOption: {
        title: 'Use home master bedroom for storage',
        platform: 'Self',
        price: 0,
        note: 'Saves full ₹2,000 if party is at home terrace.'
      },
      shoppingSearchUrl: 'https://www.oyorooms.com/search?location=Townhouse'
    }
  ],
  timelineSchedule: [
    { time: '6:30 PM', activity: 'Terrace doors open, ambient chillhop playlist, welcome citrus spritzers' },
    { time: '7:15 PM', activity: 'Hot starter platters arrive from Swiggy; icebreaker card games' },
    { time: '8:45 PM', activity: 'Photobooth photo ops under the neon sign & cake cutting ceremony' },
    { time: '9:15 PM', activity: 'Royal Handi Biryani buffet opens; casual mingling' },
    { time: '10:00 PM', activity: 'Karaoke mic takeover & uptempo dance playlist' }
  ],
  proTips: [
    'Order Swiggy Gourmet starters 45 minutes in advance and schedule biryani handis for 9:00 PM so they remain steaming hot without reheating.',
    'Buy two 10kg bags of ice from your local vendor for ₹150 instead of grocery app bags; keeps party drinks ice cold all night.',
    'Ask 3 friends to co-host specific 30-minute game segments so you can actually enjoy your own party!'
  ]
};

export const SAMPLE_JEWELRY_PLAN: JewelryPlan = {
  summary: "A regal Kundan and Polki jewelry suite designed to complement your Emerald Green Lehenga. Because the sweetheart neckline exposes the upper collarbone, we balanced a majestic high-collar choker with statement chandelier chandbalis, leaving wristwear light with filigree kadas.",
  outfitAnalysis: {
    dominantColors: 'Emerald Green (#064E3B), Antique Gold, Warm Champagne',
    necklineHarmony: 'Sweetheart Neckline: Complemented seamlessly by a scalloped choker that hugs the collarbone without overlapping the embroidered blouse border.',
    stylingVibe: 'Regal Traditional Sangeet with Modern Lightweight Comfort'
  },
  totalBudget: 9500,
  totalEstimatedSpend: 8490,
  savingsCushion: 1010,
  currency: 'INR',
  recommendations: [
    {
      id: 'j-1',
      category: 'Necklace & Choker',
      title: 'Zaveri Pearls Green Beads & Kundan Studded Regal Choker Set',
      platform: 'Amazon',
      quantity: 1,
      unitPrice: 2899,
      totalPrice: 2899,
      material: '22K Gold Plated Alloy, Hydro Green Beads, Hand-cut Kundan stones',
      stylingReason: 'The deep green beads mirror your lehenga fabric, while the warm gold plating matches the zari embroidery without feeling excessively heavy on the neck.',
      tradeoffTier: 'splurge_worthy',
      alternativeOption: {
        title: 'Sukkhi Gold-Plated Contemporary Choker',
        platform: 'Flipkart',
        price: 1899,
        note: 'Slightly lighter weight alternative saving ₹1,000.'
      },
      shoppingSearchUrl: 'https://www.amazon.in/s?k=Zaveri+Pearls+Green+Kundan+Choker'
    },
    {
      id: 'j-2',
      category: 'Earrings',
      title: 'Myntra Anouk Gold-Toned Kundan & Green Enamel Chandbali Drop Earrings',
      platform: 'Myntra',
      quantity: 1,
      unitPrice: 1950,
      totalPrice: 1950,
      material: 'Gold-toned brass, Meenakari enameling, faux pearls, post and back closure',
      stylingReason: 'Chandbali circular silhouettes soften angular face lines and sway gracefully during Sangeet dance routines.',
      tradeoffTier: 'balanced_pick',
      alternativeOption: {
        title: 'YouBella Jhumka Earrings with Ear Chain',
        platform: 'Amazon',
        price: 999,
        note: 'Classic bell jhumka with hair support chain.'
      },
      shoppingSearchUrl: 'https://www.myntra.com/anouk-green-chandbali-earrings'
    },
    {
      id: 'j-3',
      category: 'Bangles & Kadas',
      title: 'Amazon Karatcart Openable Antique Gold Plated Filigree Kada (Set of 2)',
      platform: 'Amazon',
      quantity: 1,
      unitPrice: 1699,
      totalPrice: 1699,
      material: 'Antique gold finish with screw clasp closure, floral filigree work',
      stylingReason: 'Openable kadas fit snugly without needing 20 clunky glass bangles that snag on delicate dupatta netting.',
      tradeoffTier: 'balanced_pick',
      alternativeOption: {
        title: 'Flipkart Traditional Gold Bangles Set of 4',
        platform: 'Flipkart',
        price: 1199,
        note: 'Set of 4 slender etched bangles.'
      },
      shoppingSearchUrl: 'https://www.amazon.in/s?k=Karatcart+Openable+Antique+Kada'
    },
    {
      id: 'j-4',
      category: 'Ring',
      title: 'Giva 925 Sterling Silver Gold-Plated Statement Cocktail Ring',
      platform: 'Amazon',
      quantity: 1,
      unitPrice: 1099,
      totalPrice: 1099,
      material: '925 Silver hallmarked, AAA+ Cubic Zirconia center with green solitaire accent',
      stylingReason: 'Adds a flash of sparkle whenever holding drinks or gesturing in close-up portraits.',
      tradeoffTier: 'budget_saver',
      alternativeOption: {
        title: 'Shining Diva Floral Mirror Ring',
        platform: 'Flipkart',
        price: 499,
        note: 'Adjustable bohemian mirror ring.'
      },
      shoppingSearchUrl: 'https://www.amazon.in/s?k=Giva+gold+plated+cocktail+ring'
    },
    {
      id: 'j-5',
      category: 'Hair & Maang Tikka',
      title: 'Amazon Rubans Kundan Delicate Center Drop Maang Tikka',
      platform: 'Amazon',
      quantity: 1,
      unitPrice: 843,
      totalPrice: 843,
      material: 'Gold plated with single teardrop faux emerald and pearl chain',
      stylingReason: 'Frames the forehead gracefully without overwhelming the hairstyle, whether worn in a sleek bun or loose waves.',
      tradeoffTier: 'budget_saver',
      alternativeOption: {
        title: 'Flipkart Matha Patti Bridal Band',
        platform: 'Flipkart',
        price: 1399,
        note: 'Heavier three-tier hair band.'
      },
      shoppingSearchUrl: 'https://www.amazon.in/s?k=Rubans+Kundan+Maang+Tikka'
    }
  ],
  stylingTips: [
    'Always put on perfume and hairspray BEFORE your jewelry; alcohol in fragrances can tarnish gold plating and fog Kundan glass stones.',
    'Because your lehenga neckline features heavy gold embroidery, keep your choker fitted snug high up against the neck to create a neat break of bare skin.',
    'After the event, wipe jewelry with a soft microfiber cloth and store in airtight ziplock pouches with silica gel pouches to prevent moisture tarnishing.'
  ]
};
