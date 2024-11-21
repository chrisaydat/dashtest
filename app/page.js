'use client'

import { useState, useEffect } from 'react'
import MetricsGrid from './components/MetricsGrid'
import TransactionChart from './components/TransactionChart'
import PaymentDistributionChart from './components/PaymentDistrubutionChart'
import { fetchDashboardMetrics, fetchTransactionTrends, fetchPaymentDistribution } from '@/utils/queries'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState(null)
  const [transactionData, setTransactionData] = useState([])
  const [paymentData, setPaymentData] = useState([])

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [metricsData, trendsData, distributionData] = await Promise.all([
          fetchDashboardMetrics(),
          fetchTransactionTrends(),
          fetchPaymentDistribution()
        ])

        setMetrics({
          totalTransactions: metricsData.total_count.toLocaleString(),
          totalVolume: `GHS ${(metricsData.total_volume / 1000000).toFixed(2)}M`,
          activeUsers: metricsData.active_users.toLocaleString(),
          successRate: `${metricsData.success_rate}%`,
          transactionsTrend: 12.5,
          volumeTrend: 8.3,
          usersTrend: 5.2,
          successRateTrend: -1.5
        })

        setTransactionData(trendsData)
        setPaymentData(distributionData.map(item => ({
          name: item.payment_channel,
          value: parseFloat(item.total_amount)
        })))
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
        <p className="text-gray-400">Real-time insights and performance metrics</p>
      </div>

      <MetricsGrid metrics={metrics} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <TransactionChart data={transactionData} loading={loading} />
        <PaymentDistributionChart data={paymentData} loading={loading} />
      </div>

      <div className="mt-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Transactions</h2>
          {/* Add TransactionTable component here */}
        </div>
      </div>
    </div>
  )
}