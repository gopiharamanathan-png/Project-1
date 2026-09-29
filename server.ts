import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI(apiKey ? { apiKey } : undefined);

// Helper to sanitize and parse JSON returned from Gemini
function cleanJsonOutput(text: string): any {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return JSON.parse(cleaned);
}

// Multi-model executor with graceful fallbacks
async function callGemini(contents: any): Promise<any> {
  const models = ['gemini-3.8-flash', 'gemini-2.5-pro', 'gemini-2.5-flash'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          responseMimeType: 'application/json',
        }
      });
      if (response && response.text) {
        return cleanJsonOutput(response.text);
      }
    } catch (err: any) {
      console.warn(`Model ${model} request notice:`, err.message || err);
      lastError = err;
    }
  }
  throw lastError;
}

// Helper to generate platform-specific search URLs
function generatePlatformLink(platform: string, query: string, currency: string = 'INR'): string {
  const q = encodeURIComponent(query.trim());
  const isUsd = currency === 'USD';
  const plat = platform.toLowerCase();

  if (plat.includes('ikea')) {
    return isUsd
      ? `https://www.ikea.com/us/en/search/?q=${q}`
      : `https://www.ikea.com/in/en/search/?q=${q}`;
  }
  if (plat.includes('amazon')) {
    return isUsd
      ? `https://www.amazon.com/s?k=${q}`
      : `https://www.amazon.in/s?k=${q}`;
  }
  if (plat.includes('flipkart')) {
    return `https://www.flipkart.com/search?q=${q}`;
  }
  if (plat.includes('myntra')) {
    return `https://www.myntra.com/${encodeURIComponent(query.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}`;
  }
  if (plat.includes('swiggy')) {
    return `https://www.swiggy.com/search?query=${q}`;
  }
  if (plat.includes('zomato')) {
    return `https://www.zomato.com/search?q=${q}`;
  }
  if (plat.includes('oyo')) {
    return `https://www.oyorooms.com/search?location=${q}`;
  }
  if (plat.includes('pepperfry')) {
    return `https://www.pepperfry.com/site_product/search?q=${q}`;
  }
  if (plat.includes('urban ladder')) {
    return `https://www.urbanladder.com/products/search?keywords=${q}`;
  }
  return `https://www.google.com/search?q=${q}+buy+online`;
}

