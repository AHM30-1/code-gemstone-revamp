import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Clock, User, Activity, Calendar } from "lucide-react"
import type { HistoryEntry } from "../types/history"

interface HistoryTableProps {
  entries: HistoryEntry[]
}

export default function HistoryTable({ entries }: HistoryTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredEntries = entries.filter(entry => 
    entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.client_ref?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  }

  const getActionIcon = (action: string) => {
    const lowercaseAction = action.toLowerCase()
    if (lowercaseAction.includes('login') || lowercaseAction.includes('auth')) {
      return <User className="w-4 h-4 text-brand-primary" />
    }
    if (lowercaseAction.includes('update') || lowercaseAction.includes('modify')) {
      return <Activity className="w-4 h-4 text-warning" />
    }
    if (lowercaseAction.includes('create') || lowercaseAction.includes('add')) {
      return <Calendar className="w-4 h-4 text-success" />
    }
    return <Clock className="w-4 h-4 text-foreground-muted" />
  }

  const getActionStyle = (action: string) => {
    const lowercaseAction = action.toLowerCase()
    if (lowercaseAction.includes('error') || lowercaseAction.includes('failed')) {
      return "bg-error/20 text-error border-error/30"
    }
    if (lowercaseAction.includes('success') || lowercaseAction.includes('complete')) {
      return "bg-success/20 text-success border-success/30"
    }
    if (lowercaseAction.includes('warning') || lowercaseAction.includes('alert')) {
      return "bg-warning/20 text-warning border-warning/30"
    }
    return "bg-info/20 text-info border-info/30"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-glass-border/30">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Activity History</h2>
          <p className="text-foreground-muted mt-1">{entries.length} entries recorded</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search history..."
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
              <th className="text-left py-3 px-6 text-sm font-medium text-foreground-secondary">Timestamp</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-foreground-secondary">Action</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-foreground-secondary">User</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-foreground-secondary">Client</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-foreground-secondary">Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((entry, index) => {
              const { date, time } = formatDateTime(entry.timestamp)
              
              return (
                <motion.tr
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-glass-border/10 hover:bg-glass-bg/30 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-foreground-muted" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{date}</p>
                        <p className="text-xs text-foreground-muted">{time}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {getActionIcon(entry.action)}
                      <div>
                        <p className="font-medium text-foreground">{entry.action}</p>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs border mt-1 ${getActionStyle(entry.action)}`}>
                          {entry.action.toLowerCase().includes('error') ? 'Error' : 
                           entry.action.toLowerCase().includes('success') ? 'Success' : 
                           entry.action.toLowerCase().includes('warning') ? 'Warning' : 'Info'}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-brand/20 flex items-center justify-center">
                        <User className="w-4 h-4 text-brand-primary" />
                      </div>
                      <span className="text-foreground">{entry.user || 'System'}</span>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    {entry.client_ref ? (
                      <code className="px-2 py-1 rounded bg-muted/50 text-sm font-mono text-foreground">
                        {entry.client_ref}
                      </code>
                    ) : (
                      <span className="text-foreground-muted">N/A</span>
                    )}
                  </td>
                  
                  <td className="py-4 px-6">
                    <p className="text-foreground-muted text-sm max-w-md">
                      {entry.details || 'No additional details'}
                    </p>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
        
        {filteredEntries.length === 0 && (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-foreground-muted mx-auto mb-4" />
            <p className="text-foreground-muted">No history entries found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}