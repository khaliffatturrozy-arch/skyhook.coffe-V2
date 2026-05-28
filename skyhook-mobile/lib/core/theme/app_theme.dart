import 'package:flutter/material.dart';

class AppTheme {
  static const Color skyhookBlack = Color(0xFF0A0A0A);
  static const Color skyhookCharcoal = Color(0xFF1A1A1A);
  static const Color skyhookDark = Color(0xFF222222);
  static const Color skyhookMocha = Color(0xFF3C2F2F);
  static const Color skyhookBrown = Color(0xFF6B4F3C);
  static const Color skyhookAmber = Color(0xFFC8956C);
  static const Color skyhookGold = Color(0xFFD4A853);
  static const Color skyhookCream = Color(0xFFF5EEE6);
  static const Color skyhookWarm = Color(0xFFE8C9A0);
  static const Color skyhookOrange = Color(0xFFD4763A);
  static const Color skyhookGlow = Color(0xFFFF8C42);

  static const LinearGradient amberGradient = LinearGradient(
    colors: [skyhookAmber, skyhookOrange],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient goldGradient = LinearGradient(
    colors: [skyhookGold, skyhookAmber, skyhookWarm],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: skyhookBlack,
      colorScheme: const ColorScheme.dark(
        primary: skyhookAmber,
        secondary: skyhookOrange,
        surface: skyhookCharcoal,
      ),
      fontFamily: 'Inter',
      textTheme: const TextTheme(
        displayLarge: TextStyle(fontFamily: 'PlayfairDisplay', color: Colors.white),
        displayMedium: TextStyle(fontFamily: 'PlayfairDisplay', color: Colors.white),
        headlineLarge: TextStyle(fontFamily: 'PlayfairDisplay', color: Colors.white),
        headlineMedium: TextStyle(fontFamily: 'PlayfairDisplay', color: Colors.white),
        titleLarge: TextStyle(fontFamily: 'PlayfairDisplay', color: Colors.white),
        bodyLarge: TextStyle(color: Colors.white70),
        bodyMedium: TextStyle(color: Colors.white60),
        bodySmall: TextStyle(color: Colors.white38),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: skyhookAmber,
          foregroundColor: skyhookBlack,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
        ),
      ),
    );
  }
}
