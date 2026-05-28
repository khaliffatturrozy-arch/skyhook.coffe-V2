import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_theme.dart';
import '../../data/providers/providers.dart';
import '../widgets/glass_card.dart';
import '../widgets/shimmer_loading.dart';

class RooftopScreen extends ConsumerWidget {
  const RooftopScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final outletsAsync = ref.watch(outletsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Rooftop', style: TextStyle(fontFamily: 'PlayfairDisplay', fontWeight: FontWeight.bold)),
        backgroundColor: AppTheme.skyhookBlack,
        elevation: 0,
      ),
      body: outletsAsync.when(
        data: (outlets) {
          final outlet = outlets.isNotEmpty ? outlets.first : null;
          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  height: 200,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(20),
                    gradient: LinearGradient(
                      colors: [AppTheme.skyhookCharcoal, AppTheme.skyhookDark, AppTheme.skyhookMocha],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                  ),
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          width: 70, height: 70,
                          decoration: BoxDecoration(shape: BoxShape.circle, gradient: AppTheme.amberGradient),
                          child: const Icon(Icons.nightlife_rounded, color: Colors.black, size: 36),
                        ),
                        const SizedBox(height: 12),
                        const Text('ROOFTOP LOUNGE', style: TextStyle(fontFamily: 'PlayfairDisplay', fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white, letterSpacing: 3)),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                if (outlet != null) ...[
                  GlassCard(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(outlet.name, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: Colors.white)),
                        const SizedBox(height: 12),
                        _InfoRow(icon: Icons.room_outlined, text: outlet.address),
                        const SizedBox(height: 8),
                        _InfoRow(icon: Icons.phone_outlined, text: outlet.phone ?? '-'),
                        const SizedBox(height: 8),
                        _InfoRow(icon: Icons.access_time, text: '${outlet.openingHours} - ${outlet.closingHours}'),
                        if (outlet.description != null) ...[
                          const SizedBox(height: 12),
                          Text(outlet.description!, style: TextStyle(fontSize: 13, color: Colors.white.withOpacity(0.6))),
                        ],
                      ],
                    ),
                  ),
                ],
                const SizedBox(height: 24),
                const Text('Venue Features', style: TextStyle(fontFamily: 'PlayfairDisplay', fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white)),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 8, runSpacing: 8,
                  children: [
                    _FeatureChip(icon: Icons.star, label: 'VIP Lounge'),
                    _FeatureChip(icon: Icons.garden, label: 'Garden Terrace'),
                    _FeatureChip(icon: Icons.music_note, label: 'Live Music'),
                    _FeatureChip(icon: Icons.nightlight_round, label: 'Sunset Deck'),
                    _FeatureChip(icon: Icons.wifi, label: 'Free WiFi'),
                    _FeatureChip(icon: Icons.smoke_free, label: 'Smoking Area'),
                  ],
                ),
                const SizedBox(height: 24),
                const Text('Opening Hours', style: TextStyle(fontFamily: 'PlayfairDisplay', fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white)),
                const SizedBox(height: 12),
                GlassCard(
                  child: Column(
                    children: [
                      _DayRow(day: 'Monday - Friday', hours: '15:00 - 23:00'),
                      const Divider(color: Colors.white12),
                      _DayRow(day: 'Saturday', hours: '14:00 - 01:00'),
                      const Divider(color: Colors.white12),
                      _DayRow(day: 'Sunday', hours: '14:00 - 23:00'),
                    ],
                  ),
                ),
                const SizedBox(height: 32),
              ],
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String text;
  const _InfoRow({required this.icon, required this.text});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 16, color: AppTheme.skyhookAmber),
        const SizedBox(width: 10),
        Expanded(child: Text(text, style: TextStyle(fontSize: 13, color: Colors.white.withOpacity(0.7)))),
      ],
    );
  }
}

class _FeatureChip extends StatelessWidget {
  final IconData icon;
  final String label;
  const _FeatureChip({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        color: AppTheme.skyhookDark,
        border: Border.all(color: Colors.white.withOpacity(0.08)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: AppTheme.skyhookAmber),
          const SizedBox(width: 6),
          Text(label, style: TextStyle(fontSize: 12, color: Colors.white.withOpacity(0.7))),
        ],
      ),
    );
  }
}

class _DayRow extends StatelessWidget {
  final String day;
  final String hours;
  const _DayRow({required this.day, required this.hours});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Text(day, style: TextStyle(fontSize: 13, color: Colors.white.withOpacity(0.7))),
          const Spacer(),
          Text(hours, style: const TextStyle(fontSize: 13, color: AppTheme.skyhookAmber)),
        ],
      ),
    );
  }
}
