<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Symfony\Component\HttpFoundation\Response;

class AuditController extends Controller
{
    use ApiResponse;

    protected $logPath;

    public function __construct()
    {
        $this->logPath = storage_path('logs/audit');
    }

    /**
     * সব লগ ফাইলের লিস্ট দেখা (মাসের নাম এবং সাইজসহ)
     */
    public function index()
    {
        if (!File::exists($this->logPath)) {
            return $this->sendSuccess([], 'No audit logs found yet.');
        }

        $files = File::files($this->logPath);
        $logList = [];

        foreach ($files as $file) {
            if ($file->getExtension() === 'csv') {
                $logList[] = [
                    'file_name' => $file->getFilename(),
                    'size' => round($file->getSize() / 1024, 2) . ' KB',
                    'last_modified' => date("Y-m-d H:i:s", $file->getMTime()),
                ];
            }
        }

        // লেটেস্ট ফাইলগুলো আগে দেখাবে
        usort($logList, fn($a, $b) => strcmp($b['file_name'], $a['file_name']));

        return $this->sendSuccess($logList, 'Audit logs retrieved successfully.');
    }

    /**
     * নির্দিষ্ট মাসের লগ ফাইল ডাউনলোড করা
     */
    public function download($fileName)
    {
        $filePath = $this->logPath . '/' . $fileName;

        // সিকিউরিটি চেক: ফাইলটি আসলে অডিট ফোল্ডারে আছে কিনা এবং CSV কিনা
        if (!File::exists($filePath) || File::extension($filePath) !== 'csv') {
            return $this->sendError('File not found or invalid format.', null, 404);
        }

        return response()->download($filePath, $fileName, [
            'Content-Type' => 'text/csv',
        ]);
    }

    /**
     * পুরনো লগ ফাইল ডিলিট করা (বড় সিস্টেম ক্লিনিংয়ের জন্য)
     */
    public function destroy($fileName)
    {
        $filePath = $this->logPath . '/' . $fileName;

        if (File::exists($filePath)) {
            File::delete($filePath);
            return $this->sendSuccess(null, "Log file {$fileName} deleted successfully.");
        }

        return $this->sendError('File not found.', null, 404);
    }

    /**
     * (Optional) লগ ফাইলের কন্টেন্ট সরাসরি এপিআইতে দেখা (Preview)
     * বড় ফাইল হলে এটি রিকমেন্ডেড না, তবে ছোট ফাইলের জন্য ভালো
     */
    public function preview($fileName)
    {
        $filePath = $this->logPath . '/' . $fileName;

        if (!File::exists($filePath)) {
            return $this->sendError('File not found.', null, 404);
        }

        $data = array_map('str_getcsv', file($filePath));
        $header = array_shift($data);
        $csv = [];
        foreach ($data as $row) {
            if(count($header) == count($row)) {
                $csv[] = array_combine($header, $row);
            }
        }

        return $this->sendSuccess(array_slice($csv, -50), 'Last 50 activities from log.');
    }
}