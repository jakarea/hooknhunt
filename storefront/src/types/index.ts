// types.ts

// ✅ Customer Profile (from customer_profiles table)
export interface CustomerProfile {
  dob?: string;
  gender?: string;
  whatsapp_number?: string;
  preferred_language?: string;
  preferred_currency?: string;
  loyalty_tier?: string;
  loyalty_points?: number;
  total_orders?: number;
  total_spent?: number;
  avg_order_value?: number;
}

// ✅ User
export interface User {
  id: number;
  name: string;
  email?: string;
  phone_number: string; // Updated to match API response
  role?: string;
  customer_profile?: CustomerProfile | null;
  address?: string;
  city?: string;
  district?: string;
  email_verified_at?: string;
  phone_verified_at?: string;
  created_at: string;
  updated_at: string;
}

// ✅ Address (from addresses table)
export interface Address {
  id: number;
  user_id: number;
  label?: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  area?: string;
  type?: 'shipping' | 'billing'; // Derived from is_shipping_address/is_billing_address
  city: string;
  district?: string;
  post_code?: string;
  division?: string;
  country?: string;
  is_default: boolean;
  is_billing_address: boolean;
  is_shipping_address: boolean;
  created_at: string;
  updated_at: string;
}

// ✅ Simplified Product for Cart (only essential fields)
export interface CartProduct {
  id: number;
  name: string;
  price: number;
  originalPrice?: number; // Added for savings calculation
  image: string;
  slug: string;
  stock: number;
  variant_id?: number;
  variant_name?: string;
}

// ✅ Cart Item
export interface CartItem {
  id: number;
  product: CartProduct;
  quantity: number;
  price: number;
  variant?: {
    id: number;
    name: string;
    sku: string;
    price: number;
    [key: string]: unknown;
  };
}

// ✅ Purchase Item
export interface PurchaseItem {
  id: number;
  purchase_id: number;
  product_id: number;
  variant_id?: number | null;
  rmb_price: number;
  quantity: number;
  total_cost_bdt: number;
  created_at: string;
  updated_at: string;
}

// ✅ Sale Item
export interface SaleItem {
  id: number;
  sale_id: number;
  product_id: number;
  variant_id?: number | null;
  rate: number;
  quantity: number;
  weight: number;
  subtotal: number;
  created_at: string;
  updated_at: string;
}

// ✅ Supplier
export interface Supplier {
  id: number;
  shop_name: string;
  wechat: string;
  country: string;
  created_at: string;
  updated_at: string;
}

// ✅ Category
export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
  image_url?: string; // API returns this field
  parent_id?: number | null;
  created_at: string;
  updated_at: string;
  children?: Category[]; // For nested categories
}

// ✅ Product
export interface Product {
  id: number;
  product_code: string; // internal unique code

  // 🏷️ Basic Info
  title: string;
  slug: string;
  sku: string;
  description: string;
  short_description: string;
  supplier_id: number;
  product_link: string;
  category_id: number;
  brand: string;
  tags: string[];

  // 🖼️ Media
  featured_image: string;
  gallery: string[];

  // ⚙️ Physical Info
  weight: number;
  unit: string;

  // 💱 Import Pricing
  cost_rmb: number;
  exchange_rate: number;
  cost_bdt: number;

  // 💰 Sale Pricing
  actual_price: number;
  default_price: number;
  compare_at_price: number;
  price_wholesale: number;
  price_retail: number;
  price_daraz: number;

  // 🏷️ Channel-specific Names
  name_wholesale?: string;
  name_retail?: string;
  name_daraz?: string;

  // 📦 Inventory
  inventory_quantity: number;
  inventory_policy: 'continue' | 'deny';
  has_variants: boolean;
  status: 'active' | 'inactive' | 'draft';
  featured?: boolean;   // Featured product flag

  // 📦 Additional Identifiers
  barcode: string;
  hs_code: string;

  // 🔍 SEO
  seo_title: string;
  seo_description: string;
  search_keywords?: string[];

  // 🕓 System
  created_at: string;
  updated_at: string;

