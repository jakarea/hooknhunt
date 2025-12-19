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
  }
];

export const categories = [
  { id: 1, name: 'Electronics', slug: 'electronics' },
  { id: 2, name: 'Fishing Rods', slug: 'fishing-rods' },
  { id: 3, name: 'Fishing Line', slug: 'fishing-line' },
  { id: 4, name: 'Fishing Lures', slug: 'fishing-lures' },
  { id: 5, name: 'Fish Finders', slug: 'fish-finders' },
  { id: 6, name: 'Fishing Accessories', slug: 'fishing-accessories' },
  { id: 7, name: 'Fishing Apparel', slug: 'fishing-apparel' },
];