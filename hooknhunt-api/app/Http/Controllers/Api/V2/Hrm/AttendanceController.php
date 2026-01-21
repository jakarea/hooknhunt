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

    // Standard times for auto-completion of incomplete attendance
    const STANDARD_CLOCK_OUT = '18:00:00'; // 6:00 PM
    const STANDARD_BREAK_OUT = '18:00:00'; // If on break, close both

    /**
     * 1. Clock In (Staff or Admin for Staff)
     * Sequence: Must be first action of the day
     */
    public function clockIn(Request $request)
    {
        // Permission check - staff can clock in for themselves
        $user = auth()->user();
        if ($request->has('user_id') && $request->user_id != $user->id) {
            // Admin trying to clock in for someone else
            if (!$user->hasPermissionTo('hrm.attendance.manage')) {
                return $this->sendError('You do not have permission to manage attendance.', null, 403);
            }
        }

        $userId = $request->user_id ?? auth()->id();
        $date = date('Y-m-d');
        $time = date('H:i:s');

        // Check for incomplete attendance from previous day
        $this->checkAndFixIncompleteAttendance($userId, $date);

        // Check already clocked in today?
        $exists = Attendance::where('user_id', $userId)->where('date', $date)->first();

        if ($exists) {
            return $this->sendError('Already clocked in for today.');
        }

        // Late Calculation Logic (Office starts at 10:00 AM with 15 mins grace)
        $status = 'present';
        $officeStartTime = '10:15:00';
        if ($time > $officeStartTime) {
            $status = 'late';
        }

        $attendance = Attendance::create([
            'user_id' => $userId,
            'date' => $date,
            'clock_in' => $time,
            'break_in' => [], // Initialize as empty array
            'break_out' => [], // Initialize as empty array
            'status' => $status,
            'note' => $request->note,
            'updated_by' => auth()->id()
        ]);

        return $this->sendSuccess($attendance, "Clock In Successful ({$status})");
    }

    /**
     * 2. Clock Out
     * Sequence: Must be clocked in and NOT on break
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

        if ($attendance->clock_out) {
            return $this->sendError('Already clocked out for today.');
        }

        // VALIDATE SEQUENCE: Cannot clock out while on break
        if ($attendance->isOnBreak()) {
            return $this->sendError('You are currently on break. Please end your break first.');
        }

        $attendance->update([
            'clock_out' => $time
        ]);

        return $this->sendSuccess($attendance, 'Clock Out Successful');
    }

    /**
     * 3. Break In
     * Sequence: Must be clocked in, NOT on break, NOT clocked out
     */
    public function breakIn(Request $request)
    {
        $userId = $request->user_id ?? auth()->id();
        $date = date('Y-m-d');
        $time = date('H:i:s');

        $attendance = Attendance::where('user_id', $userId)->where('date', $date)->first();

        if (!$attendance) {
            return $this->sendError('You must clock in before taking a break.');
        }

        if ($attendance->clock_out) {
            return $this->sendError('Cannot take break after clocking out.');
        }

        // VALIDATE SEQUENCE: Cannot start break if already on break
        if ($attendance->isOnBreak()) {
            return $this->sendError('You are already on break.');
        }

        // Add break time to array
        $breakIn = $attendance->break_in ?? [];
        $breakIn[] = $time;

        $attendance->update([
            'break_in' => $breakIn
        ]);

        return $this->sendSuccess($attendance->fresh(), 'Break started successfully');
    }

    /**
     * 4. Break Out (End Break)
     * Sequence: Must be on break
     */
    public function breakOut(Request $request)
    {
        $userId = $request->user_id ?? auth()->id();
        $date = date('Y-m-d');
        $time = date('H:i:s');

        $attendance = Attendance::where('user_id', $userId)->where('date', $date)->first();

        if (!$attendance) {
            return $this->sendError('No attendance record found.');
        }

        if ($attendance->clock_out) {
            return $this->sendError('Cannot end break after clocking out.');
        }

        // VALIDATE SEQUENCE: Must be on break to end break
        if (!$attendance->isOnBreak()) {
            return $this->sendError('You are not currently on break.');
        }

        // Add break out time to array
        $breakOut = $attendance->break_out ?? [];
        $breakOut[] = $time;

        $attendance->update([
            'break_out' => $breakOut
        ]);

        return $this->sendSuccess($attendance->fresh(), 'Break ended successfully');
    }

    /**
     * 5. Monthly Attendance Report (Admin View)
     */
    public function index(Request $request)
    {
        // Permission check
        if (!auth()->user()->hasPermissionTo('hrm.attendance.view')) {
            return $this->sendError('You do not have permission to view attendance records.', null, 403);
        }

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
     * 6. Manual Entry / Update (Admin Power)
     */
    public function store(Request $request)
    {
        // Permission check
        if (!auth()->user()->hasPermissionTo('hrm.attendance.edit')) {
            return $this->sendError('You do not have permission to edit attendance records.', null, 403);
        }

        $request->validate([
            'user_id' => 'required|exists:users,id',
            'date' => 'required|date',
            'status' => 'required|in:present,late,absent,leave,holiday',
            'clock_in' => 'nullable',
            'clock_out' => 'nullable',
            'break_in' => 'nullable|array',
            'break_out' => 'nullable|array'
        ]);

        $attendance = Attendance::updateOrCreate(
            [
                'user_id' => $request->user_id,
                'date' => $request->date
            ],
            [
                'clock_in' => $request->clock_in,
                'clock_out' => $request->clock_out,
                'break_in' => $request->break_in ?? [],
                'break_out' => $request->break_out ?? [],
                'status' => $request->status,
                'note' => $request->note,
                'updated_by' => auth()->id()
            ]
        );

        return $this->sendSuccess($attendance, 'Attendance updated manually');
    }

    /**
     * Check and fix incomplete attendance from previous day
     * This is called automatically on clock in for a new day
     */
    private function checkAndFixIncompleteAttendance(int $userId, string $currentDate)
    {
        // Find the most recent attendance record
        $lastAttendance = Attendance::where('user_id', $userId)
            ->where('date', '<', $currentDate)
            ->latest('date')
            ->first();

        if (!$lastAttendance) {
            return;
        }

        $issues = $lastAttendance->getIncompleteState();
        if (empty($issues)) {
            return; // No issues found
        }

        // Fix incomplete states with standard times
        $updateData = [];

        if (in_array('clocked_in_without_out', $issues)) {
            $updateData['clock_out'] = self::STANDARD_CLOCK_OUT;
        }

        if (in_array('on_break_without_out', $issues)) {
            $breakOut = $lastAttendance->break_out ?? [];
            $breakOut[] = self::STANDARD_BREAK_OUT;
            $updateData['break_out'] = $breakOut;

            // If clocked in without out, also set clock out
            if (in_array('clocked_in_without_out', $issues)) {
                $updateData['clock_out'] = self::STANDARD_CLOCK_OUT;
            }
        }

        if (!empty($updateData)) {
            $updateData['note'] = ($lastAttendance->note ?? '') . ' [Auto-completed with standard time]';
            $lastAttendance->update($updateData);
        }
    }
}