import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_theme.dart';
import '../../data/services/ai_service.dart';
import '../widgets/glass_card.dart';

final aiServiceProvider = Provider<AiService>((ref) {
  return AiService(baseUrl: 'http://localhost:3000');
});

class AiAssistantScreen extends ConsumerStatefulWidget {
  const AiAssistantScreen({super.key});

  @override
  ConsumerState<AiAssistantScreen> createState() => _AiAssistantScreenState();
}

class _AiAssistantScreenState extends ConsumerState<AiAssistantScreen> {
  final _messages = <Map<String, String>>[
    {'role': 'assistant', 'content': 'Welcome to Skyhook Coffee. I\'m your personal hospitality assistant. How can I elevate your experience today?'},
  ];
  final _controller = TextEditingController();
  bool _loading = false;
  int _balance = 0;
  bool _checkedBalance = false;

  static const int _costPerQuery = 2000;

  String? get _userId {
    final session = Supabase.instance.client.auth.currentSession;
    return session?.user.id;
  }

  @override
  void initState() {
    super.initState();
    _loadBalance();
  }

  Future<void> _loadBalance() async {
    final userId = _userId;
    if (userId == null) return;
    final aiService = ref.read(aiServiceProvider);
    final data = await aiService.getBalance(userId);
    if (mounted) {
      setState(() {
        _balance = (data['balance'] as num?)?.toInt() ?? 0;
        _checkedBalance = true;
      });
    }
  }

  void _send() async {
    final text = _controller.text.trim();
    if (text.isEmpty || _loading) return;
    final userId = _userId;
    if (userId == null) {
      setState(() {
        _messages.add({'role': 'assistant', 'content': 'Please sign in to use Skyhook AI.'});
      });
      return;
    }
    _controller.clear();

    setState(() {
      _messages.add({'role': 'user', 'content': text});
      _loading = true;
    });

    final aiService = ref.read(aiServiceProvider);
    final result = await aiService.chat(
      [..._messages.map((m) => {'role': m['role']!, 'content': m['content']!})],
      userId,
    );

    if (result.containsKey('insufficient')) {
      setState(() {
        _messages.add({
          'role': 'assistant',
          'content': 'Insufficient AI credit balance. ${result['error']}. Please top up your wallet to continue using Skyhook AI.',
        });
        _loading = false;
      });
      return;
    }

    if (result.containsKey('reply')) {
      setState(() {
        _messages.add({'role': 'assistant', 'content': result['reply'] as String});
        _balance = (result['balanceAfter'] as num?)?.toInt() ?? _balance;
        _loading = false;
      });
    } else {
      setState(() {
        _messages.add({'role': 'assistant', 'content': result['error'] as String? ?? 'Service unavailable.'});
        _loading = false;
      });
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Skyhook AI', style: TextStyle(fontFamily: 'PlayfairDisplay', fontWeight: FontWeight.bold)),
        backgroundColor: AppTheme.skyhookBlack,
        elevation: 0,
        actions: [
          if (_checkedBalance)
            Padding(
              padding: const EdgeInsets.only(right: 12),
              child: Center(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    color: _balance >= _costPerQuery
                        ? AppTheme.skyhookAmber.withOpacity(0.15)
                        : Colors.red.withOpacity(0.15),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.wallet, size: 14, color: _balance >= _costPerQuery ? AppTheme.skyhookAmber : Colors.red),
                      const SizedBox(width: 4),
                      Text(
                        'Rp ${_balance.toString().replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+(?!\d))'), (m) => '${m[1]}.')}',
                        style: TextStyle(
                          fontSize: 12,
                          color: _balance >= _costPerQuery ? AppTheme.skyhookAmber : Colors.red,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length + (_loading ? 1 : 0),
              itemBuilder: (context, i) {
                if (i == _messages.length && _loading) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Row(
                      children: [
                        Container(
                          width: 32, height: 32,
                          decoration: BoxDecoration(shape: BoxShape.circle, color: AppTheme.skyhookAmber.withOpacity(0.2)),
                          child: const Icon(Icons.smart_toy_outlined, size: 16, color: AppTheme.skyhookAmber),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(16),
                            color: Colors.white.withOpacity(0.05),
                          ),
                          child: const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white38)),
                        ),
                      ],
                    ),
                  );
                }

                final msg = _messages[i];
                final isUser = msg['role'] == 'user';

                return Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Row(
                    mainAxisAlignment: isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
                    children: [
                      if (!isUser)
                        Container(
                          width: 32, height: 32,
                          decoration: BoxDecoration(shape: BoxShape.circle, color: AppTheme.skyhookAmber.withOpacity(0.2)),
                          child: const Icon(Icons.smart_toy_outlined, size: 16, color: AppTheme.skyhookAmber),
                        ),
                      if (!isUser) const SizedBox(width: 8),
                      Flexible(
                        child: Container(
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(16).copyWith(
                              bottomLeft: isUser ? null : const Radius.circular(4),
                              bottomRight: isUser ? const Radius.circular(4) : null,
                            ),
                            color: isUser ? AppTheme.skyhookAmber : Colors.white.withOpacity(0.05),
                          ),
                          child: Text(
                            msg['content']!,
                            style: TextStyle(fontSize: 14, color: isUser ? Colors.black : Colors.white80),
                          ),
                        ),
                      ),
                      if (isUser) const SizedBox(width: 8),
                      if (isUser)
                        Container(
                          width: 32, height: 32,
                          decoration: BoxDecoration(shape: BoxShape.circle, color: AppTheme.skyhookAmber),
                          child: const Icon(Icons.person, size: 16, color: Colors.black),
                        ),
                    ],
                  ),
                );
              },
            ),
          ),
          Container(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
            decoration: BoxDecoration(
              border: Border(top: BorderSide(color: Colors.white.withOpacity(0.08))),
              color: AppTheme.skyhookBlack,
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (_userId != null)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 6),
                    child: Row(
                      children: [
                        Icon(Icons.monetization_on_outlined, size: 12, color: Colors.white.withOpacity(0.3)),
                        const SizedBox(width: 4),
                        Text(
                          'Rp $_costPerQuery per query',
                          style: TextStyle(fontSize: 10, color: Colors.white.withOpacity(0.3)),
                        ),
                        const Spacer(),
                        if (_checkedBalance && _balance < _costPerQuery)
                          GestureDetector(
                            onTap: () => Navigator.pushNamed(context, '/wallet'),
                            child: Text('Top up', style: TextStyle(fontSize: 10, color: AppTheme.skyhookAmber, decoration: TextDecoration.underline)),
                          ),
                      ],
                    ),
                  ),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _controller,
                        style: const TextStyle(color: Colors.white),
                        decoration: InputDecoration(
                          hintText: _userId != null ? 'Ask me anything...' : 'Sign in to use AI...',
                          hintStyle: TextStyle(color: Colors.white.withOpacity(0.3)),
                          filled: true,
                          fillColor: AppTheme.skyhookDark,
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        ),
                        onSubmitted: (_) => _send(),
                      ),
                    ),
                    const SizedBox(width: 8),
                    GestureDetector(
                      onTap: _send,
                      child: Container(
                        width: 44, height: 44,
                        decoration: BoxDecoration(borderRadius: BorderRadius.circular(12), gradient: AppTheme.amberGradient),
                        child: const Icon(Icons.send_rounded, color: Colors.black, size: 20),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