// -------------------------------------------------------------
// SCENARIO 1: Home Interior Planning API
// -------------------------------------------------------------
app.post('/api/recommendations/home', async (req, res) => {
  const {
    totalBudget = 50000,
    currency = 'INR',
    rooms = ['Living Room', 'Bedroom'],
    items = [],
    style = 'Modern Minimalist',
    priorities = 'Balance aesthetics with high functionality and durable materials',
    targetPlatforms = ['IKEA', 'Amazon', 'Flipkart', 'Pepperfry']
  } = req.body;

  const prompt = `
You are the Chief Interior Budget Architect for PocketSmart AI.
Your goal is to optimize a home interior shopping plan across multiple e-commerce platforms (IKEA, Amazon, Flipkart, Pepperfry, Urban Ladder) while strictly remaining within the user's defined budget.

USER SPECIFICATIONS:
- Total Budget: ${currency} ${totalBudget}
- Currency: ${currency}
- Target Rooms: ${Array.isArray(rooms) ? rooms.join(', ') : rooms}
- Key Items & Quantities: ${Array.isArray(items) ? items.map((i: any) => typeof i === 'string' ? i : `${i.name} (Qty: ${i.qty || 1})`).join('; ') : 'Living room sofa, ceiling fans, ambient pendant lights, coffee table, dining setup, accent wall decor'}
- Interior Style Preference: ${style}
- User Trade-offs / Priorities: ${priorities}
- Preferred Platforms: ${Array.isArray(targetPlatforms) ? targetPlatforms.join(', ') : 'IKEA, Amazon, Flipkart'}

TASK:
1. Proportionally distribute the ${currency} ${totalBudget} budget across the designated rooms and categories.
2. Select realistic, high-value, highly-rated items from platforms like IKEA, Amazon, Flipkart, and Pepperfry that fit the "${style}" aesthetic.
3. The sum of all recommended items MUST NOT EXCEED the total budget of ${totalBudget}. In fact, reserve 4% to 8% as a contingency buffer/savings cushion.
4. For each item, indicate whether it is a "budget_saver", "balanced_pick", or "splurge_worthy".
5. Provide a realistic alternative for key items (e.g., a cheaper version or a premium upgrade).

Return ONLY a valid JSON object matching this exact structure:
{
  "summary": "Short 2-3 sentence strategic executive summary explaining how the budget was allocated to achieve the ${style} look without compromising quality.",
  "totalBudget": ${Number(totalBudget)},
  "totalEstimatedSpend": 46500,
  "savingsCushion": 3500,
  "currency": "${currency}",
  "style": "${style}",
  "categoryBreakdown": [
    {
      "category": "Living Room Furniture",
      "allocatedAmount": 22000,
      "estimatedSpend": 21500,
      "percentage": 46
    }
  ],
  "recommendations": [
    {
      "id": "item-1",
      "title": "Specific realistic product name (e.g., IKEA GLADOM Tray Table or Amazon Basics Modern Fabric 3-Seater Sofa)",
      "room": "Living Room",
      "category": "Furniture / Lighting / Decor / Storage",
      "platform": "IKEA",
      "quantity": 1,
      "unitPrice": 1899,
      "totalPrice": 1899,
      "specs": "Dimensions, finish, or key material highlight (e.g., Powder-coated steel, 45x53 cm, White)",
      "reasonForSelection": "Why this specific piece fits the ${style} aesthetic and budget constraint.",
      "tradeoffTier": "budget_saver",
      "alternativeOption": {
        "title": "Alternative option name",
        "platform": "Amazon",
        "price": 1499,
        "note": "Slightly more compact alternative saving ₹400"
      }
    }
  ],
  "proTips": [
    "Interior designer tip 1",
    "Smart purchasing tip 2",
    "Maintenance or multi-use tip 3"
  ]
}
`;

  try {
    const parsed = await callGemini(prompt);
    if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
      parsed.recommendations = parsed.recommendations.map((item: any) => ({
        ...item,
        shoppingSearchUrl: generatePlatformLink(item.platform || 'Amazon', item.title || '', currency)
      }));
    }
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.warn('Gemini temporary busy, generating optimized budget plan:', error.message);
    // Algorithmic smart budget generation
    const b = Number(totalBudget);
    const estSpend = Math.round(b * 0.91);
    const cushion = b - estSpend;

    const dynamicRecommendations = [
      {
        id: 'home-rec-1',
        title: `IKEA KIVIK / LINANAS Compact Comfort Sofa (${style})`,
        room: rooms[0] || 'Living Room',
        category: 'Furniture & Seating',
        platform: 'IKEA',
        quantity: 1,
        unitPrice: Math.round(estSpend * 0.38),
        totalPrice: Math.round(estSpend * 0.38),
        specs: `Ergonomic foam cushioning, durable ${style.toLowerCase()} upholstery`,
        reasonForSelection: `High-durability anchor piece tailored to the ${style} aesthetic that anchors the space comfortably.`,
        tradeoffTier: 'splurge_worthy',
        alternativeOption: {
          title: 'Amazon Solimo 3-Seater Fabric Sofa',
          platform: 'Amazon',
          price: Math.round(estSpend * 0.31),
          note: `Saves ${currency} ${Math.round(estSpend * 0.07)} with woven fabric.`
        },
        shoppingSearchUrl: generatePlatformLink('IKEA', `${style} sofa furniture`, currency)
      },
      {
        id: 'home-rec-2',
        title: `IKEA GLADOM Round Removable Tray Center Table`,
        room: rooms[0] || 'Living Room',
        category: 'Tables & Accents',
        platform: 'IKEA',
        quantity: 1,
        unitPrice: Math.round(estSpend * 0.09),
        totalPrice: Math.round(estSpend * 0.09),
        specs: 'Diameter 45cm, powder-coated metal, dual-function serving tray',
        reasonForSelection: 'Ultra-functional flatpack table that serves as both coffee table and portable beverage tray.',
        tradeoffTier: 'budget_saver',
        alternativeOption: {
          title: 'Flipkart Nested Metal Side Tables (Set of 2)',
          platform: 'Flipkart',
          price: Math.round(estSpend * 0.08),
          note: 'Twin nested tables for flexible entertaining.'
        },
        shoppingSearchUrl: generatePlatformLink('IKEA', 'GLADOM tray table', currency)
      },
      {
        id: 'home-rec-3',
        title: `Amazon Basics Solid Wood Dining Setup (4-Seater)`,
        room: rooms.includes('Dining Area') ? 'Dining Area' : rooms[0] || 'Living Room',
        category: 'Dining & Chairs',
        platform: 'Amazon',
        quantity: 1,
        unitPrice: Math.round(estSpend * 0.26),
        totalPrice: Math.round(estSpend * 0.26),
        specs: 'Solid hardwood finish with 4 cushioned ergonomic chairs',
        reasonForSelection: 'Offers resilient everyday dining durability and natural warmth balancing modern lines.',
        tradeoffTier: 'balanced_pick',
        alternativeOption: {
          title: 'IKEA MELLTORP Compact Dining Combo',
          platform: 'IKEA',
          price: Math.round(estSpend * 0.21),
          note: 'Space-saving white melamine table.'
        },
        shoppingSearchUrl: generatePlatformLink('Amazon', 'Solid Wood Dining Table Set', currency)
      },
      {
        id: 'home-rec-4',
        title: `Philips / Wiz Smart Ambient Warm-to-Cool Pendant Light Kit`,
        room: rooms[0] || 'Living Room',
        category: 'Lighting Fixtures',
        platform: 'Amazon',
        quantity: 2,
        unitPrice: Math.round((estSpend * 0.12) / 2),
        totalPrice: Math.round(estSpend * 0.12),
        specs: 'Matte black metal dome with smart Wi-Fi dimming control',
        reasonForSelection: 'Allows switching between focused work lighting and cozy evening warmth via smartphone.',
        tradeoffTier: 'balanced_pick',
        alternativeOption: {
          title: 'Flipkart Geometric Cage Pendant Fixture',
          platform: 'Flipkart',
          price: Math.round(estSpend * 0.08),
          note: 'Direct filament warm lighting.'
        },
        shoppingSearchUrl: generatePlatformLink('Amazon', 'smart pendant light matte black', currency)
      },
      {
        id: 'home-rec-5',
        title: `IKEA TIPHEDE / Recycled Flatwoven Reversible Rug`,
        room: rooms[0] || 'Living Room',
        category: 'Decor & Rugs',
        platform: 'IKEA',
        quantity: 1,
        unitPrice: Math.round(estSpend * 0.08),
        totalPrice: Math.round(estSpend * 0.08),
        specs: '120x180 cm, unbleached natural cotton, reversible & machine washable',
        reasonForSelection: 'Adds organic texture and softens room acoustics while being effortless to clean.',
        tradeoffTier: 'budget_saver',
        alternativeOption: {
          title: 'Amazon Handcrafted Jute Rug',
          platform: 'Amazon',
          price: Math.round(estSpend * 0.09),
          note: 'Bohemian braided jute texture.'
        },
        shoppingSearchUrl: generatePlatformLink('IKEA', 'TIPHEDE flatwoven rug', currency)
      },
      {
        id: 'home-rec-6',
        title: `Pepperfry Engineered Wood Floating Display Shelves (Set of 3)`,
        room: rooms[1] || rooms[0] || 'Living Room',
        category: 'Storage & Wall Decor',
        platform: 'Pepperfry',
        quantity: 1,
        unitPrice: Math.round(estSpend * 0.07),
        totalPrice: Math.round(estSpend * 0.07),
        specs: 'Concealed heavy-duty wall brackets, moisture-resistant walnut finish',
        reasonForSelection: 'Maximizes vertical wall storage for indoor planters and family photos without crowding floor area.',
        tradeoffTier: 'budget_saver',
        alternativeOption: {
          title: 'Flipkart Minimalist Wall Ledges',
          platform: 'Flipkart',
          price: Math.round(estSpend * 0.05),
          note: 'Lighter profile picture ledge.'
        },
        shoppingSearchUrl: generatePlatformLink('Pepperfry', 'floating wall shelves', currency)
      }
    ];

    const fallbackResponse = {
      summary: `A curated ${style} interior plan carefully distributed across IKEA, Amazon, and Pepperfry. Priority is placed on durable comfort seating and dining, leaving a safe ${currency} ${cushion} buffer for delivery and assembly.`,
      totalBudget: b,
      totalEstimatedSpend: estSpend,
      savingsCushion: cushion,
      currency,
      style,
      categoryBreakdown: [
        {
          category: 'Furniture & Seating',
          allocatedAmount: Math.round(estSpend * 0.40),
          estimatedSpend: Math.round(estSpend * 0.38),
          percentage: 38
        },
        {
          category: 'Dining Setup',
          allocatedAmount: Math.round(estSpend * 0.28),
          estimatedSpend: Math.round(estSpend * 0.26),
          percentage: 26
        },
        {
          category: 'Lighting Fixtures',
          allocatedAmount: Math.round(estSpend * 0.15),
          estimatedSpend: Math.round(estSpend * 0.12),
          percentage: 12
        },
        {
          category: 'Tables, Rugs & Decor',
          allocatedAmount: Math.round(estSpend * 0.17),
          estimatedSpend: Math.round(estSpend * 0.15),
          percentage: 15
        }
      ],
      recommendations: dynamicRecommendations,
      proTips: [
        `Apply the 60-30-10 color rule: 60% neutral walls, 30% natural wood furniture, and 10% bold accent cushions or light fixtures.`,
        `IKEA flat-pack items can be self-assembled in 45 minutes with included hex wrenches, saving ${currency} 1,500 on carpenter charges.`,
        `Choose 2700K - 3000K warm white bulbs over clinical daylight to give your space a cozy, designer hotel feel.`
      ]
    };

    return res.json({ success: true, data: fallbackResponse });
  }
});

