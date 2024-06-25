<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateContactListRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return false;
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
            'cel' => 'required|string|size:10',
            'job' => 'required|string',
            'email' => 'required|string|email',
            'cid' => 'required|integer',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => '請輸入姓名',
            'cel.required' => '請輸入手機',
            'job.required' => '請輸入職稱',
            'email.required' => '請輸入信箱',
            'email.email' => '信箱格式錯誤',
            'cid.required' => '請輸入cid',
            'cid.integer' => 'cid格式錯誤',
        ];
    }
}
