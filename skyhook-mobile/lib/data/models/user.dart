class AppUser {
  final String id;
  final String? email;
  final String? fullName;
  final String? phone;
  final String? avatarUrl;
  final String membershipTier;
  final int points;
  final bool isSubscribed;
  final DateTime? createdAt;

  const AppUser({
    required this.id,
    this.email,
    this.fullName,
    this.phone,
    this.avatarUrl,
    this.membershipTier = 'bronze',
    this.points = 0,
    this.isSubscribed = false,
    this.createdAt,
  });

  factory AppUser.fromJson(Map<String, dynamic> json) => AppUser(
    id: json['id'] as String,
    email: json['email'] as String?,
    fullName: json['full_name'] as String?,
    phone: json['phone'] as String?,
    avatarUrl: json['avatar_url'] as String?,
    membershipTier: json['membership_tier'] as String? ?? 'bronze',
    points: json['points'] as int? ?? 0,
    isSubscribed: json['is_subscribed'] as bool? ?? false,
    createdAt: json['created_at'] != null ? DateTime.parse(json['created_at'] as String) : null,
  );

  String get tierLabel {
    switch (membershipTier) {
      case 'bronze': return 'Bronze';
      case 'silver': return 'Silver';
      case 'gold': return 'Gold';
      case 'platinum': return 'Platinum';
      case 'vip_elite': return 'VIP Elite';
      case 'skyhook_royalty': return 'Skyhook Royalty';
      default: return membershipTier;
    }
  }
}
