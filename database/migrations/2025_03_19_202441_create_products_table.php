<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\categoryProducts;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('num_reference')->unique();
            $table->integer('stock')->default(0);
            $table->float('price');
           // $table->float('discount_percent')->default(0);
            $table->string('image_url')->nullable();
            $table->string('categoria'); // Enum como string
            $table->unsignedBigInteger('shelf_id')->nullable(); // <- esta es la columna que falta
            $table->timestamps();

            $table->foreign('shelf_id')->references('id')->on('shelves')->onDelete('set null');
        });


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Products');
    }
};
