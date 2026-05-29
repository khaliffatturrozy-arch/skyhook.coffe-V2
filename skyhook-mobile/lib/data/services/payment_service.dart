import 'dart:convert';
import 'package:http/http.dart' as http;

class PaymentService {
  final String baseUrl;

  PaymentService({required this.baseUrl});

  Future<Map<String, dynamic>> createPayment({
    required String method,
    required String orderId,
    required double amount,
    String? customerName,
    String? customerEmail,
  }) async {
    try {
      final res = await http.post(
        Uri.parse('$baseUrl/api/payments/create'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'method': method,
          'orderId': orderId,
          'amount': amount,
          'customer': {
            'name': customerName ?? 'Guest',
            'email': customerEmail ?? 'guest@skyhook.coffee',
          },
        }),
      );
      if (res.statusCode == 200) {
        return jsonDecode(res.body) as Map<String, dynamic>;
      }
      return {'error': 'Payment failed (${res.statusCode})'};
    } catch (e) {
      return {'error': 'Connection error: $e'};
    }
  }

  Future<Map<String, dynamic>> checkStatus(String orderId) async {
    try {
      final res = await http.get(
        Uri.parse('$baseUrl/api/payments/status?orderId=$orderId'),
      );
      if (res.statusCode == 200) {
        return jsonDecode(res.body) as Map<String, dynamic>;
      }
      return {'error': 'Status check failed'};
    } catch (e) {
      return {'error': 'Connection error: $e'};
    }
  }
}
