"use client"

import { useEffect, useState } from "react"
import supabase from "@/lib/supabase"
import { User } from "@supabase/auth-js"

export default function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) console.error("Error getting user:", error)
      setUser(data?.user ?? null)
      setLoading(false)
    }

    getUser()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  return { user, loading, isLoggedIn: !!user }
}
