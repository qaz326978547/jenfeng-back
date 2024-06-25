<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateUser extends APIRequest //引用APIRequest
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
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'is_admin' => 'boolean',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => '請輸入姓名',
            'email.required' => '請輸入信箱',
            'email.email' => '信箱格式錯誤',
            'email.unique' => '信箱已被註冊',
            'password.required' => '請輸入密碼',
            'password.min' => '密碼至少6個字元',
            'password.confirmed' => '密碼不一致',
            'is_admin.boolean' => '權限格式錯誤',
        ];
    }
}
