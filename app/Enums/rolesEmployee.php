<?php

namespace App\Enums;

enum RolesEmployee: string
{
    case Manager = 'Manager';
    case Operator = 'Operario';
    case Dealer = 'Repartidor';
    case Admin = 'Admin';

    public function label(): string
    {
        return match ($this) {
            self::Manager => 'Manager',
            self::Operator => 'Operario',
            self::Dealer => 'Repartidor',
            self::Admin => 'Administrador',
        };
    }

    public static function casesArray(): array
    {
        return array_map(
            fn ($role) => ['value' => $role->value, 'label' => $role->label()],
            self::cases()
        );
    }

    public function is(self $role): bool
    {
        return $this === $role;
    }
}
