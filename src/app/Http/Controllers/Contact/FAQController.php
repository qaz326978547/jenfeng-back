<?php

namespace App\Http\Controllers\Contact;

use App\Http\Controllers\Controller;
use App\Models\FAQModel;
use Symfony\Component\HttpFoundation\Response; //使用於狀態碼


class FAQController extends Controller
{
    /*
    * 取得所有報名資料
    *
    * @return \Illuminate\Http\Response
    */
    public function index()
    {
        $contact = FAQModel::all()->map(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'info' => $item->info,
                'no' => $item->no,
            ];
        })->sortByDesc('no');

        return response()->json($contact->values());
    }
}
