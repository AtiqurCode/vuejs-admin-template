<template>
  <div class="reports-page">
    <!-- Page Header -->
    <div class="page-header q-mb-lg">
      <div class="row items-center justify-between">
        <div>
          <div class="text-h4 text-weight-bold q-mb-sm text-white">
            <q-icon name="assessment" class="q-mr-sm page-title-icon" />
            Reports & Analytics
          </div>
          <div class="text-subtitle1 text-white page-subtitle">
            Comprehensive insights and data analytics for your dashboard
          </div>
        </div>
        <div class="row q-gutter-sm">
          <q-btn
            color="primary"
            icon="download"
            label="Export Report"
            class="modern-btn btn-primary"
            @click="exportReport"
          />
          <q-btn
            color="secondary"
            icon="refresh"
            label="Refresh Data"
            class="modern-btn btn-secondary"
            @click="refreshReports"
          />
        </div>
      </div>
    </div>

    <!-- Key Metrics Cards -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-lg-3" v-for="metric in keyMetrics" :key="metric.title">
        <q-card class="stat-card q-pa-md">
          <q-card-section class="q-pa-md">
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="stat-value text-h4">{{ metric.value }}</div>
                <div class="text-subtitle2 text-weight-medium q-mt-xs" style="color: var(--text-dark);">{{ metric.title }}</div>
                <div class="text-caption q-mt-xs" :class="metric.trend === 'up' ? 'text-positive' : 'text-negative'">
                  <q-icon :name="metric.trend === 'up' ? 'trending_up' : 'trending_down'" class="q-mr-xs" />
                  {{ metric.change }}
                </div>
              </div>
              <div class="col-auto">
                <div class="stat-icon">
                  <q-icon :name="metric.icon" size="1.5rem" />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-lg">
      <!-- Charts Section -->
      <div class="col-12 col-lg-8">
        <div class="column q-gutter-lg">
          <!-- User Activity Chart -->
          <q-card class="content-card">
            <q-card-section>
              <div class="row items-center justify-between q-mb-md">
                <div class="text-h5 text-weight-bold">
                  <q-icon name="show_chart" class="q-mr-sm text-primary" />
                  User Activity Trends
                </div>
                <q-select
                  v-model="activityPeriod"
                  :options="periodOptions"
                  outlined
                  dense
                  class="modern-input"
                  style="min-width: 120px;"
                />
              </div>
              <div class="chart-container">
                <div class="chart-placeholder">
                  <q-icon name="insert_chart" size="4rem" class="text-grey-4" />
                  <div class="text-h6 text-grey-6 q-mt-md">User Activity Chart</div>
                  <div class="text-body2 text-grey-5">Interactive chart showing user engagement over time</div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Revenue Analytics -->
          <q-card class="content-card">
            <q-card-section>
              <div class="row items-center justify-between q-mb-md">
                <div class="text-h5 text-weight-bold">
                  <q-icon name="monetization_on" class="q-mr-sm text-primary" />
                  Revenue Analytics
                </div>
                <div class="row q-gutter-sm">
                  <q-btn-toggle
                    v-model="revenueView"
                    :options="revenueViewOptions"
                    color="primary"
                    class="modern-btn-toggle"
                  />
                </div>
              </div>
              <div class="chart-container">
                <div class="chart-placeholder">
                  <q-icon name="bar_chart" size="4rem" class="text-grey-4" />
                  <div class="text-h6 text-grey-6 q-mt-md">Revenue Breakdown</div>
                  <div class="text-body2 text-grey-5">Monthly revenue trends and projections</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Reports Sidebar -->
      <div class="col-12 col-lg-4">
        <div class="column q-gutter-lg">
          <!-- Quick Reports -->
          <q-card class="content-card">
            <q-card-section>
              <div class="text-h6 text-weight-bold q-mb-md">
                <q-icon name="flash_on" class="q-mr-sm text-primary" />
                Quick Reports
              </div>
              <div class="column q-gutter-sm">
                <q-btn
                  v-for="report in quickReports"
                  :key="report.name"
                  :icon="report.icon"
                  :label="report.name"
                  class="modern-btn btn-secondary full-width text-left"
                  align="left"
                  @click="generateQuickReport(report)"
                />
              </div>
            </q-card-section>
          </q-card>

          <!-- Top Performers -->
          <q-card class="content-card">
            <q-card-section>
              <div class="text-h6 text-weight-bold q-mb-md">
                <q-icon name="star" class="q-mr-sm text-primary" />
                Top Performers
              </div>
              <q-list>
                <q-item v-for="performer in topPerformers" :key="performer.id" class="q-pa-sm">
                  <q-item-section avatar>
                    <q-avatar size="40px">
                      <img v-if="performer.avatar" :src="performer.avatar" />
                      <q-icon v-else name="person" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">{{ performer.name }}</q-item-label>
                    <q-item-label caption>{{ performer.metric }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-badge :color="performer.badgeColor" :label="performer.score" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>

          <!-- System Health -->
          <q-card class="content-card">
            <q-card-section>
              <div class="text-h6 text-weight-bold q-mb-md">
                <q-icon name="health_and_safety" class="q-mr-sm text-primary" />
                System Health
              </div>
              <div class="column q-gutter-md">
                <div v-for="health in systemHealth" :key="health.name" class="health-item">
                  <div class="row items-center justify-between q-mb-xs">
                    <span class="text-weight-medium">{{ health.name }}</span>
                    <span class="text-caption">{{ health.value }}%</span>
                  </div>
                  <q-linear-progress
                    :value="health.value / 100"
                    :color="getHealthColor(health.value)"
                    size="8px"
                    rounded
                  />
                </div>
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
              <q-timeline color="primary">
                <q-timeline-entry
                  v-for="activity in recentActivities"
                  :key="activity.id"
                  :title="activity.title"
                  :subtitle="activity.time"
                  :icon="activity.icon"
                  :color="activity.color"
                >
                  <div class="text-body2">{{ activity.description }}</div>
                </q-timeline-entry>
              </q-timeline>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Data Tables Section -->
    <div class="row q-col-gutter-lg q-mt-lg">
      <!-- User Engagement Table -->
      <div class="col-12 col-lg-6">
        <q-card class="content-card">
          <q-card-section>
            <div class="text-h6 text-weight-bold q-mb-md">
              <q-icon name="people" class="q-mr-sm text-primary" />
              User Engagement Report
            </div>
            <q-table
              :rows="userEngagementData"
              :columns="engagementColumns"
              row-key="id"
              :pagination="{ rowsPerPage: 5 }"
              class="modern-table"
              flat
              bordered
            >
              <template v-slot:body-cell-engagement="props">
                <q-td :props="props">
                  <q-linear-progress
                    :value="props.value / 100"
                    :color="props.value > 70 ? 'positive' : props.value > 40 ? 'warning' : 'negative'"
                    size="12px"
                    rounded
                    class="q-mb-xs"
                  />
                  <div class="text-center text-caption">{{ props.value }}%</div>
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>

      <!-- Performance Metrics Table -->
      <div class="col-12 col-lg-6">
        <q-card class="content-card">
          <q-card-section>
            <div class="text-h6 text-weight-bold q-mb-md">
              <q-icon name="speed" class="q-mr-sm text-primary" />
              Performance Metrics
            </div>
            <q-table
              :rows="performanceData"
              :columns="performanceColumns"
              row-key="metric"
              :pagination="{ rowsPerPage: 5 }"
              class="modern-table"
              flat
              bordered
            >
              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-chip
                    :color="props.value === 'Good' ? 'positive' : props.value === 'Warning' ? 'warning' : 'negative'"
                    :label="props.value"
                    class="status-chip"
                  />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const activityPeriod = ref('7d')
const revenueView = ref('monthly')

const periodOptions = ['24h', '7d', '30d', '90d', '1y']
const revenueViewOptions = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Quarterly', value: 'quarterly' },
  { label: 'Yearly', value: 'yearly' }
]

