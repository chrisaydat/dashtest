import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function MetricsGrid({ metrics, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-gray-800 animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-700 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const metricCards = [
    {
      title: 'Total Transactions',
      value: metrics?.totalTransactions || '0',
      trend: metrics?.transactionsTrend || 0,
    },
    {
      title: 'Transaction Volume',
      value: metrics?.totalVolume || 'GHS 0M',
      trend: metrics?.volumeTrend || 0,
    },
    {
      title: 'Active Users',
      value: metrics?.activeUsers || '0',
      trend: metrics?.usersTrend || 0,
    },
    {
      title: 'Success Rate',
      value: metrics?.successRate || '0%',
      trend: metrics?.successRateTrend || 0,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricCards.map((metric, index) => (
        <Card key={index} className="bg-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-400 text-sm">{metric.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-white">{metric.value}</p>
              <div className={`flex items-center ${metric.trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {metric.trend >= 0 ? (
                  <ArrowUpIcon className="w-4 h-4" />
                ) : (
                  <ArrowDownIcon className="w-4 h-4" />
                )}
                <span className="ml-1">{Math.abs(metric.trend)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}