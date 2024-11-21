'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  
  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'security', label: 'Security' },
    { id: 'api', label: 'API Keys' },
  ]

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-700">
        <nav className="flex space-x-8" aria-label="Settings tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="space-y-6">
        {activeTab === 'general' && (
          <Card className="bg-gray-800">
            <CardHeader>
              <CardTitle className="text-white">General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Dashboard Theme</label>
                <select className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-300">
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="system">System</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Time Zone</label>
                <select className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-300">
                  <option value="UTC">UTC</option>
                  <option value="GMT">GMT</option>
                  <option value="EST">EST</option>
                </select>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'notifications' && (
          <Card className="bg-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-300">Email Notifications</h3>
                  <p className="text-sm text-gray-400">Receive daily summary emails</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-300">Transaction Alerts</h3>
                  <p className="text-sm text-gray-400">Get notified about large transactions</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'security' && (
          <Card className="bg-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Two-Factor Authentication</label>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Enable 2FA
                </button>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Change Password</label>
                <button className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600">
                  Update Password
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'api' && (
          <Card className="bg-gray-800">
            <CardHeader>
              <CardTitle className="text-white">API Keys</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Live API Key</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="password"
                    value="sk_live_xxxxxxxxxxxxx"
                    readOnly
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-300"
                  />
                  <button className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600">
                    Copy
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Test API Key</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="password"
                    value="sk_test_xxxxxxxxxxxxx"
                    readOnly
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-300"
                  />
                  <button className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600">
                    Copy
                  </button>
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Generate New Keys
              </button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 