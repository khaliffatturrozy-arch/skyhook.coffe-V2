import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import '../widgets/glass_card.dart';

class CommunityScreen extends StatelessWidget {
  const CommunityScreen({super.key});

  static const _groups = [
    {'name': 'Coffee Enthusiasts', 'members': 128, 'icon': Icons.coffee, 'desc': 'For coffee lovers and connoisseurs'},
    {'name': 'Night Owls', 'members': 95, 'icon': Icons.nightlight_round, 'desc': 'Late night rooftop sessions'},
    {'name': 'Music Lovers', 'members': 72, 'icon': Icons.music_note, 'desc': 'Live music and DJ night enthusiasts'},
    {'name': 'VIP Elite', 'members': 34, 'icon': Icons.star, 'desc': 'Exclusive premium member group'},
    {'name': 'Photography', 'members': 56, 'icon': Icons.camera_alt_outlined, 'desc': 'Capture the skyline moments'},
    {'name': 'Wellness', 'members': 41, 'icon': Icons.self_improvement, 'desc': 'Morning yoga and wellness events'},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Community', style: TextStyle(fontFamily: 'PlayfairDisplay', fontWeight: FontWeight.bold)),
        backgroundColor: AppTheme.skyhookBlack,
        elevation: 0,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          GlassCard(
            child: Column(
              children: [
                Icon(Icons.people, size: 48, color: AppTheme.skyhookAmber.withOpacity(0.8)),
                const SizedBox(height: 8),
                const Text('Join Our Community', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white)),
                const SizedBox(height: 4),
                Text('Connect with fellow members', style: TextStyle(fontSize: 13, color: Colors.white.withOpacity(0.5))),
              ],
            ),
          ),
          const SizedBox(height: 20),
          const Text('Groups', style: TextStyle(fontFamily: 'PlayfairDisplay', fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white)),
          const SizedBox(height: 12),
          ..._groups.map((g) => Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: GlassCard(
              child: Row(
                children: [
                  Container(
                    width: 50, height: 50,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      color: AppTheme.skyhookDark,
                      border: Border.all(color: Colors.white.withOpacity(0.08)),
                    ),
                    child: Icon(g['icon'] as IconData, color: AppTheme.skyhookAmber, size: 24),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(g['name'] as String, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: Colors.white)),
                        Text(g['desc'] as String, style: TextStyle(fontSize: 12, color: Colors.white.withOpacity(0.5))),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(8),
                      color: AppTheme.skyhookAmber.withOpacity(0.1),
                    ),
                    child: Text('${g['members']}', style: const TextStyle(fontSize: 12, color: AppTheme.skyhookAmber, fontWeight: FontWeight.w600)),
                  ),
                ],
              ),
            ),
          )),
        ],
      ),
    );
  }
}
