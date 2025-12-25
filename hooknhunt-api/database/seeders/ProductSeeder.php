<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            // Fishing Rods
            [
                'base_name' => 'Professional Carbon Fiber Spinning Rod',
                'slug' => 'pro-carbon-spinning-rod',
                'category_ids' => json_encode([1]), // Spinning Rods
                'brand_id' => 1, // Hook & Hunt
                'status' => 'published',
                'is_featured' => true,
                'description' => 'Professional grade carbon fiber spinning rod designed for serious anglers. Features lightweight construction, sensitive tip, and powerful backbone for catching big fish.',
                'short_description' => 'Lightweight carbon fiber spinning rod with excellent sensitivity and power.',
                'thumbnail' => 'https://via.placeholder.com/600x600/4F46E5/FFFFFF?text=Spinning+Rod',
                'base_thumbnail_url' => 'https://via.placeholder.com/600x600/4F46E5/FFFFFF?text=Spinning+Rod',
                'gallery_images' => json_encode([
                    'https://via.placeholder.com/600x600/4F46E5/FFFFFF?text=Spinning+Rod+1',
                    'https://via.placeholder.com/600x600/4F46E5/FFFFFF?text=Spinning+Rod+2',
                    'https://via.placeholder.com/600x600/4F46E5/FFFFFF?text=Spinning+Rod+3',
                ]),
                'specifications' => json_encode([
                    'Material' => 'Carbon Fiber',
                    'Length' => '7ft / 2.1m',
                    'Power' => 'Medium',
                    'Action' => 'Fast',
                    'Sections' => '2',
                    'Line Weight' => '8-17lb',
                    'Lure Weight' => '1/4-3/4 oz',
                    'Handle' => 'EVA Foam',
                ]),
                'weight' => 150,
                'dimensions' => '7ft length, 2 sections',
                'tags' => json_encode(['spinning', 'carbon', 'professional', 'lightweight']),
                'meta_title' => 'Professional Carbon Fiber Spinning Rod - Hook & Hunt',
                'meta_description' => 'Premium carbon fiber spinning rod for professional anglers. Lightweight, sensitive, and powerful.',
                'meta_keywords' => 'spinning rod, carbon fiber, fishing rod, professional fishing',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'base_name' => 'Telescopic Travel Fishing Rod',
                'slug' => 'telescopic-travel-fishing-rod',
                // Telescopic Rods
                'category_ids' => json_encode([1, 13]), // Fishing Rods, Telescopic Rods
                'brand_id' => 1, // Hook & Hunt
                'status' => 'published',
                'is_featured' => false,
                'description' => 'Compact telescopic fishing rod perfect for travel and backpacking. Extends to full length in seconds, collapses to fit in your bag.',
                'short_description' => 'Portable telescopic rod for fishing anywhere, anytime.',
                'thumbnail' => 'https://via.placeholder.com/600x600/10B981/FFFFFF?text=Telescopic+Rod',
                'base_thumbnail_url' => 'https://via.placeholder.com/600x600/10B981/FFFFFF?text=Telescopic+Rod',
                'gallery_images' => json_encode([
                    'https://via.placeholder.com/600x600/10B981/FFFFFF?text=Telescopic+Rod+1',
                    'https://via.placeholder.com/600x600/10B981/FFFFFF?text=Telescopic+Rod+2',
                ]),
                'specifications' => json_encode([
                    'Material' => 'Fiberglass',
                    'Extended Length' => '5.5ft / 1.7m',
                    'Collapsed Length' => '15in / 38cm',
                    'Power' => 'Medium-Light',
                    'Sections' => '7',
                    'Line Weight' => '6-15lb',
                    'Handle' => 'Cork',
                ]),
                'weight' => 120,
                'dimensions' => '5.5ft extended, 15in collapsed',
                'tags' => json_encode(['telescopic', 'travel', 'portable', 'compact']),
                'meta_title' => 'Telescopic Travel Fishing Rod - Hook & Hunt',
                'meta_description' => 'Compact and portable telescopic fishing rod perfect for travel anglers.',
                'meta_keywords' => 'telescopic rod, travel fishing, portable rod, camping fishing',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'base_name' => 'Heavy Duty Casting Rod',
                'slug' => 'heavy-duty-casting-rod',
                // Casting Rods
                'category_ids' => json_encode([1, 12]), // Fishing Rods, Casting Rods
                'brand_id' => 2, // Shimano
                'status' => 'published',
                'is_featured' => true,
                'description' => 'Heavy-duty casting rod designed for big game fishing. Built with strong materials and reinforced guides for maximum durability.',
                'short_description' => 'Powerful casting rod for big game fishing.',
                'thumbnail' => 'https://via.placeholder.com/600x600/F59E0B/FFFFFF?text=Casting+Rod',
                'base_thumbnail_url' => 'https://via.placeholder.com/600x600/F59E0B/FFFFFF?text=Casting+Rod',
                'gallery_images' => json_encode([
                    'https://via.placeholder.com/600x600/F59E0B/FFFFFF?text=Casting+Rod+1',
                    'https://via.placeholder.com/600x600/F59E0B/FFFFFF?text=Casting+Rod+2',
                ]),
                'specifications' => json_encode([
                    'Material' => 'E-Glass Composite',
                    'Length' => '8ft / 2.4m',
                    'Power' => 'Heavy',
                    'Action' => 'Moderate',
                    'Sections' => '1',
                    'Line Weight' => '20-50lb',
                    'Lure Weight' => '1-4 oz',
                    'Handle' => 'Full EVA',
                ]),
                'weight' => 280,
                'dimensions' => '8ft length, 1 piece',
                'tags' => json_encode(['casting', 'heavy duty', 'big game', 'durable']),
                'meta_title' => 'Heavy Duty Casting Rod - Shimano',
                'meta_description' => 'Powerful heavy-duty casting rod for big game fishing enthusiasts.',
                'meta_keywords' => 'casting rod, heavy duty fishing, big game, Shimano rod',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Fishing Reels
            [
                'base_name' => 'Spinning Fishing Reel',
                'slug' => 'spinning-fishing-reel',
                // Spinning Reels
                'category_ids' => json_encode([2, 14]), // Fishing Reels, Spinning Reels
                'brand_id' => 1, // Hook & Hunt
                'status' => 'published',
                'is_featured' => true,
                'description' => 'Smooth and reliable spinning reel with advanced drag system. Perfect for both freshwater and saltwater fishing.',
                'short_description' => 'Smooth spinning reel with advanced drag system.',
                'thumbnail' => 'https://via.placeholder.com/600x600/EF4444/FFFFFF?text=Spinning+Reel',
                'base_thumbnail_url' => 'https://via.placeholder.com/600x600/EF4444/FFFFFF?text=Spinning+Reel',
                'gallery_images' => json_encode([
                    'https://via.placeholder.com/600x600/EF4444/FFFFFF?text=Spinning+Reel+1',
                    'https://via.placeholder.com/600x600/EF4444/FFFFFF?text=Spinning+Reel+2',
                ]),
                'specifications' => json_encode([
                    'Material' => 'Aluminum + Graphite',
                    'Bearings' => '10 + 1',
                    'Gear Ratio' => '5.2:1',
                    'Line Capacity' => '200yds/12lb',
                    'Drag System' => 'Front Drag',
                    'Weight' => '8.8 oz',
                ]),
                'weight' => 250,
                'dimensions' => '5.5" x 3" x 3"',
                'tags' => json_encode(['spinning reel', 'smooth drag', 'versatile']),
                'meta_title' => 'Spinning Fishing Reel - Hook & Hunt',
                'meta_description' => 'Smooth and reliable spinning reel perfect for all fishing conditions.',
                'meta_keywords' => 'spinning reel, fishing reel, drag system, Hook & Hunt',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'base_name' => 'Baitcasting Reel Pro',
                'slug' => 'baitcasting-reel-pro',
                // Baitcasting Reels
                'category_ids' => json_encode([2, 15]), // Fishing Reels, Baitcasting Reels
                'brand_id' => 3, // Daiwa
                'status' => 'published',
                'is_featured' => false,
                'description' => 'Professional baitcasting reel with magnetic cast control and precision engineering for tournament fishing.',
                'short_description' => 'Professional baitcasting reel with magnetic control.',
                'thumbnail' => 'https://via.placeholder.com/600x600/8B5CF6/FFFFFF?text=Baitcasting+Reel',
                'base_thumbnail_url' => 'https://via.placeholder.com/600x600/8B5CF6/FFFFFF?text=Baitcasting+Reel',
                'gallery_images' => json_encode([
                    'https://via.placeholder.com/600x600/8B5CF6/FFFFFF?text=Baitcasting+Reel+1',
                    'https://via.placeholder.com/600x600/8B5CF6/FFFFFF?text=Baitcasting+Reel+2',
                ]),
                'specifications' => json_encode([
                    'Material' => 'Aluminum Frame',
                    'Bearings' => '8 + 1',
                    'Gear Ratio' => '7.3:1',
                    'Line Capacity' => '140yds/14lb',
                    'Cast Control' => 'Magnetic',
                    'Weight' => '7.2 oz',
                ]),
                'weight' => 204,
                'dimensions' => '5.2" x 2.8" x 2.8"',
                'tags' => json_encode(['baitcasting', 'tournament', 'magnetic control', 'professional']),
                'meta_title' => 'Baitcasting Reel Pro - Daiwa',
                'meta_description' => 'Professional baitcasting reel with magnetic cast control for tournament fishing.',
                'meta_keywords' => 'baitcasting reel, tournament fishing, Daiwa reel, magnetic control',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Fishing Lines
            [
                'base_name' => 'Monofilament Fishing Line',
                'slug' => 'monofilament-fishing-line',
                // Monofilament Lines
                'category_ids' => json_encode([3, 16]), // Fishing Lines, Monofilament Lines
                'brand_id' => 1, // Hook & Hunt
                'status' => 'published',
                'is_featured' => false,
                'description' => 'High-quality monofilament fishing line with excellent strength and flexibility. Perfect for everyday fishing.',
                'short_description' => 'Durable monofilament line with excellent strength.',
                'thumbnail' => 'https://via.placeholder.com/600x600/06B6D4/FFFFFF?text=Monofilament+Line',
                'base_thumbnail_url' => 'https://via.placeholder.com/600x600/06B6D4/FFFFFF?text=Monofilament+Line',
                'gallery_images' => json_encode([
                    'https://via.placeholder.com/600x600/06B6D4/FFFFFF?text=Monofilament+Line+1',
                ]),
                'specifications' => json_encode([
                    'Material' => 'Nylon',
                    'Diameter' => '0.30mm',
                    'Test Weight' => '10lb',
                    'Length' => '300 yards',
                    'Color' => 'Clear',
                    'Stretch' => '20-25%',
                ]),
                'weight' => 50,
                'dimensions' => '300 yards',
                'tags' => json_encode(['monofilament', 'line', 'nylon', 'versatile']),
                'meta_title' => 'Monofilament Fishing Line - Hook & Hunt',
                'meta_description' => 'High-quality monofilament fishing line with excellent strength and flexibility.',
                'meta_keywords' => 'monofilament line, fishing line, nylon line, Hook & Hunt',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'base_name' => 'Braided Fishing Line',
                'slug' => 'braided-fishing-line',
                // Braided Lines
                'category_ids' => json_encode([3, 17]), // Fishing Lines, Braided Lines
                'brand_id' => 2, // Shimano
                'status' => 'published',
                'is_featured' => true,
                'description' => 'Ultra-strong braided fishing line with zero stretch for maximum sensitivity and hook setting power.',
                'short_description' => 'Zero-stretch braided line for maximum sensitivity.',
                'thumbnail' => 'https://via.placeholder.com/600x600/84CC16/FFFFFF?text=Braided+Line',
                'base_thumbnail_url' => 'https://via.placeholder.com/600x600/84CC16/FFFFFF?text=Braided+Line',
                'gallery_images' => json_encode([
                    'https://via.placeholder.com/600x600/84CC16/FFFFFF?text=Braided+Line+1',
                    'https://via.placeholder.com/600x600/84CC16/FFFFFF?text=Braided+Line+2',
                ]),
                'specifications' => json_encode([
                    'Material' => 'PE Fiber',
                    'Diameter' => '0.20mm',
                    'Test Weight' => '20lb',
                    'Length' => '150 yards',
                    'Color' => 'Hi-Vis Yellow',
                    'Stretch' => 'Zero',
                ]),
                'weight' => 30,
                'dimensions' => '150 yards',
                'tags' => json_encode(['braided', 'zero stretch', 'sensitive', 'strong']),
                'meta_title' => 'Braided Fishing Line - Shimano',
                'meta_description' => 'Ultra-strong zero-stretch braided line for maximum fishing sensitivity.',
                'meta_keywords' => 'braided line, fishing line, zero stretch, Shimano line',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'base_name' => 'Fluorocarbon Leader Line',
                'slug' => 'fluorocarbon-leader-line',
                // Fluorocarbon Lines
                'category_ids' => json_encode([3, 18]), // Fishing Lines, Fluorocarbon Lines
                'brand_id' => 3, // Daiwa
                'status' => 'published',
                'is_featured' => false,
                'description' => 'Invisible underwater fluorocarbon leader line with superior abrasion resistance and knot strength.',
                'short_description' => 'Invisible fluorocarbon leader with superior strength.',
                'thumbnail' => 'https://via.placeholder.com/600x600/F97316/FFFFFF?text=Fluorocarbon+Line',
                'base_thumbnail_url' => 'https://via.placeholder.com/600x600/F97316/FFFFFF?text=Fluorocarbon+Line',
                'gallery_images' => json_encode([
                    'https://via.placeholder.com/600x600/F97316/FFFFFF?text=Fluorocarbon+Line+1',
                ]),
                'specifications' => json_encode([
                    'Material' => '100% Fluorocarbon',
                    'Diameter' => '0.25mm',
                    'Test Weight' => '15lb',
                    'Length' => '100 yards',
                    'Color' => 'Clear',
                    'Visibility' => 'Invisible Underwater',
                ]),
                'weight' => 20,
                'dimensions' => '100 yards',
                'tags' => json_encode(['fluorocarbon', 'leader', 'invisible', 'abrasion resistant']),
                'meta_title' => 'Fluorocarbon Leader Line - Daiwa',
                'meta_description' => 'Invisible underwater fluorocarbon leader line with superior abrasion resistance.',
                'meta_keywords' => 'fluorocarbon line, leader line, invisible fishing line, Daiwa',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Hooks & Terminal Tackle
            [
                'base_name' => 'Premium Fishing Hooks Set',
                'slug' => 'premium-fishing-hooks-set',
                // Fishing Hooks
                'category_ids' => json_encode([4, 19]), // Hooks & Terminal Tackle, Fishing Hooks
                'brand_id' => 1, // Hook & Hunt
                'status' => 'published',
                'is_featured' => false,
                'description' => 'Complete set of high-quality fishing hooks in various sizes and styles. Perfect for all types of fishing.',
                'short_description' => 'Complete hook set for all fishing needs.',
                'thumbnail' => 'https://via.placeholder.com/600x600/EC4899/FFFFFF?text=Fishing+Hooks',
                'base_thumbnail_url' => 'https://via.placeholder.com/600x600/EC4899/FFFFFF?text=Fishing+Hooks',
                'gallery_images' => json_encode([
                    'https://via.placeholder.com/600x600/EC4899/FFFFFF?text=Fishing+Hooks+1',
                    'https://via.placeholder.com/600x600/EC4899/FFFFFF?text=Fishing+Hooks+2',
                ]),
                'specifications' => json_encode([
                    'Material' => 'High Carbon Steel',
                    'Sizes Included' => '6, 8, 10, 12, 14',
                    'Types' => 'J-Hook, Circle, Treble',
                    'Coating' => 'Anti-Rust',
                    'Quantity' => '50 hooks total',
                    'Case' => 'Plastic organizer',
                ]),
                'weight' => 80,
                'dimensions' => '6" x 4" x 1"',
                'tags' => json_encode(['hooks', 'set', 'various sizes', 'complete']),
                'meta_title' => 'Premium Fishing Hooks Set - Hook & Hunt',
                'meta_description' => 'Complete set of high-quality fishing hooks in various sizes and styles.',
                'meta_keywords' => 'fishing hooks, hook set, terminal tackle, Hook & Hunt',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'base_name' => 'Swivels and Snap Clips Set',
                'slug' => 'swivels-snap-clips-set',
                // Swivels & Snap Clips
                'category_ids' => json_encode([4, 20]), // Hooks & Terminal Tackle, Swivels & Snap Clips
                'brand_id' => 4, // Penn
                'status' => 'published',
                'is_featured' => false,
                'description' => 'High-quality swivels and snap clips set for preventing line twist and quick lure changes.',
                'short_description' => 'Essential swivels and snap clips for line management.',
                'thumbnail' => 'https://via.placeholder.com/600x600/14B8A6/FFFFFF?text=Swivels+Snaps',
                'base_thumbnail_url' => 'https://via.placeholder.com/600x600/14B8A6/FFFFFF?text=Swivels+Snaps',
                'gallery_images' => json_encode([
                    'https://via.placeholder.com/600x600/14B8A6/FFFFFF?text=Swivels+Snaps+1',
                ]),
                'specifications' => json_encode([
                    'Material' => 'Stainless Steel',
                    'Swivel Sizes' => '#5, #7, #10',
                    'Types' => 'Barrel, Ball Bearing',
                    'Snap Clips' => '50 included',
                    'Total Pieces' => '100',
                    'Test Strength' => '30-50lb',
                ]),
                'weight' => 60,
                'dimensions' => '5" x 3" x 1"',
                'tags' => json_encode(['swivels', 'snap clips', 'line management', 'stainless']),
                'meta_title' => 'Swivels and Snap Clips Set - Penn',
                'meta_description' => 'High-quality swivels and snap clips for preventing line twist.',
                'meta_keywords' => 'fishing swivels, snap clips, terminal tackle, Penn fishing',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Lures & Baits
            [
                'base_name' => 'Hard Plastic Lure Set',
                'slug' => 'hard-plastic-lure-set',
                // Hard Lures
                'category_ids' => json_encode([5, 21]), // Lures & Baits, Hard Lures
                'brand_id' => 1, // Hook & Hunt
                'status' => 'published',
                'is_featured' => true,
                'description' => 'Professional hard plastic lure set with realistic swimming action and vibrant colors.',
                'short_description' => 'Realistic hard plastic lures for various fish species.',
                'thumbnail' => 'https://via.placeholder.com/600x600/9333EA/FFFFFF?text=Hard+Lures',
                'base_thumbnail_url' => 'https://via.placeholder.com/600x600/9333EA/FFFFFF?text=Hard+Lures',
                'gallery_images' => json_encode([
                    'https://via.placeholder.com/600x600/9333EA/FFFFFF?text=Hard+Lures+1',
                    'https://via.placeholder.com/600x600/9333EA/FFFFFF?text=Hard+Lures+2',
                    'https://via.placeholder.com/600x600/9333EA/FFFFFF?text=Hard+Lures+3',
                ]),
                'specifications' => json_encode([
                    'Material' => 'ABS Plastic',
                    'Quantity' => '12 lures',
                    'Weights' => '5g, 7g, 10g',
                    'Diving Depth' => '1-3 meters',
                    'Hook Size' => '#6',
                    'Colors' => 'Multiple patterns',
                ]),
                'weight' => 150,
                'dimensions' => '8" x 6" x 2"',
                'tags' => json_encode(['hard lures', 'plastic lures', 'realistic', 'colorful']),
                'meta_title' => 'Hard Plastic Lure Set - Hook & Hunt',
                'meta_description' => 'Professional hard plastic lure set with realistic swimming action.',
                'meta_keywords' => 'hard lures, plastic lures, fishing lures, Hook & Hunt',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'base_name' => 'Soft Plastic Worms',
                'slug' => 'soft-plastic-worms',
                // Soft Lures
                'category_ids' => json_encode([5, 22]), // Lures & Baits, Soft Lures
                'brand_id' => 5, // Abu Garcia
                'status' => 'published',
                'is_featured' => false,
                'description' => 'Soft plastic worms with lifelike movement and scent. Perfect for bass and other freshwater fish.',
                'short_description' => 'Lifelike soft plastic worms with scent.',
                'thumbnail' => 'https://via.placeholder.com/600x600/059669/FFFFFF?text=Soft+Worms',
                'base_thumbnail_url' => 'https://via.placeholder.com/600x600/059669/FFFFFF?text=Soft+Worms',
                'gallery_images' => json_encode([
                    'https://via.placeholder.com/600x600/059669/FFFFFF?text=Soft+Worms+1',
                    'https://via.placeholder.com/600x600/059669/FFFFFF?text=Soft+Worms+2',
                ]),
                'specifications' => json_encode([
                    'Material' => 'Soft PVC',
                    'Length' => '6 inches',
                    'Quantity' => '20 worms',
                    'Colors' => '5 varieties',
                    'Scent' => 'Anise infused',
                    'Packaging' => ' Resealable bag',
                ]),
                'weight' => 100,
                'dimensions' => '7" x 5" x 1"',
                'tags' => json_encode(['soft lures', 'worms', 'scented', 'bass fishing']),
                'meta_title' => 'Soft Plastic Worms - Abu Garcia',
                'meta_description' => 'Lifelike soft plastic worms with scent for effective bass fishing.',
                'meta_keywords' => 'soft lures, plastic worms, bass fishing, Abu Garcia',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Fishing Accessories
            [
                'base_name' => 'Fishing Tackle Box',
                'slug' => 'fishing-tackle-box',
                // Fishing Accessories
                'category_ids' => json_encode([6]), // Fishing Accessories
                'brand_id' => 1, // Hook & Hunt
                'status' => 'published',
                'is_featured' => false,
                'description' => 'Spacious fishing tackle box with multiple compartments and removable trays.',
                'short_description' => 'Organized tackle box with multiple compartments.',
                'thumbnail' => 'https://via.placeholder.com/600x600/DC2626/FFFFFF?text=Tackle+Box',
                'base_thumbnail_url' => 'https://via.placeholder.com/600x600/DC2626/FFFFFF?text=Tackle+Box',
                'gallery_images' => json_encode([
                    'https://via.placeholder.com/600x600/DC2626/FFFFFF?text=Tackle+Box+1',
                    'https://via.placeholder.com/600x600/DC2626/FFFFFF?text=Tackle+Box+2',
                ]),
                'specifications' => json_encode([
                    'Material' => 'Polypropylene',
                    'Dimensions' => '14" x 8" x 7"',
                    'Compartments' => '4 trays + storage',
                    'Locking System' => 'Latches',
                    'Handle' => 'Comfort grip',
                    'Color' => 'Black/Red',
                ]),
                'weight' => 1200,
                'dimensions' => '14" x 8" x 7"',
                'tags' => json_encode(['tackle box', 'storage', 'organized', 'portable']),
                'meta_title' => 'Fishing Tackle Box - Hook & Hunt',
                'meta_description' => 'Spacious fishing tackle box with multiple compartments for organization.',
                'meta_keywords' => 'tackle box, fishing storage, fishing accessories, Hook & Hunt',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'base_name' => 'Fishing Pliers Tool',
                'slug' => 'fishing-pliers-tool',
                // Fishing Tools
                'category_ids' => json_encode([7]), // Fishing Tools
                'brand_id' => 2, // Shimano
                'status' => 'published',
                'is_featured' => false,
                'description' => 'Multi-functional fishing pliers with split ring opener, line cutter, and crimping tool.',
                'short_description' => 'Essential fishing pliers with multiple functions.',
                'thumbnail' => 'https://via.placeholder.com/600x600/6366F1/FFFFFF?text=Fishing+Pliers',
                'base_thumbnail_url' => 'https://via.placeholder.com/600x600/6366F1/FFFFFF?text=Fishing+Pliers',
                'gallery_images' => json_encode([
                    'https://via.placeholder.com/600x600/6366F1/FFFFFF?text=Fishing+Pliers+1',
                ]),
                'specifications' => json_encode([
                    'Material' => 'Stainless Steel',
                    'Length' => '6.5 inches',
                    'Features' => 'Line cutter, Split ring opener, Crimper',
                    'Coating' => 'Anti-corrosion',
                    'Sheath' => 'Nylon included',
                    'Grip' => 'Non-slip rubber',
                ]),
                'weight' => 180,
                'dimensions' => '6.5" length',
                'tags' => json_encode(['pliers', 'tools', 'multi-functional', 'stainless']),
                'meta_title' => 'Fishing Pliers Tool - Shimano',
                'meta_description' => 'Multi-functional fishing pliers with line cutter and split ring opener.',
                'meta_keywords' => 'fishing pliers, fishing tools, multi-tool, Shimano tools',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Fishing Bags & Storage
            [
                'base_name' => 'Fishing Backpack',
                'slug' => 'fishing-backpack',
                // Fishing Bags & Storage
                'category_ids' => json_encode([8]), // Fishing Bags & Storage
                'brand_id' => 1, // Hook & Hunt
                'status' => 'published',
                'is_featured' => false,
                'description' => 'Comfortable fishing backpack with specialized rod holders and multiple pockets for gear.',
                'short_description' => 'Specialized fishing backpack with rod holders.',
                'thumbnail' => 'https://via.placeholder.com/600x600/8B5CF6/FFFFFF?text=Fishing+Backpack',
                'base_thumbnail_url' => 'https://via.placeholder.com/600x600/8B5CF6/FFFFFF?text=Fishing+Backpack',
                'gallery_images' => json_encode([
                    'https://via.placeholder.com/600x600/8B5CF6/FFFFFF?text=Fishing+Backpack+1',
                    'https://via.placeholder.com/600x600/8B5CF6/FFFFFF?text=Fishing+Backpack+2',
                ]),
                'specifications' => json_encode([
                    'Material' => 'Nylon Oxford',
                    'Capacity' => '30 liters',
                    'Rod Holders' => '2 removable',
                    'Pockets' => '6 total',
                    'Back Padding' => 'Mesh ventilation',
                    'Color' => 'Camo/Black',
                ]),
                'weight' => 850,
                'dimensions' => '20" x 14" x 8"',
                'tags' => json_encode(['backpack', 'fishing bag', 'rod holders', 'storage']),
                'meta_title' => 'Fishing Backpack - Hook & Hunt',
                'meta_description' => 'Comfortable fishing backpack with rod holders and multiple pockets.',
                'meta_keywords' => 'fishing backpack, fishing bag, rod holders, Hook & Hunt',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Fishing Electronics
            [
                'base_name' => 'Fish Finder Portable',
                'slug' => 'fish-finder-portable',
                // Fishing Electronics
                'category_ids' => json_encode([10]), // Fishing Electronics
                'brand_id' => 2, // Shimano
                'status' => 'published',
                'is_featured' => true,
                'description' => 'Portable fish finder with LCD display and depth detection up to 100 feet.',
                'short_description' => 'Portable fish finder for locating fish underwater.',
                'thumbnail' => 'https://via.placeholder.com/600x600/0891B2/FFFFFF?text=Fish+Finder',
                'base_thumbnail_url' => 'https://via.placeholder.com/600x600/0891B2/FFFFFF?text=Fish+Finder',
                'gallery_images' => json_encode([
                    'https://via.placeholder.com/600x600/0891B2/FFFFFF?text=Fish+Finder+1',
                    'https://via.placeholder.com/600x600/0891B2/FFFFFF?text=Fish+Finder+2',
                ]),
                'specifications' => json_encode([
                    'Display' => '2.8" LCD',
                    'Depth Range' => '3-100 feet',
                    'Detection Angle' => '90 degrees',
                    'Power' => 'Battery operated',
                    'Battery Life' => '20 hours',
                    'Waterproof' => 'IPX4',
                ]),
                'weight' => 120,
                'dimensions' => '4" x 3" x 1.5"',
                'tags' => json_encode(['fish finder', 'electronics', 'portable', 'depth detector']),
                'meta_title' => 'Fish Finder Portable - Shimano',
                'meta_description' => 'Portable fish finder with LCD display and depth detection.',
                'meta_keywords' => 'fish finder, fishing electronics, portable fish finder, Shimano',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // Insert products without duplicates
        foreach ($products as $product) {
            Product::firstOrCreate(
                ['slug' => $product['slug']],
                $product
            );
        }
    }
}