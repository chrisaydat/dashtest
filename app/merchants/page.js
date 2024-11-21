'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from '../lib/supabase'

export default function MerchantsPage() {
  const [merchants, setMerchants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMerchants() {
      try {
        const { data, error } = await supabase
          .from('core_merchant')
          .select(`
            merchant_id,
            merchant_name,
            business_type,
            category,
            settlement_account,
            integration_type,
            commission_rate,
            is_active
          `)
          .order('merchant_name', { ascending: true })
          .limit(50)

        if (error) throw error
        setMerchants(data || [])
      } catch (error) {
        console.error('Error fetching merchants:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMerchants()
  }, [])

  return (
    <div className="p-8">
      <Card className="bg-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Merchants</CardTitle>
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
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Business Type</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Integration</th>
                    <th className="px-6 py-3">Commission Rate</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {merchants.map((merchant) => (
                    <tr key={merchant.merchant_id} className="border-b border-gray-700">
                      <td className="px-6 py-4">{merchant.merchant_name}</td>
                      <td className="px-6 py-4">{merchant.business_type}</td>
                      <td className="px-6 py-4">{merchant.category}</td>
                      <td className="px-6 py-4">{merchant.integration_type}</td>
                      <td className="px-6 py-4">{merchant.commission_rate}%</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          merchant.is_active ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                        }`}>
                          {merchant.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
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