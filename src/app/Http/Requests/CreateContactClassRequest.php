<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateContactClassRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string',
            'no' => 'required|integer',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => '請輸入name',
            'no.required' => '請輸入no',
            'name.string' => 'name格式錯誤',
            'no.integer' => 'no格式錯誤',
        ];
    }
}
