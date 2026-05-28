import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_theme.dart';
import '../../data/providers/providers.dart';
import '../../data/models/order.dart';
import '../widgets/glass_card.dart';
import '../widgets/shimmer_loading.dart';

class KdsScreen extends ConsumerWidget {
  const KdsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final outletsAsync = ref.watch(outletsProvider);
    final outletId = outletsAsync.whenOrNull(data: (o) => o.isNotEmpty ? o.first.id : null);
    final ordersAsync = outletId != null ? ref.watch(kitchenOrdersProvider(outletId)) : const AsyncData<List<Order>>([]);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Kitchen Display', style: TextStyle(fontFamily: 'PlayfairDisplay', fontWeight: FontWeight.bold)),
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
                  Icon(Icons.check_circle_outline, size: 80, color: const Color(0xFF4CAF50).withOpacity(0.5)),
                  const SizedBox(height: 16),
                  const Text('All Orders Completed', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600, color: Colors.white38)),
                ],
              ),
            );
          }
          return RefreshIndicator(
            onRefresh: () async => ref.refresh(kitchenOrdersProvider(outletId!)),
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: orders.length,
              itemBuilder: (context, i) => _KdsOrderCard(order: orders[i], ref: ref, outletId: outletId),
            ),
          );
        },
        loading: () => const ShimmerList(),
        error: (e, _) => Center(child: Text('Error: $e', style: const TextStyle(color: Colors.red))),
      ),
    );
  }
}

class _KdsOrderCard extends StatelessWidget {
  final Order order;
  final WidgetRef ref;
  final String? outletId;

  const _KdsOrderCard({required this.order, required this.ref, this.outletId});

  Color _statusColor(String status) {
    switch (status) {
      case 'pending': return AppTheme.skyhookOrange;
      case 'confirmed': return AppTheme.skyhookGold;
      case 'preparing': return AppTheme.skyhookAmber;
      case 'ready': return const Color(0xFF4CAF50);
      default: return Colors.grey;
    }
  }

  Color _statusBg(String status) {
    return _statusColor(status).withOpacity(0.15);
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: GlassCard(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(8),
                    color: _statusBg(order.status),
                    border: Border.all(color: _statusColor(order.status).withOpacity(0.3)),
                  ),
                  child: Text(order.statusLabel, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: _statusColor(order.status))),
                ),
                const Spacer(),
                Text('#${order.id.substring(0, 6)}', style: TextStyle(fontSize: 12, color: Colors.white.withOpacity(0.4))),
              ],
            ),
            const SizedBox(height: 12),
            ...order.items.map((item) => Padding(
              padding: const EdgeInsets.symmetric(vertical: 3),
              child: Row(
                children: [
                  Container(
                    width: 28, height: 28,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(6),
                      color: AppTheme.skyhookDark,
                    ),
                    child: Center(child: Text('${item.quantity}x', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.skyhookAmber))),
                  ),
                  const SizedBox(width: 10),
                  Text(item.menuItemName, style: const TextStyle(fontSize: 14, color: Colors.white)),
                ],
              ),
            )),
            const SizedBox(height: 12),
            Row(
              children: [
                Text(order.priceFormatted, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.skyhookAmber)),
                const Spacer(),
                if (order.status == 'pending' || order.status == 'confirmed')
                  _ActionButton(label: 'Preparing', color: AppTheme.skyhookAmber, onTap: () async {
                    await ref.read(supabaseServiceProvider).updateOrderStatus(order.id, 'preparing');
                    if (outletId != null) ref.refresh(kitchenOrdersProvider(outletId));
                  }),
                if (order.status == 'preparing')
                  _ActionButton(label: 'Ready', color: const Color(0xFF4CAF50), onTap: () async {
                    await ref.read(supabaseServiceProvider).updateOrderStatus(order.id, 'ready');
                    if (outletId != null) ref.refresh(kitchenOrdersProvider(outletId));
                  }),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _ActionButton extends StatelessWidget {
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _ActionButton({required this.label, required this.color, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(8),
          color: color.withOpacity(0.15),
          border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Text(label, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: color)),
      ),
    );
  }
}
