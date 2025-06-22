'use client';

import { DollarSign, TrendingUp, TrendingDown, CreditCard } from 'lucide-react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { CardSkeleton } from '@/components/Skeletons';
import { useRevenue } from '@/hooks/useSystemData';

export function RevenueCard() {
  const { revenue, isLoading, error } = useRevenue();

  if (isLoading) return <CardSkeleton />;
  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="text-center text-red-500">
          <DollarSign className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">Failed to load revenue data</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const currentRevenue = revenue?.total || 0;
  const previousRevenue = revenue?.previous || 0;
  const growth =
    previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;
  const isPositiveGrowth = growth > 0;

  return (
    <ErrorBoundary>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue</h3>
              <p className="text-sm text-gray-600">Current period income</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentRevenue)}</p>
            <div className="flex items-center gap-1 justify-end">
              {isPositiveGrowth ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span
                className={`text-sm font-medium ${
                  isPositiveGrowth ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {isPositiveGrowth ? '+' : ''}
                {growth.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-gray-600">Tuition Fees</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency(revenue?.tuitionFees || 0)}
              </p>
              <p className="text-xs text-gray-500">
                {revenue?.total > 0
                  ? Math.round(((revenue?.tuitionFees || 0) / revenue.total) * 100)
                  : 0}
                % of total
              </p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-gray-600">Other Fees</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency((revenue?.total || 0) - (revenue?.tuitionFees || 0))}
              </p>
              <p className="text-xs text-gray-500">
                {revenue?.total > 0
                  ? Math.round(
                      (((revenue?.total || 0) - (revenue?.tuitionFees || 0)) / revenue.total) * 100
                    )
                  : 0}
                % of total
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Monthly Target</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(revenue?.target || 0)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  (revenue?.total || 0) >= (revenue?.target || 0) ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{
                  width: `${Math.min(((revenue?.total || 0) / (revenue?.target || 1)) * 100, 100)}%`,
                }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
              <span>
                {revenue?.target > 0
                  ? Math.round(((revenue?.total || 0) / revenue.target) * 100)
                  : 0}
                % achieved
              </span>
              <span>
                {formatCurrency((revenue?.target || 0) - (revenue?.total || 0))} remaining
              </span>
            </div>
          </div>

          {/* Revenue Sources */}
          {revenue?.sources && revenue.sources.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Top Revenue Sources</h4>
              <div className="space-y-2">
                {revenue.sources.slice(0, 3).map((source: any, index: number) => (
                  <div
                    key={source.name || index}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-700 truncate">{source.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {formatCurrency(source.amount)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {revenue.total > 0 ? Math.round((source.amount / revenue.total) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
