<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Verificar si existe la tabla stock antes de renombrar
        if (Schema::hasTable('stock')) {
            Schema::rename('stock', 'stocks');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revertir el cambio
        if (Schema::hasTable('stocks')) {
            Schema::rename('stocks', 'stock');
        }
    }
};