import 'dart:convert';
import 'package:http/http.dart' as http;

class AiService {
  final String baseUrl;

  AiService({required this.baseUrl});

  Future<Map<String, dynamic>> chat(List<Map<String, String>> messages, String userId) async {
    try {
      final res = await http.post(
        Uri.parse('$baseUrl/api/ai/chat'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'messages': messages, 'userId': userId}),
      );
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body) as Map<String, dynamic>;
        return data;
      }
      if (res.statusCode == 402) {
        final data = jsonDecode(res.body) as Map<String, dynamic>;
        return {'error': data['error'] ?? 'Insufficient balance.', 'insufficient': true};
      }
      return {'error': 'Service unavailable (${res.statusCode}).'};
    } catch (e) {
      return {'error': 'Connection error. Please try again.'};
    }
  }

  Future<Map<String, dynamic>> getBalance(String userId) async {
    try {
      final res = await http.get(
        Uri.parse('$baseUrl/api/ai/balance?userId=$userId'),
      );
      if (res.statusCode == 200) {
        return jsonDecode(res.body) as Map<String, dynamic>;
      }
      return {'balance': 0, 'costPerQuery': 2000, 'canAfford': false};
    } catch (_) {
      return {'balance': 0, 'costPerQuery': 2000, 'canAfford': false};
    }
  }

  Future<Map<String, dynamic>> getGreeting(String userId) async {
    try {
      final res = await http.get(
        Uri.parse('$baseUrl/api/ai/greeting?userId=$userId'),
      );
      if (res.statusCode == 200) {
        return jsonDecode(res.body) as Map<String, dynamic>;
      }
      return {'greeting': 'Welcome to Skyhook Coffee'};
    } catch (_) {
      return {'greeting': 'Welcome to Skyhook Coffee'};
    }
  }

  Future<Map<String, dynamic>> getRecommendation(String userId) async {
    try {
      final res = await http.get(
        Uri.parse('$baseUrl/api/ai/recommend?userId=$userId'),
      );
      if (res.statusCode == 200) {
        return jsonDecode(res.body) as Map<String, dynamic>;
      }
      return {'recommendation': 'Sign in for personalized recommendations.'};
    } catch (_) {
      return {'recommendation': 'Recommendations unavailable.'};
    }
  }
}
