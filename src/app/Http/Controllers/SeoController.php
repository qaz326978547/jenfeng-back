<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\SeoModel;


class SeoController extends Controller
{
    /*
        * 取得所有SEO資料
        *
        * @return \Illuminate\Http\Response
        */
    public function index()
    {
        $seo = SeoModel::all();
        return response()->json($seo);
    }
}
