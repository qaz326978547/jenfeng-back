<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactClassModel extends Model
{
    //
    protected $table = 'contact_class';

    protected $fillable = [
        "name",
        "no",
        "del"
    ];
}
