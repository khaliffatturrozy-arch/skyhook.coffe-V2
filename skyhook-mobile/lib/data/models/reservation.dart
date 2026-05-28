class Reservation {
  final String id;
  final String? userId;
  final String? outletId;
  final String? tableId;
  final DateTime date;
  final String time;
  final int guests;
  final String status;
  final String? notes;
  final DateTime createdAt;

  const Reservation({
    required this.id,
    this.userId,
    this.outletId,
    this.tableId,
    required this.date,
    required this.time,
    required this.guests,
    this.status = 'pending',
    this.notes,
    required this.createdAt,
  });

  factory Reservation.fromJson(Map<String, dynamic> json) => Reservation(
    id: json['id'] as String,
    userId: json['user_id'] as String?,
    outletId: json['outlet_id'] as String?,
    tableId: json['table_id'] as String?,
    date: DateTime.parse(json['date'] as String),
    time: json['time'] as String,
    guests: json['guests'] as int,
    status: json['status'] as String? ?? 'pending',
    notes: json['notes'] as String?,
    createdAt: DateTime.parse(json['created_at'] as String),
  );

  String get statusLabel {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'seated': return 'Seated';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  }
}
