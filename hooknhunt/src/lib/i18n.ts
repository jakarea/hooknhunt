import i18n from 'i18next';
import { initReactI18next } from '../../node_modules/react-i18next';
import enInventory from '../locales/en/inventory.json';
import bnInventory from '../locales/en/inventory.json';
import enSidebar from '../locales/en/sidebar.json';
import bnSidebar from '../locales/bn/sidebar.json';

// Translation resources
const resources = {
  en: {
    translation: {
      // Header
      'header.welcome': 'Welcome to Hook & Hunt - Hunting Happiness',
      'header.welcomeShort': 'Hook & Hunt',
      'header.phone': 'Call us: 01841544590',
      'header.search': 'Search for products...',
      'header.cart': 'Cart',
      'header.account': 'Account',
      'header.login': 'Login',
      'header.signup': 'Sign Up',

      // Navigation
      'nav.home': 'Home',
      'nav.rods': 'Fishing Rods',
      'nav.reels': 'Reels',
      'nav.lures': 'Lures & Baits',
      'nav.lines': 'Fishing Lines',
      'nav.accessories': 'Accessories',
      'nav.about': 'About Us',
      'nav.contact': 'Contact',

      // Footer
      'footer.newsletter.title': 'Subscribe to Our Newsletter',
      'footer.newsletter.subtitle': 'Get the latest updates on new products and upcoming sales',
      'footer.newsletter.placeholder': 'Enter your email address',
      'footer.newsletter.button': 'Subscribe',
      'footer.description': 'Your premier destination for quality fishing accessories and equipment. Hunting Happiness with every catch.',
      'footer.categories': 'Product Categories',
      'footer.customerService': 'Customer Service',
      'footer.getInTouch': 'Get In Touch',
      'footer.aboutUs': 'About Us',
      'footer.contactUs': 'Contact Us',
      'footer.shipping': 'Delivery & Shipping',
      'footer.returns': 'Returns & Exchange',
      'footer.privacy': 'Privacy Policy',
      'footer.terms': 'Terms & Conditions',
      'footer.location': 'Location',
      'footer.phone': 'Phone',
      'footer.email': 'Email',
      'footer.address': 'Holding - 3528/3, Biddut Nagar, Rail-Gate, Bogura Sadar, Bogura 5800.',
      'footer.phoneNumber': '+88 09613 244 200',
      'footer.emailAddress': 'Support@hooknhunt.com',
      'footer.copyright': '2025 Hook & Hunt. All rights reserved.',
      'footer.weAccept': 'We Accept:',

      // Hero Slider
      'hero.slide1.title': 'Premium Fishing Rods',
      'hero.slide1.subtitle': 'Cast Further, Catch More',
      'hero.slide1.description': 'Discover our collection of professional-grade fishing rods designed for serious anglers',
      'hero.slide1.cta': 'Shop Rods',
      'hero.slide2.title': 'High-Performance Reels',
      'hero.slide2.subtitle': 'Smooth. Strong. Reliable.',
      'hero.slide2.description': 'Experience precision engineering with our selection of premium fishing reels',
      'hero.slide2.cta': 'Explore Reels',
      'hero.slide3.title': 'Lures & Baits',
      'hero.slide3.subtitle': 'Irresistible to Every Fish',
      'hero.slide3.description': 'Browse our extensive range of lures and baits for all fishing conditions',
      'hero.slide3.cta': 'View Collection',
      'hero.viewAll': 'View All Products',

      // Home Page
      'home.categories.title': 'Shop by Category',
      'home.categories.subtitle': 'Explore our wide range of fishing equipment',

      // Banners
      'home.banners.rods.title': 'Premium Rods',
      'home.banners.rods.subtitle': 'Up to 40% OFF on select models',
      'home.banners.reels.title': 'Professional Reels',
      'home.banners.reels.subtitle': 'Heavy-duty performance guaranteed',
      'home.banners.shopNow': 'Shop Now',

      // Popular Products
      'home.popular.title': 'Popular Products',
      'home.popular.subtitle': 'Best selling fishing gear chosen by our customers',
      'home.popular.viewAll': 'View All',

      // New Arrival
      'home.newArrival.title': 'New Arrival',
      'home.newArrival.subtitle': 'Latest fishing equipment just arrived',
      'home.newArrival.viewAll': 'View All',

      // Best Deals
      'home.deals.title': 'Best Deals',
      'home.deals.subtitle': 'Amazing discounts on top fishing products',

      // Trending Products
      'home.trending.title': 'Trending Products',
      'home.trending.subtitle': 'Most popular items right now',
      'home.trending.viewAll': 'View All',

      // Recently Sold
      'home.recentlySold.title': 'Recently Sold',
      'home.recentlySold.subtitle': 'Products our customers just purchased',
      'home.recentlySold.viewAll': 'View All',

      // Recommended for You
      'home.recommended.title': 'Recommended for You',
      'home.recommended.subtitle': 'Handpicked products based on your interests',
      'home.recommended.viewAll': 'View All',

      // Customer Reviews
      'home.reviews.title': 'Customer Reviews',
      'home.reviews.subtitle': 'What our customers say about us',
      'home.reviews.review1.text': 'Excellent quality fishing rods! Fast delivery and great customer service. Very satisfied with my purchase.',
      'home.reviews.review2.text': 'Best fishing equipment store in Bangladesh. Highly recommended for all fishing enthusiasts!',
      'home.reviews.review3.text': 'Amazing products at competitive prices. Great variety and helpful staff. Will definitely buy again!',

      'home.features.shipping.title': 'Free Shipping',
      'home.features.shipping.description': 'On orders over 5000 BDT',
      'home.features.payment.title': 'Secure Payment',
      'home.features.payment.description': '100% secure transactions',
      'home.features.returns.title': 'Easy Returns',
      'home.features.returns.description': '7-day return policy',

      // Flash Sale
      'flashSale.title': 'Flash Sale',
      'flashSale.subtitle': 'Limited time offer - Grab it before it\'s gone!',
      'flashSale.save': 'Save',
      'flashSale.endsIn': 'Ends in',
      'flashSale.days': 'Days',
      'flashSale.hours': 'Hours',
      'flashSale.minutes': 'Min',
      'flashSale.seconds': 'Sec',
      'flashSale.hot': 'HOT',
      'flashSale.stock': 'Stock',
      'flashSale.hurry': 'Hurry!',
      'flashSale.buyNow': 'Buy Now',
      'flashSale.addToCart': 'Add to Cart',
      'flashSale.viewAll': 'View All Flash Sale Products',

      // Categories
      'categories.rods': 'Fishing Rods',
      'categories.reels': 'Fishing Reels',
      'categories.lines': 'Fishing Lines',
      'categories.lures': 'Lures & Baits',
      'categories.hooks': 'Hooks & Rigs',
      'categories.storage': 'Tackle Storage',
      'categories.tools': 'Fishing Tools',
      'categories.apparel': 'Fishing Apparel',

      // Common
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success',
      'common.home': 'Home',
      'common.cart': 'Cart',
      'common.checkout': 'Checkout',
      'common.continueShopping': 'Continue Shopping',
      'common.remove': 'Remove',
      'common.quantity': 'Quantity',
      'common.subtotal': 'Subtotal',
      'common.total': 'Total',
      'common.free': 'FREE',

      // Cart Sidebar
      'cart.sidebar.title': 'Shopping Cart',
      'cart.sidebar.empty': 'Your cart is empty',
      'cart.sidebar.emptyMessage': 'Add some products to get started!',
      'cart.sidebar.item': 'item',
      'cart.sidebar.items': 'items',
      'cart.sidebar.viewCart': 'View Cart',
      'cart.sidebar.proceedToCheckout': 'Proceed to Checkout',
      'cart.sidebar.shippingNote': 'Shipping and taxes calculated at checkout',
      'cart.sidebar.maxStock': 'Max stock reached',

      // Cart Page
      'cart.page.title': 'Shopping Cart',
      'cart.page.emptyTitle': 'Your Cart is Empty',
      'cart.page.emptyMessage': 'Looks like you haven\'t added anything to your cart yet. Start shopping now!',
      'cart.page.startShopping': 'Start Shopping',
      'cart.page.selectAll': 'Select All',
      'cart.page.yourTotal': 'Your total:',
      'cart.page.productDiscount': 'Product Discount',
      'cart.page.shipping': 'Shipping',
      'cart.page.orderSummary': 'Order Summary',
      'cart.page.selected': 'selected',
      'cart.page.noItemsSelected': 'No items selected',
      'cart.page.maxStockReached': 'Max stock reached',
      'cart.page.only': 'Only',
      'cart.page.available': 'available',
      'cart.page.youSaved': 'You saved',
      'cart.page.almostThere': 'Almost there!',
      'cart.page.addMore': 'Add',
      'cart.page.moreToGetFreeShipping': 'more to get FREE shipping!',
      'cart.page.secureCheckout': 'Secure Checkout',
      'cart.page.freeShippingOver': 'Free Shipping Over',
      'cart.page.easyReturns': '30-Day Easy Returns',
      'cart.page.proceedToCheckout': 'Proceed to Checkout',
      'cart.page.removeConfirm': 'Are you sure you want to remove this item?',
      'cart.page.removeWarning': 'In future, you may not get this product at this price. Price may increase and stock may be low.',
      'cart.page.confirmRemove': 'Yes, Remove',
      'cart.page.keepItem': 'Keep in Cart',

      // Checkout Page
      'checkout.title': 'Checkout',
      'checkout.customerInfo': 'Customer Information',
      'checkout.fullName': 'Full Name',
      'checkout.phoneNumber': 'Phone Number',
      'checkout.email': 'Email',
      'checkout.optional': 'Optional',
      'checkout.address': 'Address',
      'checkout.city': 'City',
      'checkout.district': 'District',
      'checkout.required': '*',

      // Payment Method
      'checkout.paymentMethod': 'Payment Method',
      'checkout.cashOnDelivery': 'Cash on Delivery',
      'checkout.payWhenReceive': 'Pay when you receive',
      'checkout.mobileWallet': 'Mobile Wallet',
      'checkout.mobileWalletDesc': 'bKash, Nagad, Rocket',
      'checkout.debitCreditCard': 'Debit / Credit Card',
      'checkout.cardTypes': 'Visa, Mastercard, Amex',

      // Order Summary
      'checkout.summary': 'Checkout Summary',
      'checkout.applyCoupon': 'Apply Voucher or Promo Code',
      'checkout.enterCode': 'Enter code',
      'checkout.apply': 'Apply',
      'checkout.tryCodes': 'Try these codes:',
      'checkout.couponDiscount': 'Coupon Discount',
      'checkout.deliveryCharge': 'Delivery Charge',
      'checkout.serviceCharge': 'Website Service Charge',
      'checkout.payableTotal': 'Payable Total',
      'checkout.youAreSaving': 'You are saving',

      // Terms
      'checkout.agreeToTerms': 'I agree to the',
      'checkout.termsAndConditions': 'terms and conditions',
      'checkout.placeOrder': 'Place Order',
      'checkout.fastDelivery': 'Fast Delivery',

      // Validation Messages
      'checkout.pleaseAgreeToTerms': 'Please agree to the terms and conditions',
      'checkout.pleaseSelectWallet': 'Please select a mobile wallet',
      'checkout.pleaseFillAllFields': 'Please fill in all required fields',
      'checkout.orderPlacedSuccess': 'Order placed successfully!',

      // Coupon Messages
      'checkout.enterCouponCode': 'Please enter a coupon code',
      'checkout.invalidCoupon': 'Invalid coupon code',
      'checkout.couponAlreadyApplied': 'This coupon is already applied',
      'checkout.couponApplied': 'Coupon applied successfully!',
      'checkout.percentageDiscount': '% discount applied',
      'checkout.fixedDiscount': ' discount applied',
      'checkout.freeShippingApplied': 'Free shipping applied',

      // Placeholders
      'checkout.enterYourFullName': 'Enter your full name',
      'checkout.phoneNumberPlaceholder': '01XXXXXXXXX',
      'checkout.emailPlaceholder': 'your@email.com',
      'checkout.addressPlaceholder': 'House/Flat No., Road, Area',
      'checkout.cityPlaceholder': 'e.g., Dhaka',
      'checkout.districtPlaceholder': 'e.g., Dhaka',

      // Authentication
      'auth.login.title': 'Welcome Back',
      'auth.login.subtitle': 'Login to your account',
      'auth.login.email': 'Email Address',
      'auth.login.password': 'Password',
      'auth.login.rememberMe': 'Remember me',
      'auth.login.forgotPassword': 'Forgot Password?',
      'auth.login.button': 'Login',
      'auth.login.noAccount': 'Don\'t have an account?',
      'auth.login.signUp': 'Sign Up',
      'auth.login.orContinueWith': 'Or continue with',
      'auth.login.google': 'Google',
      'auth.login.facebook': 'Facebook',
      'auth.login.phone': 'Phone Number',
      'auth.login.passwordPlaceholder': 'Enter your password',
      'auth.login.failed': 'Login failed. Please check your credentials.',

      'auth.register.title': 'Create Account',
      'auth.register.subtitle': 'Join us today',
      'auth.register.fullName': 'Full Name',
      'auth.register.email': 'Email Address',
      'auth.register.phone': 'Phone Number',
      'auth.register.password': 'Password',
      'auth.register.confirmPassword': 'Confirm Password',
      'auth.register.agreeToTerms': 'I agree to the',
      'auth.register.terms': 'Terms & Conditions',
      'auth.register.and': 'and',
      'auth.register.privacy': 'Privacy Policy',
      'auth.register.button': 'Create Account',
      'auth.register.haveAccount': 'Already have an account?',
      'auth.register.login': 'Login',
      'auth.register.failed': 'Registration failed. Please try again.',
      'auth.register.changePhone': 'Change Phone Number',
      'auth.register.phoneHint': 'Enter your Bangladesh phone number',
      'auth.register.passwordPlaceholder': 'Create a password',
      'auth.register.confirmPasswordPlaceholder': 'Confirm your password',

      'auth.reset.title': 'Reset Password',
      'auth.reset.subtitle': 'Enter your email to reset password',
      'auth.reset.email': 'Email Address',
      'auth.reset.button': 'Send Reset Link',
      'auth.reset.backToLogin': 'Back to Login',
      'auth.reset.backToHome': 'Back to Home',
      'auth.reset.checkEmail': 'Check Your Email',
      'auth.reset.sentMessage': 'We have sent a password reset link to your email address.',
      'auth.reset.didNotReceive': 'Didn\'t receive the email?',
      'auth.reset.resend': 'Resend',

      'auth.validation.emailRequired': 'Email is required',
      'auth.validation.emailInvalid': 'Please enter a valid email',
      'auth.validation.passwordRequired': 'Password is required',
      'auth.validation.passwordMin': 'Password must be at least 6 characters',
      'auth.validation.passwordMatch': 'Passwords do not match',
      'auth.validation.nameRequired': 'Full name is required',
      'auth.validation.phoneRequired': 'Phone number is required',
      'auth.validation.termsRequired': 'You must agree to terms and conditions',
      ...enInventory.inventory,
      ...enSidebar

    },
  },
  bn: {
    translation: {
      // Header
      'header.welcome': 'হুক এন্ড হান্ট এ স্বাগতম - সুখের শিকার',
      'header.welcomeShort': 'হুক এন্ড হান্ট',
      'header.phone': 'কল করুন: 01841544590',
      'header.search': 'পণ্য খুঁজুন...',
      'header.cart': 'কার্ট',
      'header.account': 'অ্যাকাউন্ট',
      'header.login': 'লগইন',
      'header.signup': 'সাইন আপ',

      // Navigation
      'nav.home': 'হোম',
      'nav.rods': 'ফিশিং রড',
      'nav.reels': 'রিল',
      'nav.lures': 'লোর ও টোপ',
      'nav.lines': 'ফিশিং লাইন',
      'nav.accessories': 'এক্সেসরিজ',
      'nav.about': 'আমাদের সম্পর্কে',
      'nav.contact': 'যোগাযোগ',

      // Footer
      'footer.newsletter.title': 'আমাদের নিউজলেটারে সাবস্ক্রাইব করুন',
      'footer.newsletter.subtitle': 'নতুন পণ্য এবং আসন্ন বিক্রয়ের সর্বশেষ আপডেট পান',
      'footer.newsletter.placeholder': 'আপনার ইমেইল ঠিকানা লিখুন',
      'footer.newsletter.button': 'সাবস্ক্রাইব',
      'footer.description': 'মানসম্পন্ন মাছ ধরার আনুষাঙ্গিক এবং সরঞ্জামের জন্য আপনার প্রধান গন্তব্য। প্রতিটি ক্যাচের সাথে সুখের শিকার।',
      'footer.categories': 'পণ্য বিভাগ',
      'footer.customerService': 'গ্রাহক সেবা',
      'footer.getInTouch': 'যোগাযোগ করুন',
      'footer.aboutUs': 'আমাদের সম্পর্কে',
      'footer.contactUs': 'যোগাযোগ করুন',
      'footer.shipping': 'ডেলিভারি ও শিপিং',
      'footer.returns': 'রিটার্ন ও এক্সচেঞ্জ',
      'footer.privacy': 'গোপনীয়তা নীতি',
      'footer.terms': 'শর্তাবলী',
      'footer.location': 'অবস্থান',
      'footer.phone': 'ফোন',
      'footer.email': 'ইমেইল',
      'footer.address': 'হোল্ডিং - ৩৫২৮/৩, বিদ্যুৎ নগর, রেল-গেট, বগুড়া সদর, বগুড়া ৫৮০০।',
      'footer.phoneNumber': '+৮৮ ০৯৬১৩ ২৪৪ ২০০',
      'footer.emailAddress': 'Support@hooknhunt.com',
      'footer.copyright': '২০২৫ হুক এন্ড হান্ট। সর্বস্বত্ব সংরক্ষিত।',
      'footer.weAccept': 'আমরা গ্রহণ করি:',

      // Hero Slider
      'hero.slide1.title': 'প্রিমিয়াম ফিশিং রড',
      'hero.slide1.subtitle': 'আরও দূরে নিক্ষেপ করুন, আরও ধরুন',
      'hero.slide1.description': 'পেশাদার জেলেদের জন্য ডিজাইন করা আমাদের পেশাদার-গ্রেড ফিশিং রডের সংগ্রহ আবিষ্কার করুন',
      'hero.slide1.cta': 'রড কিনুন',
      'hero.slide2.title': 'হাই-পারফরম্যান্স রিল',
      'hero.slide2.subtitle': 'মসৃণ। শক্তিশালী। নির্ভরযোগ্য।',
      'hero.slide2.description': 'আমাদের প্রিমিয়াম ফিশিং রিলের নির্বাচন সহ নির্ভুল ইঞ্জিনিয়ারিং অনুভব করুন',
      'hero.slide2.cta': 'রিল দেখুন',
      'hero.slide3.subtitle': 'প্রতিটি মাছের কাছে অপ্রতিরোধ্য',
      'hero.slide3.description': 'সমস্ত মাছ ধরার অবস্থার জন্য আমাদের বিস্তৃত পরিসীমা লোর এবং টোপ ব্রাউজ করুন',
      'hero.slide3.cta': 'সংগ্রহ দেখুন',
      'hero.viewAll': 'সকল পণ্য দেখুন',

      // Home Page
      'home.categories.title': 'ক্যাটাগরি অনুযায়ী কিনুন',
      'home.categories.subtitle': 'আমাদের বিস্তৃত মাছ ধরার সরঞ্জাম দেখুন',

      // Banners
      'home.banners.rods.title': 'প্রিমিয়াম রড',
      'home.banners.rods.subtitle': 'নির্বাচিত মডেলে ৪০% পর্যন্ত ছাড়',
      'home.banners.reels.title': 'পেশাদার রিল',
      'home.banners.reels.subtitle': 'হেভি-ডিউটি পারফরম্যান্সের গ্যারান্টি',
      'home.banners.shopNow': 'এখনই কিনুন',

      // Popular Products
      'home.popular.title': 'জনপ্রিয় পণ্য',
      'home.popular.subtitle': 'আমাদের গ্রাহকদের দ্বারা নির্বাচিত সেরা বিক্রিত মাছ ধরার সরঞ্জাম',
      'home.popular.viewAll': 'সব দেখুন',

      // New Arrival
      'home.newArrival.title': 'নতুন আগমন',
      'home.newArrival.subtitle': 'সদ্য আগত সর্বশেষ মাছ ধরার সরঞ্জাম',
      'home.newArrival.viewAll': 'সব দেখুন',

      // Best Deals
      'home.deals.title': 'সেরা ডিল',
      'home.deals.subtitle': 'শীর্ষ মাছ ধরার পণ্যে আশ্চর্যজনক ছাড়',

      // Trending Products
      'home.trending.title': 'ট্রেন্ডিং পণ্য',
      'home.trending.subtitle': 'এই মুহূর্তে সবচেয়ে জনপ্রিয় আইটেম',
      'home.trending.viewAll': 'সব দেখুন',

      // Recently Sold
      'home.recentlySold.title': 'সদ্য বিক্রিত',
      'home.recentlySold.subtitle': 'আমাদের গ্রাহকরা সদ্য ক্রয় করেছেন',
      'home.recentlySold.viewAll': 'সব দেখুন',

      // Recommended for You
      'home.recommended.title': 'আপনার জন্য সুপারিশকৃত',
      'home.recommended.subtitle': 'আপনার পছন্দের ভিত্তিতে নির্বাচিত পণ্য',
      'home.recommended.viewAll': 'সব দেখুন',

      // Customer Reviews
      'home.reviews.title': 'গ্রাহক পর্যালোচনা',
      'home.reviews.subtitle': 'আমাদের গ্রাহকরা আমাদের সম্পর্কে কী বলেন',
      'home.reviews.review1.text': 'চমৎকার মানের ফিশিং রড! দ্রুত ডেলিভারি এবং দুর্দান্ত গ্রাহক সেবা। আমার ক্রয়ে খুবই সন্তুষ্ট।',
      'home.reviews.review2.text': 'বাংলাদেশের সেরা মাছ ধরার সরঞ্জামের দোকান। সকল মাছ ধরার উৎসাহীদের জন্য অত্যন্ত সুপারিশকৃত!',
      'home.reviews.review3.text': 'প্রতিযোগিতামূলক দামে আশ্চর্যজনক পণ্য। দুর্দান্ত বৈচিত্র্য এবং সহায়ক কর্মী। অবশ্যই আবার কিনব!',

      'home.features.shipping.title': 'বিনামূল্যে শিপিং',
      'home.features.shipping.description': '৫০০০ টাকার উপরে অর্ডারে',
      'home.features.payment.title': 'নিরাপদ পেমেন্ট',
      'home.features.payment.description': '১০০% নিরাপদ লেনদেন',
      'home.features.returns.title': 'সহজ রিটার্ন',
      'home.features.returns.description': '৭ দিনের রিটার্ন নীতি',

      // Flash Sale
      'flashSale.title': 'ফ্ল্যাশ সেল',
      'flashSale.subtitle': 'সীমিত সময়ের অফার - শেষ হওয়ার আগে কিনুন!',
      'flashSale.save': 'সাশ্রয়',
      'flashSale.endsIn': 'শেষ হবে',
      'flashSale.days': 'দিন',
      'flashSale.hours': 'ঘন্টা',
      'flashSale.minutes': 'মিনিট',
      'flashSale.seconds': 'সেকেন্ড',
      'flashSale.hot': 'হট',
      'flashSale.stock': 'স্টক',
      'flashSale.hurry': 'তাড়াতাড়ি!',
      'flashSale.buyNow': 'এখনই কিনুন',
      'flashSale.addToCart': 'কার্টে যোগ করুন',
      'flashSale.viewAll': 'সকল ফ্ল্যাশ সেল পণ্য দেখুন',

      // Categories
      'categories.rods': 'ফিশিং রড',
      'categories.reels': 'ফিশিং রিল',
      'categories.lines': 'ফিশিং লাইন',
      'categories.lures': 'লোর ও টোপ',
      'categories.hooks': 'হুক ও রিগ',
      'categories.storage': 'ট্যাকল স্টোরেজ',
      'categories.tools': 'ফিশিং টুলস',
      'categories.apparel': 'ফিশিং পোশাক',

      // Common
      'common.loading': 'লোড হচ্ছে...',
      'common.error': 'ত্রুটি',
      'common.success': 'সফল',
      'common.home': 'হোম',
      'common.cart': 'কার্ট',
      'common.checkout': 'চেকআউট',
      'common.continueShopping': 'কেনাকাটা চালিয়ে যান',
      'common.remove': 'মুছুন',
      'common.quantity': 'পরিমাণ',
      'common.subtotal': 'সাবটোটাল',
      'common.total': 'মোট',
      'common.free': 'বিনামূল্যে',

      // Cart Sidebar
      'cart.sidebar.title': 'শপিং কার্ট',
      'cart.sidebar.empty': 'আপনার কার্ট খালি',
      'cart.sidebar.emptyMessage': 'শুরু করতে কিছু পণ্য যোগ করুন!',
      'cart.sidebar.item': 'আইটেম',
      'cart.sidebar.items': 'আইটেম',
      'cart.sidebar.viewCart':' কার্ট দেখুন',
      'cart.sidebar.proceedToCheckout': 'চেকআউট করুন',
      'cart.sidebar.shippingNote': 'চেকআউটে শিপিং এবং ট্যাক্স হিসাব করা হবে',
      'cart.sidebar.maxStock': 'সর্বোচ্চ স্টক পৌঁছেছে',

      // Cart Page
      'cart.page.title': 'শপিং কার্ট',
      'cart.page.emptyTitle': 'আপনার কার্ট খালি',
      'cart.page.emptyMessage': 'মনে হচ্ছে আপনি এখনও আপনার কার্টে কিছু যোগ করেননি। এখনই কেনাকাটা শুরু করুন!',
      'cart.page.startShopping': 'কেনাকাটা শুরু করুন',
      'cart.page.selectAll': 'সব নির্বাচন করুন',
      'cart.page.yourTotal': 'আপনার মোট:',
      'cart.page.productDiscount': 'পণ্য ছাড়',
      'cart.page.shipping': 'শিপিং',
      'cart.page.orderSummary': 'অর্ডার সারাংশ',
      'cart.page.selected': 'নির্বাচিত',
      'cart.page.noItemsSelected': 'কোন আইটেম নির্বাচিত নেই',
      'cart.page.maxStockReached': 'সর্বোচ্চ স্টক পৌঁছেছে',
      'cart.page.only': 'শুধুমাত্র',
      'cart.page.available': 'উপলব্ধ',
      'cart.page.youSaved': 'আপনি সঞ্চয় করেছেন',
      'cart.page.almostThere': 'প্রায় হয়ে গেছে!',
      'cart.page.addMore': 'আরও',
      'cart.page.moreToGetFreeShipping': 'যোগ করুন বিনামূল্যে শিপিং পেতে!',
      'cart.page.secureCheckout': 'নিরাপদ চেকআউট',
      'cart.page.freeShippingOver': 'এর উপরে বিনামূল্যে শিপিং',
      'cart.page.easyReturns': '৩০ দিনের সহজ রিটার্ন',
      'cart.page.proceedToCheckout': 'চেকআউট করুন',
      'cart.page.removeConfirm': 'আপনি কি এই পণ্যটি সরাতে চান?',
      'cart.page.removeWarning': 'ভবিষ্যতে, আপনি এই পণ্যটি এই দামে নাও পেতে পারেন। দাম বাড়তে পারে এবং স্টক কম হতে পারে।',
      'cart.page.confirmRemove': 'হ্যাঁ, সরান',
      'cart.page.keepItem': 'কার্টে রাখুন',

      // Checkout Page
      'checkout.title': 'চেকআউট',
      'checkout.customerInfo': 'গ্রাহক তথ্য',
      'checkout.fullName': 'পুরো নাম',
      'checkout.phoneNumber': 'ফোন নম্বর',
      'checkout.email': 'ইমেইল',
      'checkout.optional': 'ঐচ্ছিক',
      'checkout.address': 'ঠিকানা',
      'checkout.city': 'শহর',
      'checkout.district': 'জেলা',
      'checkout.required': '*',

      // Payment Method
      'checkout.paymentMethod': 'পেমেন্ট পদ্ধতি',
      'checkout.cashOnDelivery': 'ক্যাশ অন ডেলিভারি',
      'checkout.payWhenReceive': 'পণ্য পেলে পেমেন্ট করুন',
      'checkout.mobileWallet': 'মোবাইল ওয়ালেট',
      'checkout.mobileWalletDesc': 'বিকাশ, নগদ, রকেট',
      'checkout.debitCreditCard': 'ডেবিট / ক্রেডিট কার্ড',
      'checkout.cardTypes': 'ভিসা, মাস্টারকার্ড, অ্যামেক্স',

      // Order Summary
      'checkout.summary': 'চেকআউট সারাংশ',
      'checkout.applyCoupon': 'ভাউচার বা প্রোমো কোড প্রয়োগ করুন',
      'checkout.enterCode': 'কোড লিখুন',
      'checkout.apply': 'প্রয়োগ করুন',
      'checkout.tryCodes': 'এই কোডগুলি চেষ্টা করুন:',
      'checkout.couponDiscount': 'কুপন ছাড়',
      'checkout.deliveryCharge': 'ডেলিভারি চার্জ',
      'checkout.serviceCharge': 'ওয়েবসাইট সেবা চার্জ',
      'checkout.payableTotal': 'প্রদেয় মোট',
      'checkout.youAreSaving': 'আপনি সঞ্চয় করছেন',

      // Terms
      'checkout.agreeToTerms': 'আমি সম্মত',
      'checkout.termsAndConditions': 'শর্তাবলী',
      'checkout.placeOrder': 'অর্ডার করুন',
      'checkout.fastDelivery': 'দ্রুত ডেলিভারি',

      // Validation Messages
      'checkout.pleaseAgreeToTerms': 'অনুগ্রহ করে শর্তাবলীতে সম্মতি দিন',
      'checkout.pleaseSelectWallet': 'অনুগ্রহ করে একটি মোবাইল ওয়ালেট নির্বাচন করুন',
      'checkout.pleaseFillAllFields': 'অনুগ্রহ করে সমস্ত প্রয়োজনীয় ক্ষেত্র পূরণ করুন',
      'checkout.orderPlacedSuccess': 'অর্ডার সফলভাবে সম্পন্ন হয়েছে!',

      // Coupon Messages
      'checkout.enterCouponCode': 'অনুগ্রহ করে একটি কুপন কোড লিখুন',
      'checkout.invalidCoupon': 'অবৈধ কুপন কোড',
      'checkout.couponAlreadyApplied': 'এই কুপন ইতিমধ্যে প্রয়োগ করা হয়েছে',
      'checkout.couponApplied': 'কুপন সফলভাবে প্রয়োগ করা হয়েছে!',
      'checkout.percentageDiscount': '% ছাড় প্রয়োগ করা হয়েছে',
      'checkout.fixedDiscount': ' ছাড় প্রয়োগ করা হয়েছে',
      'checkout.freeShippingApplied': 'বিনামূল্যে শিপিং প্রয়োগ করা হয়েছে',

      // Placeholders
      'checkout.enterYourFullName': 'আপনার পুরো নাম লিখুন',
      'checkout.phoneNumberPlaceholder': '০১XXXXXXXXX',
      'checkout.emailPlaceholder': 'আপনার@ইমেইল.কম',
      'checkout.addressPlaceholder': 'বাড়ি/ফ্ল্যাট নং, রোড, এলাকা',
      'checkout.cityPlaceholder': 'যেমন, ঢাকা',
      'checkout.districtPlaceholder': 'যেমন, ঢাকা',

      // Authentication
      'auth.login.title': 'স্বাগতম',
      'auth.login.subtitle': 'আপনার অ্যাকাউন্টে লগইন করুন',
      'auth.login.email': 'ইমেইল ঠিকানা',
      'auth.login.password': 'পাসওয়ার্ড',
      'auth.login.rememberMe': 'আমাকে মনে রাখুন',
      'auth.login.forgotPassword': 'পাসওয়ার্ড ভুলে গেছেন?',
      'auth.login.button': 'লগইন',
      'auth.login.noAccount': 'অ্যাকাউন্ট নেই?',
      'auth.login.signUp': 'সাইন আপ',
      'auth.login.orContinueWith': 'অথবা চালিয়ে যান',
      'auth.login.google': 'গুগল',
      'auth.login.facebook': 'ফেসবুক',

      'auth.register.title': 'অ্যাকাউন্ট তৈরি করুন',
      'auth.register.subtitle': 'আজই আমাদের সাথে যোগ দিন',
      'auth.register.fullName': 'পুরো নাম',
      'auth.register.email': 'ইমেইল ঠিকানা',
      'auth.register.phone': 'ফোন নম্বর',
      'auth.register.password': 'পাসওয়ার্ড',
      'auth.register.confirmPassword': 'পাসওয়ার্ড নিশ্চিত করুন',
      'auth.register.agreeToTerms': 'আমি সম্মত',
      'auth.register.terms': 'শর্তাবলী',
      'auth.register.and': 'এবং',
      'auth.register.privacy': 'গোপনীয়তা নীতি',
      'auth.register.button': 'অ্যাকাউন্ট তৈরি করুন',
      'auth.register.haveAccount': 'ইতিমধ্যে অ্যাকাউন্ট আছে?',
      'auth.register.login': 'লগইন',
      'auth.register.failed': 'নিবন্ধন ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
      'auth.register.changePhone': 'ফোন নম্বর পরিবর্তন করুন',
      'auth.register.phoneHint': 'আপনার বাংলাদেশ ফোন নম্বর লিখুন',
      'auth.register.passwordPlaceholder': 'একটি পাসওয়ার্ড তৈরি করুন',
      'auth.register.confirmPasswordPlaceholder': 'আপনার পাসওয়ার্ড নিশ্চিত করুন',

      'auth.reset.title': 'পাসওয়ার্ড রিসেট',
      'auth.reset.subtitle': 'পাসওয়ার্ড রিসেট করতে ইমেইল লিখুন',
      'auth.reset.email': 'ইমেইল ঠিকানা',
      'auth.reset.button': 'রিসেট লিঙ্ক পাঠান',
      'auth.reset.backToLogin': 'লগইনে ফিরে যান',
      'auth.reset.backToHome': 'হোমে ফিরে যান',
      'auth.reset.checkEmail': 'আপনার ইমেইল চেক করুন',
      'auth.reset.sentMessage': 'আমরা আপনার ইমেইল ঠিকানায় একটি পাসওয়ার্ড রিসেট লিঙ্ক পাঠিয়েছি।',
      'auth.reset.didNotReceive': 'ইমেইল পাননি?',
      'auth.reset.resend': 'পুনরায় পাঠান',

      'auth.validation.emailRequired': 'ইমেইল প্রয়োজন',
      'auth.validation.emailInvalid': 'অনুগ্রহ করে একটি বৈধ ইমেইল লিখুন',
      'auth.validation.passwordRequired': 'পাসওয়ার্ড প্রয়োজন',
      'auth.validation.passwordMin': 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে',
      'auth.validation.passwordMatch': 'পাসওয়ার্ড মিলছে না',
      'auth.validation.nameRequired': 'পুরো নাম প্রয়োজন',
      'auth.validation.phoneRequired': 'ফোন নম্বর প্রয়োজন',
      'auth.validation.termsRequired': 'আপনাকে শর্তাবলীতে সম্মত হতে হবে',
      ...bnInventory.inventory,
      ...bnSidebar

    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'bn', // Default language is Bangla
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
