<?php

namespace App\Http\Controllers;

use App\Services\ProxyService;
use Illuminate\Http\Request;

class GatewayController extends Controller
{
    /**
     * Forward request to appropriate service based on route prefix.
     */
    public function forward(Request $request, string $service)
    {
        // Get service URL from config
        $serviceUrl = ProxyService::getServiceUrl($service);

        if (!$serviceUrl) {
            return response()->json([
                'status' => false,
                'message' => 'Service not found',
                'errors' => [
                    'service' => $service,
                ],
            ], 404);
        }

        // Forward request to service
        return ProxyService::forward($request, $serviceUrl);
    }

    /**
     * Gateway health check.
     */
    public function health()
    {
        return response()->json([
            'status' => 'ok',
            'service' => 'api-gateway',
            'version' => '1.0.0',
            'timestamp' => now()->toIso8601String(),
            'services' => [
                'auth' => $this->checkService('auth'),
                'user' => $this->checkService('user'),
                'catalog' => $this->checkService('catalog'),
                // Add other services as needed
            ],
        ]);
    }

    /**
     * Check if a service is healthy.
     */
    private function checkService(string $serviceName): array
    {
        $serviceUrl = ProxyService::getServiceUrl($serviceName);

        if (!$serviceUrl) {
            return ['status' => 'not_configured'];
        }

        try {
            $response = \Illuminate\Support\Facades\Http::timeout(5)->get($serviceUrl . '/api/health');

            return [
                'status' => $response->successful() ? 'ok' : 'error',
                'response_time' => $response->handlerStats()['total_time'] ?? null,
            ];

        } catch (\Exception $e) {
            return [
                'status' => 'unreachable',
                'error' => $e->getMessage(),
            ];
        }
    }
}
