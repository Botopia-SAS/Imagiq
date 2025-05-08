// app/ar/page.tsx
'use client';
import dynamic from 'next/dynamic';

const ARViewer = dynamic(() => import('@/components/ARViewer'), { ssr: false });

export default function Page() {
  return <ARViewer />;
}
