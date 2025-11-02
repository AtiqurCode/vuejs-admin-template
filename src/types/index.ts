// User Types
export interface User {
  id: number
  name: string
  email: string
  role: string
  status: 'Active' | 'Inactive' | 'Pending' | 'Suspended'
  department?: string
  avatar?: string
  phone?: string
  location?: string
  joinDate?: string
  lastActive?: string
  lastActiveDate?: Date | null
  permissions?: string[]
  recentActivity?: Array<{
    id: number
    title: string
    description: string
    time: string
    icon: string
  }>
  createdAt?: Date
  lastLogin?: Date
}

// Calendar Types
export interface CalendarEvent {
  id: string
  title: string
  description: string
  start: Date
  end: Date
  color: string
  time: string
}

// Notification Types
export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  timestamp: Date
}

// Command Palette Types
export interface Command {
  id: string
  title: string
  description: string
  icon: string
  color?: string
  shortcut?: string
  category: string
  action: () => void
}

// Statistics Types
export interface StatCard {
  title: string
  value: string
  icon: string
  color: string
  change: string
  trend?: 'up' | 'down'
  filter?: string
}

