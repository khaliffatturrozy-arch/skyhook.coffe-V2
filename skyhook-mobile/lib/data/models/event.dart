class SkyEvent {
  final String id;
  final String outletId;
  final String title;
  final String slug;
  final String description;
  final DateTime date;
  final String time;
  final String venue;
  final String type;
  final double price;
  final int capacity;
  final bool isFeatured;
  final String status;
  final String? imageUrl;

  const SkyEvent({
    required this.id,
    required this.outletId,
    required this.title,
    required this.slug,
    required this.description,
    required this.date,
    required this.time,
    required this.venue,
    required this.type,
    required this.price,
    required this.capacity,
    this.isFeatured = false,
    this.status = 'upcoming',
    this.imageUrl,
  });

  factory SkyEvent.fromJson(Map<String, dynamic> json) => SkyEvent(
    id: json['id'] as String,
    outletId: json['outlet_id'] as String,
    title: json['title'] as String,
    slug: json['slug'] as String,
    description: json['description'] as String? ?? '',
    date: DateTime.parse(json['date'] as String),
    time: json['time'] as String,
    venue: json['venue'] as String? ?? '',
    type: json['type'] as String,
    price: (json['price'] as num).toDouble(),
    capacity: json['capacity'] as int,
    isFeatured: json['is_featured'] as bool? ?? false,
    status: json['status'] as String? ?? 'upcoming',
    imageUrl: json['image_url'] as String?,
  );

  String get priceFormatted => price == 0 ? 'Free' : 'Rp ${price.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+(?!\d))'), (m) => '${m[1]}.')}';
}
