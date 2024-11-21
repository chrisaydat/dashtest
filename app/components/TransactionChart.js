// components/charts/TransactionChart.js
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function TransactionChart({ data, loading }) {
  if (loading) {
    return (
      <Card className="bg-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Transaction Trends</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px] animate-pulse">
          <div className="h-full w-full bg-gray-700 rounded-lg"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Transaction Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
              labelStyle={{ color: '#9CA3AF' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
