class Achievement {
  final String id;
  final String name;
  final String? description;
  final String? icon;
  final String category;
  final int? pointsRequired;

  const Achievement({
    required this.id,
    required this.name,
    this.description,
    this.icon,
    required this.category,
    this.pointsRequired,
  });

  factory Achievement.fromJson(Map<String, dynamic> json) => Achievement(
    id: json['id'] as String,
    name: json['name'] as String,
    description: json['description'] as String?,
    icon: json['icon'] as String?,
    category: json['category'] as String,
    pointsRequired: json['points_required'] as int?,
  );
}
