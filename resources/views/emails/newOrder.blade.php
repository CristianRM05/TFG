<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Pedido Realizado</title>
    <style>
        body {
            font-family: 'Segoe UI', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
        }

        .container {
            width: 100%;
            max-width: 600px;
            margin: auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 0 10px rgba(0,0,0,0.05);
        }

        .header {
            background-color: #E17100;
            padding: 20px;
            text-align: center;
            color: #fff;
        }

        .header h1 {
            margin: 0;
            font-size: 24px;
        }

        .content {
            padding: 30px 20px;
            line-height: 1.7;
            font-size: 16px;
        }

        .footer {
            background-color: #f1f1f1;
            text-align: center;
            padding: 15px;
            font-size: 13px;
            color: #888;
        }

        .highlight {
            background-color: #F3F3DF;
            padding: 15px;
            border-left: 4px solid #E17100;
            margin-bottom: 20px;
            border-radius: 6px;
            color: #333;
        }

        a.button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #E17100;
            color: white;
            text-decoration: none;
            border-radius: 30px;
            margin-top: 20px;
            font-weight: bold;
        }

        @media screen and (max-width: 600px) {
            .content {
                padding: 20px 15px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Pedido Realizado con Éxito</h1>
        </div>

        <div class="content">
            <div class="highlight">
                <p>{!! nl2br(e($content)) !!}</p>
            </div>

            <p><strong>Número de Referencia:</strong> {{ $orderNumber }}</p>

            <p>Tu pedido se ha registrado correctamente. Puedes consultar el estado y descargar la factura accediendo a tu cuenta en nuestra página web.</p>

            <p style="text-align: center;">
                <a href="http://localhost:8001/dashboard/orders/{{ $order->id }}" class="button">Ver mi pedido</a>
            </p>
        </div>

        <div class="footer">
            © {{ date('Y') }} Swapify. Todos los derechos reservados.<br>
            Este correo fue enviado automáticamente. Por favor, no respondas a este mensaje.
        </div>
    </div>
</body>
</html>
