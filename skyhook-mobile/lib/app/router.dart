import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../core/theme/app_theme.dart';
import '../presentation/screens/home_screen.dart';
import '../presentation/screens/menu_screen.dart';
import '../presentation/screens/orders_screen.dart';
import '../presentation/screens/auth_screen.dart';
import '../presentation/screens/events_screen.dart';
import '../presentation/screens/rooftop_screen.dart';
import '../presentation/screens/leaderboard_screen.dart';
import '../presentation/screens/community_screen.dart';
import '../presentation/screens/reservation_screen.dart';
import '../presentation/screens/wallet_screen.dart';
import '../presentation/screens/staff_screen.dart';
import '../presentation/screens/kds_screen.dart';
import '../presentation/screens/ai_assistant_screen.dart';

class _ScaffoldWithNav extends StatefulWidget {
  final Widget child;
  final String location;

  const _ScaffoldWithNav({required this.child, required this.location});

  @override
  State<_ScaffoldWithNav> createState() => _ScaffoldWithNavState();
}

class _ScaffoldWithNavState extends State<_ScaffoldWithNav> {
  late int _selectedIndex;

  static const _tabs = ['/', '/menu', '/orders', '/wallet'];

  @override
  void initState() {
    super.initState();
    _selectedIndex = _tabs.indexOf(widget.location);
    if (_selectedIndex == -1) _selectedIndex = 0;
  }

  @override
  void didUpdateWidget(covariant _ScaffoldWithNav oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.location != oldWidget.location) {
      final idx = _tabs.indexOf(widget.location);
      if (idx != -1) _selectedIndex = idx;
    }
  }

  void _onItemTapped(int index) {
    setState(() => _selectedIndex = index);
    switch (index) {
      case 0: context.go('/');
      case 1: context.go('/menu');
      case 2: context.go('/orders');
      case 3: context.go('/wallet');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: widget.child,
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          border: Border(top: BorderSide(color: Colors.white.withOpacity(0.08))),
          color: AppTheme.skyhookBlack,
        ),
        child: BottomNavigationBar(
          currentIndex: _selectedIndex,
          onTap: _onItemTapped,
          backgroundColor: Colors.transparent,
          elevation: 0,
          selectedItemColor: AppTheme.skyhookAmber,
          unselectedItemColor: Colors.white38,
          type: BottomNavigationBarType.fixed,
          items: const [
            BottomNavigationBarItem(icon: Icon(Icons.home_outlined), activeIcon: Icon(Icons.home), label: 'Home'),
            BottomNavigationBarItem(icon: Icon(Icons.coffee_outlined), activeIcon: Icon(Icons.coffee), label: 'Menu'),
            BottomNavigationBarItem(icon: Icon(Icons.receipt_outlined), activeIcon: Icon(Icons.receipt), label: 'Orders'),
            BottomNavigationBarItem(icon: Icon(Icons.account_balance_wallet_outlined), activeIcon: Icon(Icons.account_balance_wallet), label: 'Wallet'),
          ],
        ),
      ),
    );
  }
}

final router = GoRouter(
  initialLocation: '/',
  routes: [
    ShellRoute(
      builder: (context, state, child) => _ScaffoldWithNav(child: child, location: state.matchedLocation),
      routes: [
        GoRoute(path: '/', builder: (_, __) => const HomeScreen()),
        GoRoute(path: '/menu', builder: (_, __) => const MenuScreen()),
        GoRoute(path: '/orders', builder: (_, __) => const OrdersScreen()),
        GoRoute(path: '/wallet', builder: (_, __) => const WalletScreen()),
        GoRoute(path: '/auth', builder: (_, __) => const AuthScreen()),
        GoRoute(path: '/events', builder: (_, __) => const EventsScreen()),
        GoRoute(path: '/rooftop', builder: (_, __) => const RooftopScreen()),
        GoRoute(path: '/leaderboard', builder: (_, __) => const LeaderboardScreen()),
        GoRoute(path: '/community', builder: (_, __) => const CommunityScreen()),
        GoRoute(path: '/reservation', builder: (_, __) => const ReservationScreen()),
        GoRoute(path: '/staff', builder: (_, __) => const StaffScreen()),
        GoRoute(path: '/kds', builder: (_, __) => const KdsScreen()),
        GoRoute(path: '/ai', builder: (_, __) => const AiAssistantScreen()),
      ],
    ),
  ],
);
