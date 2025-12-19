# Hook & Hunt Storefront API Documentation

## Overview

The Hook & Hunt Storefront API provides public access to products and categories for the Next.js website. All endpoints are accessible without authentication and return data in JSON format.

**Base URL**: `http://localhost:8000/api/v1/store`

## Categories Endpoints

### Get All Categories

**GET** `/categories`

Returns all categories in both hierarchical and flat formats.

**Response:**
```json
{
  "categories": [
    {
      "id": 1,
      "name": "Fishing Rod",
      "slug": "fishing-rod",
      "image_url": "http://localhost:8000/storage/categories/image.jpg",
      "children": [
        {
          "id": 2,
          "name": "Subcategory",
          "slug": "subcategory",
          "image_url": "http://localhost:8000/storage/categories/subimage.jpg",
          "children": []
        }
      ]
    }
  ],
  "all_categories": [
    {
      "id": 1,
      "name": "Fishing Rod",
      "slug": "fishing-rod",
      "parent_id": null,
      "image_url": "http://localhost:8000/storage/categories/image.jpg"
    }
  ]
}
```

### Get Featured Categories

**GET** `/categories/featured`

Returns top-level categories (categories without parents).

**Response:**
```json
[
  {
    "id": 1,
    "name": "Fishing Rod",
    "slug": "fishing-rod",
    "image_url": "http://localhost:8000/storage/categories/image.jpg"
  }
]
```

### Get Single Category

**GET** `/categories/{slug}`

Returns a single category with its children.

**Response:**
```json
{
  "category": {
    "id": 1,
    "name": "Fishing Rod",
    "slug": "fishing-rod",
    "image_url": "http://localhost:8000/storage/categories/image.jpg",
    "children": [
      {
        "id": 2,
        "name": "Subcategory",
        "slug": "subcategory",
        "image_url": "http://localhost:8000/storage/categories/subimage.jpg"
      }
    ]
  }
}
```

## Products Endpoints

### Get All Products

**GET** `/products`

Returns all published products with pagination and filtering support.

**Query Parameters:**
- `page` (integer): Page number (default: 1)
- `per_page` (integer): Items per page (max: 100, default: 20)
- `category_id` (integer): Filter by category ID
- `category` (string): Filter by category slug
- `search` (string): Search in product name and description
- `min_price` (float): Filter by minimum retail price
- `max_price` (float): Filter by maximum retail price
- `sort_by` (string): Sort by (name, price_low, price_high, newest)
- `sort_order` (string): Sort order (asc, desc)

**Response:**
```json
{
  "products": [
    {
      "id": 1,
      "name": "Product Name",
      "slug": "product-slug",
      "thumbnail_url": "http://localhost:8000/storage/thumbnails/image.jpg",
      "gallery_images": [
        "http://localhost:8000/storage/images/image1.jpg",
        "http://localhost:8000/storage/images/image2.jpg"
      ],
      "price_range": {
        "min": 100.00,
        "max": 200.00,
        "display": "৳100.00 - ৳200.00"
      },
      "has_offer": true,
      "variant_count": 3,
      "categories": [
        {
          "id": 1,
          "name": "Fishing Rod",
          "slug": "fishing-rod",
          "image_url": "http://localhost:8000/storage/categories/image.jpg"
        }
      ],
      "stock_info": {
        "in_stock": true,
        "total_available": 50,
        "low_stock": false,
        "stock_status": "in_stock"
      }
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 20,
    "total": 100,
    "from": 1,
    "to": 20
  }
}
```

### Get Featured Products

**GET** `/products/featured`

Returns recently added featured products.

**Query Parameters:**
- `limit` (integer): Number of products to return (max: 50, default: 12)

**Response:**
```json
[
  {
    "id": 1,
    "name": "Product Name",
    "slug": "product-slug",
    "thumbnail_url": "http://localhost:8000/storage/thumbnails/image.jpg",
    "gallery_images": [],
    "price_range": {
      "min": 100.00,
      "max": 200.00,
      "display": "৳100.00 - ৳200.00"
    },
    "has_offer": true,
    "variant_count": 3,
    "categories": []
  }
]
```

### Get Single Product

**GET** `/products/{slug}`

Returns detailed information about a single product including all variants.

**Response:**
```json
{
  "product": {
    "id": 1,
    "name": "Product Name",
    "slug": "product-slug",
    "thumbnail_url": "http://localhost:8000/storage/thumbnails/image.jpg",
    "gallery_images": [
      "http://localhost:8000/storage/images/image1.jpg"
    ],
    "price_range": {
      "min": 100.00,
      "max": 200.00,
      "display": "৳100.00 - ৳200.00"
    },
    "has_offer": true,
    "variant_count": 3,
    "categories": [],
    "description": "Product description",
    "meta_title": "Meta Title",
    "meta_description": "Meta Description",
    "variants": [
      {
        "id": 1,
        "sku": "SKU123",
        "name": "Variant Name",
        "retail_price": 100.00,
        "wholesale_price": 80.00,
        "moq_wholesale": 10,
        "weight": 1.5,
        "dimensions": "10x5x3",
        "retail_offer": {
          "type": "percentage",
          "value": 10.00,
          "original_price": 100.00,
          "final_price": 90.00,
          "start_date": "2025-01-01T00:00:00Z",
          "end_date": "2025-01-31T23:59:59Z"
        },
        "wholesale_offer": null
      }
    ]
  }
}
```

