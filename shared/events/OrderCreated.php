<?php

namespace Shared\Events;

/**
 * Order Created Event
 * Source: sales-service
 * Consumers: inventory-service, logistics-service, finance-service, wallet-service
 */
class OrderCreated extends Event
{
    public function __construct(
        public readonly int $orderId,
        public readonly int $customerId,
        public readonly float $totalAmount,
        public readonly array $items, // [{product_variant_id, quantity, price}]
        public readonly ?string $paymentMethod = null,
        public readonly ?int $warehouseId = null,
    ) {
        parent::__construct([
            'order_id' => $orderId,
            'customer_id' => $customerId,
            'total_amount' => $totalAmount,
            'items' => $items,
            'payment_method' => $paymentMethod,
            'warehouse_id' => $warehouseId,
        ]);
    }
}

/**
 * Payment Received Event
 * Source: finance-service
 * Consumers: sales-service, wallet-service
 */
class PaymentReceived extends Event
{
    public function __construct(
        public readonly int $paymentId,
        public readonly int $orderId,
        public readonly float $amount,
        public readonly string $paymentMethod,
        public readonly string $status,
    ) {
        parent::__construct([
            'payment_id' => $paymentId,
            'order_id' => $orderId,
            'amount' => $amount,
            'payment_method' => $paymentMethod,
            'status' => $status,
        ]);
    }
}

/**
 * Purchase Order Received Event
 * Source: procurement-service
 * Consumers: inventory-service, finance-service
 */
class PurchaseOrderReceived extends Event
{
    public function __construct(
        public readonly int $purchaseOrderId,
        public readonly int $supplierId,
        public readonly array $items, // [{product_variant_id, quantity, received_qty}]
        public readonly float $totalCost,
        public readonly int $warehouseId,
    ) {
        parent::__construct([
            'purchase_order_id' => $purchaseOrderId,
            'supplier_id' => $supplierId,
            'items' => $items,
            'total_cost' => $totalCost,
            'warehouse_id' => $warehouseId,
        ]);
    }
}

/**
 * Product Created Event
 * Source: catalog-service
 * Consumers: procurement-service, sales-service
 */
class ProductCreated extends Event
{
    public function __construct(
        public readonly int $productId,
        public readonly string $productName,
        public readonly string $sku,
        public readonly array $categoryIds,
        public readonly float $basePrice,
    ) {
        parent::__construct([
            'product_id' => $productId,
            'product_name' => $productName,
            'sku' => $sku,
            'category_ids' => $categoryIds,
            'base_price' => $basePrice,
        ]);
    }
}

/**
 * Shipment Delivered Event
 * Source: logistics-service
 * Consumers: sales-service, crm-service
 */
class ShipmentDelivered extends Event
{
    public function __construct(
        public readonly int $shipmentId,
        public readonly int $orderId,
        public readonly int $customerId,
        public readonly string $deliveryDate,
    ) {
        parent::__construct([
            'shipment_id' => $shipmentId,
            'order_id' => $orderId,
            'customer_id' => $customerId,
            'delivery_date' => $deliveryDate,
        ]);
    }
}

/**
 * Stock Low Alert Event
 * Source: inventory-service
 * Consumers: procurement-service, sales-service
 */
class StockLowAlert extends Event
{
    public function __construct(
        public readonly int $productVariantId,
        public readonly string $sku,
        public readonly int $currentStock,
        public readonly int $minThreshold,
        public readonly int $warehouseId,
    ) {
        parent::__construct([
            'product_variant_id' => $productVariantId,
            'sku' => $sku,
            'current_stock' => $currentStock,
            'min_threshold' => $minThreshold,
            'warehouse_id' => $warehouseId,
        ]);
    }
}

/**
 * User Registered Event
 * Source: auth-service
 * Consumers: crm-service, sales-service
 */
class UserRegistered extends Event
{
    public function __construct(
        public readonly int $userId,
        public readonly string $name,
        public readonly string $email,
        public readonly string $phone,
        public readonly string $userType, // customer, staff, supplier
    ) {
        parent::__construct([
            'user_id' => $userId,
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'user_type' => $userType,
        ]);
    }
}

/**
 * Expense Approved Event
 * Source: finance-service
 * Consumers: audit-service
 */
class ExpenseApproved extends Event
{
    public function __construct(
        public readonly int $expenseId,
        public readonly float $amount,
        public readonly int $approvedBy,
        public readonly string $category,
    ) {
        parent::__construct([
            'expense_id' => $expenseId,
            'amount' => $amount,
            'approved_by' => $approvedBy,
            'category' => $category,
        ]);
    }
}
