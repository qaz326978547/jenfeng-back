<?php

namespace App\Http\Controllers\Contact;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\ContactModel;
use App\Http\Requests\CreateContactRequest;
use Symfony\Component\HttpFoundation\Response; //使用於狀態碼
use Illuminate\Support\Facades\DB;
use App\Mail\SignedUpMail;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{

    /**
     * 取得所有報名資料
     
     *
     * @return \Illuminate\Http\Response
     */

    public function index()
    {
        $contact = ContactModel::orderBy('created_at', 'desc')->paginate(10);
        return response()->json($contact);
    }

    /**
     * 新增報名資料
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */


    public function store(CreateContactRequest $request)
    {
        $data = $request->validated();
        $contact = ContactModel::create([
            'class' => $data['class'],
            'quest' => $data['quest'],
            'company' => $data['company'],
            'tel' => $data['tel'],
            'num' => $data['num'],
            'last5' => $data['last5'],
            'ticket' => $data['ticket'],
            'ticket_name' => $data['ticket_name'],
            'ticket_no' => $data['ticket_no'],
            'ticket_address' => $data['ticket_address'],
            'from' => $data['from'],
            'suggest_name' => $data['suggest_name'],
        ]);
        foreach ($data['contactList'] as $item) {
            $contact->contactList()->create([
                'name' => $item['name'],
                'email' => $item['email'],
                'job' => $item['job'],
                'cel' => $item['cel'],
                'cid' => $contact->id,
            ]);
        }
        //寄送信件
        Mail::to(env('RECIPIENT_EMAIL'))->send(new SignedUpMail($data['company'], $data['class'], $data['num'], $data['tel']));
        return response()->json([
            'message' => '新增成功',
            'data' => $contact,
        ], Response::HTTP_CREATED);
    }

    /**
     * 取得指定聯絡資料
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    public function show($id)
    {
        $contact = ContactModel::with('contactList')->find($id);
        if ($contact) {
            return response()->json($contact);
        } else {
            return response()->json([
                'message' => '找不到資料'
            ], Response::HTTP_NOT_FOUND);
        }
    }

    /**
     * 更新聯絡資料
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(CreateContactRequest $request, $id)
    {
        $data = $request->validated();
        $contact = ContactModel::find($id);
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
     * 刪除聯絡資料
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $ids = $request->input('ids');

        if (is_array($ids)) {
            $existingIds = ContactModel::whereIn('id', $ids)->pluck('id')->all();
            $nonExistingIds = array_diff($ids, $existingIds);

            if (!empty($nonExistingIds)) {
                return response()->json([
                    'message' => '以下的 id 不存在: ' . implode(', ', $nonExistingIds)
                ], Response::HTTP_NOT_FOUND);
            }

            DB::table('contact')->whereIn('id', $ids)->delete();
            return response()->json([
                'message' => '刪除成功'
            ], Response::HTTP_OK);
        } else {
            $contact = ContactModel::find($ids);
            if ($contact) {
                DB::table('contact')->where('id', $ids)->delete();
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
