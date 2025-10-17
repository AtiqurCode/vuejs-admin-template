import { ref, computed } from 'vue'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  timestamp: Date
}

export function useNotifications() {
  const notifications = ref<Notification[]>([])
  const showNotifications = ref(false)

  const unreadCount = computed(() => 
    notifications.value.filter(n => !n.read).length
  )

  const toggleNotifications = () => {
    showNotifications.value = !showNotifications.value
  }

  const markAllAsRead = () => {
    notifications.value.forEach(n => n.read = true)
  }

  const clearAllNotifications = () => {
    notifications.value = []
  }

  const markAsRead = (id: string) => {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.read = true
    }
  }

  const deleteNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const formatTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`
    return `${Math.floor(minutes / 1440)}d ago`
  }

  const getNotificationIcon = (type: string) => {
    const icons = {
      info: 'info',
      success: 'check_circle',
      warning: 'warning',
      error: 'error'
    }
    return icons[type as keyof typeof icons] || 'info'
  }

  const enablePushNotifications = () => {
    // Placeholder for push notification logic
    console.log('Push notifications enabled')
  }

  const sendTestNotification = () => {
    const testNotification: Notification = {
      id: Date.now().toString(),
      title: 'Test Notification',
      message: 'This is a test notification to verify the system is working.',
      type: 'info',
      read: false,
      timestamp: new Date()
    }
    notifications.value.unshift(testNotification)
  }

  return {
    notifications,
    showNotifications,
    unreadCount,
    toggleNotifications,
    markAllAsRead,
    clearAllNotifications,
    markAsRead,
    deleteNotification,
    formatTime,
    getNotificationIcon,
    enablePushNotifications,
    sendTestNotification
  }
}