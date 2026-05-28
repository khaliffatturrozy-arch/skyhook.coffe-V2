import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import '../../core/theme/app_theme.dart';

class ShimmerGrid extends StatelessWidget {
  final int itemCount;
  final double itemHeight;

  const ShimmerGrid({super.key, this.itemCount = 6, this.itemHeight = 180});

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      padding: const EdgeInsets.all(16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 0.75,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
      ),
      itemCount: itemCount,
      itemBuilder: (context, index) => Shimmer.fromColors(
        baseColor: AppTheme.skyhookCharcoal,
        highlightColor: AppTheme.skyhookDark,
        child: Container(
          decoration: BoxDecoration(
            color: AppTheme.skyhookDark,
            borderRadius: BorderRadius.circular(16),
          ),
        ),
      ),
    );
  }
}

class ShimmerList extends StatelessWidget {
  final int itemCount;

  const ShimmerList({super.key, this.itemCount = 4});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: List.generate(itemCount, (index) => Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        child: Shimmer.fromColors(
          baseColor: AppTheme.skyhookCharcoal,
          highlightColor: AppTheme.skyhookDark,
          child: Container(height: 80, decoration: BoxDecoration(color: AppTheme.skyhookDark, borderRadius: BorderRadius.circular(12))),
        ),
      )),
    );
  }
}
