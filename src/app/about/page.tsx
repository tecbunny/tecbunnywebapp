import { Metadata } from 'next';

import AboutPage from '@/components/about-page';
import { createPageMetadata } from '@/lib/metadata';

// Static metadata for better SEO and performance
export async function generateMetadata(): Promise<Metadata> {
  return createPageMetadata({});
}

// Optimized for static generation
export default function Page() {
  return <AboutPage />;
}
