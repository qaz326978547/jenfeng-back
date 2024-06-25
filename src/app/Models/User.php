<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Passport\HasApiTokens; //API驗證 <<<新增這行
class User extends Authenticatable
{
    use HasApiTokens;
    use Notifiable;

    /**
     * 指定資料表名稱
     *
     * @var array
     */
    protected $table = 'users';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'is_admin'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    public function isAdmin($query)
    {
        return $query->where('is_admin', 1);
    }
}
