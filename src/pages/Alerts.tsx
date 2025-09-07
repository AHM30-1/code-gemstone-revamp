import { useState, useEffect } from "react"
import AlertTable from "../components/AlertTable"
import { useAuth } from "../context/AuthContext"
import type { Alert } from "../types/client"
import { motion } from "framer-motion"
import { RefreshCw, ChevronLeft, ChevronRight, AlertTriangle, Bell, TrendingDown, Activity } from "lucide-react"

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const limit = 10

  const { token } = useAuth()

  const fetchAlerts = async () => {
    setLoading(true)
    setError(null)

    try {
      const url = new URL(`${import.meta.env.VITE_BACKEND_LINK}/alerts`)
      url.searchParams.set("limit", String(limit))
      url.searchParams.set("offset", String(offset))
      url.searchParams.set("include_total", "false")

      const res = await fetch(url.toString(), {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.detail || "Failed to fetch alerts")
      }

      const json = await res.json()
      const items: any[] = json.items ?? []

      const mapped: Alert[] = items.map((it: any) => {
        const ref = it.REF_PERSONNE ?? it.ref_personne ?? ""

        return {
          ref_personne: String(ref),
          type: "alert",
          alert_type: it.alert_type ?? "",
          alert_message: it.alert_message ?? "",
          alert_severity: it.alert_severity ?? "High",
          product: it.product ?? undefined,
          expiration_date: it.expiration_date ?? undefined,
          days_until_expiry: it.days_until_expiry ?? undefined,
        }
      })

      setAlerts(mapped)
      setHasMore(Boolean(json.has_more) || false)
    } catch (err: any) {
      setError(err?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlerts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset, token])

  const updateAlert = (u: Alert) => setAlerts((prev) => prev.map((a) => (a.ref_personne === u.ref_personne ? u : a)))

  if (loading) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        <div className="relative z-10 flex items-center justify-center py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl glass-premium flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-warning animate-spin" />
              </div>
              <div className="absolute -inset-1 bg-gradient-gold rounded-2xl opacity-20 animate-pulse" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-1">Loading Alerts</h3>
              <p className="text-foreground-muted">Scanning for notifications...</p>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden p-6">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        <div className="relative z-10 flex items-center justify-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-premium max-w-md w-full text-center border-error/20"
          >
            <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-error" />
            </div>
            <h3 className="text-xl font-semibold text-error mb-2">Error Loading Alerts</h3>
            <p className="text-error/80 mb-6">{error}</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={fetchAlerts}
              className="btn-glass px-6 py-3 rounded-xl font-medium transition-all hover:shadow-premium"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </motion.button>
          </motion.div>
        </div>
      </div>
    )
  }

  if (!loading && alerts.length === 0) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-20" />
        <div className="absolute inset-0 pattern-dots opacity-5" />
        
        <div className="relative z-10 p-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-gold flex items-center justify-center shadow-glow">
                <Bell className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground-secondary bg-clip-text text-transparent">
                  System Alerts
                </h1>
                <p className="text-foreground-muted">Critical notifications and warnings</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="card-premium max-w-md w-full">
              <div className="w-20 h-20 rounded-3xl bg-gradient-accent/20 flex items-center justify-center mx-auto mb-6">
                <Bell className="w-10 h-10 text-brand-accent" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-3">All Clear</h3>
              <p className="text-foreground-muted leading-relaxed">
                No alerts found. The system is running smoothly and all notifications will appear here when they occur.
              </p>
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-success">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                System monitoring active
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // Calculate alert severity stats
  const severityStats = alerts.reduce((acc, alert) => {
    const severity = alert.alert_severity || 'Medium'
    acc[severity] = (acc[severity] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-20" />
      <div className="absolute inset-0 pattern-grid opacity-5" />
      
      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-gold flex items-center justify-center shadow-glow">
                <AlertTriangle className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-error flex items-center justify-center">
                <Bell className="w-3 h-3 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground-secondary bg-clip-text text-transparent">
                System Alerts
              </h1>
              <p className="text-foreground-muted">Monitor critical notifications and warnings</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card-premium border border-glass-border/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-gold/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-brand-gold" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{alerts.length}</p>
                  <p className="text-sm text-foreground-muted">Total Alerts</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card-premium border border-error/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-error/20 flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-error" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-error">{severityStats.High || 0}</p>
                  <p className="text-sm text-foreground-muted">High Priority</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card-premium border border-warning/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-warning">{severityStats.Medium || 0}</p>
                  <p className="text-sm text-foreground-muted">Medium Priority</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card-premium border border-info/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-info/20 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-info">{severityStats.Low || 0}</p>
                  <p className="text-sm text-foreground-muted">Low Priority</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <div className="card-premium border border-glass-border/30 p-0 overflow-hidden">
            <AlertTable title="Active Alerts" alerts={alerts} onUpdateAlert={updateAlert} />
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-foreground-muted"
            >
              Showing <span className="font-medium text-foreground">{alerts.length}</span> alerts
            </motion.p>
            
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={offset === 0}
                onClick={() => setOffset((prev) => Math.max(0, prev - limit))}
                className="btn-glass flex items-center gap-2 px-4 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!hasMore}
                onClick={() => setOffset((prev) => prev + limit)}
                className="btn-glass flex items-center gap-2 px-4 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}