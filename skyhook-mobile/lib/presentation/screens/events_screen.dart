import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_theme.dart';
import '../../data/providers/providers.dart';
import '../../data/models/event.dart';
import '../widgets/glass_card.dart';
import '../widgets/shimmer_loading.dart';

class EventsScreen extends ConsumerWidget {
  const EventsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final eventsAsync = ref.watch(upcomingEventsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Events', style: TextStyle(fontFamily: 'PlayfairDisplay', fontWeight: FontWeight.bold)),
        backgroundColor: AppTheme.skyhookBlack,
        elevation: 0,
      ),
      body: eventsAsync.when(
        data: (events) {
          if (events.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.event_busy_outlined, size: 64, color: Colors.white.withOpacity(0.2)),
                  const SizedBox(height: 16),
                  const Text('No upcoming events', style: TextStyle(fontSize: 18, color: Colors.white38)),
                ],
              ),
            );
          }
          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: events.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, i) => _EventDetailCard(event: events[i]),
          );
        },
        loading: () => const ShimmerList(),
        error: (e, _) => Center(child: Text('Error: $e', style: const TextStyle(color: Colors.red))),
      ),
    );
  }
}

class _EventDetailCard extends StatelessWidget {
  final SkyEvent event;
  const _EventDetailCard({required this.event});

  IconData _typeIcon(String type) {
    switch (type) {
      case 'dj_night': return Icons.music_note;
      case 'live_music': return Icons.mic;
      case 'community': return Icons.people;
      case 'vip': return Icons.star;
      default: return Icons.event;
    }
  }

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 56, height: 56,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  gradient: AppTheme.goldGradient,
                ),
                child: Icon(_typeIcon(event.type), color: Colors.black, size: 28),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(event.title, style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w600, color: Colors.white)),
                    const SizedBox(height: 4),
                    Text('${event.date.day}/${event.date.month}/${event.date.year} at ${event.time}', style: TextStyle(fontSize: 12, color: Colors.white.withOpacity(0.5))),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(8),
                  color: AppTheme.skyhookAmber.withOpacity(0.15),
                  border: Border.all(color: AppTheme.skyhookAmber.withOpacity(0.3)),
                ),
                child: Text(event.priceFormatted, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppTheme.skyhookAmber)),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(event.description, style: TextStyle(fontSize: 13, color: Colors.white.withOpacity(0.6))),
          const SizedBox(height: 8),
          Row(
            children: [
              Icon(Icons.room_outlined, size: 14, color: Colors.white.withOpacity(0.4)),
              const SizedBox(width: 4),
              Text(event.venue, style: TextStyle(fontSize: 12, color: Colors.white.withOpacity(0.4))),
              const Spacer(),
              Icon(Icons.people_outlined, size: 14, color: Colors.white.withOpacity(0.4)),
              const SizedBox(width: 4),
              Text('${event.capacity} seats', style: TextStyle(fontSize: 12, color: Colors.white.withOpacity(0.4))),
            ],
          ),
        ],
      ),
    );
  }
}
