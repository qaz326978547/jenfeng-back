<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FAQModel extends Model
{
    //
    protected $table = 'faq';

    protected $fillable = [
        'name',
        'info'
    ];
}
