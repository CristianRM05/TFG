<?php
namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Mail\NewsletterEmail;
use Illuminate\Support\Facades\Mail;
use App\Models\NewsletterSubscriber;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:newsletter_subscribers,email',
        ]);

        NewsletterSubscriber::create(['email' => $request->email]);

        return response()->json(['message' => 'Te has suscrito con éxito.']);
    }


    public function send(Request $request)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $subscribers = NewsletterSubscriber::all();

        foreach ($subscribers as $subscriber) {
            Mail::to($subscriber->email)->queue(new NewsletterEmail(
                $request->subject,
                $request->message
            ));
        }

        return response()->json(['message' => 'Newsletter enviada correctamente.']);
    }

}
