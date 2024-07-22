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
            'class' => 'required|string', // 報名課程
            'quest' => 'required|string', // 主要問題
            'company' => 'required|string', // 公司名稱
            'tel' => 'required|string|max:10', // 電話
            'num' => 'required|string', // 報名人數
            'last5' => 'nullable|string|max:5', // 匯款帳號最後五碼
            'ticket' => 'nullable|in:2,3', // 發票種類
            'ticket_name' => 'nullable|string', // 發票抬頭
            'ticket_no' => 'nullable|string', // 統一編號
            'ticket_address' => 'nullable|string', // 發票地址
            'from' => 'nullable|string', // 得知講座管道
            'suggest_name' => 'nullable|string', // 推薦人姓名
            'contactList' => 'required|array',
            'contactList.*.name' => 'required|string',
            'contactList.*.email' => 'required|email',
            'contactList.*.job' => 'nullable|string',
            'contactList.*.cel' => 'required|string|max:10',
        ];
    }

    public function messages()
    {
        return [
            'class.required' => '請輸入報名課程',
            'quest.required' => '目前想解決或想瞭解的問題',
            'company.required' => '請輸入公司名稱',
            'tel.required' => '請輸入電話',
            'tel.max' => '電話格式錯誤',
            'num.required' => '請輸入報名人數',
            // 'last5.required' => '請輸入匯款帳號最後五碼',
            // 'last5.max' => '匯款帳號最後五碼格式錯誤',
            // 'ticket.required' => '請選擇發票是否開立公司抬頭(三聯式發票) 發票種類',
            // 'ticket.in' => '發票是否開立公司抬頭(三聯式發票) 發票種類格式錯誤',
            // 'ticket_name.required' => '請輸入發票抬頭',
            // 'ticket_no.required' => '請輸入統一編號',
            // 'ticket_address.required' => '請輸入發票地址',
            // 'from.required' => '請輸入得知講座管道',
            // 'suggest_name.required' => '請輸入推薦人姓名',
            // contact_list
            'contactList.required' => '請提供聯絡人列表',
            'contactList.array' => '聯絡人列表必須是一個陣列',
            'contactList.*.name.required' => '請輸入姓名',
            'contactList.*.email.required' => '請輸入信箱',
            'contactList.*.email.email' => '信箱格式錯誤',
            'contactList.*.job.required' => '請輸入職稱',
            'contactList.*.cel.required' => '請輸入手機',
            // 'contactList.*.cel.size' => '手機格式錯誤',
            'contactList.*.cel.max' => '手機格式錯誤',
            // 'cid.required' => '請輸入cid',
            // 'cid.integer' => 'cid格式錯誤',
        ];
    }
}
