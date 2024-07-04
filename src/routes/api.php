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

// Route::get('/', 'WelcomeController@index');

Route::prefix('v2')->group(function () {
    Route::get('seo', 'SeoController@index');
    Route::apiResource('contact-class', 'Contact\ContactClassController')->only('index');
    Route::apiResource('contact-quest', 'Contact\ContactQuestController')->only('index');
    Route::apiResource('contact', 'Contact\ContactController')->only('store');
    Route::apiResource('faq', 'Contact\FAQController')->only('index');
    Route::prefix('auth')->group(function () {
        Route::post('login', 'Auth\AuthController@login');
        Route::post('register', 'Auth\AuthController@register');
        Route::post('logout', 'Auth\AuthController@logout');
    });
    Route::middleware(['auth:api'])->prefix('admin')->group(function () {
        Route::apiResource('contact', 'Contact\ContactController')->except('destroy', 'store');
        Route::delete('contact', 'Contact\ContactController@destroy');
        Route::apiResource('contact-list', 'Contact\ContactListController')->only('index', 'show');
        Route::apiResource('contact-class', 'Contact\ContactClassController')->except('destroy', 'index');
        Route::delete('contact-class', 'Contact\ContactClassController@destroy');
        Route::get('contact/search/search-company', 'Contact\ContactController@searchCompany');
    });
});
