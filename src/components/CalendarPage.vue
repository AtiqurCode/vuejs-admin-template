<template>
  <div class="calendar-page">
    <!-- Page Header -->
    <div class="page-header q-mb-lg">
      <div class="row items-center justify-between">
        <div>
          <div class="text-h4 text-weight-bold q-mb-sm">
            <q-icon name="calendar_month" class="q-mr-sm page-title-icon" />
            Calendar
          </div>
          <div class="text-subtitle1 page-subtitle">
            Manage your events and schedule
          </div>
        </div>
        <div class="row q-gutter-sm">
          <q-btn
            color="primary"
            icon="today"
            :label="todayLabel"
            class="modern-btn btn-primary"
            @click="goToToday"
          />
          <q-btn
            color="primary"
            icon="add"
            label="New Event"
            class="modern-btn btn-primary"
            @click="showAddEventDialog = true"
          />
        </div>
      </div>
    </div>

    <!-- Calendar Controls -->
    <q-card class="content-card q-mb-md">
      <q-card-section>
        <div class="row items-center justify-between">
          <div class="row items-center q-gutter-md">
            <q-btn
              flat
              round
              icon="chevron_left"
              @click="previousPeriod"
              class="modern-btn"
            />
            <div class="text-h6 text-weight-bold calendar-title">
              {{ currentPeriodLabel }}
            </div>
            <q-btn
              flat
              round
              icon="chevron_right"
              @click="nextPeriod"
              class="modern-btn"
            />
          </div>
          <q-btn-toggle
            v-model="viewMode"
            :options="viewModeOptions"
            class="modern-btn-toggle"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Calendar View -->
    <q-card class="content-card">
      <q-card-section>
        <!-- Month View -->
        <div v-if="viewMode === 'month'" class="calendar-month-view">
          <!-- Weekday Headers -->
          <div class="calendar-weekdays">
            <div
              v-for="day in weekDays"
              :key="day"
              class="calendar-weekday"
            >
              {{ day }}
            </div>
          </div>
          <!-- Calendar Grid -->
          <div class="calendar-grid">
            <div
              v-for="(day, index) in monthDays"
              :key="index"
              class="calendar-day"
              :class="{
                'calendar-day-other-month': !day.isCurrentMonth,
                'calendar-day-today': day.isToday,
                'calendar-day-selected': day.isSelected
              }"
              @click="selectDate(day.date)"
            >
              <div class="calendar-day-number">{{ day.day }}</div>
              <div class="calendar-day-events">
                <q-chip
                  v-for="event in getDayEvents(day.date)"
                  :key="event.id"
                  :color="event.color"
                  text-color="white"
                  size="sm"
                  class="calendar-event-chip"
                  @click.stop="viewEvent(event)"
                >
                  {{ event.time }} {{ event.title }}
                </q-chip>
              </div>
            </div>
          </div>
        </div>

        <!-- Week View -->
        <div v-else-if="viewMode === 'week'" class="calendar-week-view">
          <div class="calendar-week-header">
            <div class="calendar-time-column"></div>
            <div
              v-for="day in weekDaysData"
              :key="day.date.toISOString()"
              class="calendar-week-day-header"
              :class="{ 'calendar-day-today': day.isToday }"
            >
              <div class="text-caption text-weight-medium">{{ day.weekday }}</div>
              <div class="text-h6 text-weight-bold">{{ day.day }}</div>
            </div>
          </div>
          <div class="calendar-week-body">
            <div class="calendar-time-column">
              <div
                v-for="hour in hours"
                :key="hour"
                class="calendar-time-slot"
              >
                {{ formatHour(hour) }}
              </div>
            </div>
            <div
              v-for="day in weekDaysData"
              :key="day.date.toISOString()"
              class="calendar-week-day-column"
            >
              <div
                v-for="hour in hours"
                :key="hour"
                class="calendar-hour-slot"
                @click="createEventAtTime(day.date, hour)"
              >
                <div
                  v-for="event in getDayHourEvents(day.date, hour)"
                  :key="event.id"
                  class="calendar-week-event"
                  :style="`background: ${event.color};`"
                  @click.stop="viewEvent(event)"
                >
                  {{ event.title }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Day View -->
        <div v-else class="calendar-day-view">
          <div class="calendar-day-header">
            <div class="text-h5 text-weight-bold q-mb-md">
              {{ formatDate(currentDate) }}
            </div>
          </div>
          <div class="calendar-day-body">
            <div class="calendar-time-column-day">
              <div
                v-for="hour in hours"
                :key="hour"
                class="calendar-time-slot"
              >
                {{ formatHour(hour) }}
              </div>
            </div>
            <div class="calendar-day-column">
              <div
                v-for="hour in hours"
                :key="hour"
                class="calendar-hour-slot"
                @click="createEventAtTime(currentDate, hour)"
              >
                <div
                  v-for="event in getDayHourEvents(currentDate, hour)"
                  :key="event.id"
                  class="calendar-day-event"
                  :style="`background: ${event.color};`"
                  @click.stop="viewEvent(event)"
                >
                  <div class="text-weight-medium">{{ event.time }}</div>
                  <div>{{ event.title }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Add Event Dialog -->
    <q-dialog v-model="showAddEventDialog" class="modern-dialog">
      <q-card class="event-form-card">
        <q-card-section class="event-form-header">
          <div class="text-h5 text-weight-bold">
            <q-icon name="event" class="q-mr-sm text-primary" />
            {{ selectedEvent ? 'Edit Event' : 'New Event' }}
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="event-form-body">
          <div class="event-form-fields">
            <!-- Event Title -->
            <div class="form-field-wrapper">
              <q-input
                v-model="eventForm.title"
                label="Event Title"
                outlined
                class="modern-input event-form-input"
                placeholder="Enter event title"
                :rules="[val => !!val || 'Event title is required']"
              />
            </div>
            
            <!-- Description -->
            <div class="form-field-wrapper">
              <q-input
                v-model="eventForm.description"
                label="Description"
                type="textarea"
                outlined
                :rows="3"
                class="modern-input event-form-input"
                placeholder="Enter event description (optional)"
              />
            </div>
            
            <!-- Date and Time Section -->
            <div class="form-section">
              <div class="form-section-label">Date & Time</div>
              
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6 form-field-wrapper">
                  <q-input
                    v-model="eventForm.startDate"
                    label="Start Date"
                    type="date"
                    outlined
                    class="modern-input event-form-input"
                    :rules="[val => !!val || 'Start date is required']"
                  />
                </div>
                <div class="col-12 col-sm-6 form-field-wrapper">
                  <q-input
                    v-model="eventForm.startTime"
                    label="Start Time"
                    type="time"
                    outlined
                    class="modern-input event-form-input"
                    :rules="[val => !!val || 'Start time is required']"
                  />
                </div>
              </div>
              
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6 form-field-wrapper">
                  <q-input
                    v-model="eventForm.endDate"
                    label="End Date"
                    type="date"
                    outlined
                    class="modern-input event-form-input"
                    :rules="[val => !!val || 'End date is required']"
                  />
                </div>
                <div class="col-12 col-sm-6 form-field-wrapper">
                  <q-input
                    v-model="eventForm.endTime"
                    label="End Time"
                    type="time"
                    outlined
                    class="modern-input event-form-input"
                    :rules="[val => !!val || 'End time is required']"
                  />
                </div>
              </div>
            </div>
            
            <!-- Event Color -->
            <div class="form-field-wrapper">
              <q-select
                v-model="eventForm.color"
                :options="colorOptions"
                label="Event Color"
                outlined
                class="modern-input event-form-input"
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section avatar>
                      <div
                        class="color-preview"
                        :style="`background: ${scope.opt.value};`"
                      ></div>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ scope.opt.label }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
                <template v-slot:selected>
                  <div class="row items-center">
                    <div
                      class="selected-color-preview"
                      :style="`background: ${eventForm.color};`"
                    ></div>
                    <span class="q-ml-sm">{{ colorOptions.find(c => c.value === eventForm.color)?.label || 'Blue' }}</span>
                  </div>
                </template>
              </q-select>
            </div>
          </div>
        </q-card-section>

        <q-separator />
        
        <q-card-actions align="right" class="event-form-actions">
          <q-btn
            flat
            label="Cancel"
            class="modern-btn event-form-btn-cancel"
            @click="cancelEvent"
          />
          <q-btn
            label="Save Event"
            icon="save"
            class="modern-btn btn-primary event-form-btn-save"
            @click="saveEvent"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday, isSameMonth, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, getDay, setHours, setMinutes } from 'date-fns'
