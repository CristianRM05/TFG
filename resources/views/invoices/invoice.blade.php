<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Factura - Swapify</title>
    <style>
        :root {
            --primary-color: #e27720;
            --secondary-color: #F0F4FF;
            --text-color: #333333;
            --border-color: #E0E6F5;
            --accent-color: #29CC97;
            --light-gray: #F8F9FC;
        }

        body {
            font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: var(--text-color);
            background-color: #ffffff;
            margin: 0;
            padding: 0;
        }

        .invoice-container {
            max-width: 800px;
            margin: 10px auto;
            padding: 25px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
            border-radius: 12px;
            position: relative;
        }

        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            color: rgba(74, 108, 250, 0.02);
            font-size: 120px;
            font-weight: bold;
            z-index: -1;
            white-space: nowrap;
        }

        .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            border-bottom: 2px solid var(--border-color);
            padding-bottom: 15px;
        }

        .company-info {
            flex: 1;
        }

        .company-info h2 {
            color: var(--primary-color);
            margin: 0 0 3px 0;
            font-size: 22px;
        }

        .company-info p {
            margin: 2px 0;
            color: #666;
            font-size: 12px;
        }

        .invoice-details {
            text-align: right;
        }

        .invoice-details h1 {
            margin: 0;
            color: var(--primary-color);
            font-size: 28px;
            letter-spacing: 1px;
        }

        .invoice-details .invoice-id {
            font-size: 16px;
            color: #888;
            margin: 5px 0 15px;
        }

        .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 20px;
        }

        .client-details, .order-details {
            background-color: var(--secondary-color);
            padding: 12px;
            border-radius: 8px;
            border-left: 4px solid var(--primary-color);
        }

        .details-title {
            color: var(--primary-color);
            font-size: 14px;
            margin-top: 0;
            margin-bottom: 10px;
            font-weight: 600;
        }

        .detail-row {
            display: flex;
            margin-bottom: 4px;
        }

        .detail-label {
            flex: 1;
            font-weight: 500;
            color: #666;
        }

        .detail-value {
            flex: 2;
        }

        .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            margin-bottom: 15px;
        }

        .table th {
            background-color: var(--primary-color);
            color: white;
            padding: 8px 10px;
            text-align: left;
            font-weight: 500;
        }

        .table th:first-child {
            border-top-left-radius: 8px;
        }

        .table th:last-child {
            border-top-right-radius: 8px;
            text-align: right;
        }

        .table td {
            padding: 6px 10px;
            border-bottom: 1px solid var(--border-color);
        }

        .table tr:nth-child(even) {
            background-color: var(--light-gray);
        }

        .table tr:last-child td:first-child {
            border-bottom-left-radius: 8px;
        }

        .table tr:last-child td:last-child {
            border-bottom-right-radius: 8px;
        }

        .table td:last-child {
            text-align: right;
        }

        .total-section {
            margin-left: auto;
            width: 250px;
        }

        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            border-bottom: 1px solid var(--border-color);
        }

        .total-row:last-child {
            border-bottom: none;
            font-weight: bold;
            font-size: 15px;
            color: var(--primary-color);
            padding-top: 8px;
        }

        .total-row.subtotal {
            border-top: 2px solid var(--border-color);
            margin-top: 5px;
        }

        .footer {
            margin-top: 50px;
            text-align: center;
            color: #888;
            font-size: 13px;
            border-top: 1px solid var(--border-color);
            padding-top: 20px;
        }

        .payment-info {
            margin-top: 40px;
            background-color: var(--light-gray);
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid var(--accent-color);
        }

        .status-badge {
            display: inline-block;
            padding: 5px 12px;
            border-radius: 20px;
            font-weight: 500;
            font-size: 12px;
            text-transform: uppercase;
        }

        .status-completed {
            background-color: rgba(41, 204, 151, 0.15);
            color: #29CC97;
        }

        .status-pending {
            background-color: rgba(255, 184, 0, 0.15);
            color: #FFB800;
        }

        .status-cancelled {
            background-color: rgba(255, 77, 77, 0.15);
            color: #FF4D4D;
        }

        @media print {
            .invoice-container {
                box-shadow: none;
                margin: 0;
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="watermark">SWAPIFY</div>

        <div class="header">
            <div class="company-info">
                <h2>Swapify</h2>
                <p>Calle cartuja Center, 123 |  Sevilla, España</p>
                <p>info@swapify.com | CIF: B12345678</p>
            </div>
            <div class="invoice-details">
                <h1>FACTURA</h1>
                <div class="invoice-id">Nº {{ $order->ref }}</div>
                <p>Fecha de emisión: {{ $date }}</p>
                <p>Método de pago: Tarjeta de crédito</p>

                @php
                    $statusClass = 'status-pending';
                    if($order->status == 'Completado') {
                        $statusClass = 'status-completed';
                    } elseif($order->status == 'Cancelado') {
                        $statusClass = 'status-cancelled';
                    }
                @endphp

                <span class="status-badge {{ $statusClass }}">{{ $order->status }}</span>
            </div>
        </div>

        <div class="details-grid">
            <div class="client-details">
                <h3 class="details-title">Cliente</h3>
                <div class="detail-row">
                    <span class="detail-label">Nombre:</span>
                    <span class="detail-value">{{ $user->name }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">{{ $user->email }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Dirección:</span>
                    <span class="detail-value">{{ $order->shipping_address }}</span>
                </div>
            </div>

            <div class="order-details">
                <h3 class="details-title">Detalles del Pedido</h3>
                <div class="detail-row">
                    <span class="detail-label">Referencia:</span>
                    <span class="detail-value">{{ $order->ref }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Fecha:</span>
                    <span class="detail-value">{{ $date }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Estado:</span>
                    <span class="detail-value">{{ $order->status }}</span>
                </div>
            </div>
        </div>

        @php
            $subtotal = 0;
        @endphp

        <table class="table">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio unitario</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->items as $item)
                    @php
                        $lineTotal = $item->price * $item->quantity;
                        $subtotal += $lineTotal;
                    @endphp
                    <tr>
                        <td>{{ $item->product->name }}</td>
                        <td>{{ $item->quantity }}</td>
                        <td>{{ number_format($item->price, 2) }} €</td>
                        <td>{{ number_format($lineTotal, 2) }} €</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        @php
            $iva = $subtotal * 0.21;
            $total = $subtotal + $iva;
        @endphp

        <div class="total-section">
            <div class="total-row subtotal">
                <span>Subtotal</span>
                <span>{{ number_format($subtotal, 2) }} €</span>
            </div>
            <div class="total-row">
                <span>IVA (21%)</span>
                <span>{{ number_format($iva, 2) }} €</span>
            </div>
            <div class="total-row">
                <span>Total</span>
                <span>{{ number_format($total, 2) }} €</span>
            </div>
        </div>



        <div class="footer">
            <p>Gracias por confiar en Swapify</p>
            <p>Este documento es una factura electrónica válida según la legislación vigente.</p>
            <p>© {{ date('Y') }} Swapify - Todos los derechos reservados</p>
        </div>
    </div>
</body>
</html>
