<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class ApiRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // API তে সাধারণত আমরা কন্ট্রোলারে পলিসি চেক করি, তাই এখানে true
    }

    /**
     * Handle a failed validation attempt.
     * Overriding default behavior to return JSON.
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'status' => false,
            'message' => 'Validation Error',
            'data' => null,
            'errors' => $validator->errors()
        ], 422));
    }
}