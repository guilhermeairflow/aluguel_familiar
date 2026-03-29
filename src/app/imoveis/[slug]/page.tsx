// Server component — exporta generateStaticParams sem 'use client'
import { PROPERTIES } from '@/lib/properties-data';
import { notFound } from 'next/navigation';
import PropertyClient from './PropertyClient';

export function generateStaticParams() {
  return PROPERTIES.map((p) => ({ slug: p.slug }));
}

export default function ImovelPage({ params }: { params: { slug: string } }) {
  const prop = PROPERTIES.find((p) => p.slug === params.slug);
  if (!prop) return notFound();
  return <PropertyClient prop={prop} />;
}
