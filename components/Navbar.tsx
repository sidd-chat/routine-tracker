"use client"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn, navItems } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { LogOut, Menu, Sun, Moon, X } from 'lucide-react'
import supabase from '@/lib/supabase'
import { useEffect, useState } from 'react'

const Navbar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)

  const handleLogout = async () => {
    let { error } = await supabase.auth.signOut()

    if (error) {
      alert(error.message)
    } else {
      router.replace('/login')
    }
  }

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev)
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle('dark')
    }
  }

  useEffect(() => {
    // Ensure dark mode is default
    if (typeof document !== "undefined") {
      document.documentElement.classList.add('dark')
    }
  }, [])

  return (
    <>
      <nav className="flex items-center justify-between px-6 py-4 shadow-sm bg-background border-b border-border">
        <h1 className="text-xl font-bold text-primary cursor-pointer">Atom</h1>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-4">
          {navItems.map(({ name, href, icon: Icon }) => (
            <Link key={name} href={href}>
              <Button
                variant={pathname === href ? 'default' : 'ghost'}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Icon className="h-4 w-4" />
                {name}
              </Button>
            </Link>
          ))}
        </ul>

        {/* Desktop Right Actions */}
        <div className="hidden md:flex items-center gap-2">
          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="transition-transform duration-300 hover:rotate-270 cursor-pointer">
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-yellow-400 transition-all duration-300" />
            ) : (
              <Moon className="h-5 w-5 text-blue-600 transition-all duration-300" />
            )}
          </Button>

          {/* Logout */}
          <Button variant="ghost" className="flex items-center gap-2 cursor-pointer" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Mobile Hamburger + Theme Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="transition-transform duration-300 hover:rotate-360">
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-yellow-400 transition-all duration-300" />
            ) : (
              <Moon className="h-5 w-5 text-blue-600 transition-all duration-300" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm ${sidebarOpen ? 'visible' : 'invisible'} transition-all`}>
        {/* Sidebar panel */}
        <div
          className={cn(
            "fixed right-0 top-0 h-full w-64 bg-background shadow-lg p-6 flex flex-col gap-6 transform transition-transform duration-300",
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-bold">Menu</h2>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          <ul className="flex flex-col gap-4">
            {navItems.map(({ name, href, icon: Icon }) => (
              <Link key={name} href={href} onClick={() => setSidebarOpen(false)}>
                <Button
                  variant={pathname === href ? 'default' : 'ghost'}
                  className="w-full flex items-center gap-2 justify-start"
                >
                  <Icon className="h-4 w-4" />
                  {name}
                </Button>
              </Link>
            ))}
          </ul>

          <div className="mt-auto">
            <Button
              variant="ghost"
              className="flex items-center gap-2 w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Click outside area */}
        <div
          className="w-full h-full"
          onClick={() => setSidebarOpen(false)}
        />
      </div>
    </>
  )
}

export default Navbar
