<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPortalFieldsToOrdersTable extends Migration
{
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->bigInteger('user_id')->nullable();
            $table->decimal('total_amount', 10, 2)->nullable();
            $table->string('payment_method')->nullable();
            $table->text('shipping_address')->nullable();
            $table->string('stripe_session_id')->nullable();
        });
    }

    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'user_id',
                'total_amount',
                'payment_method',
                'shipping_address',
                'stripe_session_id'
            ]);
        });
    }
}
