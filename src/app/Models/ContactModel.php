<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactModel extends Model
{
    //
    protected $table = 'contact';

    protected $fillable = [
        'class',
        'quest',
        'company',
        'tel',
        'num',
        'last5',
        'ticket',
        'ticket_name',
        'ticket_no',
        'ticket_address',
        'from',
        'suggest_name',
    ];

    public function contactList()
    {
        return $this->hasOne(ContactListModel::class, 'cid');
    }
}
