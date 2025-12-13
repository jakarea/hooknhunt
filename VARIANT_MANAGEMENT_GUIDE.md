# Product Variant Management - User Guide

## Overview

The new variant management system provides an intuitive, user-friendly interface for creating and managing product variants with multiple attributes (colors, sizes, etc.) across three sales channels (Retail, Wholesale, Daraz).

## Key Features

### ✅ Improvements Made

1. **Visual Attribute Selection**
   - See all attribute options with their actual values (colors, images)
   - Multi-select interface with visual feedback
   - Color swatches for color attributes
   - Image previews for image-based attributes

2. **Automatic Variant Generation**
   - Select multiple attribute options (e.g., Red, Blue for Color; Small, Large for Size)
   - Click "Generate Variants" to automatically create all combinations
   - Example: 2 colors × 2 sizes = 4 variants automatically generated

3. **Smart Variant Naming**
   - Variants are automatically named with format: `{Product Name} - {Attribute Values}`
   - Example: "T-Shirt - Red / Small", "T-Shirt - Blue / Large"
   - Names are editable and pre-filled for each channel (Retail, Wholesale, Daraz)

4. **Individual Variant Images**
   - Upload unique images for each variant (optional)
   - Visual preview of uploaded images
   - Easy remove/replace functionality

5. **Channel-Specific Pricing**
   - Separate pricing for Retail, Wholesale, and Daraz channels
   - Each channel has its own name field (customizable per channel)
   - MOQ (Minimum Order Quantity) settings for Wholesale and Daraz

## How to Use

### Step 1: Create or Edit a Product

1. Go to **Products** → **Create Product** or edit an existing product
2. Fill in the basic product information (name, description, category)
3. Click "Create Product" or "Save"

### Step 2: Navigate to Variants Tab

1. After creating the product, you'll see tabs: **Product Details**, **Variants**, **Suppliers**
2. Click on the **Variants** tab

### Step 3: Select Attribute Options

**Example Scenario:** You want to create variants for a T-shirt in Red and Blue colors, each available in Small and Large sizes.

1. In the "Select Attribute Options" section, you'll see all available attributes
2. Click on the attribute options you want to include:
   - For **Color**: Click "Red" and "Blue"
   - For **Size**: Click "Small" and "Large"
3. Selected options will be highlighted in blue
4. You can see the actual color values (color swatches) next to color options

### Step 4: Generate Variants

1. Click the **"Generate Variants"** button
2. The system will automatically create all possible combinations:
   - T-Shirt - Red / Small
   - T-Shirt - Red / Large
   - T-Shirt - Blue / Small
   - T-Shirt - Blue / Large

### Step 5: Configure Each Variant

For each generated variant, you'll see a card with:

#### Basic Information
- **SKU**: Auto-generated (e.g., `T-SHIRT-1`), can be edited
- **Landed Cost**: The cost price for this variant
- **Variant Image**: Upload a unique image for this variant (optional)

#### Channel-Specific Pricing

**Retail Channel** (Red highlight)
- Retail Name: Pre-filled with `{Product Name} - {Attributes}`
- Retail Price: Set the retail selling price

**Wholesale Channel** (Blue highlight)
- Wholesale Name: Pre-filled (can be different from retail)
- Wholesale Price: Set the wholesale price
- MOQ: Minimum Order Quantity (default: 10)

**Daraz Channel** (Orange highlight)
- Daraz Name: Pre-filled (can be customized for marketplace)
- Daraz Price: Set the Daraz selling price
- MOQ: Minimum Order Quantity (default: 1)

### Step 6: Upload Variant Images (Optional)

1. Click "Upload Image" for any variant
2. Select an image file
3. Preview appears immediately
4. Click "Remove" to delete if needed

### Step 7: Save Variants

1. Review all variants and their pricing
2. Click **"Save Variants"** button at the bottom
3. All variants will be saved to the database

