<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('ping', function () {
    return response()->json(['message' => 'Pong!']);
});

Route::prefix('v2')->group(function () {
    Route::get('ping', function () {
        return response()->json(['message' => 'Pong!']);
    });

    Route::prefix('auth')->group(function () {
        Route::post('login', 'Auth\AuthController@login');
        Route::post('register', 'Auth\AuthController@register');
        Route::post('logout', 'Auth\AuthController@logout');
    });
    Route::middleware(['auth:api'])->prefix('admin')->group(function () {
        Route::apiResource('contact', 'Contact\ContactController')->except('destroy');
        Route::delete('contact', 'Contact\ContactController@destroy');
        Route::apiResource('contact-list', 'Contact\ContactListController')->only('index', 'show');
    });
});
