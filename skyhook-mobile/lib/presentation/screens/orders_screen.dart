import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_theme.dart';
import '../../data/providers/providers.dart';
import '../../data/models/order.dart';
import '../widgets/glass_card.dart';
import '../widgets/shimmer_loading.dart';

final _userOrdersProvider = FutureProvider.family<List<Order>, String>((ref, userId) async {
  final service = ref.watch(supabaseServiceProvider);
  return service.getUserOrders(userId);
});

class OrdersScreen extends ConsumerWidget {
  const OrdersScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(currentUserProvider);
    final ordersAsync = user != null ? ref.watch(_userOrdersProvider(user.id)) : const AsyncData<List<Order>>([]);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Orders', style: TextStyle(fontFamily: 'PlayfairDisplay', fontWeight: FontWeight.bold)),
        backgroundColor: AppTheme.skyhookBlack,
        elevation: 0,
      ),
      body: ordersAsync.when(
        data: (orders) {
          if (orders.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.receipt_long_outlined, size: 64, color: Colors.white.withOpacity(0.2)),
                  const SizedBox(height: 16),
                  const Text('No orders yet', style: TextStyle(fontSize: 18, color: Colors.white38)),
                  const SizedBox(height: 8),
                  Text('Place your first order to see it here', style: TextStyle(fontSize: 14, color: Colors.white.withOpacity(0.3))),
                ],
              ),
            );
          }
          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: orders.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, i) => _OrderCard(order: orders[i]),
          );
        },
        loading: () => const ShimmerList(),
        error: (e, _) => Center(child: Text('Error: $e', style: const TextStyle(color: Colors.red))),
      ),
    );
  }
}

class _OrderCard extends StatelessWidget {
  final Order order;
  const _OrderCard({required this.order});

  Color _statusColor(String status) {
    switch (status) {
      case 'pending': return AppTheme.skyhookOrange;
      case 'confirmed': return AppTheme.skyhookGold;
      case 'preparing': return AppTheme.skyhookAmber;
      case 'ready': return const Color(0xFF4CAF50);
      case 'completed': return const Color(0xFF2E7D32);
      case 'cancelled': return Colors.red;
      default: return Colors.grey;
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
              Text('#${order.id.substring(0, 8)}', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.white)),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: _statusColor(order.status).withOpacity(0.15),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: _statusColor(order.status).withOpacity(0.3)),
                ),
                child: Text(
                  order.statusLabel,
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: _statusColor(order.status)),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            '${order.items.length} item(s)',
            style: TextStyle(fontSize: 13, color: Colors.white.withOpacity(0.5)),
          ),
          const SizedBox(height: 4),
          Text(
            order.priceFormatted,
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.skyhookAmber),
          ),
          const SizedBox(height: 4),
          Text(
            '${order.createdAt.day}/${order.createdAt.month}/${order.createdAt.year} ${order.createdAt.hour}:${order.createdAt.minute.toString().padLeft(2, '0')}',
            style: TextStyle(fontSize: 11, color: Colors.white.withOpacity(0.3)),
          ),
        ],
      ),
    );
  }
}
