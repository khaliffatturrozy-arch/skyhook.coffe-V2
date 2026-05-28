import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../core/theme/app_theme.dart';
import '../widgets/gradient_button.dart';

final _emailController = TextEditingController();
final _passwordController = TextEditingController();
final _nameController = TextEditingController();
final _isLogin = StateProvider<bool>((ref) => true);

class AuthScreen extends ConsumerStatefulWidget {
  const AuthScreen({super.key});

  @override
  ConsumerState<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends ConsumerState<AuthScreen> {
  bool _loading = false;

  Future<void> _submit() async {
    setState(() => _loading = true);
    try {
      final email = _emailController.text.trim();
      final password = _passwordController.text.trim();
      final login = ref.read(_isLogin);

      if (login) {
        await Supabase.instance.client.auth.signInWithPassword(email: email, password: password);
      } else {
        await Supabase.instance.client.auth.signUp(
          email: email,
          password: password,
          data: {'full_name': _nameController.text.trim()},
        );
      }
    } on AuthException catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.message)));
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _signInWithGoogle() async {
    setState(() => _loading = true);
    try {
      await Supabase.instance.client.auth.signInWithOAuth(OAuthProvider.google);
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('$e')));
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _nameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final login = ref.watch(_isLogin);

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              const SizedBox(height: 60),
              Container(
                width: 80, height: 80,
                decoration: BoxDecoration(shape: BoxShape.circle, gradient: AppTheme.amberGradient),
                child: const Center(child: Text('S', style: TextStyle(fontSize: 36, fontWeight: FontWeight.bold, color: Colors.black))),
              ),
              const SizedBox(height: 16),
              const Text('SKYHOOK', style: TextStyle(fontFamily: 'PlayfairDisplay', fontSize: 32, fontWeight: FontWeight.bold, color: Colors.white, letterSpacing: 4)),
              const Text('COFFEE', style: TextStyle(fontFamily: 'PlayfairDisplay', fontSize: 32, fontWeight: FontWeight.bold, color: AppTheme.skyhookGold, letterSpacing: 4)),
              const SizedBox(height: 48),
              if (!login)
                TextField(
                  controller: _nameController,
                  style: const TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    labelText: 'Full Name',
                    filled: true,
                    fillColor: AppTheme.skyhookDark,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                    labelStyle: TextStyle(color: Colors.white.withOpacity(0.5)),
                  ),
                ),
              if (!login) const SizedBox(height: 16),
              TextField(
                controller: _emailController,
                style: const TextStyle(color: Colors.white),
                decoration: InputDecoration(
                  labelText: 'Email',
                  filled: true,
                  fillColor: AppTheme.skyhookDark,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                  labelStyle: TextStyle(color: Colors.white.withOpacity(0.5)),
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _passwordController,
                obscureText: true,
                style: const TextStyle(color: Colors.white),
                decoration: InputDecoration(
                  labelText: 'Password',
                  filled: true,
                  fillColor: AppTheme.skyhookDark,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                  labelStyle: TextStyle(color: Colors.white.withOpacity(0.5)),
                ),
              ),
              const SizedBox(height: 24),
              GradientButton(
                label: login ? 'Sign In' : 'Create Account',
                loading: _loading,
                onPressed: _submit,
              ),
              const SizedBox(height: 16),
              Row(children: [
                const Expanded(child: Divider(color: Colors.white12)),
                Padding(padding: const EdgeInsets.symmetric(horizontal: 16), child: Text('OR', style: TextStyle(color: Colors.white.withOpacity(0.4)))),
                const Expanded(child: Divider(color: Colors.white12)),
              ]),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity, height: 50,
                child: OutlinedButton.icon(
                  onPressed: _loading ? null : _signInWithGoogle,
                  icon: const Text('G', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white)),
                  label: const Text('Continue with Google', style: TextStyle(color: Colors.white)),
                  style: OutlinedButton.styleFrom(
                    side: BorderSide(color: Colors.white.withOpacity(0.2)),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
              ),
              const SizedBox(height: 24),
              TextButton(
                onPressed: () => ref.read(_isLogin.notifier).update((s) => !s),
                child: Text(
                  login ? "Don't have an account? Sign Up" : 'Already have an account? Sign In',
                  style: TextStyle(color: AppTheme.skyhookAmber.withOpacity(0.8)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
