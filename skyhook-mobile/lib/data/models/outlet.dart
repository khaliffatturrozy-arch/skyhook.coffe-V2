class Outlet {
  final String id;
  final String name;
  final String slug;
  final String address;
  final String city;
  final String country;
  final String? phone;
  final String? email;
  final String openingHours;
  final String closingHours;
  final bool isActive;
  final double? latitude;
  final double? longitude;
  final String? imageUrl;
  final String? description;

  const Outlet({
    required this.id,
    required this.name,
    required this.slug,
    required this.address,
    required this.city,
    required this.country,
    this.phone,
    this.email,
    required this.openingHours,
    required this.closingHours,
    this.isActive = true,
    this.latitude,
    this.longitude,
    this.imageUrl,
    this.description,
  });

  factory Outlet.fromJson(Map<String, dynamic> json) => Outlet(
    id: json['id'] as String,
    name: json['name'] as String,
    slug: json['slug'] as String,
    address: json['address'] as String,
    city: json['city'] as String,
    country: json['country'] as String,
    phone: json['phone'] as String?,
    email: json['email'] as String?,
    openingHours: json['opening_hours'] as String,
    closingHours: json['closing_hours'] as String,
    isActive: json['is_active'] as bool? ?? true,
    latitude: (json['latitude'] as num?)?.toDouble(),
    longitude: (json['longitude'] as num?)?.toDouble(),
    imageUrl: json['image_url'] as String?,
    description: json['description'] as String?,
  );
}
