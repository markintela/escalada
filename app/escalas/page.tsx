import type { Metadata } from 'next';
import ScalesApp from '@/components/ScalesApp';

export const metadata: Metadata = { title: 'Escalas' };

export default function Page() {
  return <ScalesApp />;
}
