<template>
  <div class="notification-center-wrapper">
    <q-btn
      flat
      dense
      round
      icon="notifications"
      color="dark"
      class="notification-btn"
      @click="toggleNotifications"
    >
      <q-badge
        v-if="unreadCount > 0"
        class="notification-badge"
        floating
        :label="unreadCount > 99 ? '99+' : unreadCount"
      />
    </q-btn>

    <q-menu
      v-model="showNotifications"
      anchor="bottom right"
      self="top right"
      :offset="[0, 12]"
      class="notification-menu"
    >
      <q-card class="notification-center">
        <q-card-section class="row items-center justify-between">
          <div class="text-h6 text-weight-bold">
            <q-icon name="notifications_active" class="q-mr-sm text-primary" />
            Notifications
          </div>
          <div class="row q-gutter-xs">
            <q-btn
              flat
              dense
              round
              icon="mark_email_read"
              color="primary"
              size="sm"
              @click="markAllAsRead"
              :disable="unreadCount === 0"
              class="modern-btn"
            >
              <q-tooltip>Mark all as read</q-tooltip>
            </q-btn>
            <q-btn
              flat
              dense
              round
              icon="clear_all"
              color="negative"
              size="sm"
              @click="clearAllNotifications"
              :disable="notifications.length === 0"
              class="modern-btn"
            >
              <q-tooltip>Clear all</q-tooltip>
            </q-btn>
          </div>
        </q-card-section>

        <q-separator class="q-mx-md" />

        <q-card-section class="q-pa-none" style="max-height: 400px; overflow-y: auto;">
          <div v-if="notifications.length === 0" class="q-pa-lg text-center text-grey-6">
            <div class="column items-center q-gutter-md">
              <q-icon name="notifications_none" size="4rem" class="text-grey-4" />
              <div class="text-h6 text-weight-medium">No notifications yet</div>
              <div class="text-body2">You're all caught up! 🎉</div>
            </div>
          </div>

          <q-list v-else separator>
            <q-item
              v-for="notification in notifications"
              :key="notification.id"
              clickable
              class="notification-item"
              :class="{ 'unread': !notification.read }"
              @click="markAsRead(notification.id)"
            >
              <div class="full-width">
                <div class="row items-start no-wrap">
                  <q-avatar 
                    :color="getNotificationColor(notification.type)" 
                    text-color="white" 
                    size="md"
                    class="q-mr-md"
                  >
                    <q-icon :name="getNotificationIcon(notification.type)" />
                  </q-avatar>

                  <div class="col">
                    <div class="text-body1 text-weight-bold q-mb-xs">{{ notification.title }}</div>
                    <div class="text-body2 text-grey-7 q-mb-sm" style="line-height: 1.4;">{{ notification.message }}</div>
                    <div class="text-caption text-grey-5">
                      <q-icon name="schedule" size="xs" class="q-mr-xs" />
                      {{ formatTime(notification.timestamp) }}
                    </div>
                  </div>

                  <div class="column items-center q-gutter-xs q-ml-md">
                    <q-badge 
                      v-if="!notification.read" 
                      color="primary" 
                      rounded 
                      class="notification-unread-badge"
                    />
                    <q-btn
                      flat
                      dense
                      round
                      icon="close"
                      size="xs"
                      color="grey-6"
                      class="notification-delete-btn"
                      @click.stop="deleteNotification(notification.id)"
                    >
                      <q-tooltip>Delete notification</q-tooltip>
                    </q-btn>
                  </div>
                </div>
              </div>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator class="q-mx-md" />

        <q-card-section class="q-pa-md">
          <div class="row q-gutter-sm">
            <q-btn
              flat
              icon="notifications_active"
              label="Enable Push"
              color="primary"
              class="modern-btn col"
              @click="enablePushNotifications"
            />
            <q-btn
              flat
              icon="send"
              label="Send Test"
              color="secondary"
              class="modern-btn col"
              @click="sendTestNotification"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-menu>
  </div>
</template>

<script setup lang="ts">
import { useNotifications } from '../composables/useNotifications'

const {
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
} = useNotifications()

const getNotificationColor = (type: string) => {
  const colors = {
    info: 'blue-6',
    success: 'green-6',
    warning: 'orange-6',
    error: 'red-6'
  }
  return colors[type as keyof typeof colors] || 'blue'
}
</script>

<style>
.notification-center-wrapper {
  position: relative;
}

.notification-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.notification-btn:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.1);
}

.notification-menu .q-menu {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.notification-center {
  min-width: 380px;
  max-width: 420px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.notification-item {
  padding: 16px;
  margin: 8px;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.notification-item:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: scale(1.02);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.notification-item.unread {
  border-left: 4px solid var(--primary-color);
  background: rgba(30, 64, 175, 0.1);
}

.notification-item.unread:hover {
  background: rgba(30, 64, 175, 0.15);
}

.notification-unread-badge {
  animation: pulse 2s infinite;
}

.notification-delete-btn {
  opacity: 0.6;
  transition: all 0.3s ease;
}

.notification-delete-btn:hover {
  opacity: 1;
  background: rgba(220, 38, 38, 0.1);
  color: var(--error-color);
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}

/* Custom scrollbar for notifications */
.q-card-section::-webkit-scrollbar {
  width: 6px;
}

.q-card-section::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.q-card-section::-webkit-scrollbar-thumb {
  background: rgba(30, 64, 175, 0.3);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.q-card-section::-webkit-scrollbar-thumb:hover {
  background: rgba(30, 64, 175, 0.5);
}
</style>