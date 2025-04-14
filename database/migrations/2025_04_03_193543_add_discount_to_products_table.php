<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->decimal('discount_percent', 5, 2)
                  ->nullable()
                  ->default(null)
                  ->after('price')
                  ->comment('Porcentaje de descuento aplicado (nullable)');
                  
            $table->decimal('final_price', 10, 2)
                  ->nullable()
                  ->virtualAs('CASE WHEN discount_percent IS NOT NULL THEN price - (price * discount_percent / 100) ELSE price END')
                  ->after('discount_percent')
                  ->comment('Precio final calculado (nullable)');
        });
    }

    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['discount_percent', 'final_price']);
        });
    }
};