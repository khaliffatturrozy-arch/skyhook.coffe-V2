import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_theme.dart';
import '../../data/providers/providers.dart';
import '../../data/models/staff.dart';
import '../widgets/glass_card.dart';
import '../widgets/shimmer_loading.dart';

class StaffScreen extends ConsumerWidget {
  const StaffScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final outletsAsync = ref.watch(outletsProvider);
    final outletId = outletsAsync.whenOrNull(data: (o) => o.isNotEmpty ? o.first.id : null);

    final staffAsync = outletId != null ? ref.watch(staffByOutletProvider(outletId)) : const AsyncData<List<Staff>>([]);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Staff Portal', style: TextStyle(fontFamily: 'PlayfairDisplay', fontWeight: FontWeight.bold)),
        backgroundColor: AppTheme.skyhookBlack,
        elevation: 0,
      ),
      body: staffAsync.when(
        data: (staff) => ListView(
          padding: const EdgeInsets.all(16),
          children: [
            GlassCard(
              child: Column(
                children: [
                  Icon(Icons.badge_outlined, size: 48, color: AppTheme.skyhookAmber.withOpacity(0.8)),
                  const SizedBox(height: 8),
                  const Text('Staff Overview', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
                  const SizedBox(height: 4),
                  Text('${staff.length} active staff', style: TextStyle(fontSize: 13, color: Colors.white.withOpacity(0.5))),
                ],
              ),
            ),
            const SizedBox(height: 20),
            const Text('Active Staff', style: TextStyle(fontFamily: 'PlayfairDisplay', fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
            const SizedBox(height: 12),
            ...staff.map((s) => Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: GlassCard(
                child: Row(
                  children: [
                    Container(
                      width: 46, height: 46,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: AppTheme.skyhookDark,
                        border: Border.all(color: Colors.white.withOpacity(0.08)),
                      ),
                      child: Center(child: Icon(_roleIcon(s.role), color: AppTheme.skyhookAmber, size: 22)),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(s.roleLabel, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: Colors.white)),
                          if (s.shift != null)
                            Text('Shift: ${s.shift}', style: TextStyle(fontSize: 12, color: Colors.white.withOpacity(0.5))),
                        ],
                      ),
                    ),
                    Container(
                      width: 10, height: 10,
                      decoration: BoxDecoration(shape: BoxShape.circle, color: s.isActive ? const Color(0xFF4CAF50) : Colors.red),
                    ),
                  ],
                ),
              ),
            )),
          ],
        ),
        loading: () => const ShimmerList(),
        error: (e, _) => Center(child: Text('Error: $e', style: const TextStyle(color: Colors.red))),
      ),
    );
  }

  IconData _roleIcon(String role) {
    switch (role) {
      case 'barista': return Icons.coffee;
      case 'chef': return Icons.restaurant;
      case 'waiter': return Icons.room_service;
      case 'host': return Icons.people;
      case 'manager': return Icons.work;
      case 'admin': return Icons.admin_panel_settings;
      default: return Icons.person;
    }
  }
}
