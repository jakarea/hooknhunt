<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\SmsLog;
use App\Services\AlphaSmsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SmsController extends Controller
{
    private AlphaSmsService $smsService;

    public function __construct(AlphaSmsService $smsService)
    {
        $this->smsService = $smsService;
    }

    /**
     * Get SMS logs with pagination
     */
    public function index(Request $request)
    {
        $query = SmsLog::with('user:id,name,email')
            ->orderBy('created_at', 'desc');

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Search by message or recipients
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('message', 'like', "%{$search}%")
                  ->orWhere('recipients', 'like', "%{$search}%");
            });
        }

        $logs = $query->paginate(20);

        return response()->json($logs);
    }

    /**
     * Send SMS
     */
    public function send(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'message' => 'required|string|max:1000',
            'recipients' => 'required|array|min:1',
            'recipients.*' => 'required|string',
            'sender_id' => 'nullable|string',
            'schedule' => 'nullable|date_format:Y-m-d H:i:s',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 1,
                'msg' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Validate and format phone numbers
        $validatedNumbers = [];
        foreach ($request->recipients as $phone) {
            $validatedNumbers[] = $this->smsService->validatePhoneNumber($phone);
        }

        // Send SMS
        $result = $this->smsService->sendSms(
            $request->message,
            $validatedNumbers,
            $request->sender_id,
            $request->schedule
        );

        // Create log entry
        $smsLog = SmsLog::create([
            'user_id' => auth()->id(),
            'request_id' => $result['data']['request_id'] ?? null,
            'message' => $request->message,
            'recipients' => implode(',', $validatedNumbers),
            'sender_id' => $request->sender_id,
            'status' => $result['error'] == 0 ? 'sent' : 'failed',
            'scheduled_at' => $request->schedule,
            'response_data' => $result,
        ]);

        if ($result['error'] == 0) {
            return response()->json([
                'error' => 0,
                'msg' => 'SMS sent successfully',
                'data' => [
                    'log_id' => $smsLog->id,
                    'request_id' => $result['data']['request_id'] ?? null,
                ],
            ]);
        }

        return response()->json($result, 400);
    }

    /**
     * Get delivery report for a specific SMS
     */
    public function getReport($id)
    {
        $smsLog = SmsLog::findOrFail($id);

        if (!$smsLog->request_id) {
            return response()->json([
                'error' => 1,
                'msg' => 'No request ID available for this SMS',
            ], 400);
        }

        $report = $this->smsService->getDeliveryReport($smsLog->request_id);

        // Update log with delivery report
        if ($report['error'] == 0) {
            $smsLog->update([
                'delivery_report' => $report['data'],
                'status' => strtolower($report['data']['request_status'] ?? 'unknown'),
                'charge' => $report['data']['request_charge'] ?? 0,
            ]);
        }

        return response()->json($report);
    }

    /**
     * Refresh delivery reports for all pending/sent SMS
     */
    public function refreshReports()
    {
        $pendingSms = SmsLog::whereIn('status', ['pending', 'sent'])
            ->whereNotNull('request_id')
            ->get();

        $updated = 0;
        foreach ($pendingSms as $sms) {
            $report = $this->smsService->getDeliveryReport($sms->request_id);

            if ($report['error'] == 0) {
                $sms->update([
                    'delivery_report' => $report['data'],
                    'status' => strtolower($report['data']['request_status'] ?? 'unknown'),
                    'charge' => $report['data']['request_charge'] ?? 0,
                ]);
                $updated++;
            }
        }

        return response()->json([
            'error' => 0,
            'msg' => "Updated {$updated} SMS delivery reports",
            'data' => ['updated_count' => $updated],
        ]);
    }

    /**
     * Get account balance
     */
    public function getBalance()
    {
        $result = $this->smsService->getBalance();
        return response()->json($result);
    }

    /**
     * Get SMS statistics
     */
    public function statistics()
    {
        $stats = [
            'total_sent' => SmsLog::where('status', '!=', 'failed')->count(),
            'total_failed' => SmsLog::where('status', 'failed')->count(),
            'total_cost' => SmsLog::where('status', '!=', 'failed')->sum('charge'),
            'today_sent' => SmsLog::where('status', '!=', 'failed')
                ->whereDate('created_at', today())
                ->count(),
            'this_month_sent' => SmsLog::where('status', '!=', 'failed')
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
            'this_month_cost' => SmsLog::where('status', '!=', 'failed')
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->sum('charge'),
        ];

        return response()->json([
            'error' => 0,
            'data' => $stats,
        ]);
    }
}
