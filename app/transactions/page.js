'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from '../lib/supabase'

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTransactions() {
      try {
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
            core_customer!inner (
              customer_name
            ),
            core_merchant!inner (
              merchant_name
            ),
            core_payment!inner (
              payment_type,
              channel
            ),
            core_time!inner (
              full_date
            )
          `)
          .order('core_time(full_date)', { ascending: false })
          .limit(50)

        if (error) throw error
        setTransactions(data || [])
      } catch (error) {
        console.error('Error fetching transactions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  return (
    <div className="p-8">
      <Card className="bg-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-700 rounded"></div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs uppercase bg-gray-700">
                  <tr>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Merchant</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Payment Type</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.transaction_id} className="border-b border-gray-700">
                      <td className="px-6 py-4">
                        {new Date(tx.core_time.full_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">{tx.core_customer.customer_name}</td>
                      <td className="px-6 py-4">{tx.core_merchant.merchant_name}</td>
                      <td className="px-6 py-4">GHS {tx.amount.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          tx.status === 'successful' ? 'bg-green-500/20 text-green-500' :
                          tx.status === 'failed' ? 'bg-red-500/20 text-red-500' :
                          'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">{tx.core_payment.payment_type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 