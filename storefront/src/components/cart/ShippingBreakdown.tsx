import React from 'react';
import {
  ShippingBreakdown as ShippingBreakdownType,
  formatCurrency
} from '../../utils/shippingUtils';

interface ShippingBreakdownProps {
  breakdown: ShippingBreakdownType;
  className?: string;
}

export default function ShippingBreakdown({ breakdown, className = '' }: ShippingBreakdownProps) {
  const {
    currentShippingCost,
    isFreeShipping,
    baseCost,
    weightCost,
    totalWeight,
    method,
    cartTotal,
    customerType,
    amountNeededForFreeShipping
  } = breakdown;

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Shipping Details</h3>
        {customerType === 'wholesale' && (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            Wholesale
          </span>
        )}
      </div>

      {/* Shipping Method Info */}
      <div className="mb-4 pb-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">{method.name}</span>
          <span className="text-sm text-gray-600">{method.deliveryTime}</span>
        </div>
        <p className="text-xs text-gray-500">{method.description}</p>
      </div>

      {/* Cost Breakdown */}
      {!isFreeShipping && (
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Base shipping cost:</span>
            <span className="font-medium text-gray-900">{formatCurrency(baseCost)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Weight charge ({totalWeight} kg × {formatCurrency(method.perKgCost)}):</span>
            <span className="font-medium text-gray-900">{formatCurrency(weightCost)}</span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
            <span className="text-gray-900 font-semibold">Total Shipping:</span>
            <span className="font-bold text-[#ec3137]">{formatCurrency(currentShippingCost)}</span>
          </div>
        </div>
      )}

      {/* Free Shipping Indicator */}
      {isFreeShipping && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-semibold text-green-800">
              FREE Shipping Applied!
            </span>
          </div>
        </div>
      )}

      {/* Incentive Messages */}
      {!isFreeShipping && amountNeededForFreeShipping && amountNeededForFreeShipping > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 mb-1">
                Almost there! Get FREE shipping
              </p>
              <p className="text-sm text-blue-700">
                Add <span className="font-bold">{formatCurrency(amountNeededForFreeShipping)}</span> more to your cart to qualify for free shipping
              </p>

              {/* Progress Bar */}
              <div className="mt-2">
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min((cartTotal / (cartTotal + amountNeededForFreeShipping)) * 100, 100)}%`
                    }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-blue-600">{formatCurrency(cartTotal)}</span>
                  <span className="text-xs text-blue-600 font-medium">
                    {formatCurrency(cartTotal + amountNeededForFreeShipping)} (Free!)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Promotional Tiers (Optional enhancement) */}
      {!isFreeShipping && renderPromotionalTiers(breakdown)}
    </div>
  );
}

/**
 * Render promotional shipping tiers to encourage larger purchases
 */
function renderPromotionalTiers(breakdown: ShippingBreakdownType) {
  const { cartTotal, customerType, method } = breakdown;
  const freeThreshold = customerType === 'retail'
    ? method.freeShippingThresholdRetail
    : method.freeShippingThresholdWholesale;

  // Calculate potential savings at different thresholds
  const tiers = [
    { threshold: freeThreshold * 0.5, message: '50% off shipping' },
    { threshold: freeThreshold * 0.75, message: 'Almost free shipping!' },
    { threshold: freeThreshold, message: 'FREE shipping' }
  ].filter(tier => cartTotal < tier.threshold);

  if (tiers.length === 0) return null;

  return (
    <div className="mt-4 pt-3 border-t border-gray-200">
      <p className="text-xs font-semibold text-gray-700 mb-2">Shipping Deals:</p>
      <div className="space-y-1">
        {tiers.slice(0, 2).map((tier, index) => {
          const amountNeeded = tier.threshold - cartTotal;
          return (
            <div key={index} className="flex items-center text-xs text-gray-600">
              <svg className="w-3 h-3 text-gray-400 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
              <span>
                Add <span className="font-medium text-gray-900">{formatCurrency(amountNeeded)}</span> for {tier.message}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
