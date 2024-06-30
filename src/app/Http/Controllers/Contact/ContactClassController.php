<?php

namespace App\Http\Controllers\Contact;

use App\Http\Controllers\Controller;
use App\Models\ContactClassModel;
use Symfony\Component\HttpFoundation\Response; //使用於狀態碼
use App\Http\Requests\CreateContactClassRequest;
use Illuminate\Http\Request;



class ContactClassController extends Controller
{
    /*
    * 取得所有課程資料
    *
    * @return \Illuminate\Http\Response
    */
    public function index()
    {
        $contact = ContactClassModel::orderBy('no', 'desc')->where('del', '=', 0)->get();
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
     * 取得指定課程資料
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $contact = ContactClassModel::where('del', '=', 0)->find($id);
        if ($contact) {
            return response()->json($contact);
        } else {
            return response()->json([
                'message' => '找不到資料'
            ], Response::HTTP_NOT_FOUND);
        }
    }



    /**
     * 更新課程資料
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    public function update(CreateContactClassRequest $request, $id)
    {
        $data = $request->validated();
        $contact = ContactClassModel::where('del', 0)->find($id);

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
     * 刪除課程資料
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $ids = $request->input('ids');

        if (is_array($ids)) {
            $existingIds = ContactClassModel::whereIn('id', $ids)->pluck('id')->all();
            $nonExistingIds = array_diff($ids, $existingIds);

            if (!empty($nonExistingIds)) {
                return response()->json([
                    'message' => '以下的 id 不存在: ' . implode(', ', $nonExistingIds)
                ], Response::HTTP_NOT_FOUND);
            }

            ContactClassModel::whereIn('id', $ids)->delete();
            return response()->json([
                'message' => '刪除成功'
            ], Response::HTTP_OK);
        } else {
            $contact = ContactClassModel::find($ids);
            if ($contact) {
                $contact->delete();
                return response()->json([
                    'message' => '刪除成功'
                ], Response::HTTP_OK);
            } else {
                return response()->json([
                    'message' => '找不到 id: ' . $ids
                ], Response::HTTP_NOT_FOUND);
            }
        }
    }
}
