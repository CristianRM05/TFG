<h1>Albarán de Envío</h1>
<p>Ref: {{ $order->ref }}</p>
<p>Cliente: {{ $order->user->name }}</p>
<p>Fecha asignación: {{ $order->assigned_at }}</p>

<table>
    <thead>
        <tr><th>Producto</th><th>Cantidad</th></tr>
    </thead>
    <tbody>
        @foreach($order->items as $item)
            <tr>
                <td>{{ $item->product->name }}</td>
                <td>{{ $item->quantity }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
