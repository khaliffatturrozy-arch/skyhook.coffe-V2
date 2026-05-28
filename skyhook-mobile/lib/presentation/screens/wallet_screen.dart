import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_theme.dart';
import '../../data/providers/providers.dart';
import '../../data/models/wallet.dart';
import '../widgets/glass_card.dart';
import '../widgets/shimmer_loading.dart';

class WalletScreen extends ConsumerWidget {
  const WalletScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(currentUserProvider);
    final walletAsync = user != null ? ref.watch(walletProvider(user.id)) : const AsyncData<Wallet?>(null);
    final walletTransactionsAsync = walletAsync.when(
      data: (w) => w != null ? ref.watch(walletTransactionsProvider(w.id)) : const AsyncData<List<WalletTransaction>>([]),
      loading: () => const AsyncLoading<List<WalletTransaction>>(),
      error: (e, _) => AsyncError<List<WalletTransaction>>(e, StackTrace.current),
    );

    return Scaffold(
      appBar: AppBar(
        title: const Text('Wallet', style: TextStyle(fontFamily: 'PlayfairDisplay', fontWeight: FontWeight.bold)),
        backgroundColor: AppTheme.skyhookBlack,
        elevation: 0,
      ),
      body: walletAsync.when(
        data: (wallet) {
          if (wallet == null) {
            return const Center(child: Text('Wallet not found', style: TextStyle(color: Colors.white38)));
          }
          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              // Balance card
              GlassCard(
                child: Column(
                  children: [
                    Container(
                      width: 60, height: 60,
                      decoration: BoxDecoration(shape: BoxShape.circle, gradient: AppTheme.goldGradient),
                      child: const Icon(Icons.account_balance_wallet, color: Colors.black, size: 30),
                    ),
                    const SizedBox(height: 12),
                    const Text('Balance', style: TextStyle(fontSize: 13, color: Colors.white38)),
                    const SizedBox(height: 4),
                    Text(wallet.balanceFormatted, style: const TextStyle(fontSize: 36, fontWeight: FontWeight.bold, color: Colors.white)),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              // Stats
              Row(
                children: [
                  Expanded(child: _StatCard(label: 'Cashback', value: 'Rp ${wallet.cashbackBalance.toStringAsFixed(0)}', icon: Icons.monetization_on_outlined)),
                  const SizedBox(width: 12),
                  Expanded(child: _StatCard(label: 'Points', value: '${wallet.rewardPoints}', icon: Icons.star_outline)),
                ],
              ),
              const SizedBox(height: 12),
              _StatCard(label: 'Promo Credits', value: 'Rp ${wallet.promoCredits.toStringAsFixed(0)}', icon: Icons.discount_outlined),
              const SizedBox(height: 24),
              const Text('Transactions', style: TextStyle(fontFamily: 'PlayfairDisplay', fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
              const SizedBox(height: 12),
              walletTransactionsAsync.when(
                data: (txs) {
                  if (txs.isEmpty) {
                    return Padding(
                      padding: const EdgeInsets.symmetric(vertical: 24),
                      child: Center(child: Text('No transactions yet', style: TextStyle(color: Colors.white.withOpacity(0.3)))),
                    );
                  }
                  return Column(
                    children: txs.map((tx) => Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: GlassCard(
                        child: Row(
                          children: [
                            Container(
                              width: 40, height: 40,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: (tx.isCredit ? Colors.green : Colors.red).withOpacity(0.15),
                              ),
                              child: Icon(tx.isCredit ? Icons.arrow_downward : Icons.arrow_upward, color: tx.isCredit ? Colors.green : Colors.red, size: 18),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(tx.description ?? tx.type, style: const TextStyle(fontSize: 13, color: Colors.white)),
                                  Text('${tx.createdAt.day}/${tx.createdAt.month}/${tx.createdAt.year}', style: TextStyle(fontSize: 11, color: Colors.white.withOpacity(0.3))),
                                ],
                              ),
                            ),
                            Text(
                              '${tx.isCredit ? '+' : '-'}Rp ${tx.amount.toStringAsFixed(0)}',
                              style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: tx.isCredit ? Colors.green : Colors.red),
                            ),
                          ],
                        ),
                      ),
                    )).toList(),
                  );
                },
                loading: () => const ShimmerList(),
                error: (e, _) => Text('Error: $e', style: const TextStyle(color: Colors.red)),
              ),
              const SizedBox(height: 32),
            ],
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  const _StatCard({required this.label, required this.value, required this.icon});

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      child: Row(
        children: [
          Icon(icon, size: 24, color: AppTheme.skyhookAmber.withOpacity(0.7)),
          const SizedBox(width: 10),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: TextStyle(fontSize: 11, color: Colors.white.withOpacity(0.4))),
              Text(value, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white)),
            ],
          ),
        ],
      ),
    );
  }
}