import { useQuasar } from 'quasar'

const $q = useQuasar()

interface CalendarEvent {
  id: string
  title: string
  description: string
  start: Date
  end: Date
  color: string
  time: string
}

const viewMode = ref<'month' | 'week' | 'day'>('month')
const currentDate = ref(new Date())
const selectedDate = ref(new Date())
const showAddEventDialog = ref(false)
const selectedEvent = ref<CalendarEvent | null>(null)

const eventForm = ref({
  title: '',
  description: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  color: '#1e40af'
})

const colorOptions = [
  { label: 'Blue', value: '#1e40af' },
  { label: 'Cyan', value: '#0ea5e9' },
  { label: 'Green', value: '#059669' },
  { label: 'Orange', value: '#d97706' },
  { label: 'Red', value: '#dc2626' },
  { label: 'Purple', value: '#7c3aed' }
]

const viewModeOptions = [
  { label: 'Month', value: 'month', icon: 'calendar_view_month' },
  { label: 'Week', value: 'week', icon: 'calendar_view_week' },
  { label: 'Day', value: 'day', icon: 'calendar_today' }
]

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const hours = Array.from({ length: 24 }, (_, i) => i)

// Sample events
const events = ref<CalendarEvent[]>([
  {
    id: '1',
    title: 'Team Meeting',
    description: 'Weekly team sync',
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(11, 0, 0, 0)),
    color: '#1e40af',
    time: '10:00 AM'
  },
  {
    id: '2',
    title: 'Client Presentation',
    description: 'Present quarterly results',
    start: new Date(new Date().setHours(14, 0, 0, 0)),
    end: new Date(new Date().setHours(15, 30, 0, 0)),
    color: '#059669',
    time: '2:00 PM'
  }
])

