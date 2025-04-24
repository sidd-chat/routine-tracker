"use client"

import { Charts } from '@/components/Charts'
// import { useSession } from '@supabase/auth-helpers-react'
import Tracker from '@/components/Tracker/Tracker'
import supabase from '@/lib/supabase'
import React, { useEffect } from 'react'


const Dashboard = () => {
  return (
    <main className="flex flex-col overflow-x-hidden">
      <h2 className="text-4xl font-semibold mt-8 mx-auto">Your Dashboard</h2>
      <Tracker />
    </main>
  )
}

export default Dashboard