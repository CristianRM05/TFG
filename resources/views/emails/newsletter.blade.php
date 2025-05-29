<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Newsletter</title>
    <style>
        body {
            font-family: 'Segoe UI', sans-serif;
            background-color: #F3F3DF;
            margin: 0;
            padding: 0;
            color: #333;
        }

        .container {
            width: 100%;
            max-width: 600px;
            margin: auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }

        .header {
            background-color: #E17100;
            padding: 25px;
            text-align: center;
            color: #fff;
        }

        .header h1 {
            margin: 0;
            font-size: 26px;
            letter-spacing: 1px;
        }

        .content {
            padding: 35px 25px;
            line-height: 1.75;
            font-size: 17px;
            background-color: #F3F3DF;
        }

        .highlight {
            background-color: #E4E4CB;
            padding: 18px;
            border-left: 5px solid #E17100;
            margin-bottom: 25px;
            border-radius: 8px;
            color: #3B3B3B;
        }

        .button {
            display: inline-block;
            padding: 14px 28px;
            background-color: #E58E33;
            color: white;
            text-decoration: none;
            border-radius: 30px;
            font-weight: bold;
            margin-top: 25px;
            transition: background-color 0.3s ease;
        }

        .button:hover {
            background-color: #E17100;
        }

        .footer {
            background-color: #E4E4CB;
            text-align: center;
            padding: 18px;
            font-size: 13px;
            color: #666;
        }

        @media screen and (max-width: 600px) {
            .content {
                padding: 25px 18px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Swapify News</h1>
        </div>

        <div class="content">
            <div class="highlight">
                <p>{!! nl2br(e($content)) !!}</p>
            </div>

            <p style="text-align: center;">
                <a href="http://swapify-tfg.duckdns.org/dashboard" class="button">Ir al Panel</a>
            </p>
        </div>

        <div class="footer">
            © {{ date('Y') }} Swapify. Todos los derechos reservados.<br>
            Este correo fue enviado automáticamente. Por favor, no respondas a este mensaje.
        </div>
    </div>
</body>
</html>
