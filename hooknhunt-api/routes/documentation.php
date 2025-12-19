<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API DOCUMENTATION ROUTES
|--------------------------------------------------------------------------
|
| This file contains all routes for API documentation
|
*/

Route::get('/documentation', function () {
    return view('l5-swagger::index');
});

// JSON file for Swagger UI
Route::get('/documentation.json', function () {
    return response()->json([
        'openapi' => '3.0.0',
        'info' => [
            'title' => 'Hook & Hunt Storefront API',
            'description' => 'API documentation for the Hook & Hunt e-commerce storefront. This includes authentication, categories, products, and customer account management.',
            'version' => '1.0.0',
            'contact' => [
                'name' => 'API Support',
                'email' => 'support@hooknhunt.com'
            ]
        ],
        'servers' => [
            [
                'url' => env('APP_URL', 'http://localhost:8000') . '/api/v1/store',
                'description' => 'Development Server'
            ]
        ],
        'paths' => [
            '/auth/register' => [
                'post' => [
                    'summary' => 'Register new customer',
                    'description' => 'Create a new customer account with phone number and receive OTP for verification',
                    'tags' => ['Authentication'],
                    'requestBody' => [
                        'required' => true,
                        'content' => [
                            'application/json' => [
                                'schema' => [
                                    'type' => 'object',
                                    'required' => ['name', 'phone', 'password', 'password_confirmation'],
                                    'properties' => [
                                        'name' => [
                                            'type' => 'string',
                                            'example' => 'John Doe'
                                        ],
                                        'phone' => [
                                            'type' => 'string',
                                            'example' => '+8801234567890'
                                        ],
                                        'email' => [
                                            'type' => 'string',
                                            'format' => 'email',
                                            'example' => 'john@example.com'
                                        ],
                                        'password' => [
                                            'type' => 'string',
                                            'format' => 'password',
                                            'example' => 'password123'
                                        ],
                                        'password_confirmation' => [
                                            'type' => 'string',
                                            'format' => 'password',
                                            'example' => 'password123'
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ],
                    'responses' => [
                        '201' => [
                            'description' => 'Customer registered successfully',
                            'content' => [
                                'application/json' => [
                                    'schema' => [
                                        'type' => 'object',
                                        'properties' => [
                                            'message' => [
                                                'type' => 'string',
                                                'example' => 'Registration successful. Please verify your phone with OTP.'
                                            ],
                                            'customer' => [
                                                'type' => 'object',
                                                'properties' => [
                                                    'id' => [
                                                        'type' => 'integer',
                                                        'example' => 1
                                                    ],
                                                    'name' => [
                                                        'type' => 'string',
                                                        'example' => 'John Doe'
                                                    ],
                                                    'phone' => [
                                                        'type' => 'string',
                                                        'example' => '+8801234567890'
                                                    ],
                                                    'phone_verified' => [
                                                        'type' => 'boolean',
                                                        'example' => false
                                                    ]
                                                ]
                                            ]
                                        ]
                                    ]
                                ]
                            ]
                        ],
                        '422' => [
                            'description' => 'Validation error'
                        ]
                    ]
                ]
            ],
            '/auth/login' => [
                'post' => [
                    'summary' => 'Customer login',
                    'description' => 'Authenticate customer with phone and password',
                    'tags' => ['Authentication'],
                    'requestBody' => [
                        'required' => true,
                        'content' => [
                            'application/json' => [
                                'schema' => [
                                    'type' => 'object',
                                    'required' => ['phone', 'password'],
                                    'properties' => [
                                        'phone' => [
                                            'type' => 'string',
                                            'example' => '+8801234567890'
                                        ],
                                        'password' => [
                                            'type' => 'string',
                                            'format' => 'password',
                                            'example' => 'password123'
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ],
                    'responses' => [
                        '200' => [
                            'description' => 'Login successful',
                            'content' => [
                                'application/json' => [
                                    'schema' => [
                                        'type' => 'object',
                                        'properties' => [
                                            'message' => [
                                                'type' => 'string',
                                                'example' => 'Login successful'
                                            ],
                                            'token' => [
                                                'type' => 'string',
                                                'example' => '1|abc123token456'
                                            ],
                                            'customer' => [
                                                'type' => 'object',
                                                'properties' => [
                                                    'id' => [
                                                        'type' => 'integer',
                                                        'example' => 1
                                                    ],
                                                    'name' => [
                                                        'type' => 'string',
                                                        'example' => 'John Doe'
                                                    ],
                                                    'phone' => [
                                                        'type' => 'string',
                                                        'example' => '+8801234567890'
                                                    ]
                                                ]
                                            ]
                                        ]
                                    ]
                                ]
                            ]
                        ],
                        '401' => [
                            'description' => 'Invalid credentials'
                        ]
                    ]
                ]
            ],
            '/categories' => [
                'get' => [
                    'summary' => 'Get all categories',
                    'description' => 'Retrieve all categories with hierarchical structure and flat list',
                    'tags' => ['Categories'],
                    'responses' => [
                        '200' => [
                            'description' => 'Categories retrieved successfully',
                            'content' => [
                                'application/json' => [
                                    'schema' => [
                                        'type' => 'object',
                                        'properties' => [
                                            'categories' => [
                                                'type' => 'array',
                                                'items' => [
                                                    'type' => 'object',
                                                    'properties' => [
                                                        'id' => [
                                                            'type' => 'integer',
                                                            'example' => 1
                                                        ],
                                                        'name' => [
                                                            'type' => 'string',
                                                            'example' => 'Electronics'
                                                        ],
                                                        'slug' => [
                                                            'type' => 'string',
                                                            'example' => 'electronics'
                                                        ],
                                                        'image_url' => [
                                                            'type' => 'string',
                                                            'nullable' => true,
                                                            'example' => 'http://localhost:8000/storage/categories/electronics.jpg'
                                                        ],
                                                        'children' => [
                                                            'type' => 'array',
                                                            'items' => [
                                                                '$ref' => '#/components/schemas/Category'
                                                            ]
                                                        ]
                                                    ]
                                                ]
                                            ],
                                            'all_categories' => [
                                                'type' => 'array',
                                                'items' => [
                                                    '$ref' => '#/components/schemas/Category'
                                                ]
                                            ]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ],
            '/categories/featured' => [
                'get' => [
                    'summary' => 'Get featured categories',
                    'description' => 'Retrieve top-level categories for homepage display',
                    'tags' => ['Categories'],
                    'responses' => [
                        '200' => [
                            'description' => 'Featured categories retrieved successfully',
                            'content' => [
                                'application/json' => [
                                    'schema' => [
                                        'type' => 'array',
                                        'items' => [
                                            '$ref' => '#/components/schemas/Category'
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ],
            '/categories/{slug}' => [
                'get' => [
                    'summary' => 'Get category by slug',
                    'description' => 'Retrieve a single category with its children using slug',
                    'tags' => ['Categories'],
                    'parameters' => [
                        [
                            'name' => 'slug',
                            'in' => 'path',
                            'required' => true,
                            'schema' => [
                                'type' => 'string'
                            ],
                            'example' => 'electronics'
                        ]
                    ],
                    'responses' => [
                        '200' => [
                            'description' => 'Category retrieved successfully',
                            'content' => [
                                'application/json' => [
                                    'schema' => [
                                        'type' => 'object',
                                        'properties' => [
                                            'category' => [
                                                'type' => 'object',
                                                'properties' => [
                                                    'id' => [
                                                        'type' => 'integer',
                                                        'example' => 1
                                                    ],
                                                    'name' => [
                                                        'type' => 'string',
                                                        'example' => 'Electronics'
                                                    ],
                                                    'slug' => [
                                                        'type' => 'string',
                                                        'example' => 'electronics'
                                                    ],
                                                    'image_url' => [
                                                        'type' => 'string',
                                                        'nullable' => true,
                                                        'example' => 'http://localhost:8000/storage/categories/electronics.jpg'
                                                    ],
                                                    'children' => [
                                                        'type' => 'array',
                                                        'items' => [
                                                            '$ref' => '#/components/schemas/Category'
                                                        ]
                                                    ]
                                                ]
                                            ]
                                        ]
                                    ]
                                ]
                            ]
                        ],
                        '404' => [
                            'description' => 'Category not found'
                        ]
                    ]
                ]
            ]
        ],
        'components' => [
            'schemas' => [
                'Category' => [
                    'type' => 'object',
                    'properties' => [
                        'id' => [
                            'type' => 'integer',
                            'example' => 1
                        ],
                        'name' => [
                            'type' => 'string',
                            'example' => 'Electronics'
                        ],
                        'slug' => [
                            'type' => 'string',
                            'example' => 'electronics'
                        ],
                        'parent_id' => [
                            'type' => 'integer',
                            'nullable' => true,
                            'example' => null
                        ],
                        'image_url' => [
                            'type' => 'string',
                            'nullable' => true,
                            'example' => 'http://localhost:8000/storage/categories/electronics.jpg'
                        ]
                    ]
                ]
            ],
            'securitySchemes' => [
                'bearerAuth' => [
                    'type' => 'http',
                    'scheme' => 'bearer',
                    'bearerFormat' => 'JWT'
                ]
            ]
        ],
        'tags' => [
            [
                'name' => 'Authentication',
                'description' => 'Customer authentication operations'
            ],
            [
                'name' => 'Categories',
                'description' => 'Product category operations'
            ]
        ]
    ]);
});