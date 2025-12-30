<?php

namespace App\Http\Controllers\Api\V2\Crm;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\Customer; // [Fixed] Added Customer Model
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log; // [Fixed] Added Log Facade
use Illuminate\Support\Facades\Validator; // [Fixed] Added Validator Facade

class LeadController extends Controller
{
    use ApiResponse;

    /**
     * 1. All Leads List (With Filters)
     */
    public function index(Request $request)
    {
        $query = Lead::with('assignedAgent:id,name');

        // Filter by Status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by Assigned Staff
        if ($request->has('assigned_to')) {
            $query->where('assigned_to', $request->assigned_to);
        }

        // Search by Name/Phone
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'LIKE', "%$search%")
                  ->orWhere('phone', 'LIKE', "%$search%");
            });
        }

        return $this->sendSuccess($query->latest()->paginate(20));
    }

    /**
     * 2. Store New Lead (Manual Entry)
     */
    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:100',
            'phone' => 'required|unique:leads,phone',
            'source' => 'nullable',
        ]);

        $lead = Lead::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'phone' => $request->phone,
            'email' => $request->email,
            'source' => $request->source ?? 'manual',
            'status' => 'new',
            'assigned_to' => Auth::id(),
            'notes' => $request->notes
        ]);

        return $this->sendSuccess($lead, 'Lead created successfully');
    }

    /**
     * 3. Show Single Lead details
     */
    public function show($id)
    {
        $lead = Lead::with(['assignedAgent', 'activities.user'])->findOrFail($id);
        return $this->sendSuccess($lead);
    }

    /**
     * 4. Update Status / Assign Staff
     */
    public function update(Request $request, $id)
    {
        $lead = Lead::findOrFail($id);
        
        $lead->update($request->only([
            'first_name', 'last_name', 'email', 'phone', 
            'status', 'assigned_to', 'notes'
        ]));

        return $this->sendSuccess($lead, 'Lead updated successfully');
    }

    /**
     * 5. Capture Partial Lead from Checkout (Interceptor)
     * URL: POST /api/v2/crm/leads/checkout-capture
     */
    public function captureCheckoutLead(Request $request)
    {
        // 1. Strict Validation
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string|min:11|max:15',
            'first_name' => 'nullable|string|max:100',
            'product_id' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error', $validator->errors(), 422);
        }

        try {
            $phone = $request->phone;

            // 2. Check: Is this person already a Customer?
            $existingCustomer = Customer::where('phone', $phone)->first(); //
            
            if ($existingCustomer) {
                return $this->sendSuccess(
                    ['status' => 'existing_customer'], 
                    'User is already a loyal customer. No lead needed.'
                );
            }

            // 3. Check: Is this Lead already in our funnel?
            $existingLead = Lead::where('phone', $phone)->first();

            if ($existingLead) {
                // Scenario A: লিড আগেই কনভার্ট হয়ে গেছে বা লস্ট হয়েছে
                if (in_array($existingLead->status, ['converted', 'won', 'lost'])) {
                    return $this->sendSuccess(null, 'Lead already processed previously.');
                }
                
                // Scenario B: লিড এখনো প্রসেস হচ্ছে -> আপডেট করি
                $existingLead->update([
                    'updated_at' => now(),
                    'notes' => $existingLead->notes . " | Visited checkout again for Product ID: " . ($request->product_id ?? 'N/A')
                ]);
                
                return $this->sendSuccess($existingLead->id, 'Existing lead updated.');
            }

            // 4. Create New Lead (Ghost Customer)
            $lead = Lead::create([
                'first_name' => $request->first_name ?? 'Guest User',
                'phone' => $phone,
                'source' => 'checkout_interceptor',
                'status' => 'attempted_purchase',
                'notes' => $request->product_id ? "Attempted to buy Product ID: " . $request->product_id : "Dropped off at checkout",
                'created_at' => now(),
                'updated_at' => now()
            ]);

            return $this->sendSuccess($lead->id, 'Lead captured successfully.');

        } catch (\Exception $e) {
            Log::error("Checkout Interceptor Error: " . $e->getMessage());
            return $this->sendError('Internal System Error', [], 500);
        }
    }
}