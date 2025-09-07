export interface Client {
  ref_personne: string
  type: "moral" | "physique"
  name?: string
  score?: number
  segment?: string
  risk?: string
  lastContact?: string
  [key: string]: any
}

export interface Alert {
  ref_personne: string
  type: "alert"
  alert_type: string
  alert_message: string
  alert_severity: "High" | "Medium" | "Low"
  product?: string
  expiration_date?: string
  days_until_expiry?: number
}