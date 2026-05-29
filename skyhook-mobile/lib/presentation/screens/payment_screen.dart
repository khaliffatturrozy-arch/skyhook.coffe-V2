import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_theme.dart';
import '../../data/services/payment_service.dart';
import '../widgets/glass_card.dart';
import '../widgets/gradient_button.dart';

final paymentServiceProvider = Provider<PaymentService>((ref) {
  return PaymentService(baseUrl: 'http://localhost:3000');
});

class PaymentScreen extends ConsumerStatefulWidget {
  final double amount;
  final String orderId;

  const PaymentScreen({super.key, required this.amount, required this.orderId});

  @override
  ConsumerState<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends ConsumerState<PaymentScreen> {
  String _selectedMethod = 'midtrans';
  bool _loading = false;
  String? _resultMessage;
  bool? _success;

  static const _methods = [
    {'id': 'midtrans', 'label': 'Card / Bank Transfer', 'icon': Icons.credit_card, 'desc': 'Visa, Mastercard, Virtual Account'},
    {'id': 'qris', 'label': 'QRIS', 'icon': Icons.qr_code, 'desc': 'Scan with GoPay, OVO, etc.'},
    {'id': 'gopay', 'label': 'GoPay', 'icon': Icons.phone_android, 'desc': 'GoPay wallet balance'},
    {'id': 'stripe', 'label': 'Stripe', 'icon': Icons.account_balance, 'desc': 'International cards'},
  ];

  Future<void> _pay() async {
    setState(() {
      _loading = true;
      _resultMessage = null;
      _success = null;
    });

    final service = ref.read(paymentServiceProvider);
    final result = await service.createPayment(
      method: _selectedMethod == 'gopay' ? 'midtrans' : _selectedMethod,
      orderId: widget.orderId,
      amount: widget.amount,
    );

    setState(() {
      _loading = false;
      if (result.containsKey('redirect_url') || result.containsKey('client_secret')) {
        _success = true;
        _resultMessage = 'Payment initiated. Check your payment app.';
      } else {
        _success = false;
        _resultMessage = result['error'] as String? ?? 'Payment failed.';
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final total = widget.amount;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Payment', style: TextStyle(fontFamily: 'PlayfairDisplay', fontWeight: FontWeight.bold)),
        backgroundColor: AppTheme.skyhookBlack,
        elevation: 0,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            GlassCard(
              child: Column(
                children: [
                  const Icon(Icons.account_balance_wallet_outlined, size: 48, color: AppTheme.skyhookAmber),
                  const SizedBox(height: 8),
                  const Text('Total Payment', style: TextStyle(fontSize: 13, color: Colors.white38)),
                  const SizedBox(height: 4),
                  Text(
                    'Rp ${total.toStringAsFixed(0)}',
                    style: const TextStyle(fontSize: 36, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  const SizedBox(height: 4),
                  Text(widget.orderId, style: TextStyle(fontSize: 11, color: Colors.white.withOpacity(0.3))),
                ],
              ),
            ),
            const SizedBox(height: 24),
            const Text('Payment Method', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Colors.white)),
            const SizedBox(height: 12),
            ..._methods.map((m) => Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: GestureDetector(
                onTap: () => setState(() => _selectedMethod = m['id'] as String),
                child: GlassCard(
                  padding: const EdgeInsets.all(14),
                  child: Row(
                    children: [
                      Icon(m['icon'] as IconData, size: 24, color: _selectedMethod == m['id'] ? AppTheme.skyhookAmber : Colors.white38),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(m['label'] as String, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: _selectedMethod == m['id'] ? Colors.white : Colors.white60)),
                            Text(m['desc'] as String, style: TextStyle(fontSize: 11, color: Colors.white.withOpacity(0.3))),
                          ],
                        ),
                      ),
                      if (_selectedMethod == m['id'])
                        const Icon(Icons.check_circle, color: AppTheme.skyhookAmber, size: 20),
                    ],
                  ),
                ),
              ),
            )),
            if (_resultMessage != null)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 12),
                child: Row(
                  children: [
                    Icon(_success! ? Icons.check_circle : Icons.error, color: _success! ? Colors.green : Colors.red, size: 18),
                    const SizedBox(width: 8),
                    Expanded(child: Text(_resultMessage!, style: TextStyle(fontSize: 13, color: _success! ? Colors.green : Colors.red))),
                  ],
                ),
              ),
            const Spacer(),
            GradientButton(
              label: _loading ? 'Processing...' : 'Pay Rp ${total.toStringAsFixed(0)}',
              loading: _loading,
              onPressed: _loading ? null : _pay,
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }
}
