import { Product } from '@/types';

export const products: Product[] = [
  {
    id: 1,
    product_code: 'PRD-221',
    title: 'Wireless Headphones',
    slug: 'wireless-headphones',
    sku: 'WH-1000XM5',
    description: 'High-quality wireless noise-cancelling headphones with exceptional sound clarity and long battery life.',
    short_description: 'Premium sound, 30-hour battery life.',
    supplier_id: 1,
    product_link: 'https://example.com/product/wh-1000xm5',
    category_id: 1,
    brand: 'Sony',
    tags: ['audio', 'wireless', 'headphones', 'bluetooth'],

    featured_image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    gallery: [],

    weight: 0.4,
    unit: 'kg',

    cost_rmb: 850,
    exchange_rate: 15.3,
    cost_bdt: 13000,
    actual_price: 13000,
    default_price: 18000,
    compare_at_price: 20000,
    price_wholesale: 16500,
    price_retail: 18000,
    price_daraz: 19000,

    name_wholesale: 'Sony WH-1000XM5 (Bulk)',
    name_retail: 'Sony WH-1000XM5',
    name_daraz: 'Sony WH-1000XM5 Wireless Headphones',

    status: 'active',
    has_variants: false,
    inventory_quantity: 45,
    inventory_policy: 'continue',

    barcode: '1234567890123',
    hs_code: '85183000',

    seo_title: 'Wireless Noise Cancelling Headphones',
    seo_description: 'Experience premium wireless audio and top-tier noise cancellation with Sony WH-1000XM5.',
    search_keywords: ['sony', 'wireless', 'headphones', 'noise cancelling'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 2,
    product_code: 'PRD-222',
    title: 'Carbon Fiber Fishing Rod',
    slug: 'carbon-fiber-fishing-rod',
    sku: 'FISH-ROD-CF1',
    description: 'Lightweight and durable carbon fiber fishing rod designed for both professional and recreational anglers.',
    short_description: 'Perfect for freshwater and saltwater use.',
    supplier_id: 2,
    product_link: 'https://example.com/product/fishing-rod',
    category_id: 2,
    brand: 'FishPro',
    tags: ['fishing', 'outdoor', 'sports', 'rod'],

    featured_image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19',
    gallery: [],

    weight: 0.6,
    unit: 'kg',

    cost_rmb: 220,
    exchange_rate: 15.3,
    cost_bdt: 3366,
    actual_price: 3366,
    default_price: 5500,
    compare_at_price: 6000,
    price_wholesale: 5200,
    price_retail: 5500,
    price_daraz: 5700,

    name_wholesale: 'FishPro CF-1 Rod (Wholesale)',
    name_retail: 'FishPro Carbon Fiber Rod',
    name_daraz: 'FishPro Carbon Fiber Fishing Rod',

    status: 'active',
    has_variants: true,
    inventory_quantity: 25,
    inventory_policy: 'deny',

    barcode: '9876543210001',
    hs_code: '95071000',

    seo_title: 'Carbon Fiber Fishing Rod',
    seo_description: 'Premium carbon fiber fishing rod that delivers strength, balance, and performance for every angler.',
    search_keywords: ['fishing rod', 'carbon fiber', 'fishpro', 'outdoor gear'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  // --- 50 NEW FISHING PRODUCTS START HERE ---

  {
    id: 3,
    product_code: 'PRD-223',
    title: 'High-Speed Baitcasting Reel',
    slug: 'high-speed-baitcasting-reel',
    sku: 'BCR-HS-3000',
    description: 'Low-profile baitcasting reel with a 7.3:1 gear ratio, perfect for fast retrieval and handling large fish.',
    short_description: '7.3:1 ratio, smooth magnetic braking.',
    supplier_id: 3,
    product_link: 'https://example.com/product/baitcasting-reel-3000',
    category_id: 2,
    brand: 'AquaCast',
    tags: ['fishing', 'reel', 'baitcasting', 'gear'],

    featured_image: 'https://images.unsplash.com/photo-1557962777-6f81a17951a8',
    gallery: [],

    weight: 0.25,
    unit: 'kg',

    cost_rmb: 150,
    exchange_rate: 15.3,
    cost_bdt: 2295,
    actual_price: 2295,
    default_price: 4500,
    compare_at_price: 5000,
    price_wholesale: 4200,
    price_retail: 4500,
    price_daraz: 4800,

    name_wholesale: 'AquaCast HS-3000 (Bulk)',
    name_retail: 'AquaCast High-Speed Baitcaster',
    name_daraz: 'AquaCast Baitcasting Reel 7.3:1',

    status: 'active',
    has_variants: false,
    inventory_quantity: 120,
    inventory_policy: 'continue',

    barcode: '9876543210002',
    hs_code: '95073000',

    seo_title: 'AquaCast High-Speed Baitcasting Reel',
    seo_description: 'Durable and fast baitcasting reel for serious anglers.',
    search_keywords: ['baitcaster', 'fishing reel', 'aqua cast', 'lure fishing'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 4,
    product_code: 'PRD-224',
    title: 'Braided Fishing Line 500m',
    slug: 'braided-fishing-line-500m-30lb',
    sku: 'BFL-30LB-500',
    description: '500-meter spool of high-strength 4-strand braided fishing line, 30lb test, low stretch.',
    short_description: 'Super strong, thin diameter, 30lb.',
    supplier_id: 4,
    product_link: 'https://example.com/product/braided-line',
    category_id: 3,
    brand: 'LineMaster',
    tags: ['fishing', 'line', 'braid', 'accessory'],

    featured_image: 'https://images.unsplash.com/photo-1607542973167-756d11a2f647',
    gallery: [],

    weight: 0.1,
    unit: 'kg',

    cost_rmb: 55,
    exchange_rate: 15.3,
    cost_bdt: 841.5,
    actual_price: 841.5,
    default_price: 1500,
    compare_at_price: 1800,
    price_wholesale: 1350,
    price_retail: 1500,
    price_daraz: 1650,

    name_wholesale: 'LineMaster Braid 30LB (Spool)',
    name_retail: 'LineMaster Braided Line 500m',
    name_daraz: 'LineMaster 4-Strand Braid 30LB',

    status: 'active',
    has_variants: true,
    inventory_quantity: 200,
    inventory_policy: 'continue',

    barcode: '9876543210003',
    hs_code: '54041100',

    seo_title: '500m 30lb Braided Fishing Line',
    seo_description: 'Get maximum casting distance and strength with LineMaster 30lb braided line.',
    search_keywords: ['fishing line', 'braided line', '30lb test', 'linemaster'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 5,
    product_code: 'PRD-225',
    title: 'Floating Crankbait Lure Set',
    slug: 'floating-crankbait-lure-set',
    sku: 'LURE-CRANK-SET-10',
    description: 'Set of 10 assorted floating crankbait lures with internal rattles and 3D eyes for bass and pike fishing.',
    short_description: '10 colorful crankbaits, life-like action.',
    supplier_id: 5,
    product_link: 'https://example.com/product/crankbait-set',
    category_id: 4,
    brand: 'LurePro',
    tags: ['fishing', 'lure', 'bait', 'set'],

    featured_image: 'https://images.unsplash.com/photo-1549488349-438c6f1406e1',
    gallery: [],

    weight: 0.15,
    unit: 'kg',

    cost_rmb: 35,
    exchange_rate: 15.3,
    cost_bdt: 535.5,
    actual_price: 535.5,
    default_price: 990,
    compare_at_price: 1200,
    price_wholesale: 890,
    price_retail: 990,
    price_daraz: 1100,

    name_wholesale: 'LurePro Crankbait Set 10pc',
    name_retail: 'Floating Crankbait Lure Set',
    name_daraz: '10-Pack Floating Fishing Crankbaits',

    status: 'active',
    has_variants: false,
    inventory_quantity: 350,
    inventory_policy: 'continue',

    barcode: '9876543210004',
    hs_code: '95079000',

    seo_title: '10pc Floating Crankbait Fishing Lure Set',
    seo_description: 'Vivid colors and realistic action in this assorted crankbait lure set.',
    search_keywords: ['crankbait', 'fishing lures', 'bass bait', 'lure set'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 6,
    product_code: 'PRD-226',
    title: 'Portable Fish Finder',
    slug: 'portable-fish-finder',
    sku: 'FF-PORT-ECHO',
    description: 'Compact, handheld fish finder with a color display and sonar technology for easy detection of fish and bottom contours.',
    short_description: 'Color display, handheld, sonar tech.',
    supplier_id: 6,
    product_link: 'https://example.com/product/fish-finder',
    category_id: 5,
    brand: 'EchoDepth',
    tags: ['fishing', 'electronics', 'gadget', 'finder'],

    featured_image: 'https://images.unsplash.com/photo-1629864228965-0b36e9d0d3a5',
    gallery: [],

    weight: 0.35,
    unit: 'kg',

    cost_rmb: 480,
    exchange_rate: 15.3,
    cost_bdt: 7344,
    actual_price: 7344,
    default_price: 12000,
    compare_at_price: 15000,
    price_wholesale: 11000,
    price_retail: 12000,
    price_daraz: 13500,

    name_wholesale: 'EchoDepth Portable FF',
    name_retail: 'EchoDepth Portable Fish Finder',
    name_daraz: 'Portable Sonar Fish Finder Color Screen',

    status: 'active',
    has_variants: false,
    inventory_quantity: 60,
    inventory_policy: 'continue',

    barcode: '9876543210005',
    hs_code: '90148000',

    seo_title: 'Handheld Portable Fish Finder',
    seo_description: 'Locate fish and underwater structure easily with this portable EchoDepth fish finder.',
    search_keywords: ['fish finder', 'sonar', 'echo depth', 'fishing electronics'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 7,
    product_code: 'PRD-227',
    title: 'Folding Fishing Net',
    slug: 'folding-fishing-net-telescopic',
    sku: 'NET-FOLD-L',
    description: 'Large, lightweight aluminum folding landing net with a telescopic handle and rubberized mesh, ideal for catch and release.',
    short_description: 'Telescopic handle, rubber mesh, foldable.',
    supplier_id: 7,
    product_link: 'https://example.com/product/folding-net',
    category_id: 6,
    brand: 'CatchMaster',
    tags: ['fishing', 'net', 'landing', 'accessory'],

    featured_image: 'https://images.unsplash.com/photo-1543886548-5c490a07e9c5',
    gallery: [],

    weight: 0.8,
    unit: 'kg',

    cost_rmb: 90,
    exchange_rate: 15.3,
    cost_bdt: 1377,
    actual_price: 1377,
    default_price: 2800,
    compare_at_price: 3200,
    price_wholesale: 2600,
    price_retail: 2800,
    price_daraz: 3000,

    name_wholesale: 'CatchMaster Folding Net L',
    name_retail: 'Folding Telescopic Landing Net',
    name_daraz: 'Large Rubber Mesh Folding Fishing Net',

    status: 'active',
    has_variants: false,
    inventory_quantity: 90,
    inventory_policy: 'continue',

    barcode: '9876543210006',
    hs_code: '95079000',

    seo_title: 'Telescopic Folding Fishing Landing Net',
    seo_description: 'Safe and convenient folding net for easy catch and release fishing.',
    search_keywords: ['fishing net', 'landing net', 'folding net', 'catchmaster'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 8,
    product_code: 'PRD-228',
    title: 'Waterproof Tackle Box',
    slug: 'waterproof-tackle-box-large',
    sku: 'TB-WP-L',
    description: 'Large, dual-sided waterproof tackle box with adjustable compartments for storing various lures, hooks, and swivels.',
    short_description: 'Dual-sided, adjustable compartments.',
    supplier_id: 8,
    product_link: 'https://example.com/product/tackle-box',
    category_id: 6,
    brand: 'GearGuard',
    tags: ['fishing', 'storage', 'box', 'accessory'],

    featured_image: 'https://images.unsplash.com/photo-1557962777-6f81a17951a8',
    gallery: [],

    weight: 1.1,
    unit: 'kg',

    cost_rmb: 110,
    exchange_rate: 15.3,
    cost_bdt: 1683,
    actual_price: 1683,
    default_price: 3500,
    compare_at_price: 4000,
    price_wholesale: 3200,
    price_retail: 3500,
    price_daraz: 3800,

    name_wholesale: 'GearGuard Tackle Box WP L',
    name_retail: 'Large Waterproof Tackle Box',
    name_daraz: 'Dual-Sided Adjustable Tackle Box',

    status: 'active',
    has_variants: false,
    inventory_quantity: 150,
    inventory_policy: 'continue',

    barcode: '9876543210007',
    hs_code: '42029200',

    seo_title: 'Large Waterproof Fishing Tackle Box',
    seo_description: 'Keep your fishing gear dry and organized with the GearGuard waterproof tackle box.',
    search_keywords: ['tackle box', 'fishing storage', 'waterproof box', 'gearguard'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 9,
    product_code: 'PRD-229',
    title: 'Fishing Pliers and Gripper Set',
    slug: 'fishing-pliers-gripper-set',
    sku: 'TOOL-PLIER-GRIP',
    description: 'Corrosion-resistant aluminum fishing pliers with line cutters and a floating fish gripper. Essential fishing tool set.',
    short_description: 'Aluminum pliers, floating gripper.',
    supplier_id: 9,
    product_link: 'https://example.com/product/pliers-gripper-set',
    category_id: 6,
    brand: 'ToolMaster',
    tags: ['fishing', 'tool', 'pliers', 'gripper'],

    featured_image: 'https://images.unsplash.com/photo-1545624976-9d8b7a77e8a9',
    gallery: [],

    weight: 0.3,
    unit: 'kg',

    cost_rmb: 70,
    exchange_rate: 15.3,
    cost_bdt: 1071,
    actual_price: 1071,
    default_price: 2200,
    compare_at_price: 2500,
    price_wholesale: 2000,
    price_retail: 2200,
    price_daraz: 2400,

    name_wholesale: 'ToolMaster Plier/Gripper Set',
    name_retail: 'Fishing Pliers & Gripper Set',
    name_daraz: 'Aluminum Fishing Pliers and Fish Gripper Tool Set',

    status: 'active',
    has_variants: false,
    inventory_quantity: 180,
    inventory_policy: 'continue',

    barcode: '9876543210008',
    hs_code: '82055900',

    seo_title: 'Fishing Pliers and Fish Gripper Tool Set',
    seo_description: 'A must-have toolset for every angler for unhooking and landing fish safely.',
    search_keywords: ['fishing pliers', 'fish gripper', 'fishing tool', 'line cutter'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 10,
    product_code: 'PRD-230',
    title: 'Sun Protection Fishing Hat',
    slug: 'sun-protection-fishing-hat',
    sku: 'HAT-SUN-WIDE',
    description: 'Wide-brimmed fishing hat with UPF 50+ protection, moisture-wicking band, and adjustable chin strap.',
    short_description: 'UPF 50+, breathable, adjustable.',
    supplier_id: 10,
    product_link: 'https://example.com/product/sun-hat',
    category_id: 7,
    brand: 'OutdoorGuard',
    tags: ['fishing', 'apparel', 'hat', 'sun-protection'],

    featured_image: 'https://images.unsplash.com/photo-1517436447990-8c29b6e9a6e1',
    gallery: [],

    weight: 0.1,
    unit: 'kg',

    cost_rmb: 30,
    exchange_rate: 15.3,
    cost_bdt: 459,
    actual_price: 459,
    default_price: 850,
    compare_at_price: 1000,
    price_wholesale: 750,
    price_retail: 850,
    price_daraz: 950,

    name_wholesale: 'OutdoorGuard Sun Hat (Bulk)',
    name_retail: 'Sun Protection Fishing Hat',
    name_daraz: 'UPF 50+ Wide Brim Fishing Hat',

    status: 'active',
    has_variants: false,
    inventory_quantity: 250,
    inventory_policy: 'continue',

    barcode: '9876543210009',
    hs_code: '65050000',

    seo_title: 'Wide Brim UPF 50+ Fishing Sun Hat',
    seo_description: 'Stay cool and protected from the sun during long fishing trips.',
    search_keywords: ['fishing hat', 'sun hat', 'upf 50+', 'outdoor guard'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 11,
    product_code: 'PRD-231',
    title: 'Saltwater Spinning Reel',
    slug: 'saltwater-spinning-reel-5000',
    sku: 'SRL-SW-5000',
    description: 'Durable, sealed spinning reel designed for saltwater fishing, features a 5.2:1 gear ratio and smooth drag system.',
    short_description: 'Sealed drag, corrosion-resistant, 5000 size.',
    supplier_id: 11,
    product_link: 'https://example.com/product/spinning-reel-5000',
    category_id: 2,
    brand: 'SeaMaster',
    tags: ['fishing', 'reel', 'saltwater', 'spinning'],

    featured_image: 'https://images.unsplash.com/photo-1589140410651-7f99e4f5d8e7',
    gallery: [],

    weight: 0.65,
    unit: 'kg',

    cost_rmb: 320,
    exchange_rate: 15.3,
    cost_bdt: 4896,
    actual_price: 4896,
    default_price: 7500,
    compare_at_price: 8500,
    price_wholesale: 6900,
    price_retail: 7500,
    price_daraz: 8000,

    name_wholesale: 'SeaMaster SW-5000 (Bulk)',
    name_retail: 'SeaMaster Saltwater Spinning Reel',
    name_daraz: 'Durable Saltwater Spinning Fishing Reel 5000',

    status: 'active',
    has_variants: false,
    inventory_quantity: 80,
    inventory_policy: 'continue',

    barcode: '9876543210010',
    hs_code: '95073000',

    seo_title: 'Saltwater Fishing Spinning Reel 5000',
    seo_description: 'Corrosion-resistant reel for heavy-duty saltwater fishing. Smooth and reliable.',
    search_keywords: ['spinning reel', 'saltwater reel', 'sea master', 'fishing gear'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 12,
    product_code: 'PRD-232',
    title: 'Telescopic Freshwater Rod 2.1m',
    slug: 'telescopic-freshwater-rod-2-1m',
    sku: 'ROD-TEL-210',
    description: '2.1 meter telescopic fishing rod, lightweight fiberglass construction, perfect for easy travel and freshwater angling.',
    short_description: 'Portable, fiberglass, 2.1m length.',
    supplier_id: 12,
    product_link: 'https://example.com/product/telescopic-rod',
    category_id: 2,
    brand: 'TravelFish',
    tags: ['fishing', 'rod', 'telescopic', 'freshwater'],

    featured_image: 'https://images.unsplash.com/photo-1549488349-438c6f1406e1',
    gallery: [],

    weight: 0.3,
    unit: 'kg',

    cost_rmb: 60,
    exchange_rate: 15.3,
    cost_bdt: 918,
    actual_price: 918,
    default_price: 1800,
    compare_at_price: 2200,
    price_wholesale: 1600,
    price_retail: 1800,
    price_daraz: 2000,

    name_wholesale: 'TravelFish Rod 2.1m (Bulk)',
    name_retail: 'Telescopic Freshwater Rod',
    name_daraz: '2.1m Portable Telescopic Fishing Rod',

    status: 'active',
    has_variants: false,
    inventory_quantity: 130,
    inventory_policy: 'continue',

    barcode: '9876543210011',
    hs_code: '95071000',

    seo_title: 'Portable Telescopic Fishing Rod 2.1M',
    seo_description: 'Compact and easy to carry telescopic rod for casual freshwater fishing.',
    search_keywords: ['fishing rod', 'telescopic rod', 'travel fish', 'freshwater'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 13,
    product_code: 'PRD-233',
    title: 'Monofilament Line 300m',
    slug: 'monofilament-fishing-line-15lb',
    sku: 'MFL-15LB-300',
    description: '300-meter spool of 15lb clear monofilament fishing line, high knot strength and good abrasion resistance.',
    short_description: '15lb mono, low visibility, 300m.',
    supplier_id: 4,
    product_link: 'https://example.com/product/mono-line',
    category_id: 3,
    brand: 'LineMaster',
    tags: ['fishing', 'line', 'monofilament', 'accessory'],

    featured_image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19',
    gallery: [],

    weight: 0.08,
    unit: 'kg',

    cost_rmb: 25,
    exchange_rate: 15.3,
    cost_bdt: 382.5,
    actual_price: 382.5,
    default_price: 700,
    compare_at_price: 850,
    price_wholesale: 600,
    price_retail: 700,
    price_daraz: 780,

    name_wholesale: 'LineMaster Mono 15LB (Spool)',
    name_retail: 'LineMaster Monofilament 300m',
    name_daraz: '15LB Clear Monofilament Fishing Line',

    status: 'active',
    has_variants: true,
    inventory_quantity: 400,
    inventory_policy: 'continue',

    barcode: '9876543210012',
    hs_code: '54041100',

    seo_title: '15lb Monofilament Fishing Line 300m',
    seo_description: 'Reliable mono line for various fishing applications, high shock absorption.',
    search_keywords: ['fishing line', 'monofilament', '15lb line', 'clear line'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 14,
    product_code: 'PRD-234',
    title: 'Soft Plastic Worm Lure Kit',
    slug: 'soft-plastic-worm-lure-kit-50pc',
    sku: 'LURE-WORM-KIT-50',
    description: '50-piece kit of scented soft plastic fishing worms in assorted colors and sizes, ideal for bass and predator fish.',
    short_description: '50pc scented worms, assorted colors.',
    supplier_id: 5,
    product_link: 'https://example.com/product/worm-lure-kit',
    category_id: 4,
    brand: 'SoftBite',
    tags: ['fishing', 'lure', 'soft-bait', 'kit'],

    featured_image: 'https://images.unsplash.com/photo-1549488349-438c6f1406e1',
    gallery: [],

    weight: 0.2,
    unit: 'kg',

    cost_rmb: 40,
    exchange_rate: 15.3,
    cost_bdt: 612,
    actual_price: 612,
    default_price: 1100,
    compare_at_price: 1400,
    price_wholesale: 1000,
    price_retail: 1100,
    price_daraz: 1250,

    name_wholesale: 'SoftBite Worm Kit 50pc',
    name_retail: '50pc Soft Plastic Worm Kit',
    name_daraz: 'Scented Soft Plastic Fishing Lure Worms 50pcs',

    status: 'active',
    has_variants: false,
    inventory_quantity: 280,
    inventory_policy: 'continue',

    barcode: '9876543210013',
    hs_code: '95079000',

    seo_title: '50pc Scented Soft Plastic Fishing Worm Kit',
    seo_description: 'A complete assortment of soft worms to tempt all types of bass and predator fish.',
    search_keywords: ['fishing worms', 'soft plastic lures', 'bass lures', 'lure kit'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 15,
    product_code: 'PRD-235',
    title: 'Digital Fishing Scale',
    slug: 'digital-fishing-scale-50kg',
    sku: 'SCALE-DIG-50K',
    description: 'High-precision digital hanging scale with a 50kg capacity, features a tape measure and memory function for keeping track of catches.',
    short_description: '50kg capacity, built-in tape, digital display.',
    supplier_id: 6,
    product_link: 'https://example.com/product/digital-scale',
    category_id: 6,
    brand: 'WeighMax',
    tags: ['fishing', 'tool', 'scale', 'digital'],

    featured_image: 'https://images.unsplash.com/photo-1545624976-9d8b7a77e8a9',
    gallery: [],

    weight: 0.15,
    unit: 'kg',

    cost_rmb: 50,
    exchange_rate: 15.3,
    cost_bdt: 765,
    actual_price: 765,
    default_price: 1400,
    compare_at_price: 1600,
    price_wholesale: 1250,
    price_retail: 1400,
    price_daraz: 1550,

    name_wholesale: 'WeighMax Scale 50K',
    name_retail: 'Digital Fishing Scale 50kg',
    name_daraz: '50KG Digital Fish Hanging Scale with Tape Measure',

    status: 'active',
    has_variants: false,
    inventory_quantity: 160,
    inventory_policy: 'continue',

    barcode: '9876543210014',
    hs_code: '84238100',

    seo_title: 'Digital Fishing Scale 50kg with Tape Measure',
    seo_description: 'Accurately weigh and measure your trophy catches with this portable digital scale.',
    search_keywords: ['fishing scale', 'digital scale', '50kg scale', 'weighmax'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 16,
    product_code: 'PRD-236',
    title: 'Polarized Fishing Sunglasses',
    slug: 'polarized-fishing-sunglasses-uv400',
    sku: 'GLASS-POL-UV400',
    description: 'Lightweight, polarized sunglasses with UV400 protection to reduce glare and improve visibility into the water.',
    short_description: 'Polarized lenses, UV400, anti-glare.',
    supplier_id: 13,
    product_link: 'https://example.com/product/fishing-sunglasses',
    category_id: 7,
    brand: 'AquaView',
    tags: ['fishing', 'apparel', 'sunglasses', 'polarized'],

    featured_image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19',
    gallery: [],

    weight: 0.05,
    unit: 'kg',

    cost_rmb: 45,
    exchange_rate: 15.3,
    cost_bdt: 688.5,
    actual_price: 688.5,
    default_price: 1200,
    compare_at_price: 1500,
    price_wholesale: 1100,
    price_retail: 1200,
    price_daraz: 1350,

    name_wholesale: 'AquaView Polarized Glasses',
    name_retail: 'Polarized Fishing Sunglasses',
    name_daraz: 'UV400 Polarized Anti-Glare Fishing Glasses',

    status: 'active',
    has_variants: false,
    inventory_quantity: 300,
    inventory_policy: 'continue',

    barcode: '9876543210015',
    hs_code: '90041000',

    seo_title: 'Polarized Fishing Sunglasses UV400',
    seo_description: 'Essential eye protection for anglers, reducing surface glare for better fish spotting.',
    search_keywords: ['polarized sunglasses', 'fishing glasses', 'uv400', 'aqua view'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 17,
    product_code: 'PRD-237',
    title: 'Fly Fishing Rod and Reel Combo',
    slug: 'fly-fishing-rod-reel-combo-5wt',
    sku: 'FF-COMBO-5WT',
    description: '5-weight fly rod and reel combo, perfect for trout and panfish. Includes rod, reel, line, backing, and leader.',
    short_description: '5WT combo, great for beginners.',
    supplier_id: 14,
    product_link: 'https://example.com/product/fly-combo-5wt',
    category_id: 2,
    brand: 'TroutStream',
    tags: ['fishing', 'fly-fishing', 'rod', 'combo'],

    featured_image: 'https://images.unsplash.com/photo-1549488349-438c6f1406e1',
    gallery: [],

    weight: 1.2,
    unit: 'kg',

    cost_rmb: 700,
    exchange_rate: 15.3,
    cost_bdt: 10710,
    actual_price: 10710,
    default_price: 16000,
    compare_at_price: 19000,
    price_wholesale: 14500,
    price_retail: 16000,
    price_daraz: 17500,

    name_wholesale: 'TroutStream 5WT Combo',
    name_retail: 'Fly Fishing Rod & Reel Combo 5WT',
    name_daraz: '5-Weight Fly Fishing Rod and Reel Starter Kit',

    status: 'active',
    has_variants: false,
    inventory_quantity: 55,
    inventory_policy: 'continue',

    barcode: '9876543210016',
    hs_code: '95071000',

    seo_title: '5WT Fly Fishing Rod and Reel Combo',
    seo_description: 'Everything you need to start fly fishing, a perfect 5-weight setup for beginners.',
    search_keywords: ['fly fishing', 'fly rod', 'fly reel', '5wt combo', 'troutstream'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 18,
    product_code: 'PRD-238',
    title: 'Assorted Swivel and Snap Kit',
    slug: 'assorted-swivel-snap-kit-100pc',
    sku: 'ACC-SWIVEL-100',
    description: '100-piece kit of high-strength fishing swivels and snaps in multiple sizes, brass and stainless steel construction.',
    short_description: '100pc kit, various sizes, heavy-duty.',
    supplier_id: 15,
    product_link: 'https://example.com/product/swivel-snap-kit',
    category_id: 3,
    brand: 'ConnectPro',
    tags: ['fishing', 'terminal', 'swivel', 'accessory'],

    featured_image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    gallery: [],

    weight: 0.1,
    unit: 'kg',

    cost_rmb: 20,
    exchange_rate: 15.3,
    cost_bdt: 306,
    actual_price: 306,
    default_price: 650,
    compare_at_price: 750,
    price_wholesale: 550,
    price_retail: 650,
    price_daraz: 720,

    name_wholesale: 'ConnectPro Swivel Kit',
    name_retail: 'Assorted Swivel & Snap Kit',
    name_daraz: '100pc High-Strength Fishing Swivel and Snap Set',

    status: 'active',
    has_variants: false,
    inventory_quantity: 500,
    inventory_policy: 'continue',

    barcode: '9876543210017',
    hs_code: '73269090',

    seo_title: '100pc Fishing Swivel and Snap Kit',
    seo_description: 'Essential terminal tackle for quick and secure lure changes.',
    search_keywords: ['fishing swivels', 'snaps', 'terminal tackle', 'connect pro'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 19,
    product_code: 'PRD-239',
    title: 'Jig Head Hook Assortment',
    slug: 'jig-head-hook-assortment-100pc',
    sku: 'HOOK-JIG-ASSORT',
    description: '100-piece assortment of lead jig head hooks in various weights and hook sizes for soft plastic lures.',
    short_description: '100pc jig heads, multiple weights/sizes.',
    supplier_id: 16,
    product_link: 'https://example.com/product/jig-head-kit',
    category_id: 3,
    brand: 'HookSet',
    tags: ['fishing', 'terminal', 'hooks', 'jig'],

    featured_image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19',
    gallery: [],

    weight: 0.2,
    unit: 'kg',

    cost_rmb: 30,
    exchange_rate: 15.3,
    cost_bdt: 459,
    actual_price: 459,
    default_price: 850,
    compare_at_price: 1000,
    price_wholesale: 750,
    price_retail: 850,
    price_daraz: 950,

    name_wholesale: 'HookSet Jig Head Assort',
    name_retail: 'Jig Head Hook Assortment',
    name_daraz: '100pc Assorted Fishing Jig Head Hooks',

    status: 'active',
    has_variants: false,
    inventory_quantity: 450,
    inventory_policy: 'continue',

    barcode: '9876543210018',
    hs_code: '95079000',

    seo_title: '100pc Jig Head Hook Assortment for Lures',
    seo_description: 'Versatile set of jig heads for bass, crappie, and panfish fishing.',
    search_keywords: ['jig heads', 'fishing hooks', 'assortment', 'soft bait hooks'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 20,
    product_code: 'PRD-240',
    title: 'Fishing Rod Holder for Boat',
    slug: 'fishing-rod-holder-boat-clamp',
    sku: 'RH-BOAT-CLAMP',
    description: 'Adjustable clamp-on rod holder for boat railings, made from durable, marine-grade nylon and steel.',
    short_description: 'Clamp-on style, 360-degree rotation.',
    supplier_id: 17,
    product_link: 'https://example.com/product/boat-rod-holder',
    category_id: 6,
    brand: 'BoatMate',
    tags: ['fishing', 'boat', 'accessory', 'holder'],

    featured_image: 'https://images.unsplash.com/photo-1629864228965-0b36e9d0d3a5',
    gallery: [],

    weight: 0.5,
    unit: 'kg',

    cost_rmb: 95,
    exchange_rate: 15.3,
    cost_bdt: 1453.5,
    actual_price: 1453.5,
    default_price: 2600,
    compare_at_price: 3000,
    price_wholesale: 2300,
    price_retail: 2600,
    price_daraz: 2900,

    name_wholesale: 'BoatMate Rod Holder Clamp',
    name_retail: 'Boat Clamp-On Rod Holder',
    name_daraz: 'Adjustable Fishing Rod Holder for Boat Railing',

    status: 'active',
    has_variants: false,
    inventory_quantity: 110,
    inventory_policy: 'continue',

    barcode: '9876543210019',
    hs_code: '95079000',

    seo_title: 'Adjustable Clamp-On Fishing Rod Holder for Boats',
    seo_description: 'Securely hold your rod while trolling or anchored with this durable clamp-on holder.',
    search_keywords: ['rod holder', 'boat fishing', 'clamp-on', 'marine accessories'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 21,
    product_code: 'PRD-241',
    title: 'Fishing Vest Multi-Pocket',
    slug: 'fishing-vest-multi-pocket-mesh',
    sku: 'VEST-MESH-XL',
    description: 'Lightweight fishing vest with multiple pockets for tackle storage and a breathable mesh back for comfort.',
    short_description: 'Multi-pocket, breathable mesh, adjustable fit.',
    supplier_id: 18,
    product_link: 'https://example.com/product/fishing-vest',
    category_id: 7,
    brand: 'AnglerWear',
    tags: ['fishing', 'apparel', 'vest', 'clothing'],

    featured_image: 'https://images.unsplash.com/photo-1549488349-438c6f1406e1',
    gallery: [],

    weight: 0.4,
    unit: 'kg',

    cost_rmb: 130,
    exchange_rate: 15.3,
    cost_bdt: 1989,
    actual_price: 1989,
    default_price: 3500,
    compare_at_price: 4200,
    price_wholesale: 3000,
    price_retail: 3500,
    price_daraz: 3800,

    name_wholesale: 'AnglerWear Vest XL',
    name_retail: 'Multi-Pocket Fishing Vest',
    name_daraz: 'Lightweight Breathable Mesh Fishing Vest (XL)',

    status: 'active',
    has_variants: true,
    inventory_quantity: 90,
    inventory_policy: 'continue',

    barcode: '9876543210020',
    hs_code: '62114300',

    seo_title: 'Multi-Pocket Breathable Fishing Vest',
    seo_description: 'Keep your essential tackle close and organized with this comfortable fishing vest.',
    search_keywords: ['fishing vest', 'tackle vest', 'mesh vest', 'angler wear'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 22,
    product_code: 'PRD-242',
    title: 'Heavy Duty Fishing Line Cutter',
    slug: 'heavy-duty-fishing-line-cutter',
    sku: 'TOOL-CUTTER-HD',
    description: 'Tungsten carbide line cutter designed to effortlessly cut braided, fluorocarbon, and monofilament lines.',
    short_description: 'Tungsten carbide, cuts all lines.',
    supplier_id: 9,
    product_link: 'https://example.com/product/line-cutter',
    category_id: 6,
    brand: 'ToolMaster',
    tags: ['fishing', 'tool', 'cutter', 'accessory'],

    featured_image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    gallery: [],

    weight: 0.05,
    unit: 'kg',

    cost_rmb: 20,
    exchange_rate: 15.3,
    cost_bdt: 306,
    actual_price: 306,
    default_price: 550,
    compare_at_price: 650,
    price_wholesale: 450,
    price_retail: 550,
    price_daraz: 620,

    name_wholesale: 'ToolMaster Line Cutter HD',
    name_retail: 'Heavy Duty Fishing Line Cutter',
    name_daraz: 'Tungsten Carbide Braided Line Cutter',

    status: 'active',
    has_variants: false,
    inventory_quantity: 350,
    inventory_policy: 'continue',

    barcode: '9876543210021',
    hs_code: '82033000',

    seo_title: 'Tungsten Carbide Heavy Duty Line Cutter',
    seo_description: 'A sharp, durable tool for all your fishing line cutting needs.',
    search_keywords: ['line cutter', 'braid cutter', 'fishing tool', 'tungsten carbide'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 23,
    product_code: 'PRD-243',
    title: 'Artificial Shrimp Lure Pack',
    slug: 'artificial-shrimp-lure-pack-6pc',
    sku: 'LURE-SHRIMP-6PC',
    description: '6-pack of soft, realistic artificial shrimp lures with internal jig heads, ideal for inshore saltwater fishing.',
    short_description: '6pc realistic shrimp, saltwater.',
    supplier_id: 5,
    product_link: 'https://example.com/product/shrimp-lures',
    category_id: 4,
    brand: 'SaltBite',
    tags: ['fishing', 'lure', 'saltwater', 'shrimp'],

    featured_image: 'https://images.unsplash.com/photo-1549488349-438c6f1406e1',
    gallery: [],

    weight: 0.08,
    unit: 'kg',

    cost_rmb: 30,
    exchange_rate: 15.3,
    cost_bdt: 459,
    actual_price: 459,
    default_price: 900,
    compare_at_price: 1100,
    price_wholesale: 800,
    price_retail: 900,
    price_daraz: 1000,

    name_wholesale: 'SaltBite Shrimp 6pc',
    name_retail: 'Artificial Shrimp Lure 6-Pack',
    name_daraz: '6X Realistic Soft Artificial Shrimp Fishing Lures',

    status: 'active',
    has_variants: false,
    inventory_quantity: 220,
    inventory_policy: 'continue',

    barcode: '9876543210022',
    hs_code: '95079000',

    seo_title: '6-Pack Artificial Shrimp Fishing Lures',
    seo_description: 'Highly effective shrimp imitation lures for catching sea trout and redfish.',
    search_keywords: ['shrimp lures', 'saltwater lures', 'soft bait', 'inshore fishing'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 24,
    product_code: 'PRD-244',
    title: 'Fishing Rod & Reel Carrying Bag',
    slug: 'fishing-rod-reel-carrying-bag',
    sku: 'BAG-ROD-COMBO',
    description: 'Durable canvas carrying bag designed to hold two fishing rods and two reels, with extra pockets for tackle.',
    short_description: 'Holds 2 rods/reels, canvas, tackle pockets.',
    supplier_id: 8,
    product_link: 'https://example.com/product/rod-bag',
    category_id: 6,
    brand: 'GearGuard',
    tags: ['fishing', 'storage', 'bag', 'carry'],

    featured_image: 'https://images.unsplash.com/photo-1543886548-5c490a07e9c5',
    gallery: [],

    weight: 0.7,
    unit: 'kg',

    cost_rmb: 120,
    exchange_rate: 15.3,
    cost_bdt: 1836,
    actual_price: 1836,
    default_price: 3200,
    compare_at_price: 3800,
    price_wholesale: 2900,
    price_retail: 3200,
    price_daraz: 3500,

    name_wholesale: 'GearGuard Rod/Reel Bag',
    name_retail: 'Fishing Rod & Reel Carry Bag',
    name_daraz: 'Durable Canvas Fishing Rod and Reel Storage Bag',

    status: 'active',
    has_variants: false,
    inventory_quantity: 140,
    inventory_policy: 'continue',

    barcode: '9876543210023',
    hs_code: '42029200',

    seo_title: 'Fishing Rod and Reel Carrying Bag for 2 Combos',
    seo_description: 'Protect and transport your fishing gear easily with this durable bag.',
    search_keywords: ['fishing bag', 'rod case', 'reel bag', 'gear guard'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 25,
    product_code: 'PRD-245',
    title: 'Waterproof Fishing Headlamp',
    slug: 'waterproof-fishing-headlamp-led',
    sku: 'LIGHT-HEAD-WP',
    description: 'High-power LED headlamp with multiple brightness modes, rechargeable battery, and IPX5 waterproof rating for night fishing.',
    short_description: 'LED, rechargeable, IPX5 waterproof.',
    supplier_id: 6,
    product_link: 'https://example.com/product/headlamp',
    category_id: 6,
    brand: 'NightCast',
    tags: ['fishing', 'light', 'electronics', 'accessory'],

    featured_image: 'https://images.unsplash.com/photo-1629864228965-0b36e9d0d3a5',
    gallery: [],

    weight: 0.1,
    unit: 'kg',

    cost_rmb: 40,
    exchange_rate: 15.3,
    cost_bdt: 612,
    actual_price: 612,
    default_price: 1100,
    compare_at_price: 1300,
    price_wholesale: 1000,
    price_retail: 1100,
    price_daraz: 1250,

    name_wholesale: 'NightCast Headlamp WP',
    name_retail: 'Waterproof Fishing Headlamp',
    name_daraz: 'Rechargeable LED Waterproof Fishing Headlamp',

    status: 'active',
    has_variants: false,
    inventory_quantity: 200,
    inventory_policy: 'continue',

    barcode: '9876543210024',
    hs_code: '85131000',

    seo_title: 'Rechargeable Waterproof LED Fishing Headlamp',
    seo_description: 'Essential hands-free lighting for rigging and fishing in low-light conditions.',
    search_keywords: ['fishing headlamp', 'waterproof light', 'night fishing', 'led headlamp'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 26,
    product_code: 'PRD-246',
    title: 'Fluorocarbon Leader Line 50m',
    slug: 'fluorocarbon-leader-line-30lb-50m',
    sku: 'FLL-30LB-50M',
    description: '50-meter spool of 30lb 100% fluorocarbon leader line, virtually invisible underwater, high abrasion resistance.',
    short_description: '100% fluoro, 30lb, invisible line.',
    supplier_id: 4,
    product_link: 'https://example.com/product/fluoro-leader',
    category_id: 3,
    brand: 'LineMaster',
    tags: ['fishing', 'line', 'fluorocarbon', 'leader'],

    featured_image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    gallery: [],

    weight: 0.05,
    unit: 'kg',

    cost_rmb: 60,
    exchange_rate: 15.3,
    cost_bdt: 918,
    actual_price: 918,
    default_price: 1800,
    compare_at_price: 2200,
    price_wholesale: 1600,
    price_retail: 1800,
    price_daraz: 2000,

    name_wholesale: 'LineMaster Fluoro 30LB',
    name_retail: 'Fluorocarbon Leader Line 50m',
    name_daraz: '50M 30LB 100% Fluorocarbon Fishing Leader',

    status: 'active',
    has_variants: true,
    inventory_quantity: 250,
    inventory_policy: 'continue',

    barcode: '9876543210025',
    hs_code: '39209990',

    seo_title: '30lb 100% Fluorocarbon Fishing Leader Line',
    seo_description: 'High-quality leader material for stealth and excellent abrasion resistance.',
    search_keywords: ['fluorocarbon leader', 'fishing line', 'invisible line', '30lb fluoro'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 27,
    product_code: 'PRD-247',
    title: 'Fishing Rod Rack (Wall Mount)',
    slug: 'fishing-rod-rack-wall-mount-6',
    sku: 'RACK-WALL-6',
    description: 'Wall-mountable storage rack for holding up to 6 fishing rods horizontally, saving space and keeping rods safe.',
    short_description: 'Wall mount, holds 6 rods, space saver.',
    supplier_id: 17,
    product_link: 'https://example.com/product/rod-rack',
    category_id: 6,
    brand: 'HomeLocker',
    tags: ['fishing', 'storage', 'rack', 'accessory'],

    featured_image: 'https://images.unsplash.com/photo-1557962777-6f81a17951a8',
    gallery: [],

    weight: 0.9,
    unit: 'kg',

    cost_rmb: 80,
    exchange_rate: 15.3,
    cost_bdt: 1224,
    actual_price: 1224,
    default_price: 2400,
    compare_at_price: 2800,
    price_wholesale: 2100,
    price_retail: 2400,
    price_daraz: 2600,

    name_wholesale: 'HomeLocker Rod Rack 6',
    name_retail: 'Wall Mount Fishing Rod Rack',
    name_daraz: '6-Rod Capacity Wall Mount Fishing Rod Storage Rack',

    status: 'active',
    has_variants: false,
    inventory_quantity: 100,
    inventory_policy: 'continue',

    barcode: '9876543210026',
    hs_code: '95079000',

    seo_title: 'Wall Mount Fishing Rod Storage Rack',
    seo_description: 'Organize your fishing rods neatly and safely with this easy-to-install wall rack.',
    search_keywords: ['rod rack', 'fishing rod storage', 'wall mount', 'home locker'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 28,
    product_code: 'PRD-248',
    title: 'Fishing Wading Boots',
    slug: 'fishing-wading-boots-size-10',
    sku: 'BOOT-WADE-10',
    description: 'Durable, quick-drying wading boots with felt outsoles for excellent grip on slippery riverbeds. Size 10.',
    short_description: 'Felt outsole, quick-dry, durable.',
    supplier_id: 18,
    product_link: 'https://example.com/product/wading-boots',
    category_id: 7,
    brand: 'AquaTrek',
    tags: ['fishing', 'apparel', 'wading', 'boots'],

    featured_image: 'https://images.unsplash.com/photo-1543886548-5c490a07e9c5',
    gallery: [],

    weight: 2.5,
    unit: 'kg',

    cost_rmb: 400,
    exchange_rate: 15.3,
    cost_bdt: 6120,
    actual_price: 6120,
    default_price: 9500,
    compare_at_price: 11000,
    price_wholesale: 8800,
    price_retail: 9500,
    price_daraz: 10500,

    name_wholesale: 'AquaTrek Boots Size 10',
    name_retail: 'Fishing Wading Boots Size 10',
    name_daraz: 'Felt Sole Quick-Dry Fishing Wading Boots',

    status: 'active',
    has_variants: true,
    inventory_quantity: 40,
    inventory_policy: 'deny',

    barcode: '9876543210027',
    hs_code: '64039100',

    seo_title: 'Durable Felt Outsole Fishing Wading Boots',
    seo_description: 'Secure and comfortable wading boots for stream and river fishing.',
    search_keywords: ['wading boots', 'fishing boots', 'felt sole', 'aqua trek'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 29,
    product_code: 'PRD-249',
    title: 'Metal Spoon Lure Set (5pc)',
    slug: 'metal-spoon-lure-set-5pc',
    sku: 'LURE-SPOON-5PC',
    description: '5-piece set of polished metal spoon lures in varied colors and weights, excellent for trout, pike, and salmon fishing.',
    short_description: '5pc metal spoons, holographic finish.',
    supplier_id: 5,
    product_link: 'https://example.com/product/spoon-lure-set',
    category_id: 4,
    brand: 'FlashStrike',
    tags: ['fishing', 'lure', 'spoon', 'metal-bait'],

    featured_image: 'https://images.unsplash.com/photo-1549488349-438c6f1406e1',
    gallery: [],

    weight: 0.1,
    unit: 'kg',

    cost_rmb: 25,
    exchange_rate: 15.3,
    cost_bdt: 382.5,
    actual_price: 382.5,
    default_price: 750,
    compare_at_price: 900,
    price_wholesale: 650,
    price_retail: 750,
    price_daraz: 850,

    name_wholesale: 'FlashStrike Spoon 5pc',
    name_retail: 'Metal Spoon Lure Set 5pc',
    name_daraz: '5X Holographic Metal Spoon Fishing Lures',

    status: 'active',
    has_variants: false,
    inventory_quantity: 320,
    inventory_policy: 'continue',

    barcode: '9876543210028',
    hs_code: '95079000',

    seo_title: '5pc Metal Spoon Fishing Lure Set',
    seo_description: 'Highly reflective spoon lures to attract a wide variety of predator fish.',
    search_keywords: ['spoon lures', 'metal lures', 'trout bait', 'flash strike'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 30,
    product_code: 'PRD-250',
    title: 'Automatic Fishing Hook Tier',
    slug: 'automatic-fishing-hook-tier',
    sku: 'TOOL-TIE-AUTO',
    description: 'Battery-powered automatic device for quickly and securely tying fishing hooks to leader lines. Works with various hook sizes.',
    short_description: 'Battery-powered, fast, consistent knotting.',
    supplier_id: 9,
    product_link: 'https://example.com/product/hook-tier',
    category_id: 6,
    brand: 'KnotRight',
    tags: ['fishing', 'tool', 'electric', 'accessory'],

    featured_image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    gallery: [],

    weight: 0.15,
    unit: 'kg',

    cost_rmb: 65,
    exchange_rate: 15.3,
    cost_bdt: 994.5,
    actual_price: 994.5,
    default_price: 1800,
    compare_at_price: 2100,
    price_wholesale: 1600,
    price_retail: 1800,
    price_daraz: 1950,

    name_wholesale: 'KnotRight Hook Tier',
    name_retail: 'Automatic Fishing Hook Tier',
    name_daraz: 'Battery-Powered Automatic Fishing Hook Tying Tool',

    status: 'active',
    has_variants: false,
    inventory_quantity: 170,
    inventory_policy: 'continue',

    barcode: '9876543210029',
    hs_code: '85437090',

    seo_title: 'Automatic Electric Fishing Hook Tying Tool',
    seo_description: 'Tie perfect fishing knots every time, quickly and easily, with this automatic tier.',
    search_keywords: ['hook tier', 'automatic knotter', 'fishing tool', 'knot right'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 31,
    product_code: 'PRD-251',
    title: 'Fish Lip Gripper with Scale',
    slug: 'fish-lip-gripper-scale-25kg',
    sku: 'TOOL-GRIP-25K',
    description: 'Durable aluminum fish lip gripper with a built-in 25kg digital scale for safe and accurate weighing and handling of fish.',
    short_description: 'Aluminum, 25kg digital scale, quick release.',
    supplier_id: 9,
    product_link: 'https://example.com/product/lip-gripper',
    category_id: 6,
    brand: 'ToolMaster',
    tags: ['fishing', 'tool', 'gripper', 'scale'],

    featured_image: 'https://images.unsplash.com/photo-1545624976-9d8b7a77e8a9',
    gallery: [],

    weight: 0.25,
    unit: 'kg',

    cost_rmb: 100,
    exchange_rate: 15.3,
    cost_bdt: 1530,
    actual_price: 1530,
    default_price: 2800,
    compare_at_price: 3200,
    price_wholesale: 2500,
    price_retail: 2800,
    price_daraz: 3100,

    name_wholesale: 'ToolMaster Lip Grip 25K',
    name_retail: 'Fish Lip Gripper with Scale',
    name_daraz: '25KG Digital Scale Fish Lip Gripper Tool',

    status: 'active',
    has_variants: false,
    inventory_quantity: 130,
    inventory_policy: 'continue',

    barcode: '9876543210030',
    hs_code: '82055900',

    seo_title: 'Aluminum Fish Lip Gripper with Digital Scale (25kg)',
    seo_description: 'Handle your catch securely and get an instant weight reading with this essential tool.',
    search_keywords: ['fish gripper', 'lip grip', 'fishing scale', 'tool master'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 32,
    product_code: 'PRD-252',
    title: 'Neoprene Fishing Gloves',
    slug: 'neoprene-fishing-gloves-winter',
    sku: 'GLOVE-NEO-L',
    description: 'Waterproof neoprene fishing gloves with 3 cut-off fingers for dexterity, keeping hands warm and protected in cold weather.',
    short_description: 'Waterproof neoprene, 3 cut fingers, warm.',
    supplier_id: 18,
    product_link: 'https://example.com/product/neoprene-gloves',
    category_id: 7,
    brand: 'ColdCast',
    tags: ['fishing', 'apparel', 'gloves', 'winter'],

    featured_image: 'https://images.unsplash.com/photo-1517436447990-8c29b6e9a6e1',
    gallery: [],

    weight: 0.15,
    unit: 'kg',

    cost_rmb: 50,
    exchange_rate: 15.3,
    cost_bdt: 765,
    actual_price: 765,
    default_price: 1500,
    compare_at_price: 1800,
    price_wholesale: 1350,
    price_retail: 1500,
    price_daraz: 1650,

    name_wholesale: 'ColdCast Neoprene Gloves L',
    name_retail: 'Neoprene Fishing Gloves',
    name_daraz: 'Waterproof Neoprene Winter Fishing Gloves (L)',

    status: 'active',
    has_variants: true,
    inventory_quantity: 160,
    inventory_policy: 'continue',

    barcode: '9876543210031',
    hs_code: '61169900',

    seo_title: 'Waterproof Neoprene Fishing Gloves for Cold Weather',
    seo_description: 'Stay warm and maintain dexterity while fishing in cold or wet conditions.',
    search_keywords: ['fishing gloves', 'neoprene gloves', 'winter fishing', 'coldcast'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 33,
    product_code: 'PRD-253',
    title: 'Portable Fishing Chair with Cooler Bag',
    slug: 'portable-fishing-chair-cooler',
    sku: 'CHAIR-COOLER-PORT',
    description: 'Folding fishing chair with a built-in insulated cooler bag under the seat, ideal for keeping bait or lunch fresh.',
    short_description: 'Folding chair, integrated cooler bag.',
    supplier_id: 10,
    product_link: 'https://example.com/product/fishing-chair-cooler',
    category_id: 6,
    brand: 'OutdoorGuard',
    tags: ['fishing', 'outdoor', 'chair', 'accessory'],

    featured_image: 'https://images.unsplash.com/photo-1557962777-6f81a17951a8',
    gallery: [],

    weight: 3.5,
    unit: 'kg',

    cost_rmb: 180,
    exchange_rate: 15.3,
    cost_bdt: 2754,
    actual_price: 2754,
    default_price: 4800,
    compare_at_price: 5500,
    price_wholesale: 4400,
    price_retail: 4800,
    price_daraz: 5200,

    name_wholesale: 'OutdoorGuard Chair/Cooler',
    name_retail: 'Portable Fishing Chair w/ Cooler',
    name_daraz: 'Folding Fishing Chair with Insulated Cooler Bag',

    status: 'active',
    has_variants: false,
    inventory_quantity: 75,
    inventory_policy: 'continue',

    barcode: '9876543210032',
    hs_code: '94017900',

    seo_title: 'Portable Folding Fishing Chair with Cooler Bag',
    seo_description: 'Comfortable seating and cool storage for your next fishing trip.',
    search_keywords: ['fishing chair', 'folding chair', 'cooler bag', 'outdoor gear'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 34,
    product_code: 'PRD-254',
    title: 'Ceramic Bearing Kit for Baitcasting Reel',
    slug: 'ceramic-bearing-kit-baitcaster',
    sku: 'REEL-BRG-CERAMIC',
    description: 'Upgrade kit of 4 high-precision ceramic ball bearings for a smoother, longer casting experience on baitcasting reels.',
    short_description: '4pc ceramic bearings, low friction.',
    supplier_id: 3,
    product_link: 'https://example.com/product/ceramic-bearings',
    category_id: 2,
    brand: 'ReelTune',
    tags: ['fishing', 'reel', 'upgrade', 'accessory'],

    featured_image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    gallery: [],

    weight: 0.02,
    unit: 'kg',

    cost_rmb: 150,
    exchange_rate: 15.3,
    cost_bdt: 2295,
    actual_price: 2295,
    default_price: 4000,
    compare_at_price: 4500,
    price_wholesale: 3700,
    price_retail: 4000,
    price_daraz: 4300,

    name_wholesale: 'ReelTune Ceramic Bearings',
    name_retail: 'Ceramic Bearing Kit for Baitcaster',
    name_daraz: '4X Ceramic Ball Bearing Kit for Fishing Reels',

    status: 'active',
    has_variants: false,
    inventory_quantity: 110,
    inventory_policy: 'continue',

    barcode: '9876543210033',
    hs_code: '84821000',

    seo_title: 'Ceramic Ball Bearing Upgrade Kit for Baitcasting Reels',
    seo_description: 'Maximize your casting distance and reel performance with ultra-smooth ceramic bearings.',
    search_keywords: ['reel bearings', 'ceramic bearings', 'baitcaster upgrade', 'reel tune'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 35,
    product_code: 'PRD-255',
    title: 'Glow-in-the-Dark Fishing Beads',
    slug: 'glow-in-the-dark-fishing-beads-200pc',
    sku: 'ACC-BEAD-GLOW',
    description: '200-piece pack of soft, round, glow-in-the-dark fishing beads for use as attractors, sinker stops, or lure spacers.',
    short_description: '200pc glow beads, multi-size.',
    supplier_id: 15,
    product_link: 'https://example.com/product/glow-beads',
    category_id: 3,
    brand: 'NightGlow',
    tags: ['fishing', 'terminal', 'beads', 'night-fishing'],

    featured_image: 'https://images.unsplash.com/photo-1549488349-438c6f1406e1',
    gallery: [],

    weight: 0.05,
    unit: 'kg',

    cost_rmb: 15,
    exchange_rate: 15.3,
    cost_bdt: 229.5,
    actual_price: 229.5,
    default_price: 450,
    compare_at_price: 550,
    price_wholesale: 380,
    price_retail: 450,
    price_daraz: 520,

    name_wholesale: 'NightGlow Beads 200pc',
    name_retail: 'Glow-in-the-Dark Fishing Beads',
    name_daraz: '200X Soft Glow Fishing Beads Assortment',

    status: 'active',
    has_variants: false,
    inventory_quantity: 400,
    inventory_policy: 'continue',

    barcode: '9876543210034',
    hs_code: '95079000',

    seo_title: '200pc Glow-in-the-Dark Fishing Beads',
    seo_description: 'Use these glowing beads to attract fish in deep or dark water conditions.',
    search_keywords: ['fishing beads', 'glow in dark', 'terminal tackle', 'night glow'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 36,
    product_code: 'PRD-256',
    title: 'Kayak Fishing Seat with Backrest',
    slug: 'kayak-fishing-seat-padded-backrest',
    sku: 'SEAT-KAYAK-COMF',
    description: 'Padded kayak seat with a high backrest for maximum comfort and support during long fishing sessions.',
    short_description: 'Padded, high backrest, adjustable straps.',
    supplier_id: 10,
    product_link: 'https://example.com/product/kayak-seat',
    category_id: 6,
    brand: 'WaterLounge',
    tags: ['fishing', 'kayak', 'seat', 'accessory'],

    featured_image: 'https://images.unsplash.com/photo-1629864228965-0b36e9d0d3a5',
    gallery: [],

    weight: 1.5,
    unit: 'kg',

    cost_rmb: 250,
    exchange_rate: 15.3,
    cost_bdt: 3825,
    actual_price: 3825,
    default_price: 6500,
    compare_at_price: 7500,
    price_wholesale: 6000,
    price_retail: 6500,
    price_daraz: 7000,

    name_wholesale: 'WaterLounge Kayak Seat',
    name_retail: 'Kayak Fishing Seat w/ Backrest',
    name_daraz: 'Padded Adjustable High Back Kayak Fishing Seat',

    status: 'active',
    has_variants: false,
    inventory_quantity: 60,
    inventory_policy: 'continue',

    barcode: '9876543210035',
    hs_code: '94018000',

    seo_title: 'Padded High Back Kayak Fishing Seat',
    seo_description: 'Upgrade your kayak for all-day comfort with this supportive and adjustable seat.',
    search_keywords: ['kayak seat', 'fishing seat', 'kayak accessory', 'water lounge'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 37,
    product_code: 'PRD-257',
    title: 'Fishing Rod Building Kit',
    slug: 'fishing-rod-building-repair-kit',
    sku: 'KIT-ROD-BUILD',
    description: 'Starter kit for building or repairing fishing rods, includes various guides, epoxy, thread, and cork material.',
    short_description: 'Guides, thread, epoxy, cork grips.',
    supplier_id: 17,
    product_link: 'https://example.com/product/rod-building-kit',
    category_id: 6,
    brand: 'RodCraft',
    tags: ['fishing', 'diy', 'tool', 'rod'],

    featured_image: 'https://images.unsplash.com/photo-1543886548-5c490a07e9c5',
    gallery: [],

    weight: 1.0,
    unit: 'kg',

    cost_rmb: 300,
    exchange_rate: 15.3,
    cost_bdt: 4590,
    actual_price: 4590,
    default_price: 8000,
    compare_at_price: 9500,
    price_wholesale: 7300,
    price_retail: 8000,
    price_daraz: 8800,

    name_wholesale: 'RodCraft Build Kit',
    name_retail: 'Fishing Rod Building Kit',
    name_daraz: 'DIY Fishing Rod Building and Repair Starter Kit',

    status: 'active',
    has_variants: false,
    inventory_quantity: 45,
    inventory_policy: 'continue',

    barcode: '9876543210036',
    hs_code: '95071000',

    seo_title: 'DIY Fishing Rod Building and Repair Kit',
    seo_description: 'All the components needed to start making or repairing your own custom fishing rods.',
    search_keywords: ['rod building', 'rod repair kit', 'fishing guides', 'rod craft'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 38,
    product_code: 'PRD-258',
    title: 'Stainless Steel Treble Hooks (20pc)',
    slug: 'stainless-steel-treble-hooks-20pc-size-4',
    sku: 'HOOK-TREBLE-4-20',
    description: '20-piece pack of size #4, high-carbon stainless steel treble hooks, ultra-sharp and corrosion-resistant for all lures.',
    short_description: 'Size #4, stainless steel, 3X strength.',
    supplier_id: 16,
    product_link: 'https://example.com/product/treble-hooks',
    category_id: 3,
    brand: 'HookSet',
    tags: ['fishing', 'terminal', 'hooks', 'treble'],

    featured_image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    gallery: [],

    weight: 0.05,
    unit: 'kg',

    cost_rmb: 35,
    exchange_rate: 15.3,
    cost_bdt: 535.5,
    actual_price: 535.5,
    default_price: 990,
    compare_at_price: 1200,
    price_wholesale: 850,
    price_retail: 990,
    price_daraz: 1100,

    name_wholesale: 'HookSet Treble #4 (20pc)',
    name_retail: 'Stainless Steel Treble Hooks 20pc',
    name_daraz: '20X High-Carbon Stainless Steel Treble Hooks (#4)',

    status: 'active',
    has_variants: true,
    inventory_quantity: 300,
    inventory_policy: 'continue',

    barcode: '9876543210037',
    hs_code: '95079000',

    seo_title: '20pc Stainless Steel Treble Hooks Size #4',
    seo_description: 'Upgrade your lures with ultra-sharp, strong, and corrosion-resistant treble hooks.',
    search_keywords: ['treble hooks', 'fishing hooks', 'stainless steel', 'lure components'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 39,
    product_code: 'PRD-259',
    title: 'Fishing Lanyard Coiled Tool Holder',
    slug: 'fishing-lanyard-coiled-tool-holder',
    sku: 'ACC-LANYARD-COIL',
    description: 'Coiled tool lanyard with a strong clip, designed to secure pliers, clippers, or keys to your vest or belt.',
    short_description: 'Coiled cord, quick-release clip, 1m extension.',
    supplier_id: 9,
    product_link: 'https://example.com/product/coiled-lanyard',
    category_id: 6,
    brand: 'ToolMaster',
    tags: ['fishing', 'tool', 'accessory', 'lanyard'],

    featured_image: 'https://images.unsplash.com/photo-1545624976-9d8b7a77e8a9',
    gallery: [],

    weight: 0.05,
    unit: 'kg',

    cost_rmb: 10,
    exchange_rate: 15.3,
    cost_bdt: 153,
    actual_price: 153,
    default_price: 350,
    compare_at_price: 450,
    price_wholesale: 300,
    price_retail: 350,
    price_daraz: 400,

    name_wholesale: 'ToolMaster Coiled Lanyard',
    name_retail: 'Fishing Lanyard Tool Holder',
    name_daraz: 'Coiled Fishing Tool Lanyard with Safety Clip',

    status: 'active',
    has_variants: false,
    inventory_quantity: 500,
    inventory_policy: 'continue',

    barcode: '9876543210038',
    hs_code: '58081000',

    seo_title: 'Coiled Fishing Lanyard Tool Holder',
    seo_description: 'Never lose your essential fishing tools with this high-strength coiled lanyard.',
    search_keywords: ['fishing lanyard', 'coiled cord', 'tool holder', 'accessory'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 40,
    product_code: 'PRD-260',
    title: 'Floating Fishing Key Chain',
    slug: 'floating-fishing-key-chain-cork',
    sku: 'ACC-KEY-FLOAT',
    description: 'Cork-based floating key chain to prevent loss of keys or other small, lightweight items in the water.',
    short_description: 'Cork base, keeps keys afloat.',
    supplier_id: 15,
    product_link: 'https://example.com/product/floating-keychain',
    category_id: 6,
    brand: 'WaterLounge',
    tags: ['fishing', 'accessory', 'keychain', 'float'],

    featured_image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19',
    gallery: [],

    weight: 0.01,
    unit: 'kg',

    cost_rmb: 5,
    exchange_rate: 15.3,
    cost_bdt: 76.5,
    actual_price: 76.5,
    default_price: 180,
    compare_at_price: 250,
    price_wholesale: 150,
    price_retail: 180,
    price_daraz: 200,

    name_wholesale: 'WaterLounge Float Key (Bulk)',
    name_retail: 'Floating Fishing Key Chain',
    name_daraz: 'Cork Floating Key Chain for Fishing/Boating',

    status: 'active',
    has_variants: false,
    inventory_quantity: 600,
    inventory_policy: 'continue',

    barcode: '9876543210039',
    hs_code: '39269099',

    seo_title: 'Cork Floating Fishing Key Chain',
    seo_description: 'A simple yet essential accessory to protect your keys from sinking.',
    search_keywords: ['floating keychain', 'cork key float', 'fishing accessory', 'water lounge'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 41,
    product_code: 'PRD-261',
    title: 'Live Bait Bucket with Aerator',
    slug: 'live-bait-bucket-aerator-10l',
    sku: 'BAIT-BUCKET-AER',
    description: '10-liter live bait bucket with a battery-powered aerator to keep minnows, shrimp, or worms alive and fresh.',
    short_description: '10L capacity, built-in aerator.',
    supplier_id: 10,
    product_link: 'https://example.com/product/bait-bucket',
    category_id: 6,
    brand: 'BaitKeeper',
    tags: ['fishing', 'bait', 'storage', 'live-bait'],

    featured_image: 'https://images.unsplash.com/photo-1543886548-5c490a07e9c5',
    gallery: [],

    weight: 1.8,
    unit: 'kg',

    cost_rmb: 150,
    exchange_rate: 15.3,
    cost_bdt: 2295,
    actual_price: 2295,
    default_price: 4200,
    compare_at_price: 4800,
    price_wholesale: 3800,
    price_retail: 4200,
    price_daraz: 4500,

    name_wholesale: 'BaitKeeper Bucket w/Aer',
    name_retail: 'Live Bait Bucket with Aerator',
    name_daraz: '10L Live Bait Bucket with Battery-Powered Aerator',

    status: 'active',
    has_variants: false,
    inventory_quantity: 80,
    inventory_policy: 'continue',

    barcode: '9876543210040',
    hs_code: '39249000',

    seo_title: 'Live Bait Bucket with Aerator 10L',
    seo_description: 'Keep your live bait healthy and active for a longer, more successful fishing trip.',
    search_keywords: ['bait bucket', 'live bait', 'aerator', 'fishing accessory'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 42,
    product_code: 'PRD-262',
    title: 'Spinning Rod & Reel Combo (Beginner)',
    slug: 'spinning-rod-reel-combo-beginner',
    sku: 'COMBO-SPIN-BGN',
    description: 'Entry-level 6.5ft spinning rod and reel combo, pre-spooled with monofilament line, perfect for beginners.',
    short_description: '6.5ft rod, pre-spooled, beginner friendly.',
    supplier_id: 12,
    product_link: 'https://example.com/product/spinning-combo-bgn',
    category_id: 2,
    brand: 'TravelFish',
    tags: ['fishing', 'rod', 'reel', 'combo', 'beginner'],

    featured_image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19',
    gallery: [],

    weight: 1.0,
    unit: 'kg',

    cost_rmb: 180,
    exchange_rate: 15.3,
    cost_bdt: 2754,
    actual_price: 2754,
    default_price: 4500,
    compare_at_price: 5000,
    price_wholesale: 4000,
    price_retail: 4500,
    price_daraz: 4800,

    name_wholesale: 'TravelFish Spin Combo BGN',
    name_retail: 'Beginner Spinning Combo',
    name_daraz: '6.5ft Spinning Fishing Rod and Reel Combo for Beginners',

    status: 'active',
    has_variants: false,
    inventory_quantity: 150,
    inventory_policy: 'continue',

    barcode: '9876543210041',
    hs_code: '95071000',

    seo_title: 'Beginner Spinning Fishing Rod and Reel Combo',
    seo_description: 'An affordable and reliable combo to get started with freshwater spinning fishing.',
    search_keywords: ['spinning combo', 'beginner fishing rod', 'rod and reel set', 'travel fish'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 43,
    product_code: 'PRD-263',
    title: 'Biodegradable Fishing Lures (6pc)',
    slug: 'biodegradable-fishing-lures-6pc',
    sku: 'LURE-BIO-6PC',
    description: '6-pack of eco-friendly, biodegradable soft plastic swimbaits, scented for maximum attraction.',
    short_description: '6pc eco-friendly swimbaits, scented.',
    supplier_id: 5,
    product_link: 'https://example.com/product/bio-lures',
    category_id: 4,
    brand: 'EcoLure',
    tags: ['fishing', 'lure', 'eco-friendly', 'soft-bait'],

    featured_image: 'https://images.unsplash.com/photo-1549488349-438c6f1406e1',
    gallery: [],

    weight: 0.05,
    unit: 'kg',

    cost_rmb: 30,
    exchange_rate: 15.3,
    cost_bdt: 459,
    actual_price: 459,
    default_price: 850,
    compare_at_price: 1000,
    price_wholesale: 750,
    price_retail: 850,
    price_daraz: 950,

    name_wholesale: 'EcoLure Swimbait 6pc',
    name_retail: 'Biodegradable Fishing Lures 6pc',
    name_daraz: '6X Eco-Friendly Scented Soft Fishing Lures',

    status: 'active',
    has_variants: false,
    inventory_quantity: 280,
    inventory_policy: 'continue',

    barcode: '9876543210042',
    hs_code: '95079000',

    seo_title: '6pc Biodegradable Scented Fishing Lures',
    seo_description: 'Fish responsibly with these effective and eco-conscious soft plastic lures.',
    search_keywords: ['biodegradable lures', 'eco fishing', 'soft swimbaits', 'eco lure'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 44,
    product_code: 'PRD-264',
    title: 'Fishing Rod Tip Repair Kit',
    slug: 'fishing-rod-tip-repair-kit',
    sku: 'TOOL-TIP-REPAIR',
    description: 'Quick-fix kit for broken rod tips, includes assorted tip guides, heat-activated glue sticks, and a mini alcohol burner.',
    short_description: 'Assorted tips, glue, burner, fast repair.',
    supplier_id: 17,
    product_link: 'https://example.com/product/tip-repair-kit',
    category_id: 6,
    brand: 'RodCraft',
    tags: ['fishing', 'diy', 'tool', 'repair'],

    featured_image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    gallery: [],

    weight: 0.1,
    unit: 'kg',

    cost_rmb: 40,
    exchange_rate: 15.3,
    cost_bdt: 612,
    actual_price: 612,
    default_price: 1200,
    compare_at_price: 1500,
    price_wholesale: 1000,
    price_retail: 1200,
    price_daraz: 1350,

    name_wholesale: 'RodCraft Tip Repair Kit',
    name_retail: 'Fishing Rod Tip Repair Kit',
    name_daraz: 'Quick-Fix Fishing Rod Tip Replacement and Repair Kit',

    status: 'active',
    has_variants: false,
    inventory_quantity: 180,
    inventory_policy: 'continue',

    barcode: '9876543210043',
    hs_code: '95079000',

    seo_title: 'Fishing Rod Tip Repair Kit (Quick-Fix)',
    seo_description: 'Repair broken rod tips quickly and easily, getting you back to fishing faster.',
    search_keywords: ['rod tip repair', 'fishing repair kit', 'rod guides', 'diy fishing'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 45,
    product_code: 'PRD-265',
    title: 'Insulated Fishing Cooler Bag',
    slug: 'insulated-fishing-cooler-bag-20l',
    sku: 'BAG-COOLER-20L',
    description: '20-liter insulated, leak-proof cooler bag with shoulder strap, perfect for keeping drinks, snacks, or your catch cold.',
    short_description: '20L capacity, leak-proof, keeps ice for 24h.',
    supplier_id: 8,
    product_link: 'https://example.com/product/cooler-bag-20l',
    category_id: 6,
    brand: 'GearGuard',
    tags: ['fishing', 'storage', 'cooler', 'accessory'],

    featured_image: 'https://images.unsplash.com/photo-1543886548-5c490a07e9c5',
    gallery: [],

    weight: 1.2,
    unit: 'kg',

    cost_rmb: 160,
    exchange_rate: 15.3,
    cost_bdt: 2448,
    actual_price: 2448,
    default_price: 4000,
    compare_at_price: 4800,
    price_wholesale: 3600,
    price_retail: 4000,
    price_daraz: 4400,

    name_wholesale: 'GearGuard Cooler Bag 20L',
    name_retail: '20L Insulated Fishing Cooler Bag',
    name_daraz: 'Leak-Proof Insulated Soft Cooler Bag for Fishing',

    status: 'active',
    has_variants: false,
    inventory_quantity: 90,
    inventory_policy: 'continue',

    barcode: '9876543210044',
    hs_code: '42029200',

    seo_title: '20L Insulated Soft Cooler Bag for Fishing',
    seo_description: 'A reliable, portable cooler to keep provisions or catch fresh on the water.',
    search_keywords: ['fishing cooler', 'cooler bag', 'soft cooler', '20l cooler'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 46,
    product_code: 'PRD-266',
    title: 'T-Shirt Quick Dry UPF 30+',
    slug: 't-shirt-quick-dry-upf30-m',
    sku: 'TSHIRT-DRY-M-BLU',
    description: 'Lightweight, quick-drying fishing T-shirt with UPF 30+ sun protection, moisture-wicking fabric. Available in various sizes/colors.',
    short_description: 'Quick-dry, UPF 30+, moisture-wicking.',
    supplier_id: 18,
    product_link: 'https://example.com/product/upf-tshirt',
    category_id: 7,
    brand: 'AnglerWear',
    tags: ['fishing', 'apparel', 't-shirt', 'sun-protection'],

    featured_image: 'https://images.unsplash.com/photo-1517436447990-8c29b6e9a6e1',
    gallery: [],

    weight: 0.2,
    unit: 'kg',

    cost_rmb: 70,
    exchange_rate: 15.3,
    cost_bdt: 1071,
    actual_price: 1071,
    default_price: 1900,
    compare_at_price: 2200,
    price_wholesale: 1700,
    price_retail: 1900,
    price_daraz: 2100,

    name_wholesale: 'AnglerWear T-Shirt M',
    name_retail: 'Quick Dry UPF 30+ T-Shirt',
    name_daraz: 'Quick Dry UPF 30+ UV Protection Fishing T-Shirt',

    status: 'active',
    has_variants: true,
    inventory_quantity: 200,
    inventory_policy: 'continue',

    barcode: '9876543210045',
    hs_code: '61099090',

    seo_title: 'Quick Dry UPF 30+ Fishing T-Shirt',
    seo_description: 'Stay cool, dry, and protected from the sun with this performance fishing shirt.',
    search_keywords: ['fishing shirt', 'upf clothing', 'quick dry t-shirt', 'uv protection'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 47,
    product_code: 'PRD-267',
    title: 'Fishing Rod Belt Holder',
    slug: 'fishing-rod-belt-holder-waist-strap',
    sku: 'HOLDER-BELT-WAIST',
    description: 'Adjustable waist belt with a foam cup rod holder, providing a comfortable rest and support for heavy fighting.',
    short_description: 'Adjustable belt, foam rod cup, hands-free.',
    supplier_id: 17,
    product_link: 'https://example.com/product/rod-belt-holder',
    category_id: 6,
    brand: 'BoatMate',
    tags: ['fishing', 'accessory', 'tool', 'holder'],

    featured_image: 'https://images.unsplash.com/photo-1629864228965-0b36e9d0d3a5',
    gallery: [],

    weight: 0.3,
    unit: 'kg',

    cost_rmb: 50,
    exchange_rate: 15.3,
    cost_bdt: 765,
    actual_price: 765,
    default_price: 1400,
    compare_at_price: 1700,
    price_wholesale: 1250,
    price_retail: 1400,
    price_daraz: 1550,

    name_wholesale: 'BoatMate Rod Belt Holder',
    name_retail: 'Fishing Rod Belt Holder',
    name_daraz: 'Adjustable Waist Belt Fishing Rod Holder/Fighting Belt',

    status: 'active',
    has_variants: false,
    inventory_quantity: 160,
    inventory_policy: 'continue',

    barcode: '9876543210046',
    hs_code: '95079000',

    seo_title: 'Adjustable Fishing Rod Belt Holder',
    seo_description: 'Provides relief and stability when fighting big fish, a must-have for heavy tackle.',
    search_keywords: ['rod belt', 'fishing holder', 'fighting belt', 'waist holder'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 48,
    product_code: 'PRD-268',
    title: 'Soft Shell Crab Lure (3pc)',
    slug: 'soft-shell-crab-lure-3pc',
    sku: 'LURE-CRAB-SOFT-3',
    description: '3-pack of realistic soft shell crab lures with embedded hooks, highly effective for flounder and redfish.',
    short_description: '3pc realistic crab, scented, saltwater.',
    supplier_id: 5,
    product_link: 'https://example.com/product/crab-lures',
    category_id: 4,
    brand: 'SaltBite',
    tags: ['fishing', 'lure', 'soft-bait', 'crab'],

    featured_image: 'https://images.unsplash.com/photo-1549488349-438c6f1406e1',
    gallery: [],

    weight: 0.08,
    unit: 'kg',

    cost_rmb: 40,
    exchange_rate: 15.3,
    cost_bdt: 612,
    actual_price: 612,
    default_price: 1100,
    compare_at_price: 1300,
    price_wholesale: 1000,
    price_retail: 1100,
    price_daraz: 1250,

    name_wholesale: 'SaltBite Crab Lure 3pc',
    name_retail: 'Soft Shell Crab Lure 3-Pack',
    name_daraz: '3X Realistic Soft Shell Crab Fishing Lures',

    status: 'active',
    has_variants: false,
    inventory_quantity: 210,
    inventory_policy: 'continue',

    barcode: '9876543210047',
    hs_code: '95079000',

    seo_title: '3-Pack Soft Shell Crab Fishing Lures',
    seo_description: 'Mimic natural crab movement for excellent results with flounder and other bottom feeders.',
    search_keywords: ['crab lures', 'soft bait', 'flounder lure', 'saltwater fishing'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 49,
    product_code: 'PRD-269',
    title: 'Trolling Reel Heavy Duty',
    slug: 'trolling-reel-heavy-duty-50w',
    sku: 'TRL-HD-50W',
    description: 'Heavy-duty trolling reel for offshore fishing, featuring a large line capacity, high retrieve power, and lever drag system.',
    short_description: 'Lever drag, high capacity, offshore trolling.',
    supplier_id: 11,
    product_link: 'https://example.com/product/trolling-reel',
    category_id: 2,
    brand: 'SeaMaster',
    tags: ['fishing', 'reel', 'trolling', 'offshore'],

    featured_image: 'https://images.unsplash.com/photo-1589140410651-7f99e4f5d8e7',
    gallery: [],

    weight: 1.5,
    unit: 'kg',

    cost_rmb: 950,
    exchange_rate: 15.3,
    cost_bdt: 14535,
    actual_price: 14535,
    default_price: 22000,
    compare_at_price: 25000,
    price_wholesale: 20000,
    price_retail: 22000,
    price_daraz: 24000,

    name_wholesale: 'SeaMaster Trolling 50W',
    name_retail: 'Heavy Duty Trolling Reel',
    name_daraz: 'SeaMaster Heavy-Duty Offshore Trolling Reel 50W',

    status: 'active',
    has_variants: false,
    inventory_quantity: 35,
    inventory_policy: 'deny',

    barcode: '9876543210048',
    hs_code: '95073000',

    seo_title: 'Heavy-Duty Offshore Trolling Fishing Reel',
    seo_description: 'Engineered for battling large pelagic fish in deep-sea trolling operations.',
    search_keywords: ['trolling reel', 'offshore fishing', 'lever drag', 'heavy duty reel'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 50,
    product_code: 'PRD-270',
    title: 'Fishing Wader Repair Kit',
    slug: 'fishing-wader-repair-kit-glue-patch',
    sku: 'KIT-WADER-REPAIR',
    description: 'Essential kit for quick wader repairs, includes flexible waterproof glue, a selection of patches, and an applicator brush.',
    short_description: 'Waterproof glue, assorted patches.',
    supplier_id: 17,
    product_link: 'https://example.com/product/wader-repair-kit',
    category_id: 7,
    brand: 'AquaTrek',
    tags: ['fishing', 'apparel', 'repair', 'diy'],

    featured_image: 'https://images.unsplash.com/photo-1517436447990-8c29b6e9a6e1',
    gallery: [],

    weight: 0.1,
    unit: 'kg',

    cost_rmb: 30,
    exchange_rate: 15.3,
    cost_bdt: 459,
    actual_price: 459,
    default_price: 800,
    compare_at_price: 950,
    price_wholesale: 700,
    price_retail: 800,
    price_daraz: 900,

    name_wholesale: 'AquaTrek Wader Repair',
    name_retail: 'Fishing Wader Repair Kit',
    name_daraz: 'Waterproof Glue and Patch Fishing Wader Repair Kit',

    status: 'active',
    has_variants: false,
    inventory_quantity: 150,
    inventory_policy: 'continue',

    barcode: '9876543210049',
    hs_code: '35069100',

    seo_title: 'Quick-Fix Fishing Wader Repair Kit',
    seo_description: 'Fix holes and leaks in your fishing waders quickly and reliably.',
    search_keywords: ['wader repair', 'fishing glue', 'patch kit', 'aqua trek'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 51,
    product_code: 'PRD-271',
    title: 'Fishing Alarm and Bite Indicator Set (3pc)',
    slug: 'fishing-alarm-bite-indicator-set-3pc',
    sku: 'ALARM-BITE-SET-3',
    description: 'Set of 3 wireless electronic fishing bite alarms and a receiver, with adjustable volume, tone, and sensitivity for carp fishing.',
    short_description: '3 alarms, wireless receiver, adjustable settings.',
    supplier_id: 6,
    product_link: 'https://example.com/product/bite-alarm-set',
    category_id: 5,
    brand: 'NightCast',
    tags: ['fishing', 'electronics', 'alarm', 'carp'],

    featured_image: 'https://images.unsplash.com/photo-1629864228965-0b36e9d0d3a5',
    gallery: [],

    weight: 0.8,
    unit: 'kg',

    cost_rmb: 550,
    exchange_rate: 15.3,
    cost_bdt: 8415,
    actual_price: 8415,
    default_price: 13500,
    compare_at_price: 15000,
    price_wholesale: 12000,
    price_retail: 13500,
    price_daraz: 14800,

    name_wholesale: 'NightCast Alarm Set 3',
    name_retail: '3pc Fishing Alarm & Receiver Set',
    name_daraz: 'Wireless Electronic Fishing Bite Alarm and Indicator Set (3+1)',

    status: 'active',
    has_variants: false,
    inventory_quantity: 40,
    inventory_policy: 'continue',

    barcode: '9876543210050',
    hs_code: '85311000',

    seo_title: '3pc Wireless Electronic Fishing Bite Alarm Set',
    seo_description: 'Never miss a bite with this reliable, long-range wireless bite alarm system.',
    search_keywords: ['fishing alarm', 'bite indicator', 'carp fishing', 'wireless alarm'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 52,
    product_code: 'PRD-272',
    title: 'Saltwater Popping Cork (3pc)',
    slug: 'saltwater-popping-cork-3pc',
    sku: 'ACC-CORK-POP-3',
    description: '3-pack of high-visibility saltwater popping corks for live bait fishing, designed to create a loud "pop" sound to attract fish.',
    short_description: '3pc popping corks, high visibility.',
    supplier_id: 15,
    product_link: 'https://example.com/product/popping-cork',
    category_id: 3,
    brand: 'SaltBite',
    tags: ['fishing', 'terminal', 'float', 'saltwater'],

    featured_image: 'https://images.unsplash.com/photo-1549488349-438c6f1406e1',
    gallery: [],

    weight: 0.1,
    unit: 'kg',

    cost_rmb: 20,
    exchange_rate: 15.3,
    cost_bdt: 306,
    actual_price: 306,
    default_price: 600,
    compare_at_price: 750,
    price_wholesale: 500,
    price_retail: 600,
    price_daraz: 680,

    name_wholesale: 'SaltBite Popping Cork 3pc',
    name_retail: 'Saltwater Popping Cork 3-Pack',
    name_daraz: '3X High-Visibility Saltwater Fishing Popping Corks',

    status: 'active',
    has_variants: false,
    inventory_quantity: 350,
    inventory_policy: 'continue',

    barcode: '9876543210051',
    hs_code: '95079000',

    seo_title: '3pc Saltwater Popping Corks for Live Bait',
    seo_description: 'Create noise and disturbance to bring redfish and trout to your live bait.',
    search_keywords: ['popping cork', 'saltwater float', 'fishing terminal tackle', 'redfish'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 53,
    product_code: 'PRD-273',
    title: 'Telescopic Bait Spoon',
    slug: 'telescopic-bait-spoon-long-reach',
    sku: 'TOOL-BAIT-SPOON',
    description: 'Long-reach telescopic bait spoon, extends up to 1.5 meters, ideal for scooping ground bait into inaccessible spots.',
    short_description: '1.5m extension, lightweight aluminum.',
    supplier_id: 9,
    product_link: 'https://example.com/product/bait-spoon',
    category_id: 6,
    brand: 'KnotRight',
    tags: ['fishing', 'tool', 'bait', 'accessory'],

    featured_image: 'https://images.unsplash.com/photo-1545624976-9d8b7a77e8a9',
    gallery: [],

    weight: 0.3,
    unit: 'kg',

    cost_rmb: 75,
    exchange_rate: 15.3,
    cost_bdt: 1147.5,
    actual_price: 1147.5,
    default_price: 2100,
    compare_at_price: 2500,
    price_wholesale: 1900,
    price_retail: 2100,
    price_daraz: 2300,

    name_wholesale: 'KnotRight Bait Spoon',
    name_retail: 'Telescopic Bait Spoon',
    name_daraz: '1.5M Telescopic Fishing Bait Scooping Spoon Tool',

    status: 'active',
    has_variants: false,
    inventory_quantity: 120,
    inventory_policy: 'continue',

    barcode: '9876543210052',
    hs_code: '82055900',

    seo_title: 'Telescopic Long-Reach Fishing Bait Spoon',
    seo_description: 'An essential tool for accurate bait delivery to your fishing spot.',
    search_keywords: ['bait spoon', 'fishing tool', 'telescopic spoon', 'ground bait'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 54,
    product_code: 'PRD-274',
    title: 'Fishing Rod Protection Sleeve (5pc)',
    slug: 'fishing-rod-protection-sleeve-5pc',
    sku: 'ACC-SLEEVE-5',
    description: '5-pack of braided mesh rod sleeves to protect rod guides and tips from damage during transport and storage.',
    short_description: '5pc mesh sleeves, tangle prevention.',
    supplier_id: 8,
    product_link: 'https://example.com/product/rod-sleeves',
    category_id: 6,
    brand: 'GearGuard',
    tags: ['fishing', 'storage', 'accessory', 'rod'],

    featured_image: 'https://images.unsplash.com/photo-1543886548-5c490a07e9c5',
    gallery: [],

    weight: 0.2,
    unit: 'kg',

    cost_rmb: 60,
    exchange_rate: 15.3,
    cost_bdt: 918,
    actual_price: 918,
    default_price: 1600,
    compare_at_price: 1900,
    price_wholesale: 1400,
    price_retail: 1600,
    price_daraz: 1800,

    name_wholesale: 'GearGuard Rod Sleeve 5pc',
    name_retail: 'Fishing Rod Protection Sleeve 5pc',
    name_daraz: '5X Braided Mesh Fishing Rod Protection Sleeve',

    status: 'active',
    has_variants: false,
    inventory_quantity: 180,
    inventory_policy: 'continue',

    barcode: '9876543210053',
    hs_code: '56081900',

    seo_title: '5pc Braided Mesh Fishing Rod Protection Sleeves',
    seo_description: 'Prevent rod and line tangles while protecting guides during storage and travel.',
    search_keywords: ['rod sleeve', 'rod protection', 'tangle guard', 'fishing storage'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 55,
    product_code: 'PRD-275',
    title: 'Fishing Bait Slicer/Chopper',
    slug: 'fishing-bait-slicer-chopper-tool',
    sku: 'TOOL-BAIT-CHOP',
    description: 'Manual tool for quickly slicing and chopping baitfish or boilies into fine pieces for ground bait mix.',
    short_description: 'Sharp blades, easy to clean.',
    supplier_id: 9,
    product_link: 'https://example.com/product/bait-chopper',
    category_id: 6,
    brand: 'ToolMaster',
    tags: ['fishing', 'tool', 'bait', 'accessory'],

    featured_image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    gallery: [],

    weight: 0.25,
    unit: 'kg',

    cost_rmb: 40,
    exchange_rate: 15.3,
    cost_bdt: 612,
    actual_price: 612,
    default_price: 1100,
    compare_at_price: 1300,
    price_wholesale: 1000,
    price_retail: 1100,
    price_daraz: 1250,

    name_wholesale: 'ToolMaster Bait Chopper',
    name_retail: 'Fishing Bait Slicer/Chopper',
    name_daraz: 'Manual Bait Chopper Tool for Fishing Ground Bait',

    status: 'active',
    has_variants: false,
    inventory_quantity: 160,
    inventory_policy: 'continue',

    barcode: '9876543210054',
    hs_code: '82055900',

    seo_title: 'Manual Fishing Bait Slicer and Chopper Tool',
    seo_description: 'Prepare your ground bait mix efficiently with this manual chopping tool.',
    search_keywords: ['bait chopper', 'bait slicer', 'fishing tool', 'ground bait'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  },
  {
    id: 56,
    product_code: 'PRD-276',
    title: 'All-Terrain Folding Fishing Cart',
    slug: 'all-terrain-folding-fishing-cart',
    sku: 'CART-FOLD-AT',
    description: 'Heavy-duty folding cart with large, all-terrain wheels, designed to transport rods, tackle, and cooler across sand or rough terrain.',
    short_description: 'Folding, all-terrain wheels, heavy-duty.',
    supplier_id: 10,
    product_link: 'https://example.com/product/fishing-cart',
    category_id: 6,
    brand: 'OutdoorGuard',
    tags: ['fishing', 'outdoor', 'accessory', 'cart'],

    featured_image: 'https://images.unsplash.com/photo-1557962777-6f81a17951a8',
    gallery: [],

    weight: 8.5,
    unit: 'kg',

    cost_rmb: 500,
    exchange_rate: 15.3,
    cost_bdt: 7650,
    actual_price: 7650,
    default_price: 13000,
    compare_at_price: 15000,
    price_wholesale: 11800,
    price_retail: 13000,
    price_daraz: 14200,

    name_wholesale: 'OutdoorGuard All-Terrain Cart',
    name_retail: 'All-Terrain Folding Fishing Cart',
    name_daraz: 'Heavy-Duty Folding All-Terrain Fishing Beach Cart',

    status: 'active',
    has_variants: false,
    inventory_quantity: 40,
    inventory_policy: 'deny',

    barcode: '9876543210055',
    hs_code: '87168000',

    seo_title: 'All-Terrain Folding Fishing Cart for Beach and Sand',
    seo_description: 'Effortlessly transport all your fishing gear across any terrain with this sturdy folding cart.',
    search_keywords: ['fishing cart', 'beach cart', 'folding cart', 'all terrain'],

    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-27T00:00:00Z'
  }
];