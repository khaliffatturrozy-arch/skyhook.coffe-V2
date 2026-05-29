import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_theme.dart';
import '../../data/providers/providers.dart';
import '../../data/models/menu_item.dart';
import '../../data/models/event.dart';
import '../widgets/menu_item_card.dart';
import '../widgets/glass_card.dart';
import '../widgets/shimmer_loading.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final featuredMenu = ref.watch(featuredMenuProvider);
    final featuredEvents = ref.watch(featuredEventsProvider);

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 200,
            pinned: true,
            backgroundColor: AppTheme.skyhookBlack,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [AppTheme.skyhookCharcoal, AppTheme.skyhookBlack],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                ),
                child: Stack(
                  children: [
                    Positioned(
                      top: 60, left: 24,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Welcome to', style: TextStyle(fontSize: 16, color: Colors.white.withOpacity(0.6))),
                          const Text('SKYHOOK', style: TextStyle(fontFamily: 'PlayfairDisplay', fontSize: 36, fontWeight: FontWeight.bold, color: Colors.white, letterSpacing: 2)),
                          const Text('COFFEE', style: TextStyle(fontFamily: 'PlayfairDisplay', fontSize: 36, fontWeight: FontWeight.bold, color: AppTheme.skyhookGold, letterSpacing: 2)),
                        ],
                      ),
                    ),
                    Positioned(
                      right: 24, top: 80,
                      child: Container(
                        width: 80, height: 80,
                        decoration: BoxDecoration(shape: BoxShape.circle, gradient: AppTheme.amberGradient),
                        child: const Center(child: Text('S', style: TextStyle(fontSize: 36, fontWeight: FontWeight.bold, color: Colors.black))),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.all(16),
            sliver: SliverToBoxAdapter(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Quick actions
                  Row(children: [
                    _QuickAction(label: 'Menu', icon: Icons.coffee_outlined, color: AppTheme.skyhookAmber, onTap: () => context.go('/menu')),
                    const SizedBox(width: 12),
                    _QuickAction(label: 'Events', icon: Icons.event_outlined, color: AppTheme.skyhookGold, onTap: () => context.go('/events')),
                    const SizedBox(width: 12),
                    _QuickAction(label: 'Reserve', icon: Icons.calendar_today_outlined, color: AppTheme.skyhookOrange, onTap: () => context.go('/reservation')),
                    const SizedBox(width: 12),
                    _QuickAction(label: 'Orders', icon: Icons.receipt_outlined, color: AppTheme.skyhookWarm, onTap: () => context.go('/orders')),
                  ]),
                  const SizedBox(height: 20),

                  // AI Assistant
                  GestureDetector(
                    onTap: () => context.go('/ai'),
                    child: GlassCard(
                      child: Row(
                        children: [
                          Container(
                            width: 48, height: 48,
                            decoration: BoxDecoration(shape: BoxShape.circle, gradient: AppTheme.amberGradient),
                            child: const Icon(Icons.auto_awesome, color: Colors.black, size: 22),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('Skyhook AI', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Colors.white)),
                                Text('Ask me anything — menu, events, reservations', style: TextStyle(fontSize: 12, color: Colors.white.withOpacity(0.5))),
                              ],
                            ),
                          ),
                          Icon(Icons.arrow_forward_ios, size: 14, color: Colors.white.withOpacity(0.3)),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 28),

                  // Featured Menu
                  const Text('Featured Menu', style: TextStyle(fontFamily: 'PlayfairDisplay', fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white)),
                  const SizedBox(height: 12),
                  featuredMenu.when(
                    data: (items) => SizedBox(
                      height: 210,
                      child: ListView.separated(
                        scrollDirection: Axis.horizontal,
                        itemCount: items.length,
                        separatorBuilder: (_, __) => const SizedBox(width: 12),
                        itemBuilder: (context, i) => SizedBox(
                          width: 150,
                          child: MenuItemCard(item: items[i]),
                        ),
                      ),
                    ),
                    loading: () => const ShimmerGrid(itemCount: 4, itemHeight: 180),
                    error: (e, _) => Text('Error: $e', style: const TextStyle(color: Colors.red)),
                  ),

                  const SizedBox(height: 28),

                  // Upcoming Events
                  const Text('Upcoming Events', style: TextStyle(fontFamily: 'PlayfairDisplay', fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white)),
                  const SizedBox(height: 12),
                  featuredEvents.when(
                    data: (events) => Column(
                      children: events.map((e) => _EventCard(event: e)).toList(),
                    ),
                    loading: () => const ShimmerList(),
                    error: (e, _) => Text('Error: $e', style: const TextStyle(color: Colors.red)),
                  ),

                  const SizedBox(height: 80),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _QuickAction extends StatelessWidget {
  final String label;
  final IconData icon;
  final Color color;
  final VoidCallback? onTap;

  const _QuickAction({required this.label, required this.icon, required this.color, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GlassCard(
        padding: const EdgeInsets.symmetric(vertical: 16),
        onTap: onTap,
        child: Column(
          children: [
            Icon(icon, color: color, size: 28),
            const SizedBox(height: 6),
            Text(label, style: TextStyle(fontSize: 11, color: Colors.white.withOpacity(0.7))),
          ],
        ),
      ),
    );
  }
}

class _EventCard extends StatelessWidget {
  final SkyEvent event;
  const _EventCard({required this.event});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: GlassCard(
        child: Row(
          children: [
            Container(
              width: 60, height: 60,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                gradient: AppTheme.goldGradient,
              ),
              child: Center(
                child: Text('${event.date.day}', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.black)),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(event.title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Colors.white)),
                  const SizedBox(height: 4),
                  Text('${event.date.day}/${event.date.month}/${event.date.year} at ${event.time}', style: TextStyle(fontSize: 12, color: Colors.white.withOpacity(0.5))),
                ],
              ),
            ),
            Text(event.priceFormatted, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppTheme.skyhookAmber)),
          ],
        ),
      ),
    );
  }
}
