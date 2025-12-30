<?php

namespace App\Http\Controllers\Api\V2\Hrm;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    use ApiResponse;

    /**
     * 1. Clock In (Staff or Admin for Staff)
     */
    public function clockIn(Request $request)
    {
        // যদি রিকোয়েস্টে user_id থাকে (Admin দিচ্ছে), নাহলে নিজের (Logged in User)
        $userId = $request->user_id ?? auth()->id();
        $date = date('Y-m-d');
        $time = date('H:i:s');

        // Check already clocked in?
        $exists = Attendance::where('user_id', $userId)->where('date', $date)->first();

        if ($exists) {
            return $this->sendError('Already clocked in for today.');
        }

        // Late Calculation Logic (Optional: e.g. Office starts at 10:00 AM)
        $status = 'present';
        $officeStartTime = '10:15:00'; // 15 mins grace time
        if ($time > $officeStartTime) {
            $status = 'late';
        }

        $attendance = Attendance::create([
            'user_id' => $userId,
            'date' => $date,
            'clock_in' => $time,
            'status' => $status,
            'note' => $request->note,
            'updated_by' => auth()->id()
        ]);

        return $this->sendSuccess($attendance, "Clock In Successful ({$status})");
    }

    /**
     * 2. Clock Out
     */
    public function clockOut(Request $request)
    {
        $userId = $request->user_id ?? auth()->id();
        $date = date('Y-m-d');
        $time = date('H:i:s');

        $attendance = Attendance::where('user_id', $userId)->where('date', $date)->first();

        if (!$attendance) {
            return $this->sendError('You have not clocked in yet.');
        }

        $attendance->update([
            'clock_out' => $time
        ]);

        return $this->sendSuccess($attendance, 'Clock Out Successful');
    }

    /**
     * 3. Monthly Attendance Report (Admin View)
     */
    public function index(Request $request)
    {
        $startDate = $request->start_date ?? date('Y-m-01');
        $endDate = $request->end_date ?? date('Y-m-t');

        $query = Attendance::with(['user:id,name'])
            ->whereBetween('date', [$startDate, $endDate])
            ->latest('date');

        // Filter by specific employee
        if ($request->user_id) {
            $query->where('user_id', $request->user_id);
        }

        return $this->sendSuccess($query->paginate(30));
    }

    /**
     * 4. Manual Entry / Update (Admin Power)
     * যদি কেউ হাজিরা দিতে ভুলে যায় বা Absent মার্ক করতে হয়
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'date' => 'required|date',
            'status' => 'required|in:present,late,absent,leave,holiday',
            'clock_in' => 'nullable',
            'clock_out' => 'nullable'
        ]);

        // updateOrCreate: যদি থাকে আপডেট করবে, না থাকলে নতুন বানাবে
        $attendance = Attendance::updateOrCreate(
            [
                'user_id' => $request->user_id,
                'date' => $request->date
            ],
            [
                'clock_in' => $request->clock_in,
                'clock_out' => $request->clock_out,
                'status' => $request->status,
                'note' => $request->note,
                'updated_by' => auth()->id()
            ]
        );

        return $this->sendSuccess($attendance, 'Attendance updated manually');
    }
}