class Category {
  final String id;
  final String name;
  final String slug;
  final String? description;
  final int sortOrder;

  const Category({
    required this.id,
    required this.name,
    required this.slug,
    this.description,
    this.sortOrder = 0,
  });

  factory Category.fromJson(Map<String, dynamic> json) => Category(
    id: json['id'] as String,
    name: json['name'] as String,
    slug: json['slug'] as String,
    description: json['description'] as String?,
    sortOrder: json['sort_order'] as int? ?? 0,
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'slug': slug,
    'description': description,
    'sort_order': sortOrder,
  };
}
