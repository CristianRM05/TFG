<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class MakeOptionalFieldsNullableInOrdersTable extends Migration
{
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->unsignedBigInteger('truck_id')->nullable()->change();
            $table->unsignedBigInteger('route_id')->nullable()->change();
            $table->unsignedBigInteger('delivery_person_id')->nullable()->change();
            $table->unsignedBigInteger('customer_id')->nullable()->change();
            $table->dateTime('scheduled_delivery_date')->nullable()->change();
        });
    }

    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->unsignedBigInteger('truck_id')->nullable(false)->change();
            $table->unsignedBigInteger('route_id')->nullable(false)->change();
            $table->unsignedBigInteger('delivery_person_id')->nullable(false)->change();
            $table->unsignedBigInteger('customer_id')->nullable(false)->change();
            $table->dateTime('scheduled_delivery_date')->nullable(false)->change();
        });
    }
}
