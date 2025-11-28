/**
 * Shipping Utilities
 * Functions for calculating shipping costs and generating shipping breakdowns
 */

export interface ShippingMethod {
  id: number;
  name: string;
  baseCost: number;
  perKgCost: number;
  freeShippingThresholdRetail: number;
  freeShippingThresholdWholesale: number;
  deliveryTime: string;
  description: string;
}

export interface ShippingZone {
  id: number;
  name: string;
  regions: string[];
  status: 'active' | 'inactive';
  methods: ShippingMethod[];
}

export type CustomerType = 'retail' | 'wholesale';

export interface ShippingCalculation {
  shippingCost: number;
  isFreeShipping: boolean;
  baseCost: number;
  weightCost: number;
  totalWeight: number;
  method: ShippingMethod;
  zone: ShippingZone;
}

export interface ShippingBreakdown {
  currentShippingCost: number;
  isFreeShipping: boolean;
  baseCost: number;
  weightCost: number;
  totalWeight: number;
  method: ShippingMethod;
  zone: ShippingZone;
  cartTotal: number;
  customerType: CustomerType;
  amountNeededForFreeShipping?: number;
}

/**
 * Calculate shipping cost based on weight, cart total, and customer type
 */
export function calculateShippingCost(
  method: ShippingMethod,
  zone: ShippingZone,
  weightInKg: number,
  cartTotal: number,
  customerType: CustomerType = 'retail'
): ShippingCalculation {
  const threshold = customerType === 'retail'
    ? method.freeShippingThresholdRetail
    : method.freeShippingThresholdWholesale;

  const isFreeShipping = cartTotal >= threshold;

  const baseCost = method.baseCost;
  const weightCost = weightInKg * method.perKgCost;
  const totalCost = isFreeShipping ? 0 : baseCost + weightCost;

  return {
    shippingCost: totalCost,
    isFreeShipping,
    baseCost,
    weightCost,
    totalWeight: weightInKg,
    method,
    zone
  };
}

/**
 * Get shipping breakdown with incentive messages for customers
 */
export function getShippingBreakdown(
  method: ShippingMethod,
  zone: ShippingZone,
  weightInKg: number,
  cartTotal: number,
  customerType: CustomerType = 'retail'
): ShippingBreakdown {
  const calculation = calculateShippingCost(method, zone, weightInKg, cartTotal, customerType);

  const threshold = customerType === 'retail'
    ? method.freeShippingThresholdRetail
    : method.freeShippingThresholdWholesale;

  let amountNeededForFreeShipping: number | undefined;

  if (!calculation.isFreeShipping && threshold > 0) {
    amountNeededForFreeShipping = threshold - cartTotal;
  }

  return {
    currentShippingCost: calculation.shippingCost,
    isFreeShipping: calculation.isFreeShipping,
    baseCost: calculation.baseCost,
    weightCost: calculation.weightCost,
    totalWeight: weightInKg,
    method,
    zone,
    cartTotal,
    customerType,
    amountNeededForFreeShipping
  };
}

/**
 * Find the appropriate shipping zone based on customer's region
 */
export function findShippingZone(
  zones: ShippingZone[],
  customerRegion: string
): ShippingZone | null {
  const activeZones = zones.filter(z => z.status === 'active');

  for (const zone of activeZones) {
    if (zone.regions.some(region =>
      region.toLowerCase() === customerRegion.toLowerCase()
    )) {
      return zone;
    }
  }

  return null;
}

/**
 * Format currency in Bangladeshi Taka
 */
export function formatCurrency(amount: number): string {
  return `৳${amount.toFixed(0)}`;
}