  // 🎨 Display properties (for UI components)
  name?: string;        // Alias for title
  price?: number;       // Alias for actual_price
  originalPrice?: number; // Alias for compare_at_price
  image?: string;       // Alias for featured_image
  stock?: number;       // Alias for inventory_quantity
  rating?: number;      // Product rating (1-5)
  reviews?: number;     // Number of reviews
  category?: string;    // Category name (for display)
  variant_count?: number; // Number of variants
  price_range_display?: string; // Price range display text
  has_offer?: boolean;  // Whether product has offers
  short_description?: string; // Short product description for highlights
  thumbnail_url?: string; // Product thumbnail image URL
  gallery_images?: string[] | string; // Product gallery images
  price_range?: {       // Price range object
    min: string;
    max: string;
    display: string;
  };
  categories?: Category[]; // Product categories
  variants?: Variant[]; // Product variants
  meta_title?: string; // SEO meta title
  meta_description?: string; // SEO meta description
}


// ✅ Product Variant
export interface ProductVariant {
  id: number;
  product_id: number;
  title: string;
  sku: string;
  price: number;
  compare_at_price: number;
  cost_price: number;
  inventory_quantity: number;
  weight: number;
  option1?: string | null;
  option2?: string | null;
  option3?: string | null;
  image: string;
  barcode: string;
  created_at: string;
  updated_at: string;
}

// ✅ Customer
export interface Customer {
  id: number;
  name: string;
  location: string;
  mobile: string;
  point: number;
  created_at: string;
  updated_at: string;
}

// ✅ Purchase
export interface Purchase {
  id: number;
  supplier_id: number;
  invoice_no: string;
  date: string;
  tracking_no: string;
  courier_name: string;
  received_at_china: string;
  received_at_bd: string;
  exchange_rate: number;
  shipping_cost: number;
  note: string;
  created_at: string;
  updated_at: string;
}

// ✅ Purchase Item
export interface PurchaseItem {
  id: number;
  purchase_id: number;
  product_id: number;
  product_variant_id?: number | null;
  rmb_price: number;
  quantity: number;
  total_cost_bdt: number;
  created_at: string;
  updated_at: string;
}

// ✅ Sale
export interface Sale {
  id: number;
  customer_id: number;
  order_no: string;
  date: string;
  tracking_code: string;
  courier_name: string;
  cod_charge: number;
  discount: number;
  shipping_charge: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
}

// ✅ Sale Item
export interface SaleItem {
  id: number;
  sale_id: number;
  product_id: number;
  product_variant_id?: number | null;
  rate: number;
  quantity: number;
  weight: number;
  subtotal: number;
  created_at: string;
  updated_at: string;
}

// ========================================
// New Product Module Types (table.txt)
// ========================================

// 1. Products Table - Stores basic, static details about the root product
export interface ProductNew {
  product_id: number;
  name_internal: string; // Primary reference name for the product
  description: string; // Full product description/details
  base_unit: string; // Unit of measure (e.g., 'pcs', 'box')
  status: 'Active' | 'Draft' | 'Discontinued';
  created_at: string;
  updated_at: string;
}

// 2. Variations Table - Represents a unique, purchasable/sellable SKU
export interface Variation {
  variation_id: number;
  product_id: number; // FK to Products
  sku: string; // Unique Stock Keeping Unit
  attributes_json: string; // JSON string: { "Color": "Red", "Size": "L" }
  unit_weight_g: number; // Weight in grams
  created_at: string;
  updated_at: string;
}

// 3. Pricing Table - Manages multi-channel display name and price for a specific SKU
export interface Pricing {
  pricing_id: number;
  variation_id: number; // FK to Variations
  channel: 'Retail' | 'Wholesale' | 'Daraz' | 'Internal'; // Selling channel
  display_name: string; // Product name used for this channel
  actual_price: number; // Default, non-discounted selling price
  offer_price: number; // Current promotional or sale price
  created_at: string;
  updated_at: string;
}

// 4. Inventory Table - Tracks the current available stock for each SKU
export interface Inventory {
  inventory_id: number;
  variation_id: number; // FK to Variations
  current_stock: number; // Quantity currently available for sale
  reserved_stock: number; // Quantity held for pending orders
  last_purchase_cost_bdt: number; // Last recorded Landed Cost (COGS) in BDT
  updated_at: string;
}
