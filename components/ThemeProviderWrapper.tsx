"use client"

import { ThemeProvider } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if(!isMounted) {
    return (
      <>
        {children}
      </>
    )
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
    </ThemeProvider>
  )
}
