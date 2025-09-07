import { useEffect, useState } from "react"
import HistoryTable from "../components/HistoryTable"
import type { HistoryEntry } from "../types/history"
import { motion } from "framer-motion"
import { RefreshCw, Clock, Calendar, Activity, TrendingUp } from "lucide-react"

export default function History() {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_LINK}/history/`)
      if (!res.ok) throw new Error("Failed to fetch history")
      const data = await res.json()
      setHistory(data)
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

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
                <RefreshCw className="w-8 h-8 text-brand-primary animate-spin" />
              </div>
              <div className="absolute -inset-1 bg-gradient-brand rounded-2xl opacity-20 animate-pulse" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-1">Loading History</h3>
              <p className="text-foreground-muted">Retrieving activity logs...</p>
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
            <h3 className="text-xl font-semibold text-error mb-2">Error Loading History</h3>
            <p className="text-error/80 mb-6">{error}</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={fetchHistory}
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

  if (!loading && history.length === 0) {
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
              <div className="w-14 h-14 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-glow">
                <Clock className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground-secondary bg-clip-text text-transparent">
                  Activity History
                </h1>
                <p className="text-foreground-muted">Track all system activities</p>
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
                <Calendar className="w-10 h-10 text-brand-accent" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-3">No History Available</h3>
              <p className="text-foreground-muted leading-relaxed">
                No activity entries found. System activities and user actions will appear here once they occur.
              </p>
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-foreground-muted">
                <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                Monitoring system activities
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

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
              <div className="w-14 h-14 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-glow">
                <Clock className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-gold flex items-center justify-center">
                <TrendingUp className="w-3 h-3 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground-secondary bg-clip-text text-transparent">
                Activity History
              </h1>
              <p className="text-foreground-muted">Complete audit trail of system activities</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card-premium border border-glass-border/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-brand/20 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{history.length}</p>
                  <p className="text-sm text-foreground-muted">Total Entries</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card-premium border border-glass-border/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-accent/20 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-brand-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {new Set(history.map(h => new Date(h.timestamp).toDateString())).size}
                  </p>
                  <p className="text-sm text-foreground-muted">Active Days</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card-premium border border-glass-border/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-gold/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-brand-gold" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {history.length > 0 ? Math.round((Date.now() - new Date(history[0]?.timestamp).getTime()) / (1000 * 60 * 60 * 24)) : 0}
                  </p>
                  <p className="text-sm text-foreground-muted">Days Tracked</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <div className="card-premium border border-glass-border/30 p-0 overflow-hidden">
            <HistoryTable entries={history} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}