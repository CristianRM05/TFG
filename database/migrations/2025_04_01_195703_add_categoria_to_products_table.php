<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // Para MySQL/MariaDB
        if (DB::connection()->getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE products 
                ADD COLUMN categoria ENUM('destiladas', 'refresco', 'zumo', 'agua', 'cerveza', 'vino', 'energetica') 
                NULL 
                AFTER image_url");
        } 
        // Para PostgreSQL/SQLite
        else {
            Schema::table('products', function (Blueprint $table) {
                $table->string('categoria', 20)
                    ->nullable()
                    ->after('image_url');
            });
            
            // Añadir constraint para validación (excepto SQLite)
            if (DB::connection()->getDriverName() !== 'sqlite') {
                DB::statement("ALTER TABLE products 
                    ADD CONSTRAINT products_categoria_check 
                    CHECK (categoria IN ('destiladas', 'refresco', 'zumo', 'agua', 'cerveza', 'vino', 'energetica'))");
            }
        }
    }

    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('categoria');
        });
    }
};