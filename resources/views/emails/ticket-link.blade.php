<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nuevo Ticket en Swapify</title>
    <style>
        /* Variables de colores - Puedes cambiar estos valores fácilmente */
        :root {
            --primary: #4f46e5;  /* Indigo 600 - Color principal */
            --primary-dark: #4338ca;  /* Indigo 700 - Para hover */
            --accent: #10b981;  /* Emerald 500 - Color de acento/éxito */
            --text-dark: #1f2937; /* Gray 800 - Texto principal */
            --text-light: #6b7280; /* Gray 500 - Texto secundario */
            --bg-light: #f9fafb; /* Gray 50 - Fondo claro */
            --bg-white: #ffffff; /* Blanco puro */
            --border: #e5e7eb; /* Gray 200 - Bordes */
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
            background-color: #f3f4f6;
            padding: 20px;
            line-height: 1.6;
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: var(--bg-white);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.03);
        }

        .email-header {
            background-color: var(--primary);
            padding: 30px;
            text-align: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logo {
            width: 180px;
            margin-bottom: 10px;
        }

        .email-header h1 {
            color: white;
            font-size: 24px;
            font-weight: 600;
            margin: 0;
            letter-spacing: -0.5px;
        }

        .email-body {
            padding: 30px;
            background-color: var(--bg-white);
            color: var(--text-dark);
        }

        .greeting {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 16px;
            color: var(--text-dark);
        }

        .message {
            font-size: 16px;
            color: var(--text-light);
            margin-bottom: 24px;
            line-height: 1.6;
        }

        .ticket-status {
            background-color: var(--bg-light);
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 24px;
            border-left: 4px solid var(--accent);
        }

        .ticket-status p {
            margin: 0;
            color: var(--text-dark);
            font-size: 14px;
            font-weight: 500;
        }

        .ticket-status span {
            color: var(--accent);
            font-weight: 600;
        }

        .cta-button {
            display: block;
            text-align: center;
            margin: 30px 0;
        }

        .button {
            display: inline-block;
            background-color: var(--primary);
            color: white;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 50px;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.2s ease;
            box-shadow: 0 4px 6px rgba(79, 70, 229, 0.25);
        }

        .button:hover {
            background-color: var(--primary-dark);
            transform: translateY(-2px);
            box-shadow: 0 6px 10px rgba(79, 70, 229, 0.3);
        }

        .button-icon {
            margin-left: 8px;
            vertical-align: middle;
        }

        .email-footer {
            background-color: var(--bg-light);
            padding: 24px 30px;
            text-align: center;
            border-top: 1px solid var(--border);
        }

        .footer-text {
            color: var(--text-light);
            font-size: 14px;
            margin-bottom: 12px;
        }

        .social-links {
            margin-top: 16px;
        }

        .social-icon {
            display: inline-block;
            margin: 0 8px;
            width: 32px;
            height: 32px;
            background-color: var(--bg-white);
            border-radius: 50%;
            padding: 6px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s ease;
        }

        .social-icon:hover {
            transform: translateY(-2px);
        }

        .divider {
            height: 1px;
            background-color: var(--border);
            margin: 20px 0;
        }

        .help-text {
            font-size: 13px;
            color: var(--text-light);
            margin-top: 16px;
        }

        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100%;
                border-radius: 0;
            }

            .email-header,
            .email-body,
            .email-footer {
                padding: 20px;
            }

            .greeting {
                font-size: 18px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <!-- Puedes reemplazar la imagen con el logo de Swapify -->
            <img src="https://via.placeholder.com/180x40/4f46e5/ffffff?text=SWAPIFY" alt="Swapify Logo" class="logo">
            <h1>Gestión de Tickets</h1>
        </div>

        <div class="email-body">
            <h2 class="greeting">¡Hola!</h2>

            <p class="message">
                Has creado un nuevo ticket en Swapify. Nuestro equipo revisará tu solicitud lo antes posible y te responderá en breve.
            </p>

            <div class="ticket-status">
                <p>Estado: <span>Abierto</span></p>
                <p>Puedes revisar y responder a tu ticket en cualquier momento usando el enlace de abajo.</p>
            </div>

            <div class="cta-button">
                <a href="{{ $url }}" class="button">
                    Ver mi Ticket
                    <svg class="button-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </a>
            </div>

            <p class="message">
                Si tienes alguna pregunta adicional, no dudes en contactarnos respondiendo a este correo electrónico o a través de nuestros canales de soporte.
            </p>
        </div>

        <div class="email-footer">
            <p class="footer-text">© 2025 Swapify. Todos los derechos reservados.</p>

            <div class="divider"></div>

            <p class="footer-text">Síguenos en nuestras redes sociales:</p>

            <div class="social-links">
                <!-- Facebook -->
                <a href="#" class="social-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="#4f46e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </a>

                <!-- Twitter -->
                <a href="#" class="social-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 4C22 4 21.3 6.1 20 7.4C21.6 17.4 10.6 24.7 2 19C4.2 19.1 6.4 18.4 8 17C3 15.5 0.5 9.6 3 5C5.2 7.6 8.6 9.1 12 9C11.1 4.8 16 2.4 19 5.2C20.1 5.2 22 4 22 4Z" stroke="#4f46e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </a>

                <!-- Instagram -->
                <a href="#" class="social-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke="#4f46e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.9079 12.2384 16.0396 11.4078 15.9059C10.5771 15.7723 9.80976 15.3801 9.21484 14.7852C8.61991 14.1902 8.22773 13.4229 8.09406 12.5922C7.9604 11.7615 8.09206 10.9099 8.47032 10.1584C8.84858 9.40685 9.45418 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87659 12.63 8C13.4789 8.12588 14.2648 8.52146 14.8717 9.1283C15.4785 9.73515 15.8741 10.5211 16 11.37Z" stroke="#4f46e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M17.5 6.5H17.51" stroke="#4f46e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </a>
            </div>

            <p class="help-text">
                Si no creaste este ticket o necesitas ayuda, por favor contacta con nuestro soporte en
                <a href="mailto:soporte@swapify.com" style="color: var(--primary);">soporte@swapify.com</a>
            </p>
        </div>
    </div>
</body>
</html>
