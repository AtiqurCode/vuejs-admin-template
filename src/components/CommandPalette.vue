<template>
  <q-dialog v-model="show" @hide="handleClose" class="command-palette-dialog">
    <q-card class="command-palette-card">
      <q-card-section class="q-pa-none">
        <div class="command-palette-header">
          <q-icon name="search" size="md" class="q-mr-sm text-grey-6" />
          <q-input
            v-model="searchQuery"
            placeholder="Type a command or search..."
            autofocus
            borderless
            class="command-input"
            @keydown="handleKeyDown"
          >
            <template v-slot:append>
              <kbd class="keyboard-shortcut">⌘K</kbd>
            </template>
          </q-input>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-none" style="max-height: 400px; overflow-y: auto;">
        <q-list v-if="filteredCommands.length > 0" class="command-list">
          <q-item
            v-for="(command, index) in filteredCommands"
            :key="command.id"
            clickable
            :class="{ 'command-item-active': index === selectedIndex }"
            @click="executeCommand(command)"
            @mouseenter="selectedIndex = index"
          >
            <q-item-section avatar>
              <q-icon :name="command.icon" :color="command.color || 'primary'" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="command-title">{{ command.title }}</q-item-label>
              <q-item-label caption class="command-description">{{ command.description }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <kbd v-if="command.shortcut" class="command-shortcut">{{ command.shortcut }}</kbd>
            </q-item-section>
          </q-item>
        </q-list>

        <div v-else class="q-pa-lg text-center text-grey-6">
          <q-icon name="search_off" size="3rem" class="q-mb-md text-grey-4" />
          <div class="text-body1">No commands found</div>
          <div class="text-caption q-mt-xs">Try searching for something else</div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="command-footer">
        <div class="row q-gutter-md text-caption text-grey-6">
          <div class="row items-center q-gutter-xs">
            <kbd>↑↓</kbd>
            <span>Navigate</span>
          </div>
          <div class="row items-center q-gutter-xs">
            <kbd>Enter</kbd>
            <span>Select</span>
          </div>
          <div class="row items-center q-gutter-xs">
            <kbd>Esc</kbd>
            <span>Close</span>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

interface Command {
  id: string
  title: string
  description: string
  icon: string
  color?: string
  shortcut?: string
  category: string
  action: () => void
}

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'navigate': [page: string]
}>()

const show = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const searchQuery = ref('')
const selectedIndex = ref(0)

const commands: Command[] = [
  // Navigation
  { id: 'nav-dashboard', title: 'Go to Dashboard', description: 'Navigate to dashboard', icon: 'dashboard', category: 'Navigation', action: () => navigateTo('Dashboard') },
  { id: 'nav-users', title: 'Go to Users', description: 'Navigate to user management', icon: 'people', category: 'Navigation', action: () => navigateTo('Users') },
  { id: 'nav-reports', title: 'Go to Reports', description: 'Navigate to reports page', icon: 'assessment', category: 'Navigation', action: () => navigateTo('Reports') },
  { id: 'nav-settings', title: 'Go to Settings', description: 'Navigate to settings', icon: 'settings', category: 'Navigation', action: () => navigateTo('Settings') },
  { id: 'nav-calendar', title: 'Go to Calendar', description: 'Navigate to calendar', icon: 'calendar_month', category: 'Navigation', action: () => navigateTo('Calendar') },
  
  // User Actions
  { id: 'user-add', title: 'Add New User', description: 'Create a new user account', icon: 'person_add', category: 'Users', action: () => { navigateTo('Users'); setTimeout(() => $q.notify({ message: 'Opening add user dialog...', type: 'info' }), 100) } },
  { id: 'user-search', title: 'Search Users', description: 'Search through all users', icon: 'search', category: 'Users', action: () => { navigateTo('Users'); $q.notify({ message: 'Use the search bar to find users', type: 'info' }) } },
  
  // Quick Actions
  { id: 'action-refresh', title: 'Refresh Data', description: 'Refresh current page data', icon: 'refresh', category: 'Actions', action: () => $q.notify({ message: 'Data refreshed', type: 'positive', icon: 'refresh' }) },
  { id: 'action-export', title: 'Export Data', description: 'Export current data', icon: 'download', category: 'Actions', action: () => $q.notify({ message: 'Exporting data...', type: 'info', icon: 'download' }) },
  { id: 'action-notify', title: 'Send Notification', description: 'Send a notification', icon: 'send', category: 'Actions', action: () => $q.notify({ message: 'Opening notification dialog...', type: 'info' }) },
  
  // System
  { id: 'system-settings', title: 'Open Settings', description: 'Open application settings', icon: 'settings', category: 'System', action: () => navigateTo('Settings') },
  { id: 'system-profile', title: 'View Profile', description: 'View your profile', icon: 'person', category: 'System', action: () => { navigateTo('Settings'); $q.notify({ message: 'Viewing profile', type: 'info' }) } },
  { id: 'system-logout', title: 'Logout', description: 'Sign out of your account', icon: 'logout', category: 'System', action: () => $q.notify({ message: 'Logging out...', type: 'info', icon: 'logout' }) },
]

const filteredCommands = computed(() => {
  if (!searchQuery.value.trim()) {
    return commands.slice(0, 8) // Show top 8 when no search
  }
  
  const query = searchQuery.value.toLowerCase()
  return commands.filter(cmd => 
    cmd.title.toLowerCase().includes(query) ||
    cmd.description.toLowerCase().includes(query) ||
    cmd.category.toLowerCase().includes(query)
  )
})

const navigateTo = (page: string) => {
  // Emit event to parent to navigate
  emit('navigate', page)
  show.value = false
}

const executeCommand = (command: Command) => {
  command.action()
  show.value = false
  searchQuery.value = ''
  selectedIndex.value = 0
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    selectedIndex.value = Math.min(selectedIndex.value + 1, filteredCommands.value.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    if (filteredCommands.value[selectedIndex.value]) {
      executeCommand(filteredCommands.value[selectedIndex.value])
    }
  } else if (e.key === 'Escape') {
    show.value = false
  }
}

const handleClose = () => {
  searchQuery.value = ''
  selectedIndex.value = 0
}

watch(searchQuery, () => {
  selectedIndex.value = 0
})

// Keyboard shortcut listener
const handleKeyboardShortcut = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    show.value = !show.value
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyboardShortcut)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyboardShortcut)
})

defineExpose({
  open: () => { show.value = true },
  close: () => { show.value = false }
})
</script>

<style scoped>
.command-palette-dialog .q-dialog__inner {
  padding: 0;
}

.command-palette-card {
  width: 600px;
  max-width: 90vw;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.command-palette-header {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 1);
}

.command-input {
  flex: 1;
  font-size: 1rem;
}

.command-input :deep(.q-field__control) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.keyboard-shortcut {
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 0.75rem;
  font-family: monospace;
  color: var(--text-light);
}

.command-list {
  padding: 8px;
}

.command-item-active {
  background: rgba(30, 64, 175, 0.08) !important;
  border-radius: 8px;
}

.command-title {
  font-weight: 600;
  color: var(--text-dark);
}

.command-description {
  color: var(--text-light);
  font-size: 0.875rem;
}

.command-shortcut {
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 0.7rem;
  font-family: monospace;
  color: var(--text-light);
}

.command-footer {
  padding: 12px 20px;
  background: rgba(0, 0, 0, 0.02);
}

kbd {
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 0.7rem;
  font-family: monospace;
  color: var(--text-dark);
}
</style>

