import { useAuthStore } from "@/stores/authStore"
import { Navigate, Outlet } from "react-router-dom"

const ProtectedRoute = () => {
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const hydrated = useAuthStore((state) => state.hydrated)

  console.log('🛡️ ProtectedRoute checking auth...')
  console.log('🛡️ Hydrated:', hydrated)
  console.log('🛡️ Token:', token)
  console.log('🛡️ User:', user)

  // Wait for hydration before making auth decision
  if (!hydrated) {
    console.log('⏳ Store not hydrated yet, showing loading...')
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const isAuthenticated = token !== null

  console.log('🛡️ Is Authenticated:', isAuthenticated)

  if (!isAuthenticated) {
    console.log('❌ Not authenticated, redirecting to /login')
  } else {
    console.log('✅ Authenticated, allowing access')
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoute
