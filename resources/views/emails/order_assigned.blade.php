<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Pedido asignado</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            background-color: #f9fafb;
            margin: 0;
            padding: 0;
            color: #1f2937;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #fd941c;
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .logo img {
            width: 60px;
            height: 60px;
            margin-bottom: 10px;
        }
        .content {
            padding: 30px 20px;
        }
        .order-info {
            background-color: #f3f4f6;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 25px;
        }
        .status-badge {
            display: inline-block;
            background-color: #fef3c7;
            color: #f59e0b;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 14px;
            margin-bottom: 15px;
        }
        .info-item {
            display: flex;
            margin-bottom: 15px;
            align-items: flex-start;
        }
        .info-icon {
            width: 24px;
            height: 24px;
            margin-right: 15px;
            flex-shrink: 0;
        }
        .info-text strong {
            display: block;
            font-weight: 600;
            color: #374151;
        }
        .divider {
            border-top: 1px solid #e5e7eb;
            margin: 25px 0;
        }
        .footer {
            text-align: center;
            padding: 20px;
            background-color: #f9fafb;
            color: #6b7280;
            font-size: 12px;
        }
        .btn {
            display: inline-block;
            background-color: #f37024;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: 600;
            margin-top: 15px;
        }
        @media (max-width: 600px) {
            .container {
                border-radius: 0;
            }
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <div class="logo">
            <img src="https://cdn-icons-png.flaticon.com/512/2981/2981016.png" alt="Logo">
        </div>
        <h1>¡Tu pedido está en camino!</h1>
    </div>

    <div class="content">
        <p>Hola <strong>{{ $order->user->name }}</strong>,</p>
        <p>Nos complace informarte que tu pedido ha sido asignado y está siendo procesado.</p>

        <div class="order-info">
            <div class="status-badge">
                <img src="https://cdn-icons-png.flaticon.com/512/6598/6598519.png" alt="Asignado" width="16" height="16" style="vertical-align: middle; margin-right: 5px;">
                En proceso
            </div>

            <h2>Pedido #{{ $order->ref }}</h2>

            <div class="info-item">
                <img src="https://cdn-icons-png.flaticon.com/512/1827/1827392.png" alt="Reloj" class="info-icon">
                <div class="info-text">
                    <strong>Estado del pedido</strong>
                    Tu pedido ha sido asignado y está en camino.
                </div>
            </div>

            <div class="info-item">
                <img src="https://cdn-icons-png.flaticon.com/512/684/684908.png" alt="Ubicación" class="info-icon">
                <div class="info-text">
                    <strong>Dirección de envío</strong>
                    {{ $order->shipping_address }}
                </div>
            </div>
        </div>

        <p>Te notificaremos cuando tu pedido esté completado. Si tienes alguna pregunta, no dudes en contactarnos.</p>

        <div style="text-align: center;">
            <a href="https://wealthy-walleye-severely.ngrok-free.app/my-orders" class="btn">Ver detalles del pedido</a>
        </div>
    </div>

    <div class="footer">
        <p>© 2025 Swapify. Todos los derechos reservados.</p>
        <p>Este email fue enviado a {{ $order->user->email }} porque tienes un pedido con nosotros.</p>
    </div>
</div>
</body>
</html>
