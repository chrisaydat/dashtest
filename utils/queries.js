// utils/queries.js
import { supabase } from '../app/lib/supabase.js'
import { startOfDay, endOfDay, subDays, format } from 'date-fns'

export async function fetchDashboardMetrics() {
  try {
    const today = new Date()
    const thirtyDaysAgo = subDays(today, 30)

    // Fetch current period metrics
    const { data: currentMetrics, error: currentError } = await supabase
      .rpc('get_transaction_metrics', {
        start_date: thirtyDaysAgo.toISOString(),
        end_date: today.toISOString()
      })

    if (currentError) throw currentError

    // Fetch previous period metrics for comparison
    const previousStart = subDays(thirtyDaysAgo, 30)
    const { data: previousMetrics, error: previousError } = await supabase
      .rpc('get_transaction_metrics', {
        start_date: previousStart.toISOString(),
        end_date: thirtyDaysAgo.toISOString()
      })

    if (previousError) throw previousError

    // Calculate trends
    const calculateTrend = (current, previous) => {
      if (!previous) return 0
      return ((current - previous) / previous * 100).toFixed(1)
    }

    return {
      total_count: currentMetrics.transaction_count,
      total_volume: currentMetrics.total_amount,
      active_users: currentMetrics.unique_customers,
      success_rate: currentMetrics.success_rate,
      trends: {
        transaction_trend: calculateTrend(
          currentMetrics.transaction_count,
          previousMetrics.transaction_count
        ),
        volume_trend: calculateTrend(
          currentMetrics.total_amount,
          previousMetrics.total_amount
        ),
        users_trend: calculateTrend(
          currentMetrics.unique_customers,
          previousMetrics.unique_customers
        ),
        success_rate_trend: calculateTrend(
          currentMetrics.success_rate,
          previousMetrics.success_rate
        )
      }
    }
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error)
    throw error
  }
}

export async function fetchTransactionTrends(range = 30) {
  try {
    const endDate = new Date()
    const startDate = subDays(endDate, range)

    const { data, error } = await supabase
      .from('TRANSACTION_FACTS')
      .select(`
        amount,
        status,
        CORE_TIME (
          full_date
        )
      `)
      .gte('time_id', startDate.toISOString())
      .lte('time_id', endDate.toISOString())
      .order('time_id', { ascending: true })

    if (error) throw error

    // Group and aggregate data by date
    const aggregatedData = data.reduce((acc, transaction) => {
      const date = format(new Date(transaction.CORE_TIME.full_date), 'yyyy-MM-dd')
      
      if (!acc[date]) {
        acc[date] = {
          date,
          amount: 0,
          successful: 0,
          total: 0
        }
      }

      acc[date].amount += transaction.amount
      acc[date].total += 1
      if (transaction.status === 'Completed') {
        acc[date].successful += 1
      }

      return acc
    }, {})

    return Object.values(aggregatedData).map(day => ({
      ...day,
      success_rate: ((day.successful / day.total) * 100).toFixed(2)
    }))
  } catch (error) {
    console.error('Error fetching transaction trends:', error)
    throw error
  }
}

export async function fetchPaymentDistribution() {
  try {
    const { data, error } = await supabase
      .from('TRANSACTION_FACTS')
      .select(`
        amount,
        CORE_PAYMENT (
          channel,
          payment_type
        )
      `)
      .gte('time_id', subDays(new Date(), 30).toISOString())

    if (error) throw error

    // Aggregate by payment channel
    const distribution = data.reduce((acc, transaction) => {
      const channel = transaction.CORE_PAYMENT.channel
      if (!acc[channel]) {
        acc[channel] = {
          channel,
          amount: 0,
          count: 0
        }
      }
      acc[channel].amount += transaction.amount
      acc[channel].count += 1
      return acc
    }, {})

    return Object.values(distribution)
      .map(item => ({
        name: item.channel,
        value: item.amount,
        count: item.count
      }))
      .sort((a, b) => b.value - a.value)
  } catch (error) {
    console.error('Error fetching payment distribution:', error)
    throw error
  }
}

export async function fetchRecentTransactions(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('TRANSACTION_FACTS')
      .select(`
        transaction_id,
        amount,
        status,
        platform_source,
        CORE_CUSTOMER (
          customer_name,
          phone_number
        ),
        CORE_MERCHANT (
          merchant_name
        ),
        CORE_PAYMENT (
          channel,
          payment_type
        ),
        CORE_TIME (
          full_date
        )
      `)
      .order('time_id', { ascending: false })
      .limit(limit)

    if (error) throw error

    return data.map(transaction => ({
      id: transaction.transaction_id,
      amount: transaction.amount,
      status: transaction.status,
      customer: transaction.CORE_CUSTOMER.customer_name,
      merchant: transaction.CORE_MERCHANT.merchant_name,
      payment: {
        channel: transaction.CORE_PAYMENT.channel,
        type: transaction.CORE_PAYMENT.payment_type
      },
      date: new Date(transaction.CORE_TIME.full_date),
      platform: transaction.platform_source
    }))
  } catch (error) {
    console.error('Error fetching recent transactions:', error)
    throw error
  }
}

export async function fetchMerchantPerformance(merchantId, dateRange = 30) {
  try {
    const { data, error } = await supabase
      .from('TRANSACTION_FACTS')
      .select(`
        amount,
        status,
        CORE_TIME (
          full_date
        ),
        CORE_MERCHANT (
          merchant_name,
          commission_rate
        )
      `)
      .eq('merchant_id', merchantId)
      .gte('time_id', subDays(new Date(), dateRange).toISOString())

    if (error) throw error

    // Aggregate merchant performance data
    const performance = data.reduce((acc, transaction) => {
      const date = format(new Date(transaction.CORE_TIME.full_date), 'yyyy-MM-dd')
      
      if (!acc[date]) {
        acc[date] = {
          date,
          volume: 0,
          commission: 0,
          successful: 0,
          failed: 0
        }
      }

      acc[date].volume += transaction.amount
      acc[date].commission += transaction.amount * 
        (transaction.CORE_MERCHANT.commission_rate / 100)
      
      if (transaction.status === 'Completed') {
        acc[date].successful += 1
      } else {
        acc[date].failed += 1
      }

      return acc
    }, {})

    return Object.values(performance)
  } catch (error) {
    console.error('Error fetching merchant performance:', error)
    throw error
  }
}

// Helper function to generate date ranges for filtering
export function getDateRange(range = 'last30') {
  const today = new Date()
  
  switch (range) {
    case 'today':
      return {
        start: startOfDay(today),
        end: endOfDay(today)
      }
    case 'last7':
      return {
        start: subDays(today, 7),
        end: today
      }
    case 'last30':
      return {
        start: subDays(today, 30),
        end: today
      }
    case 'last90':
      return {
        start: subDays(today, 90),
        end: today
      }
    default:
      return {
        start: subDays(today, 30),
        end: today
      }
  }
}