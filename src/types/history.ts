export interface HistoryEntry {
  id: string
  timestamp: string
  action: string
  user?: string
  details?: string
  client_ref?: string
  [key: string]: any
}