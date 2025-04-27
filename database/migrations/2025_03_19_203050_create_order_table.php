<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->dateTime('order_date');
            $table->dateTime('scheduled_delivery_date');
            $table->foreignId('delivery_person_id')->constrained('users')->onDelete('cascade');
            $table->double('total_amount');
            $table->string('payment_method');
            $table->string('shipping_address');
            $table->string('stripe_session_id')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
