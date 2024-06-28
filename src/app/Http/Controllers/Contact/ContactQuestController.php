<?php

namespace App\Http\Controllers\Contact;

use App\Http\Controllers\Controller;
use App\Models\ContactQuestModel;
use Symfony\Component\HttpFoundation\Response; //使用於狀態碼
use App\Http\Requests\CreateContactClassRequest;

class ContactQuestController extends Controller
{
    /*
    * 取得所有問題資料
    *
    * @return \Illuminate\Http\Response
    */
    public function index()
    {
        $contact = ContactQuestModel::orderBy('no', 'desc')->where('del', '=', 0)->paginate(10);
        return response()->json($contact);
    }

    // /**
    //  * 
    //  * @param  \Illuminate\Http\Request  $request
    //  * 
    //  * @return \Illuminate\Http\Response

    //  */
    // public function store(CreateContactClassRequest $request)
    // {
    //     $data = $request->validated();
    //     $contactQuest = ContactQuestModel::create([
    //         'name' => $data['name'],
    //         'no' => $data['no'],
    //     ]);
    //     return response()->json([
    //         'message' => '新增成功',
    //         'data' => $contactQuest
    //     ], Response::HTTP_CREATED);
    // }
}
