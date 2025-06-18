import React from 'react';
import { 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Database,
  Mail,
  Users,
  Lock,
  Eye,
  Save
} from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your application preferences</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Reset to Default
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <nav className="space-y-2">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-blue-600 bg-blue-50 rounded-lg">
                <Settings className="w-4 h-4" />
                General
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg">
                <Bell className="w-4 h-4" />
                Notifications
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg">
                <Shield className="w-4 h-4" />
                Security
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg">
                <Palette className="w-4 h-4" />
                Appearance
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg">
                <Database className="w-4 h-4" />
                Data & Privacy
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg">
                <Mail className="w-4 h-4" />
                Communications
              </button>
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* General Settings */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              General Settings
            </h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School Name
                  </label>
                  <input
                    type="text"
                    defaultValue="EduLynx High School"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Academic Year
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>2024</option>
                    <option>2025</option>
                    <option>2026</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Language
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>English</option>
                    <option>Afrikaans</option>
                    <option>Zulu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Zone
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>South Africa Standard Time (SAST)</option>
                    <option>GMT</option>
                    <option>UTC</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School Address
                </label>
                <textarea
                  rows={3}
                  defaultValue="123 Education Street, Johannesburg, 2000, South Africa"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Preferences
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Receive important updates via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Student Updates</h4>
                  <p className="text-sm text-gray-600">Notifications about student activities</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">System Alerts</h4>
                  <p className="text-sm text-gray-600">Important system maintenance notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Financial Updates</h4>
                  <p className="text-sm text-gray-600">Payment and financial notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security & Privacy
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-gray-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Session Timeout</h4>
                    <p className="text-sm text-gray-600">Automatically log out after inactivity</p>
                  </div>
                </div>
                <select className="p-2 border border-gray-300 rounded-lg text-sm">
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>2 hours</option>
                  <option>Never</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">User Permissions</h4>
                    <p className="text-sm text-gray-600">Manage role-based access control</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Configure
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-gray-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Activity Logging</h4>
                    <p className="text-sm text-gray-600">Track user activities and changes</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Appearance
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Theme
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="relative">
                    <input type="radio" name="theme" value="light" defaultChecked className="sr-only peer" />
                    <div className="w-full p-4 border-2 border-gray-300 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50">
                      <div className="w-full h-12 bg-white border border-gray-200 rounded mb-2"></div>
                      <p className="text-sm font-medium text-center">Light</p>
                    </div>
                  </div>
                  <div className="relative">
                    <input type="radio" name="theme" value="dark" className="sr-only peer" />
                    <div className="w-full p-4 border-2 border-gray-300 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50">
                      <div className="w-full h-12 bg-gray-800 border border-gray-600 rounded mb-2"></div>
                      <p className="text-sm font-medium text-center">Dark</p>
                    </div>
                  </div>
                  <div className="relative">
                    <input type="radio" name="theme" value="auto" className="sr-only peer" />
                    <div className="w-full p-4 border-2 border-gray-300 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50">
                      <div className="w-full h-12 bg-gradient-to-r from-white to-gray-800 border border-gray-200 rounded mb-2"></div>
                      <p className="text-sm font-medium text-center">Auto</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full cursor-pointer ring-2 ring-blue-600 ring-offset-2"></div>
                  <div className="w-8 h-8 bg-purple-600 rounded-full cursor-pointer hover:ring-2 hover:ring-purple-600 hover:ring-offset-2"></div>
                  <div className="w-8 h-8 bg-green-600 rounded-full cursor-pointer hover:ring-2 hover:ring-green-600 hover:ring-offset-2"></div>
                  <div className="w-8 h-8 bg-red-600 rounded-full cursor-pointer hover:ring-2 hover:ring-red-600 hover:ring-offset-2"></div>
                  <div className="w-8 h-8 bg-orange-600 rounded-full cursor-pointer hover:ring-2 hover:ring-orange-600 hover:ring-offset-2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
