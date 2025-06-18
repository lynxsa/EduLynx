import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  PiggyBank,
  Receipt,
  AlertCircle,
  Calendar
} from 'lucide-react';

// Mock financial data
const financialData = {
  totalRevenue: 2450000,
  monthlyRevenue: 204166,
  pendingPayments: 125000,
  expenses: 1800000,
  netProfit: 650000,
  recentTransactions: [
    { id: 1, type: 'revenue', description: 'Tuition Payment - Grade 12', amount: 15000, date: '2024-01-15', status: 'completed' },
    { id: 2, type: 'expense', description: 'Teacher Salaries', amount: -120000, date: '2024-01-14', status: 'completed' },
    { id: 3, type: 'revenue', description: 'School Supplies Fee', amount: 8500, date: '2024-01-13', status: 'completed' },
    { id: 4, type: 'expense', description: 'Utilities Bill', amount: -25000, date: '2024-01-12', status: 'completed' },
    { id: 5, type: 'revenue', description: 'Extra Classes Fee', amount: 12000, date: '2024-01-11', status: 'pending' },
  ],
  monthlyBreakdown: [
    { month: 'Jan', revenue: 220000, expenses: 180000 },
    { month: 'Feb', revenue: 210000, expenses: 175000 },
    { month: 'Mar', revenue: 235000, expenses: 190000 },
    { month: 'Apr', revenue: 225000, expenses: 185000 },
    { month: 'May', revenue: 240000, expenses: 195000 },
    { month: 'Jun', revenue: 250000, expenses: 200000 },
  ]
};

const FinancePage = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor school finances and track revenue</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Generate Report
          </button>
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Export Data
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialData.totalRevenue)}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12.5% from last year
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialData.monthlyRevenue)}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +5.3% from last month
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Payments</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialData.pendingPayments)}</p>
              <p className="text-sm text-orange-600 flex items-center mt-1">
                <AlertCircle className="w-4 h-4 mr-1" />
                Requires attention
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <CreditCard className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Profit</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialData.netProfit)}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +8.2% margin
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <PiggyBank className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart Placeholder */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue vs Expenses</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Chart visualization would be rendered here</p>
              <p className="text-sm text-gray-400">Integration with chart library needed</p>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            {financialData.recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'revenue' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'revenue' ? 
                      <TrendingUp className="w-4 h-4 text-green-600" /> : 
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    }
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(transaction.amount)}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    transaction.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Breakdown Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Financial Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Month</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Expenses</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Net Profit</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Margin</th>
              </tr>
            </thead>
            <tbody>
              {financialData.monthlyBreakdown.map((month, index) => {
                const netProfit = month.revenue - month.expenses;
                const margin = ((netProfit / month.revenue) * 100).toFixed(1);
                return (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{month.month}</td>
                    <td className="py-3 px-4 text-green-600">{formatCurrency(month.revenue)}</td>
                    <td className="py-3 px-4 text-red-600">{formatCurrency(month.expenses)}</td>
                    <td className="py-3 px-4 font-bold">{formatCurrency(netProfit)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        parseFloat(margin) > 15 
                          ? 'bg-green-100 text-green-800' 
                          : parseFloat(margin) > 10 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {margin}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinancePage;
