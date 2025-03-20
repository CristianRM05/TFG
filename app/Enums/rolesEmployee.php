<?php

namespace App\Enums;

enum RolesEmployee: string
{
    case Manager = 'Manager';
    case Operator = 'Operario';
    case Dealer = 'Repartidor';
}
