import { useState } from "react"
import { motion } from "framer-motion"
import { Search, AlertTriangle, Clock, Bell, CheckCircle, XCircle } from "lucide-react"
import type { Alert } from "../types/client"

interface AlertTableProps {
  title: string
  alerts: Alert[]
  onUpdateAlert: (alert: Alert) => void
}

export default function AlertTable({ title, alerts, onUpdateAlert }: AlertTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredAlerts = alerts.filter(alert => 
    alert.alert_message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.ref_personne.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.alert_type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'High':
        return <XCircle className="w-4 h-4 text-error" />
      case 'Medium':
        return <AlertTriangle className="w-4 h-4 text-warning" />
      case 'Low':
        return <Bell className="w-4 h-4 text-info" />
      default:
        return <AlertTriangle className="w-4 h-4 text-warning" />
    }
  }

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'High':
        return "bg-error/20 text-error border-error/30"
      case 'Medium':
        return "bg-warning/20 text-warning border-warning/30"
      case 'Low':
        return "bg-info/20 text-info border-info/30"
      default:
        return "bg-warning/20 text-warning border-warning/30"
    }
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-glass-border/30">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
          <p className="text-foreground-muted mt-1">{alerts.length} active alerts</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search alerts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-premium pl-10 pr-4 py-2 w-64"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-glass-border/20">
              <th className="text-left py-3 px-6 text-sm font-medium text-foreground-secondary">Alert</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-foreground-secondary">Client</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-foreground-secondary">Severity</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-foreground-secondary">Product</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-foreground-secondary">Expiry</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-foreground-secondary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlerts.map((alert, index) => (
              <motion.tr
                key={alert.ref_personne + alert.alert_type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-glass-border/10 hover:bg-glass-bg/30 transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getSeverityIcon(alert.alert_severity)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{alert.alert_type}</p>
                      <p className="text-sm text-foreground-muted mt-1 max-w-md">
                        {alert.alert_message}
                      </p>
                    </div>
                  </div>
                </td>
                
                <td className="py-4 px-6">
                  <code className="px-2 py-1 rounded bg-muted/50 text-sm font-mono text-foreground">
                    {alert.ref_personne}
                  </code>
                </td>
                
                <td className="py-4 px-6">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs border ${getSeverityStyle(alert.alert_severity)}`}>
                    {getSeverityIcon(alert.alert_severity)}
                    {alert.alert_severity}
                  </div>
                </td>
                
                <td className="py-4 px-6">
                  <span className="text-foreground">
                    {alert.product || 'N/A'}
                  </span>
                </td>
                
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-foreground-muted" />
                    <div>
                      <p className="text-foreground">{formatDate(alert.expiration_date)}</p>
                      {alert.days_until_expiry !== undefined && (
                        <p className="text-xs text-foreground-muted">
                          {alert.days_until_expiry} days
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-glass p-2 rounded-lg text-success hover:bg-success/10"
                      title="Mark as Resolved"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-glass p-2 rounded-lg text-error hover:bg-error/10"
                      title="Dismiss Alert"
                    >
                      <XCircle className="w-4 h-4" />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        
        {filteredAlerts.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-foreground-muted mx-auto mb-4" />
            <p className="text-foreground-muted">No alerts found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}