import type { Metadata } from 'next';
import CourseApp from '@/components/CourseApp';

export const metadata: Metadata = { title: 'Curso de improviso · Escalas no Violão' };

export default function Page() {
  return <CourseApp />;
}