const currentPeriodLabel = computed(() => {
  if (viewMode.value === 'month') {
    return format(currentDate.value, 'MMMM yyyy')
  } else if (viewMode.value === 'week') {
    const weekStart = startOfWeek(currentDate.value)
    const weekEnd = endOfWeek(currentDate.value)
    return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`
  } else {
    return format(currentDate.value, 'EEEE, MMMM d, yyyy')
  }
})

const todayLabel = computed(() => {
  return isToday(currentDate.value) ? 'Today' : 'Go to Today'
})

const monthDays = computed(() => {
  const monthStart = startOfMonth(currentDate.value)
  const monthEnd = endOfMonth(currentDate.value)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  
  return days.map(date => ({
    date,
    day: format(date, 'd'),
    isCurrentMonth: isSameMonth(date, currentDate.value),
    isToday: isToday(date),
    isSelected: isSameDay(date, selectedDate.value)
  }))
})

const weekDaysData = computed(() => {
  const weekStart = startOfWeek(currentDate.value)
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i)
    return {
      date,
      day: format(date, 'd'),
      weekday: format(date, 'EEE'),
      isToday: isToday(date)
    }
  })
})

const previousPeriod = () => {
  if (viewMode.value === 'month') {
    currentDate.value = subMonths(currentDate.value, 1)
  } else if (viewMode.value === 'week') {
    currentDate.value = subWeeks(currentDate.value, 1)
  } else {
    currentDate.value = subDays(currentDate.value, 1)
  }
}

const nextPeriod = () => {
  if (viewMode.value === 'month') {
    currentDate.value = addMonths(currentDate.value, 1)
  } else if (viewMode.value === 'week') {
    currentDate.value = addWeeks(currentDate.value, 1)
  } else {
    currentDate.value = addDays(currentDate.value, 1)
  }
}

const goToToday = () => {
  currentDate.value = new Date()
  selectedDate.value = new Date()
}

const selectDate = (date: Date) => {
  selectedDate.value = date
  if (viewMode.value === 'month') {
    currentDate.value = date
    viewMode.value = 'day'
  }
}

const getDayEvents = (date: Date) => {
  return events.value.filter(event => isSameDay(event.start, date))
}

const getDayHourEvents = (date: Date, hour: number) => {
  return events.value.filter(event => {
    return isSameDay(event.start, date) && event.start.getHours() === hour
  })
}

const createEventAtTime = (date: Date, hour: number) => {
  const startDateTime = setHours(setMinutes(date, 0), hour)
  eventForm.value.startDate = format(startDateTime, 'yyyy-MM-dd')
  eventForm.value.startTime = format(startDateTime, 'HH:mm')
  eventForm.value.endDate = format(addDays(startDateTime, 0), 'yyyy-MM-dd')
  eventForm.value.endTime = format(setHours(startDateTime, hour + 1), 'HH:mm')
  showAddEventDialog.value = true
}

const viewEvent = (event: CalendarEvent) => {
  selectedEvent.value = event
  eventForm.value = {
    title: event.title,
    description: event.description,
    startDate: format(event.start, 'yyyy-MM-dd'),
    startTime: format(event.start, 'HH:mm'),
    endDate: format(event.end, 'yyyy-MM-dd'),
    endTime: format(event.end, 'HH:mm'),
    color: event.color
  }
  showAddEventDialog.value = true
}

const saveEvent = () => {
  if (!eventForm.value.title) {
    $q.notify({
      type: 'negative',
      message: 'Please enter an event title',
      icon: 'error'
    })
    return
  }

  const start = new Date(`${eventForm.value.startDate}T${eventForm.value.startTime}`)
  const end = new Date(`${eventForm.value.endDate}T${eventForm.value.endTime}`)

  if (selectedEvent.value) {
    // Update existing event
    const index = events.value.findIndex(e => e.id === selectedEvent.value!.id)
    if (index > -1) {
      events.value[index] = {
        ...selectedEvent.value,
        title: eventForm.value.title,
        description: eventForm.value.description,
        start,
        end,
        color: eventForm.value.color,
        time: format(start, 'h:mm a')
      }
    }
    $q.notify({
      type: 'positive',
      message: 'Event updated successfully',
      icon: 'check_circle'
    })
  } else {
    // Create new event
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: eventForm.value.title,
      description: eventForm.value.description,
      start,
      end,
      color: eventForm.value.color,
      time: format(start, 'h:mm a')
    }
    events.value.push(newEvent)
    $q.notify({
      type: 'positive',
      message: 'Event created successfully',
      icon: 'check_circle'
    })
  }

  cancelEvent()
}

const cancelEvent = () => {
  showAddEventDialog.value = false
  selectedEvent.value = null
  eventForm.value = {
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    color: '#1e40af'
  }
}

const formatHour = (hour: number) => {
  const date = new Date()
  date.setHours(hour, 0, 0, 0)
  return format(date, 'h a')
}

const formatDate = (date: Date) => {
  return format(date, 'EEEE, MMMM d, yyyy')
}

onMounted(() => {
  const today = new Date()
  eventForm.value.startDate = format(today, 'yyyy-MM-dd')
  eventForm.value.endDate = format(today, 'yyyy-MM-dd')
})
</script>

<style scoped>
.calendar-page {
  padding: 24px;
}

.calendar-title {
  min-width: 200px;
  text-align: center;
}

.calendar-month-view {
  width: 100%;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.calendar-weekday {
  text-align: center;
  padding: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-dark);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendar-day {
  min-height: 120px;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
}

.calendar-day:hover {
  background: rgba(30, 64, 175, 0.05);
  border-color: var(--primary-color);
}

.calendar-day-other-month {
  opacity: 0.4;
  background: rgba(0, 0, 0, 0.02);
}

.calendar-day-today {
  background: rgba(30, 64, 175, 0.1);
  border-color: var(--primary-color);
  border-width: 2px;
}

.calendar-day-selected {
  background: rgba(30, 64, 175, 0.15);
  border-color: var(--primary-color);
}

.calendar-day-number {
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 4px;
}

.calendar-day-events {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.calendar-event-chip {
  font-size: 0.7rem;
  height: auto;
  padding: 2px 6px;
  cursor: pointer;
}

.calendar-week-view {
  width: 100%;
}

.calendar-week-header {
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.calendar-week-day-header {
  text-align: center;
  padding: 8px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.02);
}

.calendar-week-body {
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  gap: 4px;
  height: 600px;
  overflow-y: auto;
}

.calendar-time-column {
  display: flex;
  flex-direction: column;
}

.calendar-time-slot {
  height: 60px;
  padding: 4px 8px;
  font-size: 0.75rem;
  color: var(--text-light);
  text-align: right;
  border-right: 1px solid var(--border-light);
}

.calendar-week-day-column {
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--border-light);
}

.calendar-hour-slot {
  height: 60px;
  border-bottom: 1px solid var(--border-light);
  padding: 2px;
  cursor: pointer;
  transition: background 0.2s ease;
  position: relative;
}

.calendar-hour-slot:hover {
  background: rgba(30, 64, 175, 0.03);
}

.calendar-week-event {
  position: absolute;
  left: 2px;
  right: 2px;
  padding: 4px 8px;
  border-radius: 4px;
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.calendar-day-view {
  width: 100%;
}

.calendar-day-header {
  margin-bottom: 16px;
}

.calendar-day-body {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 8px;
  height: 600px;
  overflow-y: auto;
}

.calendar-time-column-day {
  display: flex;
  flex-direction: column;
}

.calendar-day-column {
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--border-light);
}

.calendar-day-event {
  padding: 8px 12px;
  border-radius: 8px;
  color: white;
  margin: 4px 0;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.color-preview {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--border-light);
}

/* Event Form Styling */
.event-form-card {
  min-width: 520px;
  max-width: 600px;
  width: 90vw;
  border-radius: 20px !important;
  overflow: hidden;
}

.event-form-header {
  padding: 24px 24px 20px 24px !important;
  background: rgba(255, 255, 255, 1) !important;
}

.event-form-body {
  padding: 0 24px 24px 24px !important;
  background: rgba(255, 255, 255, 1) !important;
}

.event-form-fields {
  padding-top: 8px;
}

.form-field-wrapper {
  margin-bottom: 20px;
}

.form-field-wrapper:last-child {
  margin-bottom: 0;
}

.event-form-input {
  margin: 0 !important;
}

.event-form-input :deep(.q-field__control) {
  min-height: 48px !important;
}

.event-form-input :deep(.q-field__label) {
  top: 14px !important;
  font-weight: 500 !important;
  color: var(--text-dark) !important;
}

.event-form-input :deep(.q-field__native) {
  padding: 12px 0 !important;
  color: var(--text-dark) !important;
}

.form-section {
  margin: 24px 0;
  padding-top: 16px;
  border-top: 1px solid var(--border-light);
}

.form-section:first-child {
  border-top: none;
  margin-top: 0;
  padding-top: 0;
}

.form-section-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.selected-color-preview {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid var(--border-light);
}

.event-form-actions {
  padding: 20px 24px !important;
  background: rgba(0, 0, 0, 0.02) !important;
}

.event-form-btn-cancel,
.event-form-btn-save {
  min-width: 120px !important;
  padding: 10px 20px !important;
}

.event-form-btn-save {
  margin-left: 12px;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .event-form-card {
    min-width: 95vw;
    max-width: 95vw;
  }
  
  .event-form-header,
  .event-form-body,
  .event-form-actions {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
  
  .event-form-actions {
    flex-direction: column-reverse;
    gap: 12px;
  }
  
  .event-form-btn-cancel,
  .event-form-btn-save {
    width: 100%;
    margin: 0 !important;
  }
}
</style>

