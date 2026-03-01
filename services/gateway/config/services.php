<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Service URLs
    |--------------------------------------------------------------------------
    |
    | URLs of all microservices for routing
    |
    */

    'auth' => env('SERVICE_AUTH_URL', 'http://localhost:8001'),
    'user' => env('SERVICE_USER_URL', 'http://localhost:8013'),
    'settings' => env('SERVICE_SETTINGS_URL', 'http://localhost:8014'),
    'media' => env('SERVICE_MEDIA_URL', 'http://localhost:8015'),

    'catalog' => env('SERVICE_CATALOG_URL', 'http://localhost:8003'),
    'inventory' => env('SERVICE_INVENTORY_URL', 'http://localhost:8004'),
    'procurement' => env('SERVICE_PROCUREMENT_URL', 'http://localhost:8005'),
    'sales' => env('SERVICE_SALES_URL', 'http://localhost:8006'),
    'logistics' => env('SERVICE_LOGISTICS_URL', 'http://localhost:8007'),
    'finance' => env('SERVICE_FINANCE_URL', 'http://localhost:8008'),
    'hrm' => env('SERVICE_HRM_URL', 'http://localhost:8009'),
    'crm' => env('SERVICE_CRM_URL', 'http://localhost:8010'),
    'wallet' => env('SERVICE_WALLET_URL', 'http://localhost:8011'),
    'cms' => env('SERVICE_CMS_URL', 'http://localhost:8012'),
    'public' => env('SERVICE_PUBLIC_URL', 'http://localhost:8018'),
];
