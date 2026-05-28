import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../services/supabase_service.dart';
import '../models/menu_item.dart';
import '../models/category.dart';
import '../models/order.dart';
import '../models/user.dart';
import '../models/event.dart';
import '../models/outlet.dart';
import '../models/leaderboard_entry.dart';
import '../models/reservation.dart';
import '../models/wallet.dart';
import '../models/staff.dart';
import '../models/achievement.dart';

final supabaseClientProvider = Provider<SupabaseClient>((ref) {
  return Supabase.instance.client;
});

final supabaseServiceProvider = Provider<SupabaseService>((ref) {
  final client = ref.watch(supabaseClientProvider);
  return SupabaseService(client);
});

// Auth
final authStateProvider = StreamProvider<AuthState?>((ref) {
  final service = ref.watch(supabaseServiceProvider);
  return service.authStateChanges;
});

final currentUserProvider = Provider<AppUser?>((ref) {
  final authState = ref.watch(authStateProvider).valueOrNull;
  final user = authState?.session?.user;
  if (user == null) return null;
  return AppUser(id: user.id, email: user.email);
});

// Categories
final categoriesProvider = FutureProvider<List<Category>>((ref) async {
  final service = ref.watch(supabaseServiceProvider);
  return service.getCategories();
});

// Menu
final menuProvider = FutureProvider<List<MenuItem>>((ref) async {
  final service = ref.watch(supabaseServiceProvider);
  return service.getMenu();
});

final featuredMenuProvider = FutureProvider<List<MenuItem>>((ref) async {
  final service = ref.watch(supabaseServiceProvider);
  return service.getFeaturedMenu();
});

final menuByCategoryProvider = FutureProvider.family<List<MenuItem>, String>((ref, categoryId) async {
  final service = ref.watch(supabaseServiceProvider);
  return service.getMenu(categoryId: categoryId);
});

// Outlets
final outletsProvider = FutureProvider<List<Outlet>>((ref) async {
  final service = ref.watch(supabaseServiceProvider);
  return service.getOutlets();
});

// Events
final upcomingEventsProvider = FutureProvider<List<SkyEvent>>((ref) async {
  final service = ref.watch(supabaseServiceProvider);
  return service.getUpcomingEvents();
});

final featuredEventsProvider = FutureProvider<List<SkyEvent>>((ref) async {
  final service = ref.watch(supabaseServiceProvider);
  return service.getFeaturedEvents();
});

// Leaderboard
final leaderboardProvider = FutureProvider<List<LeaderboardEntry>>((ref) async {
  final service = ref.watch(supabaseServiceProvider);
  return service.getLeaderboard();
});

// Reservations
final userReservationsProvider = FutureProvider.family<List<Reservation>, String>((ref, userId) async {
  final service = ref.watch(supabaseServiceProvider);
  return service.getUserReservations(userId);
});

// Wallet
final walletProvider = FutureProvider.family<Wallet?, String>((ref, userId) async {
  final service = ref.watch(supabaseServiceProvider);
  return service.getWallet(userId);
});

final walletTransactionsProvider = FutureProvider.family<List<WalletTransaction>, String>((ref, walletId) async {
  final service = ref.watch(supabaseServiceProvider);
  return service.getWalletTransactions(walletId);
});

// Staff
final staffByOutletProvider = FutureProvider.family<List<Staff>, String>((ref, outletId) async {
  final service = ref.watch(supabaseServiceProvider);
  return service.getStaffByOutlet(outletId);
});

// Kitchen Display
final kitchenOrdersProvider = FutureProvider.family<List<Order>, String>((ref, outletId) async {
  final service = ref.watch(supabaseServiceProvider);
  return service.getKitchenOrders(outletId);
});

// Achievements
final achievementsProvider = FutureProvider<List<Achievement>>((ref) async {
  final service = ref.watch(supabaseServiceProvider);
  return service.getAchievements();
});
