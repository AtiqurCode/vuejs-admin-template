<template>
  <div id="q-app">
    <!-- Authentication Modal -->
    <AuthModal @authenticated="handleAuthentication" ref="authModal" />

    <q-layout view="lHh Lpr lFf" class="modern-layout">
      <q-header class="modern-header">
        <q-toolbar>
          <q-btn
            flat
            dense
            round
            icon="menu"
            color="white"
            aria-label="Menu"
            @click="toggleLeftDrawer"
            class="q-mr-md"
          />

          <q-toolbar-title class="header-title">
            <div class="row items-center">
              <q-icon name="dashboard" class="q-mr-sm" size="md" />
              <span class="text-h5 text-weight-bold">Dashboard</span>
            </div>
          </q-toolbar-title>

          <div class="row items-center q-gutter-md">
            <NotificationCenter />

            <q-btn
              flat
              dense
              round
              icon="send"
              color="white"
              aria-label="Send notification"
              @click="showSendNotificationDialog = true"
              class="modern-btn"
            />

            <!-- User Profile Menu -->
            <q-btn-dropdown
              flat
              dense
              round
              color="white"
              class="modern-btn"
              @before-show="checkAuthBeforeShow"
            >
              <template v-slot:label>
                <q-avatar size="32px">
                  <img v-if="user?.user_metadata?.avatar_url" :src="user.user_metadata.avatar_url" />
                  <q-icon v-else name="person" />
                </q-avatar>
              </template>

              <q-list>
                <q-item clickable v-close-popup>
                  <q-item-section avatar>
                    <q-icon name="person" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ user?.email || 'Profile' }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="handleLogout">
                  <q-item-section avatar>
                    <q-icon name="logout" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Logout</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="leftDrawerOpen"
        show-if-above
        class="modern-sidebar"
        :width="280"
      >
        
        <q-list class="q-px-md">
          <q-item-label header class="text-weight-medium q-mb-md">
            <q-icon name="menu" class="q-mr-sm" />
            Main Menu
          </q-item-label>

          <q-item
            v-for="item in menuItems"
            :key="item.label"
            clickable
            v-ripple
            class="sidebar-item text-white"
            :active="activeItem === item.label"
            @click="setActiveItem(item.label)"
          >
            <q-item-section avatar>
              <q-icon :name="item.icon" size="md" />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-weight-medium">{{ item.label }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-drawer>

      <q-page-container>
        <q-page class="q-pa-lg" style="background: transparent;" v-if="activeItem === 'Dashboard'">
          <!-- Statistics Cards Row -->
          <div class="row q-col-gutter-md q-mb-lg">
            <div class="col-12 col-sm-6 col-md-3" v-for="stat in stats" :key="stat.title">
              <q-card class="stat-card q-pa-md">
                <q-card-section class="q-pa-md">
                  <div class="row items-center no-wrap">
                    <div class="col">
                      <div class="stat-value text-h4">{{ stat.value }}</div>
                      <div class="text-subtitle2 text-grey-7 text-weight-medium q-mt-xs">{{ stat.title }}</div>
                      <div class="text-caption text-positive q-mt-xs">
                        <q-icon name="trending_up" class="q-mr-xs" />
                        {{ stat.change }}
                      </div>
                    </div>
                    <div class="col-auto">
                      <div class="stat-icon">
                        <q-icon :name="stat.icon" size="1.5rem" />
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- Main Content Row -->
          <div class="row q-col-gutter-md">
            <!-- User Management - Full Width on Mobile, 8 cols on Desktop -->
            <div class="col-12 col-lg-8">
              <q-card class="content-card">
                <q-card-section>
                  <div class="row items-center justify-between">
                    <div class="text-h5 text-weight-bold q-mb-md">
                      <q-icon name="people" class="q-mr-sm text-primary" />
                      User Management
                    </div>
                    <q-btn
                      color="primary"
                      icon="add"
                      label="Add User"
                      class="modern-btn btn-primary"
                      @click="showAddUserDialog = true"
                    />
                  </div>
                </q-card-section>
                <q-card-section>
                  <q-table
                    :rows="users"
                    :columns="columns"
                    row-key="id"
                    :pagination="{ rowsPerPage: 5 }"
                    class="modern-table"
                    flat
                    bordered
                    :rows-per-page-options="[5, 10, 15, 20]"
                  >
                    <template v-slot:body-cell-status="props">
                      <q-td :props="props">
                        <q-chip
                          :class="props.value === 'Active' ? 'status-active' : 'status-inactive'"
                          :label="props.value"
                          class="status-chip"
                        />
                      </q-td>
                    </template>
                    <template v-slot:body-cell-actions="props">
                      <q-td :props="props">
                        <div class="q-gutter-xs">
                          <q-btn
                            flat
                            dense
                            round
                            icon="edit"
                            size="sm"
                            color="primary"
                            class="modern-btn"
                            @click="editUser(props.row)"
                          />
                          <q-btn
                            flat
                            dense
                            round
                            icon="delete"
                            size="sm"
                            color="negative"
                            class="modern-btn"
                            @click="deleteUser(props.row)"
                          />
                        </div>
                      </q-td>
                    </template>
                  </q-table>
                </q-card-section>
              </q-card>
            </div>

            <!-- Side Panel - Quick Actions and Recent Activity -->
            <div class="col-12 col-lg-4">
              <div class="column q-gutter-md">
                <!-- Quick Actions -->
                <q-card class="content-card">
                  <q-card-section>
                    <div class="text-h6 text-weight-bold q-mb-md">
                      <q-icon name="flash_on" class="q-mr-sm text-primary" />
                      Quick Actions
                    </div>
                    <div class="column q-gutter-sm">
                      <q-btn
                        icon="refresh"
                        label="Refresh Data"
                        class="modern-btn btn-primary full-width"
                        @click="refreshData"
                        size="sm"
                      />
                      <q-btn
                        icon="download"
                        label="Export Report"
                        class="modern-btn btn-secondary full-width"
                        @click="exportReport"
                        size="sm"
                      />
                    </div>
                  </q-card-section>
                </q-card>

                <!-- Recent Activity -->
                <q-card class="content-card">
                  <q-card-section>
                    <div class="text-h6 text-weight-bold q-mb-md">
                      <q-icon name="history" class="q-mr-sm text-primary" />
                      Recent Activity
                    </div>
                    <div class="column q-gutter-xs">
                      <q-item v-for="activity in recentActivities" :key="activity.id" class="q-pa-none">
                        <div class="activity-item full-width">
                          <div class="row items-center no-wrap">
                            <q-avatar :color="activity.color" text-color="white" :icon="activity.icon" size="sm" class="q-mr-sm" />
                            <div class="col">
                              <div class="text-body2 text-weight-medium">{{ activity.title }}</div>
                              <div class="text-caption text-grey-6">{{ activity.time }}</div>
                            </div>
                          </div>
                        </div>
                      </q-item>
                    </div>
                  </q-card-section>
                </q-card>
                  </div>
            </div>
          </div>
        </q-page>
        
        <!-- Users Page -->
        <q-page style="background: transparent;" v-else-if="activeItem === 'Users'">
          <UsersPage />
        </q-page>
        
        <!-- Other Pages Placeholder -->
        <q-page style="background: transparent;" v-else-if="activeItem === 'Settings'">
          <SettingsPage />
        </q-page>
        
        <!-- Reports Page -->
        <q-page style="background: transparent;" v-else-if="activeItem === 'Reports'">
          <ReportsPage />
        </q-page>
        
        <!-- Other Pages Placeholder -->
        <q-page class="q-pa-lg" style="background: transparent;" v-else>
          <div class="text-center q-mt-xl">
            <q-icon name="construction" size="4rem" class="text-grey-4 q-mb-md" />
            <div class="text-h4 text-weight-bold text-grey-6 q-mb-sm">{{ activeItem }}</div>
            <div class="text-subtitle1 text-grey-5">This page is under construction</div>
          </div>
        </q-page>
      </q-page-container>
    </q-layout>

    <!-- Add User Dialog -->
    <q-dialog v-model="showAddUserDialog" class="modern-dialog">
      <q-card class="content-card" style="min-width: 500px; max-width: 600px;">
        <q-card-section>
          <div class="text-h5 text-weight-bold">
            <q-icon name="person_add" class="q-mr-sm text-primary" />
            Add New User
          </div>
          <div class="text-subtitle2 text-grey-6 q-mt-sm">
            Create a new user account with the details below
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="column q-gutter-md">
            <q-input
              v-model="newUser.name"
              label="Full Name"
              outlined
              class="modern-input"
              :rules="[val => !!val || 'Name is required']"
            />
            <q-input
              v-model="newUser.email"
              label="Email Address"
              type="email"
              outlined
              class="modern-input"
              :rules="[val => !!val || 'Email is required']"
            />
            <q-select
              v-model="newUser.role"
              :options="roleOptions"
              label="User Role"
              outlined
              class="modern-input"
              :rules="[val => !!val || 'Role is required']"
            />
            <div class="row items-center">
              <q-toggle
                v-model="newUser.active"
                label="Active Status"
                color="primary"
                class="text-weight-medium"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-lg q-gutter-md">
          <q-btn 
            flat 
            label="Cancel" 
            class="modern-btn" 
            @click="showAddUserDialog = false" 
          />
          <q-btn 
            label="Add User" 
            class="modern-btn btn-primary" 
            @click="addUser" 
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Send Notification Dialog -->
    <q-dialog v-model="showSendNotificationDialog" class="modern-dialog">
      <q-card class="content-card notification-form-card">
        <q-card-section>
          <div class="text-h5 text-weight-bold">
            <q-icon name="notifications_active" class="q-mr-sm text-primary" />
            Send Push Notification
          </div>
          <div class="text-subtitle2 text-grey-6 q-mt-sm">
            Broadcast a notification to all users instantly
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="column q-gutter-md">
            <q-input
              v-model="notificationForm.title"
              label="Notification Title"
              outlined
              class="modern-input"
              :rules="[val => !!val || 'Title is required']"
            />
            <q-input
              v-model="notificationForm.message"
              label="Message Content"
              type="textarea"
              outlined
              :rows="$q.screen.xs ? 3 : 4"
              class="modern-input"
              :rules="[val => !!val || 'Message is required']"
            />
            <q-select
              v-model="notificationForm.type"
              :options="notificationTypeOptions"
              label="Notification Type"
              outlined
              class="modern-input"
            />
          </div>
        </q-card-section>

        <q-card-actions :align="$q.screen.xs ? 'center' : 'right'" class="q-pa-lg q-gutter-md">
          <div :class="$q.screen.xs ? 'column q-gutter-sm full-width' : 'row q-gutter-md'">
            <q-btn 
              flat 
              label="Cancel" 
              :class="$q.screen.xs ? 'modern-btn full-width' : 'modern-btn'" 
              @click="showSendNotificationDialog = false" 
            />
            <q-btn 
              label="Send Notification" 
              icon="send"
              :class="$q.screen.xs ? 'modern-btn btn-primary full-width' : 'modern-btn btn-primary'" 
              @click="sendGlobalNotification" 
              :loading="sendingNotification" 
            />
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import NotificationCenter from './components/NotificationCenter.vue'
import AuthModal from './components/AuthModal.vue'
import UsersPage from './components/UsersPage.vue'
import SettingsPage from './components/SettingsPage.vue'
import ReportsPage from './components/ReportsPage.vue'
import { supabase } from './lib/supabase'

