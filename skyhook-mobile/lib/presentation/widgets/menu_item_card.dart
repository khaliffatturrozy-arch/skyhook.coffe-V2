import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import '../../data/models/menu_item.dart';
import 'glass_card.dart';

class MenuItemCard extends StatelessWidget {
  final MenuItem item;
  final VoidCallback? onTap;

  const MenuItemCard({super.key, required this.item, this.onTap});

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      padding: const EdgeInsets.all(12),
      onTap: onTap,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Center(
              child: Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: AppTheme.amberGradient,
                ),
                child: Center(
                  child: Text(
                    item.name[0].toUpperCase(),
                    style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.black),
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            item.name,
            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Colors.white),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 4),
          if (item.preparationTime > 0)
            Text(
              '${item.preparationTime} min',
              style: TextStyle(fontSize: 11, color: Colors.white.withOpacity(0.5)),
            ),
          const SizedBox(height: 4),
          Row(
            children: [
              Text(
                item.priceFormatted,
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppTheme.skyhookAmber),
              ),
              const Spacer(),
              if (item.isFeatured)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: AppTheme.skyhookGold.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(4),
                    border: Border.all(color: AppTheme.skyhookGold.withOpacity(0.4)),
                  ),
                  child: const Text('FEATURED', style: TextStyle(fontSize: 8, color: AppTheme.skyhookGold, fontWeight: FontWeight.bold)),
                ),
            ],
          ),
        ],
      ),
    );
  }
}
