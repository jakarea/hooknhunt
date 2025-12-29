<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // API এর জন্য স্টেটফুল মিডলওয়্যার কনফিগারেশন (যদি দরকার হয়)
        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // 1. Handle Authentication Error (401)
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthenticated or Token Expired',
                    'errors' => null,
                    'data' => null
                ], 401);
            }
        });

        // 2. Handle Validation Error (422) - Global Fallback
        $exceptions->render(function (ValidationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validation Failed',
                    'errors' => $e->errors(), // Field specific errors
                    'data' => null
                ], 422);
            }
        });

        // 3. Handle Not Found (404)
        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'status' => false,
                    'message' => 'Resource Not Found',
                    'errors' => null,
                    'data' => null
                ], 404);
            }
        });

        // 4. General Server Error (500) - For unexpected crashes
        // প্রোডাকশনে ডিটেইলস হাইড করা ভালো, কিন্তু ডেভেলপমেন্টে দেখতে পারেন
        //
        $exceptions->render(function (\Throwable $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'status' => false,
                    'message' => 'Server Error',
                    'errors' => $e->getMessage(), // Hide in production
                    'data' => null
                ], 500);
            }
        });
        
    })->create();