const $q = useQuasar()

const leftDrawerOpen = ref(false)
const activeItem = ref('Dashboard')
const showAddUserDialog = ref(false)
const showSendNotificationDialog = ref(false)
const sendingNotification = ref(false)
const user = ref({ email: 'demo@example.com', id: 'demo-user' })
const authModal = ref(null)

const newUser = ref({
  name: '',
  email: '',
  role: '',
  active: true
})

const notificationForm = ref({
  title: '',
  message: '',
  type: 'info'
})

const notificationTypeOptions = [
  { label: 'Information', value: 'info' },
  { label: 'Success', value: 'success' },
  { label: 'Warning', value: 'warning' },
  { label: 'Error', value: 'error' }
]

const roleOptions = ['Admin', 'User', 'Manager', 'Editor']

const menuItems = [
  { label: 'Dashboard', icon: 'dashboard' },
  { label: 'Users', icon: 'people' },
  { label: 'Reports', icon: 'assessment' },
  { label: 'Settings', icon: 'settings' },
]

const stats = [
  { title: 'Total Users', value: '2,543', icon: 'people', color: 'primary', change: '+12.5%' },
  { title: 'Active Users', value: '2,234', icon: 'online_prediction', color: 'positive', change: '+8.2%' },
  { title: 'Revenue', value: '$12,345', icon: 'monetization_on', color: 'accent', change: '+23.1%' },
  { title: 'Growth Rate', value: '+15.3%', icon: 'trending_up', color: 'secondary', change: '+5.7%' }
]