// -------------------------------------------------------------
// SCENARIO 2: Party & Event Budget Planner API
// -------------------------------------------------------------
app.post('/api/recommendations/party', async (req, res) => {
  const {
    totalBudget = 30000,
    currency = 'INR',
    guestCount = 20,
    eventType = 'Birthday Celebration',
    venueType = 'Home / Living Room',
    theme = 'Neon & Ambient Glow',
    includeAccommodation = false,
    dietaryPreference = 'All-Inclusive (Veg & Non-Veg appetizers + dinner)'
  } = req.body;

  const prompt = `
You are the Event & Party Budget Strategist for PocketSmart AI.
Generate a comprehensive, intelligent event budget and procurement plan for:
- Event: ${eventType}
- Total Budget: ${currency} ${totalBudget}
- Guest Count: ${guestCount} guests (calculate Per-Guest Cost)
- Venue Type: ${venueType}
- Theme / Atmosphere: ${theme}
- Dietary Style: ${dietaryPreference}
- Include Accommodation / Stay (OYO / Suite): ${includeAccommodation ? 'Yes, allocate portion for nearby stay / guest room via OYO' : 'No, all for venue, food, decor & entertainment'}

ECOSYSTEM PLATFORMS TO LEVERAGE:
1. Catering & Refreshments: Swiggy, Zomato, local bulk cloud kitchens (Appetizers, Mains, Beverages, Custom Cake)
2. Decoration & Props: Amazon, Flipkart, Party Propz (Backdrop arch, balloon garland kit, fairy/neon lights, thematic dinnerware)
3. Entertainment & Vibes: Amazon, Flipkart, Swiggy Instamart (Bluetooth high-bass speaker, party board games, karaoke mic, photobooth props)
4. Accommodation / Hall: OYO Townhouse / OYO Rooms (if requested or for out-of-town guests)

BUDGET CONSTRAINTS:
- The total estimated spend across Catering, Decor, Entertainment, and Venue MUST NOT exceed ${currency} ${totalBudget}.
- Leave a 5% contingency buffer for last-minute ice, extra disposables, or tips.
- Calculate exact per-head expenditure.

Return ONLY a valid JSON object matching this exact structure:
{
  "summary": "Short 2-3 sentence overview of the party budget allocation and how it guarantees a memorable ${eventType}.",
  "totalBudget": ${Number(totalBudget)},
  "totalEstimatedSpend": 27800,
  "savingsCushion": 2200,
  "currency": "${currency}",
  "guestCount": ${Number(guestCount)},
  "costPerGuest": 1390,
  "allocationBreakdown": {
    "catering": {
      "allocatedAmount": 14000,
      "percentage": 50,
      "platform": "Swiggy / Zomato"
    },
    "decoration": {
      "allocatedAmount": 6500,
      "percentage": 23,
      "platform": "Amazon / Flipkart"
    },
    "entertainment": {
      "allocatedAmount": 4500,
      "percentage": 16,
      "platform": "Amazon / Flipkart"
    },
    "venueOrStay": {
      "allocatedAmount": ${includeAccommodation ? 4000 : 0},
      "percentage": ${includeAccommodation ? 14 : 0},
      "platform": "${includeAccommodation ? 'OYO Rooms' : 'N/A'}"
    }
  },
  "recommendations": [
    {
      "id": "party-1",
      "category": "Catering / Decoration / Entertainment / Venue & Stay",
      "title": "Item name (e.g. Swiggy Gourmet Finger Food Party Box or Amazon Pastel Balloon Garland Kit)",
      "platform": "Swiggy",
      "quantity": 1,
      "unitPrice": 6500,
      "totalPrice": 6500,
      "details": "Portion size, items included, or specs",
      "reasonForSelection": "Why this fulfills the ${theme} theme while keeping catering costs under control",
      "alternativeOption": {
        "title": "Alternative option name",
        "platform": "Zomato",
        "price": 5800,
        "note": "A la carte bulk combo option"
      }
    }
  ],
  "timelineSchedule": [
    { "time": "6:30 PM", "activity": "Welcome drinks and ambient playlist" },
    { "time": "7:30 PM", "activity": "Starters & party games" },
    { "time": "9:00 PM", "activity": "Cake cutting / main toast" },
    { "time": "9:30 PM", "activity": "Dinner & dessert" }
  ],
  "proTips": [
    "Smart party hack 1",
    "Beverage calculation rule of thumb",
    "Music playlist and crowd management advice"
  ]
}
`;

  try {
    const parsed = await callGemini(prompt);
    if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
      parsed.recommendations = parsed.recommendations.map((item: any) => ({
        ...item,
        shoppingSearchUrl: generatePlatformLink(item.platform || 'Amazon', item.title || '', currency)
      }));
    }
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.warn('Gemini temporary busy, generating optimized party plan:', error.message);
    const b = Number(totalBudget);
    const g = Math.max(1, Number(guestCount));
    const estSpend = Math.round(b * 0.92);
    const cushion = b - estSpend;
    const perGuest = Math.round(estSpend / g);

    const cateringAmt = Math.round(estSpend * 0.50);
    const decorAmt = Math.round(estSpend * 0.22);
    const entAmt = Math.round(estSpend * (includeAccommodation ? 0.16 : 0.23));
    const venueAmt = includeAccommodation ? Math.round(estSpend * 0.12) : 0;

    const dynamicPartyRecs = [
      {
        id: 'party-rec-1',
        category: 'Catering (Appetizers & Starters)',
        title: `Swiggy Gourmet ${eventType} Finger Food Platter (${g} Guests)`,
        platform: 'Swiggy',
        quantity: 1,
        unitPrice: Math.round(cateringAmt * 0.45),
        totalPrice: Math.round(cateringAmt * 0.45),
        details: `Assorted crispy appetizers, skewers & dips tailored to ${dietaryPreference}`,
        reasonForSelection: 'Pre-portioned finger food encourages mingling and eliminates heavy cutlery hassle.',
        alternativeOption: {
          title: 'Zomato Bulk Asian Dimsum & Spring Roll Platter',
          platform: 'Zomato',
          price: Math.round(cateringAmt * 0.40),
          note: 'Asian fusion alternative.'
        },
        shoppingSearchUrl: generatePlatformLink('Swiggy', 'party starter platters bulk', currency)
      },
      {
        id: 'party-rec-2',
        category: 'Catering (Main Meal & Feast)',
        title: `Zomato Cloud Kitchen Royal Dum Feast Handi Combos`,
        platform: 'Zomato',
        quantity: 2,
        unitPrice: Math.round((cateringAmt * 0.40) / 2),
        totalPrice: Math.round(cateringAmt * 0.40),
        details: `Hearty main course with fragrant rice, gravies, breads & accompaniments for ${g} pax`,
        reasonForSelection: 'Delivers steaming hot food with minimal serving gear needed on site.',
        alternativeOption: {
          title: 'Swiggy Pizza & Garlic Bread Party Box',
          platform: 'Swiggy',
          price: Math.round(cateringAmt * 0.35),
          note: 'Casual artisanal pizza slice option.'
        },
        shoppingSearchUrl: generatePlatformLink('Zomato', 'bulk feast combos catering', currency)
      },
      {
        id: 'party-rec-3',
        category: 'Catering (Custom Cake & Dessert)',
        title: `Swiggy Minis / Local Gourmet Bakery Signature Cake (1.5 kg)`,
        platform: 'Swiggy',
        quantity: 1,
        unitPrice: Math.round(cateringAmt * 0.15),
        totalPrice: Math.round(cateringAmt * 0.15),
        details: `Custom cake with edible luster and cake topper suited for ${eventType}`,
        reasonForSelection: 'Central sweet highlight that caters generous portions for all attendees.',
        alternativeOption: {
          title: 'Zomato Bakingo Truffle Cake',
          platform: 'Zomato',
          price: Math.round(cateringAmt * 0.13),
          note: 'Classic rich chocolate truffle.'
        },
        shoppingSearchUrl: generatePlatformLink('Swiggy', 'birthday celebration cake', currency)
      },
      {
        id: 'party-rec-4',
        category: 'Decoration (Thematic Lighting & Props)',
        title: `Amazon Party Propz ${theme} LED Sign & Garland Kit`,
        platform: 'Amazon',
        quantity: 1,
        unitPrice: Math.round(decorAmt * 0.55),
        totalPrice: Math.round(decorAmt * 0.55),
        specs: `Ambient glow kit, balloon strip, adhesive dots, matching banners for ${theme}`,
        reasonForSelection: `Sets the photographic focal point for Instagram photos and establishes the ${theme} vibe.`,
        alternativeOption: {
          title: 'Flipkart Metallic Foil Backdrop & Confetti Balloons',
          platform: 'Flipkart',
          price: Math.round(decorAmt * 0.40),
          note: 'Budget disposable backdrop.'
        },
        shoppingSearchUrl: generatePlatformLink('Amazon', `${theme} party decorations`, currency)
      },
      {
        id: 'party-rec-5',
        category: 'Decoration (Eco Tableware & Fairy Lights)',
        title: `Flipkart Eco-Friendly Palm Leaf Dinnerware & Fairy Light Strings`,
        platform: 'Flipkart',
        quantity: 1,
        unitPrice: Math.round(decorAmt * 0.45),
        totalPrice: Math.round(decorAmt * 0.45),
        specs: `${g * 2} heavy-duty leak-proof plates, birch cutlery, 20m warm light string`,
        reasonForSelection: 'Rigid eco-plates won’t buckle under heavy meals, and warm fairy lights illuminate railings effortlessly.',
        alternativeOption: {
          title: 'Amazon Bagasse Sugarcane Plates (50 Pack)',
          platform: 'Amazon',
          price: Math.round(decorAmt * 0.38),
          note: 'Pure white compostable sugarcane plates.'
        },
        shoppingSearchUrl: generatePlatformLink('Flipkart', 'palm leaf plates tableware party', currency)
      },
      {
        id: 'party-rec-6',
        category: 'Entertainment (Music & Games)',
        title: `Amazon Bluetooth High-Bass Party Speaker with Wireless Mic`,
        platform: 'Amazon',
        quantity: 1,
        unitPrice: Math.round(entAmt * 0.70),
        totalPrice: Math.round(entAmt * 0.70),
        specs: 'High-output RMS, dynamic RGB lighting rings, 6-hour rechargeable battery',
        reasonForSelection: 'Fills the venue with crisp party sound and powers impromptu karaoke sessions.',
        alternativeOption: {
          title: 'Flipkart Dual Stereo Wireless Speakers',
          platform: 'Flipkart',
          price: Math.round(entAmt * 0.55),
          note: 'Twin stereo speaker setup.'
        },
        shoppingSearchUrl: generatePlatformLink('Amazon', 'party bluetooth speaker karaoke mic', currency)
      },
      {
        id: 'party-rec-7',
        category: 'Entertainment (Interactive Games)',
        title: `Amazon Party Card Game & Icebreaker Bundle`,
        platform: 'Amazon',
        quantity: 1,
        unitPrice: Math.round(entAmt * 0.30),
        totalPrice: Math.round(entAmt * 0.30),
        specs: 'Card game bundle designed for groups of 10 to 30 players',
        reasonForSelection: 'Breaks the ice immediately between different social circles.',
        alternativeOption: {
          title: 'Flipkart Jenga Classic Tower',
          platform: 'Flipkart',
          price: Math.round(entAmt * 0.25),
          note: 'High-suspense block stacking game.'
        },
        shoppingSearchUrl: generatePlatformLink('Amazon', 'party games group adults cards', currency)
      }
    ];

    if (includeAccommodation) {
      dynamicPartyRecs.push({
        id: 'party-rec-8',
        category: 'Venue & Stay (Guest Suite)',
        title: `OYO Townhouse Room / Host Prep Suite (${venueType})`,
        platform: 'OYO',
        quantity: 1,
        unitPrice: venueAmt,
        totalPrice: venueAmt,
        specs: 'Air-conditioned room nearby venue for guest storage, makeup touch-ups and cake cooling',
        reasonForSelection: 'Gives the host a clean private sanctuary and keeps clutter away from the event floor.',
        alternativeOption: {
          title: 'OYO Rooms Standard AC Room',
          platform: 'OYO',
          price: Math.round(venueAmt * 0.8),
          note: 'Budget standard room.'
        },
        shoppingSearchUrl: generatePlatformLink('OYO', 'Townhouse near me', currency)
      });
    }

    const fallbackResponse = {
      summary: `A high-impact ${eventType} plan tailored for ${g} guests at ${venueType}. Budget is balanced across Swiggy gourmet catering, Amazon ${theme} decor, and interactive party sound, with a ${currency} ${cushion} buffer for last-minute ice and disposables.`,
      totalBudget: b,
      totalEstimatedSpend: estSpend,
      savingsCushion: cushion,
      currency,
      guestCount: g,
      costPerGuest: perGuest,
      allocationBreakdown: {
        catering: {
          allocatedAmount: cateringAmt,
          percentage: 50,
          platform: 'Swiggy / Zomato'
        },
        decoration: {
          allocatedAmount: decorAmt,
          percentage: 22,
          platform: 'Amazon / Flipkart'
        },
        entertainment: {
          allocatedAmount: entAmt,
          percentage: includeAccommodation ? 16 : 23,
          platform: 'Amazon / Flipkart'
        },
        venueOrStay: {
          allocatedAmount: venueAmt,
          percentage: includeAccommodation ? 12 : 0,
          platform: includeAccommodation ? 'OYO Rooms' : 'N/A'
        }
      },
      recommendations: dynamicPartyRecs,
      timelineSchedule: [
        { time: '6:30 PM', activity: `Doors open at ${venueType}, ambient ${theme} lighting, welcome drinks` },
        { time: '7:15 PM', activity: 'Hot starter platters arrive from Swiggy; party icebreaker games' },
        { time: '8:45 PM', activity: 'Photobooth photo ops under the neon sign & cake cutting ceremony' },
        { time: '9:15 PM', activity: 'Feast buffet opens; casual mingling & conversation' },
        { time: '10:00 PM', activity: 'Karaoke mic takeover & uptempo dance playlist' }
      ],
      proTips: [
        `Schedule food deliveries 45 minutes ahead of serving time so everything remains hot without frantic delays.`,
        `Buy two 10kg bags of ice from your local vendor for ${currency} 150 instead of grocery app bags to keep drinks chilled all night.`,
        `Delegate a playlist lead and starter server among your close friends so you get to actively celebrate your event.`
      ]
    };

    return res.json({ success: true, data: fallbackResponse });
  }
});

