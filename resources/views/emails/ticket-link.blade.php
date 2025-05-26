<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nuevo Ticket en Swapify</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        /* Variables de colores mejoradas */
        :root {
            --primary: linear-gradient(135deg, #ec5b21 0%, #ebaf6b 100%);
            --primary-solid: #e7672b;
            --primary-dark: #e08712;
            --accent: #fdb632;
            --accent-light: #ecde5f;
            --success: #10b981;
            --text-dark: #1a202c;
            --text-medium: #f7a439;
            --text-light: #fa9e25;
            --bg-gradient: linear-gradient(180deg, #f7fafc 0%, #edf2f7 100%);
            --bg-white: #ffffff;
            --bg-light: #f8fafc;
            --border: #e2e8f0;
            --shadow-light: 0 4px 6px rgba(0, 0, 0, 0.05);
            --shadow-medium: 0 10px 25px rgba(0, 0, 0, 0.1);
            --shadow-heavy: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            background: var(--bg-gradient);
            padding: 20px;
            line-height: 1.6;
            color: var(--text-dark);
        }

        .email-container {
            max-width: 640px;
            margin: 0 auto;
            background: var(--bg-white);
            border-radius: 20px;
            overflow: hidden;
            box-shadow: var(--shadow-heavy);
            position: relative;
        }

        .email-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #667eea, #764ba2, #00d4aa, #4ade80);
            background-size: 400% 100%;
            animation: gradientShift 8s ease infinite;
        }

        @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }

        .email-header {
            background: var(--primary);
            padding: 50px 40px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .email-header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
        }

        .logo-container {
            position: relative;
            z-index: 2;
            margin-bottom: 20px;
        }

        .logo {
            width: 200px;
            height: auto;
            filter: brightness(0) invert(1);
            transition: transform 0.3s ease;
        }

        .logo:hover {
            transform: scale(1.05);
        }

        .email-header h1 {
            color: white;
            font-size: 28px;
            font-weight: 700;
            margin: 0;
            letter-spacing: -0.5px;
            position: relative;
            z-index: 2;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .header-subtitle {
            color: rgba(255, 255, 255, 0.8);
            font-size: 16px;
            font-weight: 400;
            margin-top: 8px;
            position: relative;
            z-index: 2;
        }

        .email-body {
            padding: 50px 40px;
            background: var(--bg-white);
        }

        .greeting {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 20px;
            color: var(--text-dark);
            background: linear-gradient(135deg, var(--primary-solid), var(--accent));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .message {
            font-size: 17px;
            color: var(--text-medium);
            margin-bottom: 30px;
            line-height: 1.7;
            font-weight: 400;
        }

        .ticket-card {
            background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
            border-radius: 16px;
            padding: 30px;
            margin: 30px 0;
            border: 1px solid var(--border);
            box-shadow: var(--shadow-light);
            position: relative;
            overflow: hidden;
        }

        .ticket-card::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background: linear-gradient(180deg, var(--accent), var(--accent-light));
        }

        .ticket-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
            flex-wrap: wrap;
            gap: 15px;
        }

        .ticket-id {
            font-size: 14px;
            color: var(--text-light);
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .status-badge {
            background: linear-gradient(135deg, var(--success), var(--accent-light));
            color: white;
            padding: 8px 16px;
            border-radius: 50px;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
        }

        .ticket-description {
            color: var(--text-medium);
            font-size: 15px;
            line-height: 1.6;
            margin: 0;
        }

        .cta-section {
            text-align: center;
            margin: 40px 0;
        }

        .button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: var(--primary);
            color: white;
            text-decoration: none;
            padding: 18px 36px;
            border-radius: 50px;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: var(--shadow-medium);
            position: relative;
            overflow: hidden;
            min-width: 200px;
        }

        .button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
        }

        .button:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
        }

        .button:hover::before {
            left: 100%;
        }

        .button-icon {
            margin-left: 10px;
            transition: transform 0.3s ease;
        }

        .button:hover .button-icon {
            transform: translateX(3px);
        }

        .info-section {
            background: #f8fafc;
            border-radius: 12px;
            padding: 24px;
            margin: 30px 0;
            border-left: 4px solid var(--accent);
        }

        .info-section h3 {
            color: var(--text-dark);
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 12px;
        }

        .info-list {
            list-style: none;
            padding: 0;
        }

        .info-list li {
            color: var(--text-medium);
            font-size: 15px;
            margin-bottom: 8px;
            padding-left: 20px;
            position: relative;
        }

        .info-list li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: var(--accent);
            font-weight: bold;
        }

        .email-footer {
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            padding: 40px;
            text-align: center;
            border-top: 1px solid var(--border);
        }

        .footer-brand {
            margin-bottom: 30px;
        }

        .footer-logo {
            width: 120px;
            opacity: 0.7;
            margin-bottom: 16px;
        }

        .footer-text {
            color: var(--text-light);
            font-size: 14px;
            margin-bottom: 20px;
            font-weight: 400;
        }

        .social-section {
            margin: 30px 0;
        }

        .social-title {
            color: var(--text-medium);
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 20px;
        }

        .social-links {
            display: flex;
            justify-content: center;
            gap: 15px;
            flex-wrap: wrap;
        }

        .social-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 44px;
            height: 44px;
            background: white;
            border-radius: 50%;
            text-decoration: none;
            box-shadow: var(--shadow-light);
            transition: all 0.3s ease;
            color: var(--text-medium);
        }

        .social-icon:hover {
            transform: translateY(-3px);
            box-shadow: var(--shadow-medium);
            color: var(--primary-solid);
        }

        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, var(--border), transparent);
            margin: 30px 0;
        }

        .help-section {
            background: white;
            border-radius: 12px;
            padding: 24px;
            margin-top: 20px;
            box-shadow: var(--shadow-light);
        }

        .help-text {
            font-size: 14px;
            color: var(--text-medium);
            text-align: center;
            line-height: 1.6;
        }

        .help-link {
            color: var(--primary-solid);
            text-decoration: none;
            font-weight: 600;
            border-bottom: 1px solid transparent;
            transition: border-color 0.3s ease;
        }

        .help-link:hover {
            border-bottom-color: var(--primary-solid);
        }

        @media only screen and (max-width: 640px) {
            body {
                padding: 10px;
            }

            .email-container {
                border-radius: 16px;
            }

            .email-header,
            .email-body,
            .email-footer {
                padding: 30px 24px;
            }

            .greeting {
                font-size: 20px;
            }

            .message {
                font-size: 16px;
            }

            .ticket-card {
                padding: 24px;
            }

            .ticket-header {
                flex-direction: column;
                align-items: flex-start;
            }

            .button {
                width: 100%;
                padding: 16px 24px;
            }

            .social-links {
                gap: 12px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <div class="logo-container">
                <img src="https://i.ibb.co/Z1mPQmbK/s-removebg-preview.png" alt="Swapify Logo" class="logo">
            </div>
            <h1 style="color: #e7672b">Gestión de Tickets</h1>
            <p class="header-subtitle" style="color: #e08712">Tu solicitud ha sido recibida correctamente</p>
        </div>

        <div class="email-body">
            <h2 class="greeting">¡Hola! 👋</h2>

            <p class="message">
                Acabas de crear un nuevo ticket en <strong>Swapify</strong>. Nuestro equipo de soporte especializado revisará tu solicitud de manera prioritaria y te responderá lo antes posible.
            </p>

            <div class="ticket-card">
                <div class="ticket-header">
                    <span class="ticket-id">Ticket #SW-2025-001</span>
                    <span class="status-badge">Abierto</span>
                </div>
                <p class="ticket-description">
                    Puedes revisar el progreso de tu ticket, añadir comentarios adicionales y recibir actualizaciones en tiempo real usando el enlace de acceso directo.
                </p>
            </div>

            <div class="info-section">
                <h3>¿Qué sucede ahora?</h3>
                <ul class="info-list">
                    <li>Tu ticket ha sido asignado a nuestro equipo especializado</li>
                    <li>Puedes responder directamente desde la plataforma</li>
                    <li>Tiempo de respuesta estimado: 2-4 horas hábiles</li>
                </ul>
            </div>

            <div class="cta-section">
                <a href="{{ $url }}" class="button">
                    Ver mi Ticket
                    <svg class="button-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </a>
            </div>

            <p class="message">
                Si tienes información adicional que pueda ayudarnos a resolver tu consulta más rápidamente, no dudes en agregarla directamente en tu ticket o contactarnos a través de nuestros canales de soporte.
            </p>
        </div>

        <div class="email-footer">
            <div class="footer-brand">
                <img src="https://i.ibb.co/Z1mPQmbK/s-removebg-preview.png" alt="Swapify" class="footer-logo">
                <p class="footer-text">© 2025 Swapify. Todos los derechos reservados.</p>
            </div>

            <div class="divider"></div>


            <div class="help-section">
                <p class="help-text">
                    ¿No creaste este ticket o necesitas ayuda adicional?<br>
                    Contacta con nuestro equipo de soporte en
                    <a href="mailto:soporte@swapify.com" class="help-link">soporte@swapify.com</a>
                    <br><br>
                    <strong>Horario de atención:</strong> Lunes a Viernes, 9:00 AM - 6:00 PM (GMT-5)
                </p>
            </div>
        </div>
    </div>
</body>
</html>
