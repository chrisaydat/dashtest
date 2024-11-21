// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// utils/queries.js
export async function fetchDashboardMetrics() {
  try {
    console.log('Fetching dashboard metrics...')
    const { data, error } = await supabase
      .from('transaction_facts')
      .select(`
        transaction_id,
        amount,
        fee,
        commission,
        status,
        platform_source,
        transaction_type,
        core_time!inner (
          full_date
        )
      `)
      .order('core_time(full_date)', { ascending: false })
      .limit(1000)

    if (error) {
      console.error('Error in fetchDashboardMetrics:', error)
      throw error
    }

    if (!data || data.length === 0) {
      console.log('No data returned from fetchDashboardMetrics')
      return {
        totalTransactions: '0',
        totalVolume: 'GHS 0',
        activeUsers: '0',
        successRate: '0%',
        transactionsTrend: 0,
        volumeTrend: 0,
        usersTrend: 0,
        successRateTrend: 0
      }
    }

    // Process the data
    const totalTransactions = data.length
    const totalVolume = data.reduce((sum, tx) => sum + (tx.amount || 0), 0)
    const successfulTx = data.filter(tx => tx.status === 'successful').length
    const successRate = (successfulTx / totalTransactions) * 100

    // Calculate trends (comparing with previous period)
    const currentPeriodData = data.slice(0, data.length / 2)
    const previousPeriodData = data.slice(data.length / 2)

    const transactionsTrend = calculateTrend(
      currentPeriodData.length,
      previousPeriodData.length
    )

    const volumeTrend = calculateTrend(
      currentPeriodData.reduce((sum, tx) => sum + (tx.amount || 0), 0),
      previousPeriodData.reduce((sum, tx) => sum + (tx.amount || 0), 0)
    )

    // Format the metrics
    const metrics = {
      totalTransactions: totalTransactions.toLocaleString(),
      totalVolume: `GHS ${(totalVolume / 1000000).toFixed(2)}M`,
      activeUsers: data.length.toLocaleString(),
      successRate: `${successRate.toFixed(1)}%`,
      transactionsTrend,
      volumeTrend,
      usersTrend: 0, // You can implement this based on your needs
      successRateTrend: 0 // You can implement this based on your needs
    }

    console.log('Processed metrics:', metrics)
    return metrics
  } catch (error) {
    console.error('Exception in fetchDashboardMetrics:', error)
    throw error
  }
}

// Helper function to calculate trend percentage
function calculateTrend(current, previous) {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

export async function fetchTransactionTrends() {
  try {
    console.log('Fetching transaction trends...')
    const { data, error } = await supabase
      .from('transaction_facts')
      .select(`
        amount,
        core_time!inner (
          full_date
        )
      `)
      .order('core_time(full_date)', { ascending: true })

    if (error) throw error

    if (!data || data.length === 0) return []

    // Process data for the chart
    const processedData = data.reduce((acc, tx) => {
      const date = tx.core_time.full_date.split('T')[0]
      if (!acc[date]) {
        acc[date] = { date, count: 0 }
      }
      acc[date].count++
      return acc
    }, {})

    return Object.values(processedData)
  } catch (error) {
    console.error('Exception in fetchTransactionTrends:', error)
    throw error
  }
}

export async function fetchPaymentDistribution() {
  try {
    console.log('Fetching payment distribution...')
    const { data, error } = await supabase
      .from('transaction_facts')
      .select(`
        amount,
        core_payment!inner (
          payment_type,
          channel
        )
      `)
      .not('amount', 'is', null)

    if (error) throw error

    if (!data || data.length === 0) return []

    // Process data for the pie chart
    const distribution = data.reduce((acc, tx) => {
      const type = tx.core_payment.payment_type
      if (!acc[type]) {
        acc[type] = { name: type, value: 0 }
      }
      acc[type].value += tx.amount || 0
      return acc
    }, {})

    return Object.values(distribution)
  } catch (error) {
    console.error('Exception in fetchPaymentDistribution:', error)
    throw error
  }
}

// Add this function to test basic connectivity
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('transaction_facts')
      .select('amount')
      .limit(1)
    
    if (error) throw error
    console.log('Test query result:', data)
    return data
  } catch (error) {
    console.error('Connection test error:', error)
    throw error
  }
}