const columns = [
  { name: 'name', required: true, label: 'Name', align: 'left', field: 'name', sortable: true },
  { name: 'email', align: 'left', label: 'Email', field: 'email', sortable: true },
  { name: 'role', align: 'left', label: 'Role', field: 'role', sortable: true },
  { name: 'status', align: 'center', label: 'Status', field: 'status', sortable: true },
  { name: 'actions', align: 'center', label: 'Actions', field: 'actions' }
]

const users = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager', status: 'Inactive' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Editor', status: 'Active' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'User', status: 'Active' }
])

const recentActivities = [
  { id: 1, title: 'User John Doe logged in', time: '2 minutes ago', icon: 'login', color: 'positive' },
  { id: 2, title: 'New user registered', time: '5 minutes ago', icon: 'person_add', color: 'primary' },
  { id: 3, title: 'Report generated', time: '10 minutes ago', icon: 'description', color: 'secondary' },
  { id: 4, title: 'System backup completed', time: '1 hour ago', icon: 'backup', color: 'accent' }
]

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const setActiveItem = (item: string) => {
  activeItem.value = item
}

const checkAuthBeforeShow = async () => {
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  if (!currentUser) {
    authModal.value?.show()
    return false
  }
  return true
}

const addUser = () => {
  if (newUser.value.name && newUser.value.email && newUser.value.role) {
    const newId = Math.max(...users.value.map(u => u.id)) + 1
    users.value.push({
      id: newId,
      name: newUser.value.name,
      email: newUser.value.email,
      role: newUser.value.role,
      status: newUser.value.active ? 'Active' : 'Inactive'
    })
    
    // Reset form
    newUser.value = { name: '', email: '', role: '', active: true }
    showAddUserDialog.value = false
    
    $q.notify({
      type: 'positive',
      message: 'User added successfully!',
      icon: 'check_circle'
    })
  } else {
    $q.notify({
      type: 'negative',
      message: 'Please fill in all required fields',
      icon: 'error'
    })
  }
}

