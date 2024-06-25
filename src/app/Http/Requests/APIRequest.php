<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest; //FormRequest是Laravel提供的用來處理請求的類別
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\ValidationException; //ValidationException是Laravel提供的用來處理驗證失敗的例外

class APIRequest extends FormRequest
{
    protected function failedValidation(Validator $validator)
    {
        $response = response()->json([
            'status' => 'error',
            'message' => $validator->errors()->first()
        ], 400);
        //APIRequest.php主要是為了處理驗證失敗 如果直接使用FormRequest的話 驗證失敗會直接導向錯誤頁面
        throw new ValidationException($validator, $response); //拋出驗證失敗的例外
    }
}
