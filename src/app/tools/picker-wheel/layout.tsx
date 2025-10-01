
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Random Picker Wheel | Artechway',
  description: 'A fun, free, and easy-to-use random picker wheel. Enter your options and spin the wheel to get a random choice. Perfect for giveaways, decisions, and games!',
  keywords: ['Picker Wheel', 'Random Picker', 'Spin the Wheel', 'Random Choice Generator', 'Decision Maker', 'Giveaway Tool'],
};

export default function PickerWheelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
