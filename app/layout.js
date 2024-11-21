// app/layout.js
import './globals.css'
import { Inter } from 'next/font/google'
import Sidebar from '@/app/components/Sidebar.js'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Hubtel Analytics Dashboard',
  description: 'Real-time analytics and insights for Hubtel transactions',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-64">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}