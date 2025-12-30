<?php

namespace App\Http\Controllers\Api\V2\Hrm;

use App\Http\Controllers\Controller;
use App\Models\Leave;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Carbon\Carbon;

class LeaveController extends Controller
{
    use ApiResponse;

    /**
     * 1. List Leaves (Admin sees all, Staff sees own)
     */
    public function index(Request $request)
    {
        $query = Leave::with(['user:id,name', 'approver:id,name'])->latest();

        // If not Admin/Manager, show only own leaves
        // (Assuming Role ID 1 & 2 are Admin/Manager)
        if (!in_array(auth()->user()->role_id, [1, 2])) {
            $query->where('user_id', auth()->id());
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        return $this->sendSuccess($query->paginate(20));
    }

    /**
     * 2. Apply for Leave
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'nullable|exists:users,id', // Admin can apply for others
            'type' => 'required|in:sick,casual,unpaid',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'nullable|string'
        ]);

        $userId = $request->user_id ?? auth()->id();
        
        // Calculate Days
        $start = Carbon::parse($request->start_date);
        $end = Carbon::parse($request->end_date);
        $days = $start->diffInDays($end) + 1;

        // Auto-approve if Admin creates it
        $isAdmin = in_array(auth()->user()->role_id, [1, 2]);
        $status = $isAdmin ? 'approved' : 'pending';
        $approvedBy = $isAdmin ? auth()->id() : null;

        $leave = Leave::create([
            'user_id' => $userId,
            'type' => $request->type,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'days_count' => $days,
            'reason' => $request->reason,
            'status' => $status,
            'approved_by' => $approvedBy
        ]);

        return $this->sendSuccess($leave, "Leave request submitted ({$status})");
    }

    /**
     * 3. Approve / Reject (Admin Only)
     */
    public function update(Request $request, $id)
    {
        // Permission check can be added here
        
        $request->validate([
            'status' => 'required|in:approved,rejected'
        ]);

        $leave = Leave::findOrFail($id);
        
        $leave->update([
            'status' => $request->status,
            'approved_by' => auth()->id()
        ]);

        return $this->sendSuccess($leave, "Leave request {$request->status}");
    }

    /**
     * 4. Cancel / Delete Request
     */
    public function destroy($id)
    {
        $leave = Leave::findOrFail($id);
        
        if ($leave->status === 'approved' && !in_array(auth()->user()->role_id, [1, 2])) {
            return $this->sendError('Cannot delete approved leave. Contact Admin.');
        }

        $leave->delete();
        return $this->sendSuccess(null, 'Leave request deleted');
    }
}