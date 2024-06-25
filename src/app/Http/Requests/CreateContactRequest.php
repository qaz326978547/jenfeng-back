<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateContactRequest extends APIRequest
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
            'class' => 'required|string', //報名課程
            'quest' => 'required|string', //主要問題
            'company' => 'required|string', //公司名稱
            'tel' => 'required|string|size:10', //電話
            'num' => 'required|string', //報名人數
            'last5' => 'required|string', //匯款帳號最後五碼
            'ticket' => 'required|in:2,3', //發票是否開立公司抬頭(三聯式發票) 發票種類
            'ticket_name' => 'required|string', //發票抬頭
            'ticket_no' => 'required|string', //統一編號
            'ticket_address' => 'required|string', //發票地址
            'from' => 'required|string', //得知講座管道
            'suggest_name' => 'required|string', //推薦人姓名
            // contact_list
            // 'cid' => 'required|integer',
            'name' => 'required|string',
            'email' => 'required|email',
            'job' => 'required|string',
            'cel' => 'required|string|size:10',
        ];
    }

    public function messages()
    {
        return [
            'class.required' => '請輸入報名課程',
            'quest.required' => '請輸入主要問題',
            'company.required' => '請輸入公司名稱',
            'tel.required' => '請輸入電話',
            'tel.size' => '電話格式錯誤',
            'num.required' => '請輸入報名人數',
            'last5.required' => '請輸入匯款帳號最後五碼',
            'ticket.required' => '請選擇發票是否開立公司抬頭(三聯式發票) 發票種類',
            'ticket.in' => '發票是否開立公司抬頭(三聯式發票) 發票種類格式錯誤',
            'ticket_name.required' => '請輸入發票抬頭',
            'ticket_no.required' => '請輸入統一編號',
            'ticket_address.required' => '請輸入發票地址',
            'from.required' => '請輸入得知講座管道',
            'suggest_name.required' => '請輸入推薦人姓名',
            // contact_list
            'name.required' => '請輸入姓名',
            'cel.required' => '請輸入手機',
            'job.required' => '請輸入職稱',
            'email.required' => '請輸入信箱',
            'email.email' => '信箱格式錯誤',
            // 'cid.required' => '請輸入cid',
            // 'cid.integer' => 'cid格式錯誤',
        ];
    }
}
