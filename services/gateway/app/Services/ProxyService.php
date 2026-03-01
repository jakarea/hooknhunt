<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ProxyService
{
    /**
     * Forward request to target service.
     */
    public static function forward(Request $request, string $serviceUrl)
    {
        // Build target URL
        $path = $request->path();
        $queryString = $request->getQueryString();
        $targetUrl = $serviceUrl . '/' . $path;

        if ($queryString) {
            $targetUrl .= '?' . $queryString;
        }

        // Log the request
        Log::info("Gateway: {$request->method()} {$path} → {$serviceUrl}");

        // Prepare headers
        $headers = [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ];

        // Forward auth token if present
        if ($request->bearerToken()) {
            $headers['Authorization'] = 'Bearer ' . $request->bearerToken();
        }

        // Forward user context headers if present (set by auth middleware)
        if ($request->hasHeader('X-User-Id')) {
            $headers['X-User-Id'] = $request->header('X-User-Id');
        }

        if ($request->hasHeader('X-User-Type')) {
            $headers['X-User-Type'] = $request->header('X-User-Type');
        }

        // Forward request based on method
        $method = strtolower($request->method());

        try {
            $response = Http::withHeaders($headers)
                ->timeout(30)
                ->$method(
                    $targetUrl,
                    $request->all()
                );

            // Log response
            Log::info("Gateway: Response {$response->status()} from {$serviceUrl}");

            // Return response with status code and headers
            return response(
                $response->body(),
                $response->status(),
                [
                    'Content-Type' => 'application/json',
                ]
            );

        } catch (\Exception $e) {
            Log::error("Gateway: Service error - " . $e->getMessage());

            return response()->json([
                'status' => false,
                'message' => 'Service unavailable',
                'errors' => [
                    'service' => $serviceUrl,
                    'reason' => $e->getMessage(),
                ],
            ], 503);
        }
    }

    /**
     * Get service URL from service name.
     */
    public static function getServiceUrl(string $serviceName): string
    {
        return config("services.{$serviceName}", null);
    }
}