### Get Products by Category

**GET** `/categories/{categorySlug}/products`

Returns products belonging to a specific category and its subcategories.

**Response:**
```json
{
  "category": {
    "id": 1,
    "name": "Fishing Rod",
    "slug": "fishing-rod",
    "image_url": "http://localhost:8000/storage/categories/image.jpg"
  },
  "products": [
    {
      "id": 1,
      "name": "Product Name",
      "slug": "product-slug",
      "thumbnail_url": "http://localhost:8000/storage/thumbnails/image.jpg",
      "gallery_images": [],
      "price_range": {
        "min": 100.00,
        "max": 200.00,
        "display": "৳100.00 - ৳200.00"
      },
      "has_offer": true,
      "variant_count": 3,
      "categories": []
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 20,
    "total": 5,
    "from": 1,
    "to": 5
  }
}
```

### Get Related Products

**GET** `/products/{slug}/related`

Returns products from the same categories as the specified product.

**Query Parameters:**
- `limit` (integer): Number of related products to return (default: 8)

**Response:**
```json
[
  {
    "id": 2,
    "name": "Related Product",
    "slug": "related-product",
    "thumbnail_url": "http://localhost:8000/storage/thumbnails/related.jpg",
    "gallery_images": [],
    "price_range": {
      "min": 150.00,
      "max": 250.00,
      "display": "৳150.00 - ৳250.00"
    },
    "has_offer": false,
    "variant_count": 2,
    "categories": []
  }
]
```

## Data Fields Explanation

### Product Fields

- **id**: Unique product identifier
- **name**: Product base name
- **slug**: URL-friendly slug for the product
- **thumbnail_url**: URL to product thumbnail image
- **gallery_images**: Array of product gallery image URLs
- **price_range**: Object containing price information
  - **min**: Minimum retail price among variants
  - **max**: Maximum retail price among variants
  - **display**: Formatted price range string
- **has_offer**: Boolean indicating if any variant has an active offer
- **variant_count**: Number of active variants
- **categories**: Array of categories the product belongs to

### Category Fields

- **id**: Unique category identifier
- **name**: Category name
- **slug**: URL-friendly slug for the category
- **image_url**: URL to category image
- **parent_id**: ID of parent category (null for top-level categories)
- **children**: Array of child categories (for hierarchical view)

### Variant Fields

- **id**: Unique variant identifier
- **sku**: Stock Keeping Unit
- **name**: Variant display name
- **retail_price**: Retail selling price
- **wholesale_price**: Wholesale selling price
- **moq_wholesale**: Minimum Order Quantity for wholesale
- **weight**: Product weight in kg
- **dimensions**: Product dimensions (LxWxH)
- **retail_offer**: Retail offer details (if active)
- **wholesale_offer**: Wholesale offer details (if active)

### Offer Fields

- **type**: "percentage" or "fixed"
- **value**: Discount value
- **original_price**: Original price before discount
- **final_price**: Final price after discount
- **start_date**: Offer start date
- **end_date**: Offer end date

## Error Responses

All endpoints return appropriate HTTP status codes:

- **200**: Success
- **404**: Resource not found
- **422**: Validation error
- **500**: Server error

Error response format:
```json
{
  "message": "Error description"
}
```

## Usage Examples

### 1. Get all products with pagination
```bash
curl "http://localhost:8000/api/v1/store/products?page=1&per_page=10"
```

### 2. Search products
```bash
curl "http://localhost:8000/api/v1/store/products?search=fishing"
```

### 3. Filter by price range
```bash
curl "http://localhost:8000/api/v1/store/products?min_price=100&max_price=500"
```

### 4. Sort by price (low to high)
```bash
curl "http://localhost:8000/api/v1/store/products?sort_by=price_low"
```

### 5. Get products by category
```bash
curl "http://localhost:8000/api/v1/store/categories/fishing-rod/products"
```

### 6. Get featured products
```bash
curl "http://localhost:8000/api/v1/store/products/featured?limit=8"
```

## Notes

- All prices are in Bangladeshi Taka (৳)
- Only products with `status = "published"` are returned
- Only variants with `status = "active"` are included
- Images are returned as full URLs
- Pagination follows Laravel's standard pagination format
- Category filtering includes parent category and all child categories
- Offers are automatically filtered by start/end dates