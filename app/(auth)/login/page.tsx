"use client"

import { useState } from "react"
import { Eye, EyeOff, Mail } from "lucide-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGoogle } from "@fortawesome/free-brands-svg-icons"
import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import supabase from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true)

    let { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    })

    setLoading(false)

    if(error) {
      console.log('Error Logging In:', error)
    } else {
      router.push('/dashboard')
    }
  }

  const handleGoogleLogin = async () => {
    let { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    })

    if(error) {
      alert(error.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome Back 👋</CardTitle>
          <CardDescription className="text-center">
            Log in to continue your journey
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            className="w-full cursor-pointer"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Separator />
          <Button variant="outline" className="w-full gap-2 flex items-center hover:bg-black/10 cursor-pointer" onClick={handleGoogleLogin}>
            <FontAwesomeIcon icon={faGoogle} className="h-5 w-5" />
            <span>Continue with Google</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
