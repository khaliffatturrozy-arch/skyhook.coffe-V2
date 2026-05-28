class Wallet {
  final String id;
  final String userId;
  final double balance;
  final double cashbackBalance;
  final int rewardPoints;
  final double promoCredits;
  final DateTime? createdAt;

  const Wallet({
    required this.id,
    required this.userId,
    this.balance = 0,
    this.cashbackBalance = 0,
    this.rewardPoints = 0,
    this.promoCredits = 0,
    this.createdAt,
  });

  factory Wallet.fromJson(Map<String, dynamic> json) => Wallet(
    id: json['id'] as String,
    userId: json['user_id'] as String,
    balance: (json['balance'] as num?)?.toDouble() ?? 0,
    cashbackBalance: (json['cashback_balance'] as num?)?.toDouble() ?? 0,
    rewardPoints: json['reward_points'] as int? ?? 0,
    promoCredits: (json['promo_credits'] as num?)?.toDouble() ?? 0,
    createdAt: json['created_at'] != null ? DateTime.parse(json['created_at'] as String) : null,
  );

  String get balanceFormatted => 'Rp ${balance.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+(?!\d))'), (m) => '${m[1]}.')}';
}

class WalletTransaction {
  final String id;
  final String walletId;
  final String type;
  final double amount;
  final String? description;
  final String? referenceId;
  final DateTime createdAt;

  const WalletTransaction({
    required this.id,
    required this.walletId,
    required this.type,
    required this.amount,
    this.description,
    this.referenceId,
    required this.createdAt,
  });

  factory WalletTransaction.fromJson(Map<String, dynamic> json) => WalletTransaction(
    id: json['id'] as String,
    walletId: json['wallet_id'] as String,
    type: json['type'] as String,
    amount: (json['amount'] as num).toDouble(),
    description: json['description'] as String?,
    referenceId: json['reference_id'] as String?,
    createdAt: DateTime.parse(json['created_at'] as String),
  );

  bool get isCredit => type == 'top_up' || type == 'cashback' || type == 'promo' || type == 'refund';
}
