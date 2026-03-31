import { PROPERTIES } from './properties-data';

export type PricingRule = {
  id: string;
  startDate: string; // ISO yyyy-mm-dd
  endDate: string;   // ISO yyyy-mm-dd
  price: number;
};

export type PropertyPricing = {
  basePrice: number;
  cleaningFee: number;
  rules: PricingRule[];
};

export function calculateStayTotal(
  propertyId: string, 
  checkIn: string, 
  checkOut: string,
  dynamicPricing?: Record<string, PropertyPricing>
) {
  const prop = PROPERTIES.find(p => p.id === propertyId);
  if (!prop) return { total: 0, nights: 0, average: 0 };

  const start = new Date(checkIn);
  const end = new Date(checkOut);
  // Garante que ignore a hora para o calculo de noites
  const startD = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
  const endD = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate()));
  
  const nights = Math.max(0, Math.round((endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)));

  if (nights === 0) return { total: 0, subtotal: 0, cleaningFee: prop.cleaningFee, nights: 0, average: 0 };

  const pricing = dynamicPricing ? dynamicPricing[propertyId] : null;
  const basePrice = pricing?.basePrice ?? prop.basePricePerNight;
  const cleaningFee = pricing?.cleaningFee ?? prop.cleaningFee;
  const rules = pricing?.rules ?? [];

  let sumDays = 0;

  for (let i = 0; i < nights; i++) {
    const current = new Date(startD);
    current.setDate(startD.getUTCDate() + i);
    const y = current.getUTCFullYear();
    const m = String(current.getUTCMonth() + 1).padStart(2, '0');
    const d = String(current.getUTCDate()).padStart(2, '0');
    const currentISO = `${y}-${m}-${d}`;
    const rule = rules.find(r => currentISO >= r.startDate && currentISO <= r.endDate);
    sumDays += rule ? rule.price : basePrice;
  }

  return {
    total: sumDays + cleaningFee,
    subtotal: sumDays,
    cleaningFee,
    nights,
    average: Math.round(sumDays / nights)
  };
}
