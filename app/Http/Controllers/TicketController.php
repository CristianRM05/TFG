<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\TicketMessage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TicketController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'email' => auth()->check() ? 'nullable' : 'required|email',
        ]);

        $ticket = Ticket::create([
            'user_id' => auth()->id(),
            'email' => auth()->check() ? null : $request->email,
            'token' => auth()->check() ? null : Str::uuid(),
            'subject' => $request->subject,
        ]);

        TicketMessage::create([
            'ticket_id' => $ticket->id,
            'sender_type' => 'user',
            'sender_id' => auth()->id(),
            'message' => $request->message,
        ]);

        if (!auth()->check()) {
            $url = route('tickets.view', ['token' => $ticket->token]);

            // Enviar email con el enlace
            Mail::to($request->email)->send(new \App\Mail\TicketLinkMail($ticket, $url));
        }

        return back()->with('success', 'Ticket creado correctamente.');
    }

    public function view($token)
    {
        $ticket = Ticket::where('token', $token)->firstOrFail();
        return Inertia::render('Tickets/View', [
            'ticket' => $ticket->load('messages'),
        ]);
    }

   public function show($id)
{
    $ticket = Ticket::with('messages')->findOrFail($id);

    return Inertia::render('Tickets/View', [
        'ticket' => $ticket
    ]);
}


    public function reply(Request $request, $id)
    {
        $request->validate([
            'message' => 'required|string'
        ]);

        $ticket = Ticket::findOrFail($id);

        // ⚠️ Verificación manual de acceso:
        $canReply = false;

        if (auth()->check()) {
            // Usuario logueado puede responder si es suyo
            $canReply = auth()->id() === $ticket->user_id;
        } elseif ($request->has('token')) {
            // Usuario no logueado, comparar tokens
            $canReply = $ticket->token === $request->token;
        }

        if (!$canReply) {
            abort(403, 'No tienes permiso para responder a este ticket.');
        }

        TicketMessage::create([
            'ticket_id' => $ticket->id,
            'sender_type' => auth()->check() ? (auth()->user()->is_admin ? 'admin' : 'user') : 'user',
            'sender_id' => auth()->id(),
            'message' => $request->message,
        ]);

        return back()->with('success', 'Mensaje enviado');
    }

    public function adminIndex(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        
        $query = Ticket::with('user')->latest();
        
        // Filtrar por estado si se proporciona
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        
        $tickets = $query->paginate($perPage);
        
        return response()->json([
            'success' => true,
            'tickets' => $tickets->items(),
            'pagination' => [
                'current_page' => $tickets->currentPage(),
                'last_page' => $tickets->lastPage(),
                'per_page' => $tickets->perPage(),
                'total' => $tickets->total(),
            ]
        ]);
    }

 public function adminShow($id)
{
    $ticket = Ticket::with(['messages', 'user'])->findOrFail($id);

    return response()->json([
        'success' => true,
        'ticket' => $ticket,
    ]);
}

   public function adminReply(Request $request, $id)
{
    $request->validate(['message' => 'required|string']);

    $ticket = Ticket::findOrFail($id);

    TicketMessage::create([
        'ticket_id' => $ticket->id,
        'sender_type' => 'admin',
        'sender_id' => auth()->id(),
        'message' => $request->message,
    ]);

    return response()->json(['success' => true, 'message' => 'Respuesta enviada']);
}

public function adminUpdate(Request $request, $id)
{
    $request->validate([
        'status' => 'required|in:abierto,cerrado',
    ]);

    $ticket = Ticket::findOrFail($id);
    $ticket->status = $request->status;
    $ticket->save();

    return response()->json(['success' => true]);
}
public function close(Request $request, $id)
{
    $ticket = Ticket::findOrFail($id);

    if (!auth()->check()) {
        if ($ticket->token !== $request->token) {
            abort(403, 'Token inválido');
        }
    }

    $ticket->status = 'cerrado';
    $ticket->save();

    return back()->with('success', 'Ticket cerrado correctamente.');
}
public function myTickets()
{
    $tickets = Ticket::where('user_id', auth()->id())
        ->orderByDesc('created_at')
        ->get();

    return inertia('Tickets/MyTickets', [
        'tickets' => $tickets
    ]);
}

}
