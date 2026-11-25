import type { Metadata } from 'next';
import CourseApp from '@/components/CourseApp';

export const metadata: Metadata = { title: 'Curso de improviso' };

export default function Page() {
  return <CourseApp />;
}
