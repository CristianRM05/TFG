<?php

namespace App\Enums;

enum OrderStatus: string
{
    case Pendiente = 'Pendiente';
    case Asignado = 'Asignado';
    case Entregado = 'Entregado';
    case Cancelado = 'Cancelado';
}
