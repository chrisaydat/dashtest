'use client'

import { useState, useEffect } from 'react'
import MetricsGrid from './components/MetricsGrid'
import TransactionChart from './components/TransactionChart'
import PaymentDistributionChart from './components/PaymentDistrubutionChart'
import { fetchDashboardMetrics, fetchTransactionTrends, fetchPaymentDistribution } from './lib/supabase'

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null)
  const [trends, setTrends] = useState([])
  const [distribution, setDistribution] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true)
        const [metricsData, trendsData, distributionData] = await Promise.all([
          fetchDashboardMetrics(),
          fetchTransactionTrends(),
          fetchPaymentDistribution()
        ])
        
        setMetrics(metricsData)
        setTrends(trendsData)
        setDistribution(distributionData)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  return (
    <div className="space-y-6 p-8">
      <MetricsGrid metrics={metrics} loading={loading} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TransactionChart data={trends} loading={loading} />
        <PaymentDistributionChart data={distribution} loading={loading} />
      </div>
    </div>
  )
}