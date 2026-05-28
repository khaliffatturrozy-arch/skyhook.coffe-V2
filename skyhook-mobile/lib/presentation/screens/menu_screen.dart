import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_theme.dart';
import '../../data/providers/providers.dart';
import '../../data/models/category.dart';
import '../../data/models/menu_item.dart';
import '../widgets/menu_item_card.dart';
import '../widgets/shimmer_loading.dart';

final _selectedCategoryId = StateProvider<String?>((ref) => null);
final _searchQuery = StateProvider<String>((ref) => '');

class MenuScreen extends ConsumerStatefulWidget {
  const MenuScreen({super.key});

  @override
  ConsumerState<MenuScreen> createState() => _MenuScreenState();
}

class _MenuScreenState extends ConsumerState<MenuScreen> {
  final _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final categoriesAsync = ref.watch(categoriesProvider);
    final menuAsync = ref.watch(menuProvider);
    final selectedCategoryId = ref.watch(_selectedCategoryId);
    final searchQuery = ref.watch(_searchQuery);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Menu', style: TextStyle(fontFamily: 'PlayfairDisplay', fontWeight: FontWeight.bold)),
        backgroundColor: AppTheme.skyhookBlack,
        elevation: 0,
      ),
      body: Column(
        children: [
          // Search bar
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: TextField(
              controller: _searchController,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: 'Search menu...',
                hintStyle: TextStyle(color: Colors.white.withOpacity(0.3)),
                prefixIcon: Icon(Icons.search, color: Colors.white.withOpacity(0.3)),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        icon: Icon(Icons.clear, color: Colors.white.withOpacity(0.3)),
                        onPressed: () {
                          _searchController.clear();
                          ref.read(_searchQuery.notifier).state = '';
                        },
                      )
                    : null,
                filled: true,
                fillColor: AppTheme.skyhookDark,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
              ),
              onChanged: (v) => ref.read(_searchQuery.notifier).state = v,
            ),
          ),

          // Categories
          categoriesAsync.when(
            data: (categories) => SizedBox(
              height: 44,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: categories.length + 1,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (context, i) {
                  final isSelected = i == 0 ? selectedCategoryId == null : selectedCategoryId == categories[i - 1].id;
                  final label = i == 0 ? 'All' : categories[i - 1].name;
                  return _CategoryChip(
                    label: label,
                    selected: isSelected,
                    onTap: () => ref.read(_selectedCategoryId.notifier).state = i == 0 ? null : categories[i - 1].id,
                  );
                },
              ),
            ),
            loading: () => const SizedBox(height: 44),
            error: (e, _) => Text('Error: $e'),
          ),

          const SizedBox(height: 8),

          // Menu grid
          Expanded(
            child: menuAsync.when(
              data: (items) {
                var filtered = items;
                if (selectedCategoryId != null) {
                  filtered = filtered.where((m) => m.categoryId == selectedCategoryId).toList();
                }
                if (searchQuery.isNotEmpty) {
                  filtered = filtered.where((m) => m.name.toLowerCase().contains(searchQuery.toLowerCase())).toList();
                }

                if (filtered.isEmpty) {
                  return const Center(child: Text('No items found', style: TextStyle(color: Colors.white38)));
                }

                return GridView.builder(
                  padding: const EdgeInsets.all(16),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    childAspectRatio: 0.75,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                  ),
                  itemCount: filtered.length,
                  itemBuilder: (context, i) => MenuItemCard(item: filtered[i]),
                );
              },
              loading: () => const ShimmerGrid(),
              error: (e, _) => Center(child: Text('Error: $e', style: const TextStyle(color: Colors.red))),
            ),
          ),
        ],
      ),
    );
  }
}

class _CategoryChip extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;

  const _CategoryChip({required this.label, required this.selected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          gradient: selected ? AppTheme.amberGradient : null,
          color: selected ? null : AppTheme.skyhookDark,
          border: selected ? null : Border.all(color: Colors.white.withOpacity(0.1)),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: selected ? Colors.black : Colors.white.withOpacity(0.7),
          ),
        ),
      ),
    );
  }
}