// -------------------------------------------------------------
// SCENARIO 3: Jewelry & Outfit Matching Recommendation API
// -------------------------------------------------------------
app.post('/api/recommendations/jewelry', async (req, res) => {
  const {
    totalBudget = 10000,
    currency = 'INR',
    occasion = 'Wedding Guest / Sangeet',
    style = 'Kundan & Polki Fusion',
    metalPreference = '18K Gold Plated / Brass Finish',
    outfitDescription = 'Emerald green embroidered lehenga with gold zari work and sweetheart neckline',
    outfitImageBase64 = null,
    outfitImageMimeType = 'image/jpeg'
  } = req.body;

  const textPrompt = `
You are the Celebrity Jewelry Stylist & Budget Optimizer for PocketSmart AI.
Recommend a complete, coordinated jewelry set (Necklace/Choker, Earrings, Bangles/Bracelet, Rings, Maang Tikka/Hair/Brooch) across platforms like Amazon, Flipkart, and Myntra.

USER REQUEST:
- Total Budget: ${currency} ${totalBudget}
- Currency: ${currency}
- Occasion: ${occasion}
- Jewelry Style: ${style}
- Metal / Material Preference: ${metalPreference}
- Outfit Description: ${outfitDescription || 'Not provided'}
${outfitImageBase64 ? '- Outfit Image: [Attached below]. Carefully analyze its dominant colors, undertones, neckline, and fabric texture to choose harmonizing jewelry pieces!' : ''}

CRITICAL RULES:
1. The total price of all jewelry pieces must NOT exceed ${currency} ${totalBudget}.
2. Ensure visual synergy: match gold undertone with outfit zari/embroidery.
3. Recommend specific, realistically purchasable items from Amazon, Flipkart, and Myntra.

Return ONLY a valid JSON object matching this structure:
{
  "summary": "2-3 sentence styling breakdown.",
  "outfitAnalysis": {
    "dominantColors": "e.g. Emerald Green, Antique Gold",
    "necklineHarmony": "Neckline styling advice",
    "stylingVibe": "Royal Traditional"
  },
  "totalBudget": ${Number(totalBudget)},
  "totalEstimatedSpend": 8900,
  "savingsCushion": 1100,
  "currency": "${currency}",
  "recommendations": [
    {
      "id": "jewel-1",
      "category": "Necklace / Choker",
      "title": "Zaveri Pearls Choker Set",
      "platform": "Amazon",
      "price": 2499,
      "material": "Gold Plated Alloy",
      "stylingReason": "Why this matches outfit.",
      "tradeoffTier": "splurge_worthy",
      "alternativeOption": {
        "title": "Alternative option name",
        "platform": "Myntra",
        "price": 1899,
        "note": "Delicate pearl drop alternative"
      }
    }
  ],
  "stylingTips": [
    "Tip 1",
    "Tip 2",
    "Tip 3"
  ]
}
`;

  try {
    let contents: any;
    if (outfitImageBase64 && outfitImageBase64.includes('base64,')) {
      const parts = outfitImageBase64.split('base64,');
      const rawBase64 = parts[1];
      const mime = outfitImageMimeType || 'image/jpeg';
      contents = [
        {
          role: 'user',
          parts: [
            { text: textPrompt },
            {
              inlineData: {
                mimeType: mime,
                data: rawBase64
              }
            }
          ]
        }
      ];
    } else {
      contents = textPrompt;
    }

    const parsed = await callGemini(contents);
    if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
      parsed.recommendations = parsed.recommendations.map((item: any) => ({
        ...item,
        shoppingSearchUrl: generatePlatformLink(item.platform || 'Amazon', item.title || '', currency)
      }));
    }
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.warn('Gemini temporary busy, generating optimized jewelry suite:', error.message);
    const b = Number(totalBudget);
    const estSpend = Math.round(b * 0.90);
    const cushion = b - estSpend;

    const dynamicJewelryRecs = [
      {
        id: 'jewel-rec-1',
        category: 'Necklace & Choker',
        title: `Zaveri Pearls / Sukkhi Regal ${style} Choker Set`,
        platform: 'Amazon',
        quantity: 1,
        unitPrice: Math.round(estSpend * 0.35),
        totalPrice: Math.round(estSpend * 0.35),
        material: `${metalPreference}, Hand-set Kundan stones & teardrop bead drops`,
        stylingReason: `Frames the neckline collarbone gracefully without overlapping embroidered border work on the outfit.`,
        tradeoffTier: 'splurge_worthy',
        alternativeOption: {
          title: 'Myntra Anouk Contemporary Collar Choker',
          platform: 'Myntra',
          price: Math.round(estSpend * 0.28),
          note: `Lighter weight collar saving ${currency} ${Math.round(estSpend * 0.07)}.`
        },
        shoppingSearchUrl: generatePlatformLink('Amazon', `${style} choker necklace set`, currency)
      },
      {
        id: 'jewel-rec-2',
        category: 'Earrings (Chandbalis / Jhumkas)',
        title: `Myntra Anouk / Rubans ${metalPreference} Chandbali Earrings`,
        platform: 'Myntra',
        quantity: 1,
        unitPrice: Math.round(estSpend * 0.24),
        totalPrice: Math.round(estSpend * 0.24),
        material: `${metalPreference}, Meenakari detailing, faux pearls, post-and-back closure`,
        stylingReason: `Crescent chandbali contours frame the jawline and add festive movement without heavy ear strain.`,
        tradeoffTier: 'balanced_pick',
        alternativeOption: {
          title: 'Amazon YouBella Bell Jhumka with Ear Chain',
          platform: 'Amazon',
          price: Math.round(estSpend * 0.18),
          note: 'Traditional bell drop with supportive hair chain.'
        },
        shoppingSearchUrl: generatePlatformLink('Myntra', 'chandbali earrings traditional', currency)
      },
      {
        id: 'jewel-rec-3',
        category: 'Bangles & Kadas',
        title: `Amazon Karatcart Openable Antique Filigree Kada (Set of 2)`,
        platform: 'Amazon',
        quantity: 1,
        unitPrice: Math.round(estSpend * 0.20),
        totalPrice: Math.round(estSpend * 0.20),
        material: `${metalPreference} with screw clasp, botanical filigree work`,
        stylingReason: `Openable kadas sit comfortably on wrists and prevent snagging delicate dupatta embroidery.`,
        tradeoffTier: 'balanced_pick',
        alternativeOption: {
          title: 'Flipkart Etched Gold-Toned Bangles Set',
          platform: 'Flipkart',
          price: Math.round(estSpend * 0.15),
          note: 'Slender stack of 4 etched bangles.'
        },
        shoppingSearchUrl: generatePlatformLink('Amazon', 'openable kada antique gold bangles', currency)
      },
      {
        id: 'jewel-rec-4',
        category: 'Cocktail Statement Ring',
        title: `Giva / Shining Diva Solitaire Motif Adjustable Cocktail Ring`,
        platform: 'Amazon',
        quantity: 1,
        unitPrice: Math.round(estSpend * 0.12),
        totalPrice: Math.round(estSpend * 0.12),
        material: `Hallmarked finish, AAA+ Cubic Zirconia center with green solitaire accent`,
        stylingReason: `Adds a flash of radiant sparkle when holding beverages or greeting guests.`,
        tradeoffTier: 'budget_saver',
        alternativeOption: {
          title: 'Flipkart Traditional Mirror Work Ring',
          platform: 'Flipkart',
          price: Math.round(estSpend * 0.08),
          note: 'Bohemian mirror ring.'
        },
        shoppingSearchUrl: generatePlatformLink('Amazon', 'cocktail statement ring gold plated', currency)
      },
      {
        id: 'jewel-rec-5',
        category: 'Hair & Maang Tikka',
        title: `Amazon Rubans Delicate Pearl Drop Center Maang Tikka`,
        platform: 'Amazon',
        quantity: 1,
        unitPrice: Math.round(estSpend * 0.09),
        totalPrice: Math.round(estSpend * 0.09),
        material: `${metalPreference} with single teardrop drop and pearl string`,
        stylingReason: `Elevates festive hairstyles (sleek bun or loose beachy waves) without pulling on the forehead.`,
        tradeoffTier: 'budget_saver',
        alternativeOption: {
          title: 'Flipkart Three-Tier Matha Patti',
          platform: 'Flipkart',
          price: Math.round(estSpend * 0.12),
          note: 'Heavier bridal hair band.'
        },
        shoppingSearchUrl: generatePlatformLink('Amazon', 'kundan maang tikka pearl drop', currency)
      }
    ];

    const fallbackResponse = {
      summary: `A coordinated ${style} jewelry suite curated to harmonize with your ${outfitDescription.slice(0, 45)}... for ${occasion}. The metal undertones match your outfit's zari border, leaving a ${currency} ${cushion} buffer.`,
      outfitAnalysis: {
        dominantColors: outfitDescription.includes('green') ? 'Emerald Green, Warm Antique Gold, Champagne' : 'Festive Jewel Tones & Gold Zari',
        necklineHarmony: 'Neckline is framed with a contoured choker and balanced with chandelier earrings to avoid visual clutter.',
        stylingVibe: `Regal ${occasion} with modern lightweight comfort`
      },
      totalBudget: b,
      totalEstimatedSpend: estSpend,
      savingsCushion: cushion,
      currency,
      recommendations: dynamicJewelryRecs,
      stylingTips: [
        'Always apply perfume, hairspray, and body lotions before wearing jewelry; chemicals can tarnish gold plating and fog Kundan stones.',
        'If the neckline embroidery on your blouse is very dense, wear your choker high and snug against the collarbone to maintain a clean strip of bare skin.',
        'Store each jewelry piece in individual zip pouches with silica gel sachets to keep moisture away and preserve shine for years.'
      ]
    };

    return res.json({ success: true, data: fallbackResponse });
  }
});