## Tips & Best Practices

### Attribute Setup
- **Before creating variants**, make sure you've added attributes in the **Attributes** module
- Example attributes: Color (with values: Red, Green, Blue), Size (with values: S, M, L, XL)
- For color attributes, add color codes for better visual selection
- Mark attributes as "visible" to see them in the variant generator

### SKU Management
- Auto-generated SKUs follow the pattern: `{PRODUCT-SLUG}-{NUMBER}`
- Edit SKUs to match your inventory system
- Ensure SKUs are unique across all variants

### Pricing Strategy
- **Landed Cost**: Should be the actual cost (China price + shipping + extras)
- **Retail Price**: Usually landed cost + markup (e.g., 40-60%)
- **Wholesale Price**: Lower than retail, typically 20-30% markup
- **Daraz Price**: May need to account for marketplace fees

### Channel Names
- Retail names are customer-facing on your website
- Wholesale names might be more descriptive for B2B clients
- Daraz names should be SEO-optimized for the marketplace

### Variant Images
- Use high-quality images showing the actual variant (e.g., red version, blue version)
- If no variant image is uploaded, the product's base thumbnail will be used
- Recommended size: 800x600px, max 500KB

## Workflow Example

**Creating a Shoe Product with Color and Size Variants:**

1. **Create Product**: "Running Shoes" with description and base image
2. **Go to Variants Tab**
3. **Select Attributes**:
   - Color: Black, White, Red (3 options)
   - Size: 7, 8, 9, 10 (4 options)
4. **Generate**: Creates 3 × 4 = 12 variants automatically
5. **Configure Each Variant**:
   - Running Shoes - Black / 7 → SKU: RS-BLACK-7, Retail: $89.99
   - Running Shoes - Black / 8 → SKU: RS-BLACK-8, Retail: $89.99
   - ... and so on
6. **Upload Images**: Add images for Black, White, and Red versions
7. **Set Pricing**:
   - Retail: $89.99
   - Wholesale: $69.99 (MOQ: 10)
   - Daraz: $94.99 (MOQ: 1)
8. **Save Variants**

## Troubleshooting

### "No Attributes Found" Message
- Go to **Attributes** module and create attributes first
- Make sure attributes are marked as "visible"
- Refresh the page after creating attributes

### Variants Not Generating
- Ensure you've selected at least one option for one attribute
- Check that the attribute has options (values) assigned to it

### Images Not Uploading
- Check file size (should be under 500KB)
- Use supported formats: PNG, JPG, JPEG, GIF
- Compress large images before uploading

## Future Enhancements (Backend Integration Required)

Currently, this is a **UI-only implementation**. To make it fully functional:

1. **Backend API Endpoints Needed**:
   - `GET /admin/products/{id}/variants` - Fetch existing variants
   - `POST /admin/products/{id}/variants` - Create/update variants
   - `DELETE /admin/products/{id}/variants/{variantId}` - Delete variant

2. **Database Schema**: Already implemented in migrations
   - `product_variants` table
   - `variant_attribute_options` pivot table

3. **Model Implementation**: Need to create ProductVariant model in Laravel

## UI Features Implemented

✅ Visual attribute selector with color swatches
✅ Multi-select attribute options
✅ Automatic variant combination generator
✅ Pre-filled variant names (base_name + attributes)
✅ Individual variant image upload
✅ Channel-specific pricing (Retail, Wholesale, Daraz)
✅ SKU auto-generation with edit capability
✅ Variant cards with attribute badges
✅ Remove individual variants
✅ Clear all variants option
✅ Loading states and error handling
✅ Responsive design
✅ Integrated into ProductCreate and ProductEdit pages

## Next Steps

1. **Test the UI**: Create a product and try generating variants
2. **Implement Backend**: Connect to the backend API when ready
3. **Add Inventory**: Link variants to inventory management
4. **Purchase Orders**: Update purchase orders to work with variants
