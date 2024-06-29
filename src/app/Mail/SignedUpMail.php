<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class SignedUpMail extends Mailable
{
    use Queueable, SerializesModels;

    public $company;

    public $class;
    public $num;
    public $tel;

    public $sent_at;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($company, $class, $num, $tel)
    {
        $this->company = $company;
        $this->class = $class;
        $this->num = $num;
        $this->tel = $tel;
        $this->sent_at = now()->format('Y/m/d H:i:s');
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('JINFENG 報名成功通知')->view('emails.signUpClass');
    }
}
