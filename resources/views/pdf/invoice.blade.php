<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Albarán Pedido {{ $order->ref }}</title>
    @include('pdf.invoice-style') {{-- Incluir estilos desde otro archivo --}}
</head>
<body>

    <div class="header">
        <h1>Swapify</h1>
        <div class="company-info">
            Calle Cartuja Center, 123 | Sevilla, España <br>
            info@swapify.com | CIF: B12345678
        </div>
    </div>

    <div class="invoice-title">ALBARÁN Nº {{ $order->ref }}</div>

    <div class="section">
        <div class="section-title">Cliente</div>
        <div>
            <strong>Nombre:</strong> {{ $order->user->name ?? 'N/A' }}<br>
            <strong>Email:</strong> {{ $order->user->email ?? 'N/A' }}<br>
            <strong>Dirección:</strong> {{ $order->shipping_address }}
        </div>
    </div>

    <div class="section">
        <div class="section-title">Detalles del Pedido</div>
        <table class="details-table">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio unitario</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($order->items as $item)
                    <tr>
                        <td>{{ $item->product->name }}</td>
                        <td>{{ $item->quantity }}</td>
                        <td>{{ number_format($item->price, 2) }} €</td>
                        <td>{{ number_format($item->price * $item->quantity, 2) }} €</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        @php
            $subtotal = $order->items->sum(fn($item) => $item->price * $item->quantity);
            $iva = $subtotal * 0.21;
            $total = $subtotal + $iva;
        @endphp

        <table class="totals">
            <tr>
                <td class="label">Subtotal:</td>
                <td class="value">{{ number_format($subtotal, 2) }} €</td>
            </tr>
            <tr>
                <td class="label">IVA (21%):</td>
                <td class="value">{{ number_format($iva, 2) }} €</td>
            </tr>
            <tr>
                <td class="label"><strong>Total:</strong></td>
                <td class="value"><strong>{{ number_format($total, 2) }} €</strong></td>
            </tr>
        </table>
    </div>

    <div class="footer">
        Gracias por confiar en Swapify<br>
        Este documento es un albarán válido según la legislación vigente.
    </div>

</body>
</html>
