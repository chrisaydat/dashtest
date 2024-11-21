import Image from 'next/image'
import Link from 'next/link'
import { Home, Users, ShoppingBag, Activity, Settings } from 'lucide-react'

export default function Sidebar() {
  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/' },
    { icon: Activity, label: 'Transactions', href: '/transactions' },
    { icon: Users, label: 'Customers', href: '/customers' },
    { icon: ShoppingBag, label: 'Merchants', href: '/merchants' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ]

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-gray-800 p-4">
      <div className="mb-8">
        <Image 
          src="/logo.png" 
          alt="Hubtel Logo" 
          width={120} 
          height={40} 
          className="mx-auto"
        />
      </div>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center space-x-3 px-4 py-2.5 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
