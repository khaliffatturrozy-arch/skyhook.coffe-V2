import 'package:flutter_test/flutter_test.dart';
import 'package:skyhook_mobile/core/constants/app_constants.dart';

void main() {
  group('AppConstants', () {
    test('has app name', () {
      expect(AppConstants.appName, equals('Skyhook Coffee'));
    });

    test('has app tagline', () {
      expect(AppConstants.appTagline, isNotEmpty);
    });

    test('has all routes defined', () {
      expect(AppRoutes.home, equals('/'));
      expect(AppRoutes.menu, equals('/menu'));
      expect(AppRoutes.orders, equals('/orders'));
      expect(AppRoutes.auth, equals('/auth'));
      expect(AppRoutes.wallet, equals('/wallet'));
      expect(AppRoutes.staff, equals('/staff'));
      expect(AppRoutes.kds, equals('/kds'));
    });
  });
}
