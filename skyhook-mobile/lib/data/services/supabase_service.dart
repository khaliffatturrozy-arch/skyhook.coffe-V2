import 'package:supabase_flutter/supabase_flutter.dart';
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

class SupabaseService {
  final SupabaseClient _client;

  SupabaseService(this._client);

  // Categories
  Future<List<Category>> getCategories() async {
    final response = await _client
        .from('categories')
        .select()
        .order('sort_order');
    return (response as List).map((e) => Category.fromJson(e as Map<String, dynamic>)).toList();
  }

  // Menu
  Future<List<MenuItem>> getMenu({String? categoryId}) async {
    var query = _client.from('menu').select().eq('is_available', true).order('sort_order');
    if (categoryId != null) {
      query = query.eq('category_id', categoryId);
    }
    final response = await query;
    return (response as List).map((e) => MenuItem.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<List<MenuItem>> getFeaturedMenu() async {
    final response = await _client
        .from('menu')
        .select()
        .eq('is_available', true)
        .eq('is_featured', true)
        .order('sort_order');
    return (response as List).map((e) => MenuItem.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<MenuItem?> getMenuItem(String id) async {
    final response = await _client.from('menu').select().eq('id', id).maybeSingle();
    if (response == null) return null;
    return MenuItem.fromJson(response as Map<String, dynamic>);
  }

  // Outlets
  Future<List<Outlet>> getOutlets() async {
    final response = await _client.from('outlets').select().eq('is_active', true);
    return (response as List).map((e) => Outlet.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<Outlet?> getOutlet(String id) async {
    final response = await _client.from('outlets').select().eq('id', id).maybeSingle();
    if (response == null) return null;
    return Outlet.fromJson(response as Map<String, dynamic>);
  }

  // Events
  Future<List<SkyEvent>> getUpcomingEvents() async {
    final response = await _client
        .from('events')
        .select()
        .eq('status', 'upcoming')
        .order('date');
    return (response as List).map((e) => SkyEvent.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<List<SkyEvent>> getFeaturedEvents() async {
    final response = await _client
        .from('events')
        .select()
        .eq('status', 'upcoming')
        .eq('is_featured', true)
        .order('date');
    return (response as List).map((e) => SkyEvent.fromJson(e as Map<String, dynamic>)).toList();
  }

  // Leaderboard
  Future<List<LeaderboardEntry>> getLeaderboard({int limit = 50}) async {
    final response = await _client
        .from('leaderboard')
        .select()
        .limit(limit);
    return (response as List).map((e) => LeaderboardEntry.fromJson(e as Map<String, dynamic>)).toList();
  }

  // Reservations
  Future<List<Reservation>> getUserReservations(String userId) async {
    final response = await _client
        .from('reservations')
        .select()
        .eq('user_id', userId)
        .order('date', ascending: false);
    return (response as List).map((e) => Reservation.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<Reservation> createReservation(Map<String, dynamic> data) async {
    final response = await _client.from('reservations').insert(data).select().single();
    return Reservation.fromJson(response as Map<String, dynamic>);
  }

  // Wallet
  Future<Wallet?> getWallet(String userId) async {
    final response = await _client.from('wallets').select().eq('user_id', userId).maybeSingle();
    if (response == null) return null;
    return Wallet.fromJson(response as Map<String, dynamic>);
  }

  Future<List<WalletTransaction>> getWalletTransactions(String walletId) async {
    final response = await _client
        .from('wallet_transactions')
        .select()
        .eq('wallet_id', walletId)
        .order('created_at', ascending: false);
    return (response as List).map((e) => WalletTransaction.fromJson(e as Map<String, dynamic>)).toList();
  }

  // Staff
  Future<List<Staff>> getStaffByOutlet(String outletId) async {
    final response = await _client
        .from('staff')
        .select()
        .eq('outlet_id', outletId)
        .eq('is_active', true);
    return (response as List).map((e) => Staff.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<Staff?> getCurrentStaff(String userId) async {
    final response = await _client
        .from('staff')
        .select()
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle();
    if (response == null) return null;
    return Staff.fromJson(response as Map<String, dynamic>);
  }

  // Kitchen Display (all active orders for an outlet)
  Future<List<Order>> getKitchenOrders(String outletId) async {
    final response = await _client
        .from('orders')
        .select('*, order_items(*)')
        .eq('outlet_id', outletId)
        .in_('status', ['pending', 'confirmed', 'preparing', 'ready'])
        .order('created_at');
    return (response as List).map((e) => Order.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<void> updateOrderStatus(String orderId, String status) async {
    await _client.from('orders').update({'status': status}).eq('id', orderId);
  }

  // Achievements
  Future<List<Achievement>> getAchievements() async {
    final response = await _client.from('achievements').select().order('points_required');
    return (response as List).map((e) => Achievement.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<List<String>> getUserAchievementIds(String userId) async {
    final response = await _client
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', userId);
    return (response as List).map((e) => e['achievement_id'] as String).toList();
  }

  // Orders
  Future<List<Order>> getUserOrders(String userId) async {
    final response = await _client
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', userId)
        .order('created_at', ascending: false);
    return (response as List).map((e) => Order.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<Order> createOrder(Map<String, dynamic> orderData) async {
    final response = await _client.from('orders').insert(orderData).select().single();
    return Order.fromJson(response as Map<String, dynamic>);
  }

  // Auth
  Future<AuthResponse> signInWithEmail(String email, String password) async {
    return _client.auth.signInWithPassword(email: email, password: password);
  }

  Future<AuthResponse> signUp(String email, String password, {Map<String, dynamic>? data}) async {
    return _client.auth.signUp(email: email, password: password, data: data);
  }

  Future<AuthResponse> signInWithGoogle() async {
    return _client.auth.signInWithOAuth(OAuthProvider.google);
  }

  Future<void> signOut() async {
    await _client.auth.signOut();
  }

  User? get currentUser => _client.auth.currentUser;

  Future<AppUser?> getUserProfile(String userId) async {
    final response = await _client.from('users').select().eq('id', userId).maybeSingle();
    if (response == null) return null;
    return AppUser.fromJson(response as Map<String, dynamic>);
  }

  Stream<AuthState> get authStateChanges => _client.auth.onAuthStateChange;
}
