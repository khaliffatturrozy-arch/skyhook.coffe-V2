class MenuItem {
  final String id;
  final String categoryId;
  final String name;
  final String slug;
  final String description;
  final double price;
  final String? imageUrl;
  final bool isAvailable;
  final bool isFeatured;
  final int preparationTime;
  final int sortOrder;

  const MenuItem({
    required this.id,
    required this.categoryId,
    required this.name,
    required this.slug,
    required this.description,
    required this.price,
    this.imageUrl,
    this.isAvailable = true,
    this.isFeatured = false,
    this.preparationTime = 0,
    this.sortOrder = 0,
  });

  factory MenuItem.fromJson(Map<String, dynamic> json) => MenuItem(
    id: json['id'] as String,
    categoryId: json['category_id'] as String,
    name: json['name'] as String,
    slug: json['slug'] as String,
    description: json['description'] as String? ?? '',
    price: (json['price'] as num).toDouble(),
    imageUrl: json['image_url'] as String?,
    isAvailable: json['is_available'] as bool? ?? true,
    isFeatured: json['is_featured'] as bool? ?? false,
    preparationTime: json['preparation_time'] as int? ?? 0,
    sortOrder: json['sort_order'] as int? ?? 0,
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'category_id': categoryId,
    'name': name,
    'slug': slug,
    'description': description,
    'price': price,
    'image_url': imageUrl,
    'is_available': isAvailable,
    'is_featured': isFeatured,
    'preparation_time': preparationTime,
    'sort_order': sortOrder,
  };

  String get priceFormatted => 'Rp ${price.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+(?!\d))'), (m) => '${m[1]}.')}';
}
