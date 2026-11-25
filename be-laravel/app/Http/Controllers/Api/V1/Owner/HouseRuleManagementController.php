<?php

namespace App\Http\Controllers\Api\V1\Owner;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class HouseRuleManagementController extends Controller
{
    public function show()
    {
        return response()->json([
            'success' => true,
            'message' => 'Aturan kost berhasil diambil.',
            'data' => [
                'rules' => Setting::get('kost_rules', ''),
            ],
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'rules' => ['required', 'string', 'max:10000'],
        ]);

        Setting::put('kost_rules', $validated['rules']);

        return response()->json([
            'success' => true,
            'message' => 'Aturan kost berhasil diperbarui.',
            'data' => [
                'rules' => Setting::get('kost_rules', ''),
            ],
        ]);
    }
}