const keyMetrics = [
  { title: 'Total Revenue', value: '$124,567', icon: 'attach_money', change: '+15.3%', trend: 'up' },
  { title: 'Active Sessions', value: '3,247', icon: 'timeline', change: '+8.7%', trend: 'up' },
  { title: 'Conversion Rate', value: '12.4%', icon: 'trending_up', change: '+2.1%', trend: 'up' },
  { title: 'Bounce Rate', value: '23.8%', icon: 'trending_down', change: '-5.2%', trend: 'down' }
]

const quickReports = [
  { name: 'User Activity Report', icon: 'people' },
  { name: 'Revenue Summary', icon: 'monetization_on' },
  { name: 'Performance Report', icon: 'speed' },
  { name: 'Security Audit', icon: 'security' },
  { name: 'System Usage', icon: 'storage' }
]

const topPerformers = [
  { 
    id: 1, 
    name: 'Sarah Johnson', 
    metric: 'Sales Performance', 
    score: '98%', 
    badgeColor: 'positive',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  { 
    id: 2, 
    name: 'Mike Chen', 
    metric: 'User Engagement', 
    score: '94%', 
    badgeColor: 'positive',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  { 
    id: 3, 
    name: 'Emily Davis', 
    metric: 'Customer Support', 
    score: '91%', 
    badgeColor: 'warning'
  },
  { 
    id: 4, 
    name: 'Alex Rodriguez', 
    metric: 'Project Delivery', 
    score: '89%', 
    badgeColor: 'warning'
  }
]

const systemHealth = [
  { name: 'Server Uptime', value: 99.8 },
  { name: 'Database Performance', value: 87.3 },
  { name: 'API Response Time', value: 92.1 },
  { name: 'Memory Usage', value: 68.4 },
  { name: 'Storage Capacity', value: 45.2 }
]

const recentActivities = [
  { 
    id: 1, 
    title: 'System Backup Completed', 
    description: 'Daily backup completed successfully',
    time: '2 hours ago', 
    icon: 'backup', 
    color: 'positive' 
  },
  { 
    id: 2, 
    title: 'New User Registration Spike', 
    description: '50+ new users registered in the last hour',
    time: '3 hours ago', 
    icon: 'person_add', 
    color: 'primary' 
  },
  { 
    id: 3, 
    title: 'Performance Alert', 
    description: 'API response time increased by 15%',
    time: '5 hours ago', 
    icon: 'warning', 
    color: 'warning' 
  },
  { 
    id: 4, 
    title: 'Revenue Milestone', 
    description: 'Monthly revenue target achieved',
    time: '1 day ago', 
    icon: 'celebration', 
    color: 'accent' 
  }
]

const engagementColumns = [
  { name: 'user', label: 'User', field: 'user', align: 'left', sortable: true },
  { name: 'sessions', label: 'Sessions', field: 'sessions', align: 'center', sortable: true },
  { name: 'duration', label: 'Avg Duration', field: 'duration', align: 'center', sortable: true },
  { name: 'engagement', label: 'Engagement', field: 'engagement', align: 'center', sortable: true }
]

const userEngagementData = [
  { id: 1, user: 'John Doe', sessions: 45, duration: '12m 34s', engagement: 87 },
  { id: 2, user: 'Jane Smith', sessions: 38, duration: '9m 21s', engagement: 72 },
  { id: 3, user: 'Bob Johnson', sessions: 52, duration: '15m 47s', engagement: 94 },
  { id: 4, user: 'Alice Brown', sessions: 29, duration: '7m 12s', engagement: 58 },
  { id: 5, user: 'Charlie Wilson', sessions: 41, duration: '11m 03s', engagement: 79 }
]

const performanceColumns = [
  { name: 'metric', label: 'Metric', field: 'metric', align: 'left', sortable: true },
  { name: 'current', label: 'Current', field: 'current', align: 'center', sortable: true },
  { name: 'target', label: 'Target', field: 'target', align: 'center', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'center', sortable: true }
]

const performanceData = [
  { metric: 'Page Load Time', current: '2.3s', target: '< 3s', status: 'Good' },
  { metric: 'API Response', current: '145ms', target: '< 200ms', status: 'Good' },
  { metric: 'Error Rate', current: '0.8%', target: '< 1%', status: 'Good' },
  { metric: 'Memory Usage', current: '68%', target: '< 80%', status: 'Good' },
  { metric: 'CPU Usage', current: '85%', target: '< 70%', status: 'Warning' }
]

const getHealthColor = (value: number) => {
  if (value >= 90) return 'positive'
  if (value >= 70) return 'warning'
  return 'negative'
}

const exportReport = () => {
  $q.notify({
    type: 'positive',
    message: 'Report export started! You will receive an email when ready.',
    icon: 'download'
  })
}

const refreshReports = () => {
  $q.loading.show({
    message: 'Refreshing reports data...'
  })
  
  setTimeout(() => {
    $q.loading.hide()
    $q.notify({
      type: 'positive',
      message: 'Reports data refreshed successfully!',
      icon: 'refresh'
    })
  }, 2000)
}

const generateQuickReport = (report: any) => {
  $q.notify({
    type: 'info',
    message: `Generating ${report.name}...`,
    icon: report.icon
  })
}
</script>

<style scoped>
.reports-page {
  padding: 24px;
}

.page-header {
  animation: fadeInUp 0.6s ease-out;
}

.page-title-icon {
  color: white;
  background: rgba(102, 126, 234, 0.1);
  padding: 8px;
  border-radius: 12px;
}

.page-subtitle {
  opacity: 0.8;
}

.chart-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 16px;
  border: 2px dashed rgba(102, 126, 234, 0.2);
}

.chart-placeholder {
  text-align: center;
  padding: 40px;
}

.health-item {
  padding: 8px 0;
}

.modern-btn-toggle {
  border-radius: 12px;
  overflow: hidden;
}

.modern-btn-toggle .q-btn {
  border-radius: 0;
}

.modern-btn-toggle .q-btn:first-child {
  border-radius: 12px 0 0 12px;
}

.modern-btn-toggle .q-btn:last-child {
  border-radius: 0 12px 12px 0;
}

@media (max-width: 768px) {
  .reports-page {
    padding: 16px;
  }
  
  .page-header .row {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .chart-container {
    height: 250px;
  }
  
  .chart-placeholder {
    padding: 20px;
  }
}

@media (max-width: 599px) {
  .reports-page {
    padding: 12px;
  }
  
  .page-header .text-h4 {
    font-size: 1.5rem !important;
  }
  
  .chart-container {
    height: 200px;
  }
}
</style>