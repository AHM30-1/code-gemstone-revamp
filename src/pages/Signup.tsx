import type React from "react"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Shield, Mail, Lock, User, Eye, EyeOff, CheckCircle, Sparkles, Star } from "lucide-react"

export default function Signup() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const passwordStrength = {
    hasLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
  }

  const isPasswordStrong = Object.values(passwordStrength).every(Boolean)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!name || !email || !password) {
      setError("All fields are required")
      setLoading(false)
      return
    }

    if (!isPasswordStrong) {
      setError("Please ensure your password meets all requirements")
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_LINK}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name, email, password }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        const msg = data?.detail || "Registration failed"
        setError(msg)
        return
      }

      navigate("/login")
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
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-20 left-20 w-32 h-32 rounded-full bg-gradient-brand opacity-20 blur-xl"
        />
        <motion.div
          animate={{ 
            rotate: -360,
            y: [-20, 20, -20],
          }}
          transition={{ 
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-40 right-32 w-24 h-24 rounded-2xl bg-gradient-accent opacity-25 blur-lg rotate-45"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: 180,
          }}
          transition={{ 
            scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 15, repeat: Infinity, ease: "linear" }
          }}
          className="absolute bottom-32 left-32 w-40 h-40 rounded-full bg-gradient-gold opacity-15 blur-2xl"
        />
        <motion.div
          animate={{ 
            x: [-10, 10, -10],
            rotate: 360,
          }}
          transition={{ 
            x: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 12, repeat: Infinity, ease: "linear" }
          }}
          className="absolute bottom-20 right-20 w-28 h-28 rounded-xl bg-brand-accent opacity-30 blur-xl"
        />
      </div>

      {/* Geometric patterns */}
      <div className="absolute inset-0 pattern-dots opacity-10" />

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
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: 0.3, 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 15 
                }}
                className="relative inline-flex items-center justify-center w-20 h-20 mb-6"
              >
                <div className="absolute inset-0 bg-gradient-brand rounded-2xl shadow-glow animate-glow" />
                <div className="relative flex items-center justify-center w-full h-full">
                  <Shield className="w-10 h-10 text-primary-foreground drop-shadow-lg" />
                  <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-brand-gold animate-pulse" />
                </div>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground-secondary bg-clip-text text-transparent mb-2"
              >
                Create Account
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-foreground-muted text-lg"
              >
                Join the premium insurance platform
              </motion.p>
            </div>

            {/* Form */}
            <form onSubmit={handleSignup} className="space-y-6">
              {/* Name Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-2"
              >
                <label className="text-sm font-medium text-foreground-secondary flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-premium w-full pl-12 pr-4 py-4 transition-all duration-300 group-hover:shadow-glass focus:shadow-premium"
                    required
                  />
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-primary transition-colors" />
                </div>
              </motion.div>

              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
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
                transition={{ delay: 0.9 }}
                className="space-y-2"
              >
                <label className="text-sm font-medium text-foreground-secondary flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
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

                {/* Password Strength Indicators */}
                {password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-3 mt-4 p-4 rounded-xl glass border border-glass-border/30"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries({
                        hasLength: "8+ characters",
                        hasUpper: "Uppercase",
                        hasLower: "Lowercase", 
                        hasNumber: "Number"
                      }).map(([key, label]) => (
                        <motion.div
                          key={key}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center gap-2 text-xs"
                        >
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                            passwordStrength[key as keyof typeof passwordStrength] 
                              ? 'bg-success text-success-foreground shadow-sm' 
                              : 'bg-muted border border-border'
                          }`}>
                            {passwordStrength[key as keyof typeof passwordStrength] && (
                              <CheckCircle className="w-3 h-3" />
                            )}
                          </div>
                          <span className={passwordStrength[key as keyof typeof passwordStrength] ? "text-success" : "text-foreground-muted"}>
                            {label}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
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
                transition={{ delay: 1.0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="btn-premium w-full py-4 rounded-xl font-semibold text-primary-foreground transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Star className="w-5 h-5" />
                    Create Account
                  </>
                )}
              </motion.button>
            </form>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="mt-8 text-center"
            >
              <p className="text-foreground-muted">
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className="text-brand-primary font-medium hover:text-brand-accent transition-colors hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </motion.div>
          </div>

          {/* Premium Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-6 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-brand-primary/20 text-sm text-foreground-muted">
              <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
              Premium Insurance Platform
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}