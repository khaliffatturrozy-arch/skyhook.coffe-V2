class Staff {
  final String id;
  final String userId;
  final String outletId;
  final String role;
  final bool isActive;
  final String? shift;
  final String? pinCode;

  const Staff({
    required this.id,
    required this.userId,
    required this.outletId,
    required this.role,
    this.isActive = true,
    this.shift,
    this.pinCode,
  });

  factory Staff.fromJson(Map<String, dynamic> json) => Staff(
    id: json['id'] as String,
    userId: json['user_id'] as String,
    outletId: json['outlet_id'] as String,
    role: json['role'] as String,
    isActive: json['is_active'] as bool? ?? true,
    shift: json['shift'] as String?,
    pinCode: json['pin_code'] as String?,
  );

  String get roleLabel {
    switch (role) {
      case 'barista': return 'Barista';
      case 'chef': return 'Chef';
      case 'waiter': return 'Waiter';
      case 'host': return 'Host';
      case 'manager': return 'Manager';
      case 'admin': return 'Admin';
      default: return role;
    }
  }
}
