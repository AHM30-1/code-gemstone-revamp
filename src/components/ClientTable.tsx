import { useState } from "react"
import { motion } from "framer-motion"
import { Filter, Search, MessageCircle, User, Building2, TrendingUp, MoreHorizontal } from "lucide-react"
import type { Client } from "../types/client"

interface ClientTableProps {
  title: string
  clients: Client[]
  onUpdateClient: (client: Client) => void
  onMessageSent: (ref: string) => void
  onApplyFilters: (filters: any) => void
  currentFilters: any
}

export default function ClientTable({ 
  title, 
  clients, 
  onUpdateClient, 
  onMessageSent, 
  onApplyFilters, 
  currentFilters 
}: ClientTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const filteredClients = clients.filter(client => 
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.ref_personne.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getScoreColor = (score?: number) => {
    if (!score) return "text-foreground-muted"
    if (score >= 80) return "text-success"
    if (score >= 60) return "text-warning"
    return "text-error"
  }

  const getScoreBadge = (score?: number) => {
    if (!score) return "bg-muted"
    if (score >= 80) return "bg-success/20 text-success border-success/30"
    if (score >= 60) return "bg-warning/20 text-warning border-warning/30"
    return "bg-error/20 text-error border-error/30"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-glass-border/30">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
          <p className="text-foreground-muted mt-1">{clients.length} clients loaded</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-muted" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-premium pl-10 pr-4 py-2 w-64"
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilters(!showFilters)}
            className="btn-glass px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </motion.button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-glass-border/20">
              <th className="text-left py-3 px-6 text-sm font-medium text-foreground-secondary">Client</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-foreground-secondary">Reference</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-foreground-secondary">Score</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-foreground-secondary">Type</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-foreground-secondary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client, index) => (
              <motion.tr
                key={client.ref_personne}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-glass-border/10 hover:bg-glass-bg/30 transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-brand/20 flex items-center justify-center">
                      {client.type === 'moral' ? (
                        <Building2 className="w-5 h-5 text-brand-primary" />
                      ) : (
                        <User className="w-5 h-5 text-brand-accent" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{client.name || 'Unknown'}</p>
                      <p className="text-sm text-foreground-muted">{client.segment || 'N/A'}</p>
                    </div>
                  </div>
                </td>
                
                <td className="py-4 px-6">
                  <code className="px-2 py-1 rounded bg-muted/50 text-sm font-mono text-foreground">
                    {client.ref_personne}
                  </code>
                </td>
                
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-semibold ${getScoreColor(client.score)}`}>
                      {client.score || 'N/A'}
                    </span>
                    {client.score && (
                      <div className={`px-2 py-1 rounded-full text-xs border ${getScoreBadge(client.score)}`}>
                        {client.score >= 80 ? 'High' : client.score >= 60 ? 'Medium' : 'Low'}
                      </div>
                    )}
                  </div>
                </td>
                
                <td className="py-4 px-6">
                  <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs border ${
                    client.type === 'moral' 
                      ? 'bg-brand-primary/20 text-brand-primary border-brand-primary/30'
                      : 'bg-brand-accent/20 text-brand-accent border-brand-accent/30'
                  }`}>
                    {client.type === 'moral' ? <Building2 className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    {client.type === 'moral' ? 'Corporate' : 'Individual'}
                  </div>
                </td>
                
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onMessageSent(client.ref_personne)}
                      className="btn-glass p-2 rounded-lg"
                      title="Send Message"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-glass p-2 rounded-lg"
                      title="More Actions"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        
        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <TrendingUp className="w-12 h-12 text-foreground-muted mx-auto mb-4" />
            <p className="text-foreground-muted">No clients found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}