const editUser = (user: any) => {
  $q.notify({
    message: `Edit user: ${user.name}`,
    icon: 'edit',
    timeout: 1000
  })
}

const deleteUser = (user: any) => {
  $q.dialog({
    title: 'Confirm Delete',
    message: `Are you sure you want to delete ${user.name}?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    const index = users.value.findIndex(u => u.id === user.id)
    if (index > -1) {
      users.value.splice(index, 1)
      $q.notify({
        type: 'positive',
        message: 'User deleted successfully!',
        icon: 'delete'
      })
    }
  })
}

const refreshData = () => {
  $q.loading.show({
    message: 'Refreshing data...'
  })
  
  setTimeout(() => {
    $q.loading.hide()
    $q.notify({
      type: 'positive',
      message: 'Data refreshed successfully!',
      icon: 'refresh'
    })
  }, 1500)
}

const exportReport = () => {
  $q.notify({
    type: 'positive',
    message: 'Report export started successfully!',
    icon: 'download',
    timeout: 2000
  })
}

const sendGlobalNotification = async () => {
  if (!notificationForm.value.title || !notificationForm.value.message) {
    $q.notify({
      type: 'negative',
      message: 'Please fill in title and message',
      icon: 'error'
    })
    return
  }
  
  sendingNotification.value = true
  console.log('🚀 Sending global notification...')
  
  try {
    // Create a global notification that will be received by all users
    const notification = {
      id: Date.now().toString(),
      title: notificationForm.value.title,
      message: notificationForm.value.message,
      type: notificationForm.value.type,
      timestamp: new Date().toISOString()
    }
    
    console.log('📝 Created notification:', notification)
    
    // Store in localStorage for persistence
    const existingNotifications = JSON.parse(localStorage.getItem('globalNotifications') || '[]')
    existingNotifications.unshift(notification)
    localStorage.setItem('globalNotifications', JSON.stringify(existingNotifications.slice(0, 50))) // Keep last 50
    
    console.log('💾 Stored in localStorage, total notifications:', existingNotifications.length)
    
    // Send browser push notification to all users
    if (Notification.permission === 'granted') {
      console.log('🔔 Showing browser notification')
      new Notification(notification.title, {
        body: notification.message,
        icon: '/vite.svg',
        badge: '/vite.svg'
      })
    } else {
      console.log('❌ Browser notification permission not granted')
    }
    
    // Broadcast to all open tabs/windows
    console.log('📡 Broadcasting to other tabs...')
    const channel = new BroadcastChannel('notifications')
    channel.postMessage(notification)
    channel.close()
    
    console.log('✅ Notification sent successfully')
    
    // Reset form
    notificationForm.value = { title: '', message: '', type: 'info' }
    showSendNotificationDialog.value = false
    
    $q.notify({
      type: 'positive',
      message: 'Notification sent to all users!',
      icon: 'send'
    })
  } catch (error) {
    console.error('❌ Error sending notification:', error)
    $q.notify({
      type: 'negative',
      message: 'Failed to send notification',
      icon: 'error'
    })
  } finally {
    sendingNotification.value = false
  }
}

const handleAuthentication = (authenticatedUser: any) => {
  user.value = authenticatedUser
  $q.notify({
    type: 'positive',
    message: 'Successfully authenticated!',
    icon: 'check_circle'
  })
}

const handleLogout = async () => {
  try {
    await supabase.auth.signOut()
    user.value = null
    $q.notify({
      type: 'positive',
      message: 'Logged out successfully',
      icon: 'logout'
    })
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: 'Error logging out',
      icon: 'error'
    })
  }
}

const checkAuthStatus = async () => {
  // Start with demo user, only check auth when needed
  user.value = { email: 'demo@example.com', id: 'demo-user' }
}

onMounted(() => {
  checkAuthStatus()
  
  $q.notify({
    type: 'positive',
    message: 'Welcome to Dashboard! 🚀',
    timeout: 3000
  })

  // Listen for auth changes
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
      user.value = { email: 'demo@example.com', id: 'demo-user' }
    } else if (event === 'SIGNED_IN' && session?.user) {
      user.value = session.user
    }
  })
})
</script>

<style scoped>
.modern-layout {
  min-height: 100vh;
}

.modern-dialog .q-dialog__inner {
  padding: 16px;
}

.modern-dialog .q-card {
  max-height: 90vh;
  overflow-y: auto;
}

/* Custom animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-card {
  animation: fadeInUp 0.6s ease-out;
}

.content-card {
  animation: fadeInUp 0.8s ease-out;
}

.activity-item {
  animation: fadeInUp 1s ease-out;
}
</style>