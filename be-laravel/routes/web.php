<?php

use Illuminate\Support\Facades\Route;

// Backend hanya API; tampilan ada di fe-react.
Route::get('/', fn () => ['app' => 'KostKuy API', 'api' => url('/api/v1')]);
