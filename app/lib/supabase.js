// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// utils/queries.js
export async function fetchDashboardMetrics() {
  const { data, error } = await supabase
    .from('TRANSACTION_FACTS')
    .select(`
      *,
      CORE_PRODUCT (*),
      CORE_CUSTOMER (*),
      CORE_MERCHANT (*),
      CORE_PAYMENT (*),
      CORE_TIME (*)
    `)
    .limit(1000)

  if (error) throw error
  return data
}

export async function fetchTransactionTrends() {
  const { data, error } = await supabase
    .rpc('get_transaction_trends')  // We'll create this function

  if (error) throw error
  return data
}

export async function fetchPaymentDistribution() {
  const { data, error } = await supabase
    .rpc('get_payment_distribution')  // We'll create this function

  if (error) throw error
  return data
}