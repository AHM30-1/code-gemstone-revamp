import type React from "react"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { motion } from "framer-motion"
import { Shield, Mail, Lock, Eye, EyeOff, LogIn, Sparkles } from "lucide-react"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!email || !password) {
      setError("Please provide email and password.")
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_LINK}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        const msg = data?.detail || "Invalid credentials"
        setError(msg)
        return
      }

      const token = data?.access_token
      if (!token) {
        setError("No token received from server.")
        return
      }

      login(token)
      navigate("/dashboard/clients-morales")
    } catch (err) {
      console.error(err)
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Primary gradient mesh */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-60" />
        
        {/* Floating geometric elements */}
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1, 1.15, 1],
          }}
          transition={{ 
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-32 left-20 w-28 h-28 rounded-2xl bg-gradient-brand opacity-25 blur-xl rotate-12"
        />
        <motion.div
          animate={{ 
            rotate: 360,
            y: [-15, 15, -15],
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            y: { duration: 7, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-40 right-32 w-36 h-36 rounded-full bg-gradient-accent opacity-20 blur-2xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: -180,
          }}
          transition={{ 
            scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 18, repeat: Infinity, ease: "linear" }
          }}
          className="absolute bottom-40 left-32 w-32 h-32 rounded-xl bg-gradient-gold opacity-30 blur-lg"
        />
        <motion.div
          animate={{ 
            x: [-15, 15, -15],
            rotate: 360,
          }}
          transition={{ 
            x: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 14, repeat: Infinity, ease: "linear" }
          }}
          className="absolute bottom-20 right-24 w-24 h-24 rounded-full bg-brand-secondary opacity-35 blur-xl"
        />
      </div>

      {/* Geometric patterns */}
      <div className="absolute inset-0 pattern-grid opacity-5" />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Main Card */}
          <div className="card-premium backdrop-blur-2xl border border-glass-border/50 shadow-elevated">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: 0.3, 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 15 
                }}
                className="relative inline-flex items-center justify-center w-20 h-20 mb-6"
              >
                <div className="absolute inset-0 bg-gradient-accent rounded-2xl shadow-glow animate-glow" />
                <div className="relative flex items-center justify-center w-full h-full">
                  <Shield className="w-10 h-10 text-accent-foreground drop-shadow-lg" />
                  <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-brand-gold animate-pulse" />
                </div>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground-secondary bg-clip-text text-transparent mb-2"
              >
                Welcome Back
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-foreground-muted text-lg"
              >
                Access your premium dashboard
              </motion.p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-2"
              >
                <label className="text-sm font-medium text-foreground-secondary flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-premium w-full pl-12 pr-4 py-4 transition-all duration-300 group-hover:shadow-glass focus:shadow-premium"
                    required
                  />
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-primary transition-colors" />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-2"
              >
                <label className="text-sm font-medium text-foreground-secondary flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-premium w-full pl-12 pr-14 py-4 transition-all duration-300 group-hover:shadow-glass focus:shadow-premium"
                    required
                  />
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-primary transition-colors" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-foreground-muted hover:text-brand-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="p-4 rounded-xl bg-error/10 border border-error/20 backdrop-blur-sm"
                >
                  <p className="text-sm text-error font-medium">{error}</p>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="btn-premium w-full py-4 rounded-xl font-semibold text-primary-foreground transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </>
                )}
              </motion.button>
            </form>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="mt-8 text-center"
            >
              <p className="text-foreground-muted">
                Don't have an account?{" "}
                <Link 
                  to="/signup" 
                  className="text-brand-primary font-medium hover:text-brand-accent transition-colors hover:underline"
                >
                  Create Account
                </Link>
              </p>
            </motion.div>
          </div>

          {/* Security Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="mt-6 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-success/20 text-sm text-foreground-muted">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Secure & Encrypted
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}