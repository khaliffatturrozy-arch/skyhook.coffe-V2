import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_theme.dart';
import '../../data/providers/providers.dart';
import '../widgets/glass_card.dart';
import '../widgets/shimmer_loading.dart';

class LeaderboardScreen extends ConsumerWidget {
  const LeaderboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final leaderboardAsync = ref.watch(leaderboardProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Leaderboard', style: TextStyle(fontFamily: 'PlayfairDisplay', fontWeight: FontWeight.bold)),
        backgroundColor: AppTheme.skyhookBlack,
        elevation: 0,
      ),
      body: leaderboardAsync.when(
        data: (entries) {
          if (entries.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.leaderboard_outlined, size: 64, color: Colors.white.withOpacity(0.2)),
                  const SizedBox(height: 16),
                  const Text('No rankings yet', style: TextStyle(fontSize: 18, color: Colors.white38)),
                  const SizedBox(height: 8),
                  Text('Place orders to earn points and climb the leaderboard', style: TextStyle(fontSize: 14, color: Colors.white.withOpacity(0.3))),
                ],
              ),
            );
          }
          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: entries.length,
            separatorBuilder: (_, __) => const SizedBox(height: 8),
            itemBuilder: (context, i) => _LeaderboardRow(entry: entries[i]),
          );
        },
        loading: () => const ShimmerList(),
        error: (e, _) => Center(child: Text('Error: $e', style: const TextStyle(color: Colors.red))),
      ),
    );
  }
}

class _LeaderboardRow extends StatelessWidget {
  final dynamic entry;
  const _LeaderboardRow({required this.entry});

  Color _medalColor(int rank) {
    switch (rank) {
      case 1: return const Color(0xFFFFD700);
      case 2: return const Color(0xFFC0C0C0);
      case 3: return const Color(0xFFCD7F32);
      default: return Colors.transparent;
    }
  }

  @override
  Widget build(BuildContext context) {
    final rank = entry.rank as int;
    final isTop3 = rank <= 3;

    return GlassCard(
      child: Row(
        children: [
          SizedBox(
            width: 36,
            child: isTop3
                ? Icon(Icons.emoji_events, color: _medalColor(rank), size: 24)
                : Text('$rank', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.white.withOpacity(0.5))),
          ),
          Container(
            width: 40, height: 40,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: isTop3 ? AppTheme.goldGradient : AppTheme.amberGradient.withOpacity(0.3),
            ),
            child: Center(
              child: Text(
                (entry.fullName as String? ?? 'U')[0].toUpperCase(),
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: isTop3 ? Colors.black : Colors.white60),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(entry.fullName as String? ?? 'Unknown', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.white)),
                if (entry.membershipTier != null)
                  Text((entry.membershipTier as String).toUpperCase(), style: TextStyle(fontSize: 10, color: AppTheme.skyhookAmber.withOpacity(0.7))),
              ],
            ),
          ),
          Text(
            '${entry.totalPoints} pts',
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.skyhookAmber),
          ),
        ],
      ),
    );
  }
}
