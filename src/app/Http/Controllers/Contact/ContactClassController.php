<?php

namespace App\Http\Controllers\Contact;

use App\Http\Controllers\Controller;
use App\Models\ContactClassModel;
use Symfony\Component\HttpFoundation\Response; //使用於狀態碼
use App\Http\Requests\CreateContactClassRequest;

class ContactClassController extends Controller
{
    /*
    * 取得所有報名資料
    *
    * @return \Illuminate\Http\Response
    */
    public function index()
    {
        $contact = ContactClassModel::orderBy('no', 'desc')->where('del', '=', 0)->paginate(10);
        return response()->json($contact);
    }

    /**
     * 
     * @param  \Illuminate\Http\Request  $request
     * 
     * @return \Illuminate\Http\Response

     */
    public function store(CreateContactClassRequest $request)
    {
        $data = $request->validated();
        $contactClass = ContactClassModel::create([
            'name' => $data['name'],
            'no' => $data['no'],
        ]);
        return response()->json([
            'message' => '新增成功',
            'data' => $contactClass
        ], Response::HTTP_CREATED);
    }


    /**
     * 更新報名資料
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(CreateContactClassRequest $request, $id)
    {
        $data = $request->validated();
        $contact = ContactClassModel::find($id);
        if ($contact) {
            $contact->update($data);
            return response()->json([
                'message' => '更新成功',
                'data' => $contact
            ], Response::HTTP_OK);
        } else {
            return response()->json([
                'message' => '找不到資料'
            ], Response::HTTP_NOT_FOUND);
        }
    }

    /**
     * 刪除報名資料
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $contact = ContactClassModel::find($id);
        if ($contact) {
            $contact->delete();
            return response()->json([
                'message' => '刪除成功'
            ], Response::HTTP_OK);
        } else {
            return response()->json([
                'message' => '找不到資料'
            ], Response::HTTP_NOT_FOUND);
        }
    }
}
