class AppConstants {
  static const String appName = 'Skyhook Coffee';
  static const String appTagline = 'Next-Generation Luxury Hospitality';
  static const String appVersion = '1.0.0';

  static const String supabaseUrl = String.fromEnvironment('SUPABASE_URL');
  static const String supabaseAnonKey = String.fromEnvironment('SUPABASE_ANON_KEY');

  static const String midtransClientKey = String.fromEnvironment('MIDTRANS_CLIENT_KEY');
  static const String stripePublishableKey = String.fromEnvironment('STRIPE_PUBLISHABLE_KEY');
}

class AppRoutes {
  static const String home = '/';
  static const String menu = '/menu';
  static const String events = '/events';
  static const String rooftop = '/rooftop';
  static const String leaderboard = '/leaderboard';
  static const String community = '/community';
  static const String reservation = '/reservation';
  static const String wallet = '/wallet';
  static const String auth = '/auth';
  static const String orders = '/orders';
  static const String staff = '/staff';
  static const String kds = '/kds';
}
