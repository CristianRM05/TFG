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
            $table->string('name');
            $table->string('last_name');
            $table->string('dni')->unique();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password')->nullable();
            $table->string('phone')->nullable();
            $table->string('location')->nullable();
            $table->enum('role', ['Admin', 'Manager', 'Cliente'])->default('Cliente');
            $table->text('avatar')->nullable(); // Actualizado: tu modelo usa 'avatar', no 'photograph'
            $table->string('external_id')->nullable();
            $table->string('external_auth')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }
};
