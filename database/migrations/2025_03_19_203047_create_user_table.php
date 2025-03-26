<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('number_employ')->unique();
            $table->string('name');
            $table->string('last_name');
            $table->string('dni')->unique();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('phone');
            $table->string('address');
            $table->enum ('role', ['Admin','Manager', 'Operario', 'Repartidor'])->default('Operario');
            $table->string('photograph')->nullable();
            $table->string('license')->nullable();
            $table->string('driver_license')->nullable();
            $table->date('license_expiration_date')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {

            $table->string('license')->nullable(false);
            $table->string('driver_license')->nullable(false);
            $table->date('license_expiration_date')->nullable(false);
        });
    }
};
