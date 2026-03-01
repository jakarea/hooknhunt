<?php

namespace Modules\Auth\Traits;

use Illuminate\Http\JsonResponse;

/**
 * API Response Trait
 *
 * Standardized API responses across all modules
 */
trait ApiResponse
{
    /**
     * Send success response
     */
    public function sendSuccess($data, string $message = 'Success', int $statusCode = 200): JsonResponse
    {
        return response()->json([
            'status' => true,
            'message' => $message,
            'data' => $data,
        ], $statusCode);
    }

    /**
     * Send error response
     */
    public function sendError(string $message, $errors = null, int $statusCode = 400): JsonResponse
    {
        $response = [
            'status' => false,
            'message' => $message,
        ];

        if ($errors) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $statusCode);
    }

    /**
     * Send validation error response
     */
    public function sendValidationError(array $errors, string $message = 'Validation failed'): JsonResponse
    {
        return response()->json([
            'status' => false,
            'message' => $message,
            'errors' => $errors,
        ], 422);
    }
}
