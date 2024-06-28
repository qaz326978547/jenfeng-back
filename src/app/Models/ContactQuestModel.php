<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactQuestModel extends Model
{
    //
    protected $table = 'contact_quest';

    protected $fillable = [
        "name",
        "no",
        "del"
    ];
}
