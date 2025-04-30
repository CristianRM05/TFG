<?php

// app/Models/NewsletterSubscriber.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NewsletterSubscriber extends Model
{
    protected $fillable = ['email'];
}
