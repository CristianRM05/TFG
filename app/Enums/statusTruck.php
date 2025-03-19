<?php

namespace App\Enums;

enum StatusTruck: string
{
    case AVAILABLE = 'Disponible';
    case BUSY = 'Ocupado';
    case MAINTENANCE = 'Mantenimiento';
}
