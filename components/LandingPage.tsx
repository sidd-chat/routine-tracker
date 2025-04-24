import Link from 'next/link'
import React from 'react'

const LandingPage = () => {
  return (
    <div className="text-center mt-20 h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to Routine Tracker</h1>
      <p className="mb-6">Build habits, track progress, and win at life.</p>

      <Link
        href="/dashboard"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Go to Dashboard
      </Link>
    </div>
  )
}

export default LandingPage