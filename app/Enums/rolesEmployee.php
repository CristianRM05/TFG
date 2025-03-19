<?php

namespace App\Enums;

enum rolesEmployee: string
{
    case Manager = 'Jefe de Trafico';
    case operator = 'Operario';
    case dealer = 'Repartidor';
}
