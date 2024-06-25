<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactListModel extends Model
{
    //
    protected $table = 'contact_list';

    protected $fillable = [
        'name',
        'cel',
        'job',
        'email',
        'cid',
    ];

    public function contact()
    {
        return $this->belongsTo(ContactModel::class, 'cid');
    }
}
