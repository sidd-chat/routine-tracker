"use client"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn, navItems } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Landmark } from 'lucide-react'
import supabase from '@/lib/supabase'

const Navbar = () => {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    let { error } = await supabase.auth.signOut()

    if(error) {
      alert(error.message)
    } else {
      router.replace('/login')
    }
  }

  return (
    <nav className="flex items-center justify-between px-6 py-4 shadow-sm bg-background border-b border-border">
      <h1 className="text-xl font-bold text-primary cursor-pointer">Atom</h1>

      <ul className="flex gap-4">
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

      <Link href="/login">
        <Button variant="ghost" className="flex items-center gap-2 cursor-pointer" onClick={handleLogout}>
          <Landmark className="h-4 w-4" />
          Logout
        </Button>
      </Link>
    </nav>
  )
}

export default Navbar