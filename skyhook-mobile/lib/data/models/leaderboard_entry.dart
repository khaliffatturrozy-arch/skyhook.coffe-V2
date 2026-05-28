class LeaderboardEntry {
  final String userId;
  final String? fullName;
  final String? avatarUrl;
  final String membershipTier;
  final int totalPoints;
  final int rank;

  const LeaderboardEntry({
    required this.userId,
    this.fullName,
    this.avatarUrl,
    this.membershipTier = 'bronze',
    required this.totalPoints,
    required this.rank,
  });

  factory LeaderboardEntry.fromJson(Map<String, dynamic> json) => LeaderboardEntry(
    userId: json['user_id'] as String,
    fullName: json['full_name'] as String?,
    avatarUrl: json['avatar_url'] as String?,
    membershipTier: json['membership_tier'] as String? ?? 'bronze',
    totalPoints: json['total_points'] as int,
    rank: json['rank'] as int,
  );
}
