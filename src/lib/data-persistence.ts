import { PROPERTIES } from './properties-data';
import { PropertyPricing } from './pricing-engine';

const PROPERTIES_KEY = 'af_properties';
const PRICING_KEY = 'af_dynamic_pricing';

export function loadAllProperties() {
  if (typeof window === 'undefined') return PROPERTIES;
  try {
    const saved = localStorage.getItem(PROPERTIES_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return PROPERTIES.map(p => {
        const found = parsed.find((sp: any) => sp.id === p.id);
        return found ? { ...p, ...found } : p;
      });
    }
  } catch (err) {
    console.error("Error loading properties:", err);
  }
  return PROPERTIES;
}

export function loadAllPricing(): Record<string, PropertyPricing> {
  const defaultPricing: Record<string, PropertyPricing> = Object.fromEntries(
    PROPERTIES.map(p => [p.id, {
      basePrice: p.basePricePerNight,
      cleaningFee: p.cleaningFee,
      rules: [],
    }])
  );

  if (typeof window === 'undefined') return defaultPricing;
  try {
    const saved = localStorage.getItem(PRICING_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const merged = { ...defaultPricing };
      Object.keys(parsed).forEach(id => {
        merged[id] = { ...merged[id], ...parsed[id] };
      });
      return merged;
    }
  } catch (err) {
    console.error("Error loading pricing:", err);
  }
  return defaultPricing;
}

export function saveProperty(updated: any) {
  if (typeof window === 'undefined') return;
  try {
    // 1. Save to af_properties
    const saved = localStorage.getItem(PROPERTIES_KEY);
    const all = saved ? JSON.parse(saved) : [...PROPERTIES];
    const idx = all.findIndex((p: any) => p.id === updated.id);
    if (idx >= 0) all[idx] = updated;
    else all.push(updated);
    localStorage.setItem(PROPERTIES_KEY, JSON.stringify(all));

    // 2. Sync to af_dynamic_pricing (Base and Cleaning should match)
    const pricingSaved = localStorage.getItem(PRICING_KEY);
    const allPricing = pricingSaved ? JSON.parse(pricingSaved) : {};
    const currentPricing = allPricing[updated.id] || { rules: [] };
    allPricing[updated.id] = {
      ...currentPricing,
      basePrice: updated.basePricePerNight,
      cleaningFee: updated.cleaningFee
    };
    localStorage.setItem(PRICING_KEY, JSON.stringify(allPricing));
  } catch (err) {
    console.error("Error saving property:", err);
  }
}

export function savePricing(propertyId: string, pricing: PropertyPricing) {
  if (typeof window === 'undefined') return;
  try {
    // 1. Save to af_dynamic_pricing
    const saved = localStorage.getItem(PRICING_KEY);
    const allPricing = saved ? JSON.parse(saved) : {};
    allPricing[propertyId] = pricing;
    localStorage.setItem(PRICING_KEY, JSON.stringify(allPricing));

    // 2. Sync back to af_properties (Base and Cleaning should match)
    const propsSaved = localStorage.getItem(PROPERTIES_KEY);
    const allProps = propsSaved ? JSON.parse(propsSaved) : [...PROPERTIES];
    const idx = allProps.findIndex((p: any) => p.id === propertyId);
    if (idx >= 0) {
      allProps[idx].basePricePerNight = pricing.basePrice;
      allProps[idx].cleaningFee = pricing.cleaningFee;
      localStorage.setItem(PROPERTIES_KEY, JSON.stringify(allProps));
    }
  } catch (err) {
    console.error("Error saving pricing:", err);
  }
}
