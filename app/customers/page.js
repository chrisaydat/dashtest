'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from '../lib/supabase'

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const { data, error } = await supabase
          .from('core_customer')
          .select(`
            customer_id,
            customer_name,
            phone_number,
            email,
            segment,
            kyc_level,
            joined_date
          `)
          .order('joined_date', { ascending: false })
          .limit(50)

        if (error) throw error
        setCustomers(data || [])
      } catch (error) {
        console.error('Error fetching customers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  return (
    <div className="p-8">
      <Card className="bg-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Customers</CardTitle>
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
                    <th className="px-6 py-3">Phone</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Segment</th>
                    <th className="px-6 py-3">KYC Level</th>
                    <th className="px-6 py-3">Joined Date</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.customer_id} className="border-b border-gray-700">
                      <td className="px-6 py-4">{customer.customer_name}</td>
                      <td className="px-6 py-4">{customer.phone_number}</td>
                      <td className="px-6 py-4">{customer.email}</td>
                      <td className="px-6 py-4">{customer.segment}</td>
                      <td className="px-6 py-4">{customer.kyc_level}</td>
                      <td className="px-6 py-4">
                        {new Date(customer.joined_date).toLocaleDateString()}
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