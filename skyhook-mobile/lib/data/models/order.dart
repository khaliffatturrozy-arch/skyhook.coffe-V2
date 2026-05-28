class OrderItem {
  final String id;
  final String orderId;
  final String menuItemId;
  final String menuItemName;
  final int quantity;
  final double unitPrice;
  final double subtotal;

  const OrderItem({
    required this.id,
    required this.orderId,
    required this.menuItemId,
    required this.menuItemName,
    required this.quantity,
    required this.unitPrice,
    required this.subtotal,
  });

  factory OrderItem.fromJson(Map<String, dynamic> json) => OrderItem(
    id: json['id'] as String,
    orderId: json['order_id'] as String,
    menuItemId: json['menu_item_id'] as String,
    menuItemName: json['menu_item_name'] as String? ?? '',
    quantity: json['quantity'] as int,
    unitPrice: (json['unit_price'] as num).toDouble(),
    subtotal: (json['subtotal'] as num).toDouble(),
  );
}

class Order {
  final String id;
  final String? userId;
  final String outletId;
  final String? tableId;
  final String status;
  final String orderType;
  final double subtotal;
  final double? tax;
  final double? serviceCharge;
  final double totalPrice;
  final String? notes;
  final DateTime createdAt;
  final DateTime? updatedAt;
  final List<OrderItem> items;

  const Order({
    required this.id,
    this.userId,
    required this.outletId,
    this.tableId,
    required this.status,
    this.orderType = 'dine_in',
    required this.subtotal,
    this.tax,
    this.serviceCharge,
    required this.totalPrice,
    this.notes,
    required this.createdAt,
    this.updatedAt,
    this.items = const [],
  });

  factory Order.fromJson(Map<String, dynamic> json) => Order(
    id: json['id'] as String,
    userId: json['user_id'] as String?,
    outletId: json['outlet_id'] as String,
    tableId: json['table_id'] as String?,
    status: json['status'] as String,
    orderType: json['order_type'] as String? ?? 'dine_in',
    subtotal: (json['subtotal'] as num).toDouble(),
    tax: (json['tax'] as num?)?.toDouble(),
    serviceCharge: (json['service_charge'] as num?)?.toDouble(),
    totalPrice: (json['total_price'] as num).toDouble(),
    notes: json['notes'] as String?,
    createdAt: DateTime.parse(json['created_at'] as String),
    updatedAt: json['updated_at'] != null ? DateTime.parse(json['updated_at'] as String) : null,
    items: (json['order_items'] as List?)?.map((e) => OrderItem.fromJson(e as Map<String, dynamic>)).toList() ?? [],
  );

  String get statusLabel {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'preparing': return 'Preparing';
      case 'ready': return 'Ready';
      case 'served': return 'Served';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  }

  String get priceFormatted => 'Rp ${totalPrice.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+(?!\d))'), (m) => '${m[1]}.')}';
}
