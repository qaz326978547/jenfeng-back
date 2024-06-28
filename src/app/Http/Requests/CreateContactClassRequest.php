<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateContactClassRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            "name" => "required|string",
            "no" => "required|string",
        ];
    }

    public function messages()
    {
        return [
            "name.required" => "請輸入name",
            "no.required" => "請輸入no",
            "name.string" => "name格式錯誤",
            "no.string" => "no格式錯誤",
        ];
    }
}
