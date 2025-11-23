import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/stores/authStore"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { Eye, EyeOff } from "lucide-react"

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export function LoginForm() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    console.log('🔐 Login form submitted')
    try {
      console.log('📡 Sending login request to:', "/admin/auth/login")
      const response = await api.post("/admin/auth/login", {
        phone_number: phoneNumber,
        password,
      })
      console.log('✅ API Response:', response.data)
      const { token, user } = response.data
      console.log('🎫 Token received:', token)
      console.log('👤 User received:', user)
      console.log('💾 Calling authStore.login()...')
      login(token, user)
      console.log('✅ Login function called, checking localStorage...')
      console.log('📦 localStorage token:', localStorage.getItem('token'))
      console.log('📦 localStorage user:', localStorage.getItem('user'))
      navigate("/dashboard")
    } catch (error: unknown) {
      console.error('❌ Login error:', error)
      const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
      const apiError = error as ApiErrorResponse;
      const description = apiError?.response?.data?.message || errorMessage;
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: description,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <img src="/logo.svg" alt="Hook & Hunt" className="h-20 w-auto" />
          </div>
          <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your phone number and password to login to your account.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                type="text"
                placeholder="e.g. 017xxxxxxxx"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember_me"
                checked={rememberMe}
                onCheckedChange={setRememberMe}
              />
              <Label htmlFor="remember_me" className="text-sm">
                Remember me
              </Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
