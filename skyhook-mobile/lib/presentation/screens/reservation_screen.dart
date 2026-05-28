import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_theme.dart';
import '../../data/providers/providers.dart';
import '../widgets/glass_card.dart';
import '../widgets/gradient_button.dart';
import '../widgets/shimmer_loading.dart';

final _selectedDate = StateProvider<DateTime?>((ref) => null);
final _selectedTime = StateProvider<String>((ref) => '19:00');
final _guestCount = StateProvider<int>((ref) => 2);

class ReservationScreen extends ConsumerStatefulWidget {
  const ReservationScreen({super.key});

  @override
  ConsumerState<ReservationScreen> createState() => _ReservationScreenState();
}

class _ReservationScreenState extends ConsumerState<ReservationScreen> {
  final _notesController = TextEditingController();
  bool _loading = false;

  static const _timeSlots = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

  Future<void> _submit() async {
    setState(() => _loading = true);
    try {
      final user = ref.read(currentUserProvider);
      if (user == null) {
        if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please sign in first')));
        return;
      }
      final service = ref.read(supabaseServiceProvider);
      final date = ref.read(_selectedDate);
      if (date == null) return;

      await service.createReservation({
        'user_id': user.id,
        'date': date.toIso8601String().split('T')[0],
        'time': ref.read(_selectedTime),
        'guests': ref.read(_guestCount),
        'notes': _notesController.text.trim(),
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Reservation created!'), backgroundColor: Color(0xFF4CAF50)),
        );
        _notesController.clear();
      }
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final date = ref.watch(_selectedDate);
    final guests = ref.watch(_guestCount);
    final time = ref.watch(_selectedTime);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Reservation', style: TextStyle(fontFamily: 'PlayfairDisplay', fontWeight: FontWeight.bold)),
        backgroundColor: AppTheme.skyhookBlack,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            GlassCard(
              child: Column(
                children: [
                  Icon(Icons.calendar_month, size: 48, color: AppTheme.skyhookAmber.withOpacity(0.8)),
                  const SizedBox(height: 8),
                  const Text('Book Your Table', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
                  const Text('Rooftop & Garden Terrace available', style: TextStyle(fontSize: 12, color: Colors.white38)),
                ],
              ),
            ),
            const SizedBox(height: 24),
            const Text('Date', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.white)),
            const SizedBox(height: 8),
            InkWell(
              onTap: () async {
                final picked = await showDatePicker(
                  context: context,
                  firstDate: DateTime.now(),
                  lastDate: DateTime.now().add(const Duration(days: 30)),
                  theme: ThemeData.dark().copyWith(colorScheme: const ColorScheme.dark(primary: AppTheme.skyhookAmber)),
                );
                if (picked != null) ref.read(_selectedDate.notifier).state = picked;
              },
              child: GlassCard(
                child: Row(
                  children: [
                    Icon(Icons.calendar_today, size: 20, color: AppTheme.skyhookAmber.withOpacity(0.7)),
                    const SizedBox(width: 12),
                    Text(
                      date != null ? '${date.day}/${date.month}/${date.year}' : 'Select date',
                      style: TextStyle(fontSize: 15, color: date != null ? Colors.white : Colors.white38),
                    ),
                    const Spacer(),
                    Icon(Icons.arrow_forward_ios, size: 14, color: Colors.white.withOpacity(0.3)),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),
            const Text('Time', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.white)),
            const SizedBox(height: 8),
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: _timeSlots.map((t) {
                  final isSelected = time == t;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: GestureDetector(
                      onTap: () => ref.read(_selectedTime.notifier).state = t,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(12),
                          gradient: isSelected ? AppTheme.amberGradient : null,
                          color: isSelected ? null : AppTheme.skyhookDark,
                          border: isSelected ? null : Border.all(color: Colors.white.withOpacity(0.08)),
                        ),
                        child: Text(t, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: isSelected ? Colors.black : Colors.white60)),
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),
            const SizedBox(height: 20),
            const Text('Guests', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.white)),
            const SizedBox(height: 8),
            GlassCard(
              child: Row(
                children: [
                  IconButton(
                    onPressed: guests > 1 ? () => ref.read(_guestCount.notifier).state-- : null,
                    icon: Icon(Icons.remove_circle_outline, color: guests > 1 ? AppTheme.skyhookAmber : Colors.white24),
                  ),
                  Text('$guests', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white)),
                  IconButton(
                    onPressed: guests < 20 ? () => ref.read(_guestCount.notifier).state++ : null,
                    icon: Icon(Icons.add_circle_outline, color: guests < 20 ? AppTheme.skyhookAmber : Colors.white24),
                  ),
                ],
                mainAxisAlignment: MainAxisAlignment.center,
              ),
            ),
            const SizedBox(height: 20),
            const Text('Notes (optional)', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.white)),
            const SizedBox(height: 8),
            TextField(
              controller: _notesController,
              maxLines: 3,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: 'Any special requests...',
                hintStyle: TextStyle(color: Colors.white.withOpacity(0.3)),
                filled: true,
                fillColor: AppTheme.skyhookDark,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
              ),
            ),
            const SizedBox(height: 32),
            GradientButton(
              label: date != null ? 'Confirm Reservation' : 'Select a Date First',
              loading: _loading,
              onPressed: date != null ? _submit : null,
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }
}
