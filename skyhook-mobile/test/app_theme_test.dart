import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:skyhook_mobile/core/theme/app_theme.dart';

void main() {
  group('AppTheme', () {
    test('has required colors', () {
      expect(AppTheme.skyhookBlack, equals(const Color(0xFF0A0A0A)));
      expect(AppTheme.skyhookAmber, equals(const Color(0xFFC8956C)));
      expect(AppTheme.skyhookGold, equals(const Color(0xFFD4A853)));
    });

    test('has amber gradient', () {
      expect(AppTheme.amberGradient.colors.length, equals(2));
      expect(AppTheme.amberGradient.colors[0], equals(AppTheme.skyhookAmber));
    });

    test('dark theme is not null', () {
      final theme = AppTheme.darkTheme;
      expect(theme, isNotNull);
      expect(theme.brightness, equals(Brightness.dark));
    });

    test('dark theme uses correct scaffold background', () {
      final theme = AppTheme.darkTheme;
      expect(theme.scaffoldBackgroundColor, equals(AppTheme.skyhookBlack));
    });
  });
}