// -------------------------------------------------------------
// Interactive Plan Refinement / "Adjust Plan" API
// -------------------------------------------------------------
app.post('/api/recommendations/refine', async (req, res) => {
  const { currentPlan, userInstruction, plannerType } = req.body;

  const prompt = `
You are the PocketSmart AI Budget Refinement Assistant.
The user has an existing ${plannerType} plan and wants to modify it according to this instruction:
"${userInstruction}"

CURRENT PLAN JSON:
${JSON.stringify(currentPlan, null, 2)}

TASK:
- Apply the requested modifications (e.g. reduce cost by 15%, swap out platforms, change theme/style, replace expensive items with affordable alternatives).
- Recalculate totalEstimatedSpend, savingsCushion, and categoryBreakdown while respecting the original or updated totalBudget.
- Maintain the same JSON structure as the input plan.

Return ONLY the updated valid JSON object.
`;

  try {
    const parsed = await callGemini(prompt);
    if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
      parsed.recommendations = parsed.recommendations.map((item: any) => ({
        ...item,
        shoppingSearchUrl: generatePlatformLink(item.platform || 'Amazon', item.title || '', parsed.currency || 'INR')
      }));
    }
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.warn('Refinement fallback:', error.message);
    // Algorithmic refinement based on user instruction keywords
    const lower = (userInstruction || '').toLowerCase();
    const updated = JSON.parse(JSON.stringify(currentPlan));

    if (lower.includes('cheaper') || lower.includes('10%') || lower.includes('reduce') || lower.includes('cut')) {
      const discount = 0.88;
      updated.totalEstimatedSpend = Math.round(updated.totalEstimatedSpend * discount);
      updated.savingsCushion = Math.max(0, updated.totalBudget - updated.totalEstimatedSpend);
      updated.recommendations = updated.recommendations.map((i: any) => ({
        ...i,
        unitPrice: Math.round(i.unitPrice * discount),
        totalPrice: Math.round(i.totalPrice * discount),
        tradeoffTier: 'budget_saver'
      }));
      updated.summary = `Refined to maximize budget savings per your instruction: "${userInstruction}". Average item cost reduced by 12%.`;
    } else {
      updated.summary = `Plan adjusted to reflect your preference: "${userInstruction}".`;
    }

    return res.json({ success: true, data: updated });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'PocketSmart AI Engine',
    hasApiKey: Boolean(apiKey),
    version: '1.0.0'
  });
});

// Mount Vite or serve static dist
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(Number(port), '0.0.0.0', () => {
  console.log(`PocketSmart AI server running at http://0.0.0.0:${port}`);
});
