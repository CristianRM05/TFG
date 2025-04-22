<?php

namespace App\Enums;

enum StatusTruck: string
{
    case Disponible = 'Disponible';
    case Ocupado = 'Ocupado';
    case Mantenimiento = 'Mantenimiento';
}
