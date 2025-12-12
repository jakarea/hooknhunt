# ShopHub - E-commerce Next.js Frontend

A modern, fully-responsive static e-commerce website built with Next.js 15, React 19, and Tailwind CSS 4.

## Features

### Pages
- **Home Page** (`/`) - Hero section, category showcase, featured products, and best deals
- **Products Listing** (`/products`) - Filterable product grid with category and price filters
- **Product Detail** (`/products/[slug]`) - Detailed product view with image gallery and related products
- **Shopping Cart** (`/cart`) - Cart management with quantity controls and order summary
- **Checkout** (`/checkout`) - Complete checkout flow with shipping and payment forms

### Components
- **Layout Components**
  - `Header` - Responsive navigation with search and cart
  - `Footer` - Site links, newsletter signup, and social media

- **Common Components**
  - `Button` - Reusable button with multiple variants and sizes
  - `Input` - Form input with label and error states
  - `ProductCard` - Product display card with ratings and pricing

### Data Structure
- Static mock data for 12+ products across 4 categories
- TypeScript interfaces for type safety
- Product attributes: name, price, images, ratings, stock, etc.

## Tech Stack
- **Framework**: Next.js 15.5.5 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Package Manager**: npm

## Project Structure
```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Home page
│   │   ├── products/          # Products pages
│   │   │   ├── page.tsx       # Product listing
│   │   │   └── [slug]/        # Product detail (dynamic)
│   │   ├── cart/              # Shopping cart
│   │   └── checkout/          # Checkout page
│   ├── components/
│   │   ├── layout/            # Header, Footer
│   │   ├── common/            # Button, Input
│   │   ├── product/           # ProductCard
│   │   └── cart/              # Cart components
│   ├── data/                  # Mock product data
│   ├── types/                 # TypeScript interfaces
│   └── app/globals.css        # Global styles
├── public/                    # Static assets
└── package.json
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3001](http://localhost:3001) in your browser

## Build for Production
```bash
npm run build
npm start
```

## Next Steps (Dynamic Integration)

When ready to connect to the Laravel API backend:

1. **API Integration**
   - Replace static data imports with API calls
   - Add data fetching hooks (SWR or React Query recommended)
   - Set up environment variables for API endpoints

2. **State Management**
   - Implement cart state management (Context API or Zustand)
   - Add user authentication state
   - Handle loading and error states

3. **Enhanced Features**
   - Real-time inventory updates
   - User authentication and profiles
   - Order history and tracking
   - Product reviews and ratings
   - Wishlist functionality
   - Advanced filtering and search
   - Payment gateway integration

4. **API Endpoints Needed**
   - `GET /api/products` - List all products
   - `GET /api/products/:slug` - Get single product
   - `GET /api/categories` - List categories
   - `POST /api/cart` - Add to cart
   - `POST /api/checkout` - Process order
   - `POST /api/auth/login` - User authentication

## Design Features
- Fully responsive design (mobile, tablet, desktop)
- Modern gradient hero section
- Product cards with hover effects
- Rating stars and discount badges
- Sticky navigation and order summary
- Empty state designs
- Form validation ready
- Smooth transitions and animations

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

**Status**: Static design complete and ready for API integration
**Development Server**: Running on http://localhost:3001
