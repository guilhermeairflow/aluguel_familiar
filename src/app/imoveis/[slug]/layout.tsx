import { PROPERTIES } from '@/lib/properties-data';

export function generateStaticParams() {
  return PROPERTIES.map((prop) => ({
    slug: prop.slug,
  }));
}

export default function ImovelLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
