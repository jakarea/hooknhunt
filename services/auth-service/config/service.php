<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Service Configuration
    |--------------------------------------------------------------------------
    |
    | Service-specific configuration for microservices architecture
    |
    */

    'name' => env('SERVICE_NAME', 'auth-service'),
    'port' => env('SERVICE_PORT', 8001),
    'version' => '1.0.0',

    /*
    |--------------------------------------------------------------------------
    | Event Broadcasting
    |--------------------------------------------------------------------------
    |
    | Configuration for dispatching events to other services
    |
    */
    'events' => [
        'enabled' => env('EVENTS_ENABLED', true),
        'driver' => env('EVENT_DRIVER', 'log'), // log, redis, http
    ],

    /*
    |--------------------------------------------------------------------------
    | Service Discovery
    |--------------------------------------------------------------------------
    |
    | URLs of other microservices
    |
    */
    'services' => [
        'user' => env('USER_SERVICE_URL', 'http://localhost:8013'),
        'settings' => env('SETTINGS_SERVICE_URL', 'http://localhost:8014'),
        'media' => env('MEDIA_SERVICE_URL', 'http://localhost:8015'),
    ],
];
