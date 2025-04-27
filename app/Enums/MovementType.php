<?php

namespace App\Enums;

enum MovementType: string
{
    //Se puede dejar para controlar las entradas y dalidas de productos
    //graficas estadisticas y demas
    
    case ENTRY = 'entry';
    case EXIT = 'exit';
}
