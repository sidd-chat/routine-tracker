'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import supabase from '@/lib/supabase'
import { User } from '@/lib/types'

const UserAccountPage = () => {
  const [user, setUser] = useState<User | null>(null)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchUserData = async () => {
    const { data, error } = await supabase.auth.getUser()
    if (data) {
      console.log(data)
      // setUser()
      // setNewName(data?.user_metadata?.full_name || '')
      // setNewEmail(data?.email || '')
    }
    if (error) console.error(error.message)
  }

  const handleSaveProfile = async () => {
    if (loading || !user) return
    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: newName,
        email: newEmail
      }
    })

    if (error) {
      console.error('Error updating profile:', error.message)
    } else {
      console.log('Profile updated successfully')
    }

    setLoading(false)
  }

  const handleUpdatePassword = async () => {
    if (loading || !newPassword) return
    setLoading(true)

    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) {
      console.error('Error updating password:', error.message)
    } else {
      console.log('Password updated successfully')
    }

    setLoading(false)
  }

  React.useEffect(() => {
    fetchUserData()
  }, [])

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">User Account</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your profile and settings</p>
      </div>

      {/* Profile Section */}
      {user && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Profile</h2>

          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-600 dark:text-gray-300">Name</label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600 dark:text-gray-300">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="Your email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="mt-1"
            />
          </div>

          <Button
            onClick={handleSaveProfile}
            className="w-full bg-blue-600 text-white mt-4"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      )}

      {/* Password Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Change Password</h2>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-600 dark:text-gray-300">New Password</label>
          <Input
            id="password"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1"
          />
        </div>

        <Button
          onClick={handleUpdatePassword}
          className="w-full bg-blue-600 text-white mt-4"
          disabled={loading || !newPassword}
        >
          {loading ? 'Updating...' : 'Update Password'}
        </Button>
      </div>

      {/* Activity Log Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Activity Log</h2>
        <p className="text-gray-500 dark:text-gray-400">No recent activity to show.</p>
      </div>
    </div>
  )
}

export default UserAccountPage
