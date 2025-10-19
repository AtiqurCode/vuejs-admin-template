<template>
  <div class="users-page">
    <!-- Page Header -->
    <div class="page-header q-mb-lg">
      <div class="row items-center justify-between">
        <div>
          <div class="text-h4 text-weight-bold q-mb-sm text-white">
            <q-icon name="people" class="q-mr-sm page-title-icon" />
            User Management
          </div>
          <div class="text-såubtitle1 text-white page-subtitle">
            Manage and organize your users efficiently with advanced tools
          </div>
        </div>
        <div class="row q-gutter-sm">
          <q-btn
            color="primary"
            icon="person_add"
            label="Add User"
            class="modern-btn btn-primary"
            @click="showAddUserDialog = true"
          />
          <q-btn
            color="secondary"
            icon="upload"
            label="Import Users"
            class="modern-btn btn-secondary"
            @click="importUsers"
          />
        </div>
      </div>
    </div>

    <!-- Enhanced Stats Cards -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-lg-3" v-for="stat in userStats" :key="stat.title">
        <q-card class="stat-card q-pa-md" @click="filterByStatus(stat.filter)">
          <q-card-section class="q-pa-md">
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="stat-value text-h4">{{ stat.value }}</div>
                <div class="text-subtitle2 text-weight-medium q-mt-xs" style="color: var(--text-dark);">{{ stat.title }}</div>
                <div class="text-caption q-mt-xs" :class="stat.trend === 'up' ? 'text-positive' : 'text-negative'">
                  <q-icon :name="stat.trend === 'up' ? 'trending_up' : 'trending_down'" class="q-mr-xs" />
                  {{ stat.change }}
                </div>
              </div>
              <div class="col-auto">
                <div class="stat-icon" :style="`background: ${stat.gradient}`">
                  <q-icon :name="stat.icon" size="1.5rem" />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Advanced Filters and Search -->
    <q-card class="content-card q-mb-lg">
      <q-card-section>
        <div class="row items-center justify-between q-mb-md">
          <div class="text-h6 text-weight-bold">
            <q-icon name="filter_list" class="q-mr-sm text-primary" />
            Advanced Filters
          </div>
          <q-btn
            flat
            icon="refresh"
            label="Reset Filters"
            class="modern-btn"
            @click="resetFilters"
          />
        </div>
        
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-input
              v-model="searchQuery"
              placeholder="Search users by name, email, or department..."
              outlined
              dense
              class="modern-input"
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-2">
            <q-select
              v-model="filterRole"
              :options="['All', ...roleOptions]"
              label="Role"
              outlined
              dense
              class="modern-input"
            />
          </div>
          <div class="col-12 col-md-2">
            <q-select
              v-model="filterStatus"
              :options="statusOptions"
              label="Status"
              outlined
              dense
              class="modern-input"
            />
          </div>
          <div class="col-12 col-md-2">
            <q-select
              v-model="filterDepartment"
              :options="['All', ...departmentOptions]"
              label="Department"
              outlined
              dense
              class="modern-input"
            />
          </div>
          <div class="col-12 col-md-2">
            <q-select
              v-model="sortBy"
              :options="sortOptions"
              label="Sort By"
              outlined
              dense
              class="modern-input"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Enhanced Users Table -->
    <q-card class="content-card">
      <q-card-section>
        <div class="row items-center justify-between q-mb-md">
          <div class="text-h5 text-weight-bold text-white">
            <q-icon name="group" class="q-mr-sm text-primary" />
            All Users ({{ filteredUsers.length }})
          </div>
          <div class="row q-gutter-sm">
            <q-btn-toggle
              v-model="viewMode"
              :options="viewModeOptions"
              color="primary"
              class="modern-btn-toggle"
            />
            <q-btn
              flat
              icon="more_vert"
              class="modern-btn"
            >
              <q-menu>
                <q-list>
                  <q-item clickable @click="exportUsers">
                    <q-item-section avatar>
                      <q-icon name="download" />
                    </q-item-section>
                    <q-item-section>Export Users</q-item-section>
                  </q-item>
                  <q-item clickable @click="bulkActions">
                    <q-item-section avatar>
                      <q-icon name="checklist" />
                    </q-item-section>
                    <q-item-section>Bulk Actions</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>
      </q-card-section>
      
      <!-- Table View -->
      <q-card-section v-if="viewMode === 'table'">
        <q-table
          :rows="filteredUsers"
          :columns="columns"
          row-key="id"
          :pagination="tablePagination"
          @request="onRequest"
          class="modern-table"
          flat
          bordered
          selection="multiple"
          v-model:selected="selectedUsers"
          :rows-per-page-options="[10, 25, 50, 100]"
        >
          <template v-slot:body-cell-avatar="props">
            <q-td :props="props">
              <q-avatar size="45px" class="user-avatar">
                <img v-if="props.row.avatar" :src="props.row.avatar" />
                <q-icon v-else name="person" size="1.5rem" />
              </q-avatar>
            </q-td>
          </template>

          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              <div class="column">
                <div class="text-weight-bold">{{ props.row.name }}</div>
                <div class="text-caption text-grey-6">{{ props.row.email }}</div>
              </div>
            </q-td>
          </template>
          
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-chip
                :color="getStatusColor(props.value)"
                :label="props.value"
                class="status-chip"
                :icon="getStatusIcon(props.value)"
              />
            </q-td>
          </template>

          <template v-slot:body-cell-lastActive="props">
            <q-td :props="props">
              <div class="column">
                <div class="text-body2">{{ props.row.lastActive }}</div>
                <div class="text-caption text-grey-6">{{ getTimeAgo(props.row.lastActiveDate) }}</div>
              </div>
            </q-td>
          </template>
          
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <div class="q-gutter-xs">
                <q-btn
                  flat
                  dense
                  round
                  icon="visibility"
                  size="sm"
                  color="info"
                  class="modern-btn"
                  @click="viewUser(props.row)"
                >
                  <q-tooltip>View Details</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  icon="edit"
                  size="sm"
                  color="primary"
                  class="modern-btn"
                  @click="editUser(props.row)"
                >
                  <q-tooltip>Edit User</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  icon="email"
                  size="sm"
                  color="secondary"
                  class="modern-btn"
                  @click="sendMessage(props.row)"
                >
                  <q-tooltip>Send Message</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  icon="more_vert"
                  size="sm"
                  color="grey-6"
                  class="modern-btn"
                >
                  <q-menu>
                    <q-list>
                      <q-item clickable @click="toggleUserStatus(props.row)">
                        <q-item-section avatar>
                          <q-icon :name="props.row.status === 'Active' ? 'block' : 'check_circle'" />
                        </q-item-section>
                        <q-item-section>{{ props.row.status === 'Active' ? 'Deactivate' : 'Activate' }}</q-item-section>
                      </q-item>
                      <q-item clickable @click="resetPassword(props.row)">
                        <q-item-section avatar>
                          <q-icon name="lock_reset" />
                        </q-item-section>
                        <q-item-section>Reset Password</q-item-section>
                      </q-item>
                      <q-separator />
                      <q-item clickable @click="deleteUser(props.row)" class="text-negative">
                        <q-item-section avatar>
                          <q-icon name="delete" color="negative" />
                        </q-item-section>
                        <q-item-section>Delete User</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </q-td>
          </template>
        </q-table>
      </q-card-section>

      <!-- Card View -->
      <q-card-section v-else>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6 col-md-4 col-lg-3" v-for="user in filteredUsers" :key="user.id">
            <q-card class="user-card" @click="viewUser(user)">
              <q-card-section class="text-center q-pb-none">
                <q-avatar size="80px" class="user-avatar q-mb-md">
                  <img v-if="user.avatar" :src="user.avatar" />
                  <q-icon v-else name="person" size="2.5rem" />
                </q-avatar>
                <div class="text-h6 text-weight-bold">{{ user.name }}</div>
                <div class="text-caption text-grey-6 q-mb-sm">{{ user.email }}</div>
                <q-chip
                  :color="getStatusColor(user.status)"
                  :label="user.status"
                  class="status-chip"
                  size="sm"
                />
              </q-card-section>
              <q-card-section class="q-pt-sm">
                <div class="row q-gutter-xs text-center">
                  <div class="col">
                    <div class="text-caption text-grey-6">Role</div>
                    <div class="text-body2 text-weight-medium">{{ user.role }}</div>
                  </div>
                  <div class="col">
                    <div class="text-caption text-grey-6">Department</div>
                    <div class="text-body2 text-weight-medium">{{ user.department || 'N/A' }}</div>
                  </div>
                </div>
              </q-card-section>
              <q-card-actions align="center">
                <q-btn flat icon="edit" size="sm" color="primary" @click.stop="editUser(user)" />
                <q-btn flat icon="email" size="sm" color="secondary" @click.stop="sendMessage(user)" />
                <q-btn flat icon="more_vert" size="sm" color="grey-6">
                  <q-menu>
                    <q-list>
                      <q-item clickable @click="toggleUserStatus(user)">
                        <q-item-section>{{ user.status === 'Active' ? 'Deactivate' : 'Activate' }}</q-item-section>
                      </q-item>
                      <q-item clickable @click="deleteUser(user)" class="text-negative">
                        <q-item-section>Delete</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Enhanced Add User Dialog -->
    <q-dialog v-model="showAddUserDialog" class="modern-dialog">
      <q-card class="content-card add-user-card">
        <q-card-section>
          <div class="text-h5 text-weight-bold">
            <q-icon name="person_add" class="q-mr-sm text-primary" />
            Add New User
          </div>
          <div class="text-subtitle2 text-grey-6 q-mt-sm">
            Create a new user account with comprehensive details
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-stepper v-model="addUserStep" color="primary" animated>
            <q-step :name="1" title="Basic Information" icon="person" :done="addUserStep > 1">
              <div class="row q-col-gutter-md">
                <div class="col-12 text-center q-mb-md">
                  <q-avatar size="100px" class="profile-avatar">
                    <img v-if="newUser.avatar" :src="newUser.avatar" />
                    <q-icon v-else name="person" size="3rem" />
                  </q-avatar>
                  <div class="q-mt-sm">
                    <q-btn flat icon="photo_camera" label="Upload Photo" size="sm" @click="uploadAvatar" />
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="newUser.firstName"
                    label="First Name *"
                    outlined
                    class="modern-input"
                    :rules="[val => !!val || 'First name is required']"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="newUser.lastName"
                    label="Last Name *"
                    outlined
                    class="modern-input"
                    :rules="[val => !!val || 'Last name is required']"
                  />
                </div>
                <div class="col-12">
                  <q-input
                    v-model="newUser.email"
                    label="Email Address *"
                    type="email"
                    outlined
                    class="modern-input"
                    :rules="[val => !!val || 'Email is required']"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="newUser.phone"
                    label="Phone Number"
                    outlined
                    class="modern-input"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="newUser.dateOfBirth"
                    label="Date of Birth"
                    type="date"
                    outlined
                    class="modern-input"
                  />
                </div>
              </div>
            </q-step>

            <q-step :name="2" title="Role & Permissions" icon="work" :done="addUserStep > 2">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-select
                    v-model="newUser.role"
                    :options="roleOptions"
                    label="User Role *"
                    outlined
                    class="modern-input"
                    :rules="[val => !!val || 'Role is required']"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-select
                    v-model="newUser.department"
                    :options="departmentOptions"
                    label="Department"
                    outlined
                    class="modern-input"
                  />
                </div>
                <div class="col-12">
                  <q-input
                    v-model="newUser.jobTitle"
                    label="Job Title"
                    outlined
                    class="modern-input"
                  />
                </div>
                <div class="col-12">
                  <div class="text-subtitle2 text-weight-medium q-mb-md">Permissions</div>
                  <div class="row q-col-gutter-sm">
                    <div class="col-12 col-md-6" v-for="permission in availablePermissions" :key="permission.key">
                      <q-checkbox
                        v-model="newUser.permissions"
                        :val="permission.key"
                        :label="permission.label"
                        color="primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </q-step>

            <q-step :name="3" title="Settings" icon="settings" :done="addUserStep > 3">
              <div class="column q-gutter-md">
                <div class="row items-center justify-between">
                  <div>
                    <div class="text-body1 text-weight-medium">Account Status</div>
                    <div class="text-caption text-grey-6">Enable or disable user account</div>
                  </div>
                  <q-toggle
                    v-model="newUser.active"
                    color="primary"
                    size="lg"
                  />
                </div>
                <q-separator />
                <div class="row items-center justify-between">
                  <div>
                    <div class="text-body1 text-weight-medium">Email Notifications</div>
                    <div class="text-caption text-grey-6">Send system notifications via email</div>
                  </div>
                  <q-toggle
                    v-model="newUser.emailNotifications"
                    color="primary"
                    size="lg"
                  />
                </div>
                <q-separator />
                <div class="row items-center justify-between">
                  <div>
                    <div class="text-body1 text-weight-medium">Two-Factor Authentication</div>
                    <div class="text-caption text-grey-6">Require 2FA for enhanced security</div>
                  </div>
                  <q-toggle
                    v-model="newUser.twoFactorAuth"
                    color="primary"
                    size="lg"
                  />
                </div>
                <q-separator />
                <div>
                  <div class="text-body1 text-weight-medium q-mb-sm">Send Welcome Email</div>
                  <q-checkbox
                    v-model="newUser.sendWelcomeEmail"
                    label="Send welcome email with login credentials"
                    color="primary"
                  />
                </div>
              </div>
            </q-step>

            <template v-slot:navigation>
              <q-stepper-navigation>
                <q-btn
                  v-if="addUserStep < 3"
                  @click="addUserStep++"
                  color="primary"
                  label="Continue"
                  class="modern-btn btn-primary"
                />
                <q-btn
                  v-if="addUserStep === 3"
                  @click="addUser"
                  color="primary"
                  label="Create User"
                  icon="person_add"
                  class="modern-btn btn-primary"
                />
                <q-btn
                  v-if="addUserStep > 1"
                  flat
                  color="primary"
                  @click="addUserStep--"
                  label="Back"
                  class="q-ml-sm modern-btn"
                />
              </q-stepper-navigation>
            </template>
          </q-stepper>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-lg">
          <q-btn 
            flat 
            label="Cancel" 
            class="modern-btn" 
            @click="closeAddUserDialog" 
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Enhanced View User Dialog -->
    <q-dialog v-model="showViewUserDialog" class="modern-dialog">
      <q-card class="content-card view-user-card">
        <q-card-section>
          <div class="text-h5 text-weight-bold">
            <q-icon name="person" class="q-mr-sm text-primary" />
            User Profile
          </div>
        </q-card-section>

        <q-card-section v-if="selectedUser">
          <div class="row q-col-gutter-lg">
            <!-- Profile Info -->
            <div class="col-12 col-md-4 text-center">
              <q-avatar size="120px" class="user-avatar q-mb-md">
                <img v-if="selectedUser.avatar" :src="selectedUser.avatar" />
                <q-icon v-else name="person" size="4rem" />
              </q-avatar>
              <div class="text-h6 text-weight-bold">{{ selectedUser.name }}</div>
              <div class="text-subtitle2 text-grey-6 q-mb-sm">{{ selectedUser.email }}</div>
              <q-chip
                :color="getStatusColor(selectedUser.status)"
                :label="selectedUser.status"
                class="status-chip"
              />
            </div>
            
            <!-- Details -->
            <div class="col-12 col-md-8">
              <q-tabs v-model="userDetailTab" class="text-primary">
                <q-tab name="details" label="Details" />
                <q-tab name="activity" label="Activity" />
                <q-tab name="permissions" label="Permissions" />
              </q-tabs>

              <q-tab-panels v-model="userDetailTab" animated>
                <q-tab-panel name="details">
                  <div class="row q-col-gutter-md">
                    <div class="col-12 col-sm-6">
                      <q-list>
                        <q-item>
                          <q-item-section avatar>
                            <q-icon name="work" color="primary" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>Role</q-item-label>
                            <q-item-label caption>{{ selectedUser.role }}</q-item-label>
                          </q-item-section>
                        </q-item>
                        
                        <q-item>
                          <q-item-section avatar>
                            <q-icon name="business" color="primary" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>Department</q-item-label>
                            <q-item-label caption>{{ selectedUser.department || 'Not specified' }}</q-item-label>
                          </q-item-section>
                        </q-item>

                        <q-item>
                          <q-item-section avatar>
                            <q-icon name="phone" color="primary" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>Phone</q-item-label>
                            <q-item-label caption>{{ selectedUser.phone || 'Not provided' }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </div>
                    
                    <div class="col-12 col-sm-6">
                      <q-list>
                        <q-item>
                          <q-item-section avatar>
                            <q-icon name="schedule" color="primary" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>Joined</q-item-label>
                            <q-item-label caption>{{ selectedUser.joinDate || 'Unknown' }}</q-item-label>
                          </q-item-section>
                        </q-item>
                        
                        <q-item>
                          <q-item-section avatar>
                            <q-icon name="access_time" color="primary" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>Last Active</q-item-label>
                            <q-item-label caption>{{ selectedUser.lastActive || 'Never' }}</q-item-label>
                          </q-item-section>
                        </q-item>

                        <q-item>
                          <q-item-section avatar>
                            <q-icon name="location_on" color="primary" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>Location</q-item-label>
                            <q-item-label caption>{{ selectedUser.location || 'Not specified' }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </div>
                  </div>
                </q-tab-panel>

                <q-tab-panel name="activity">
                  <div class="text-subtitle2 text-weight-medium q-mb-md">Recent Activity</div>
                  <q-timeline color="primary">
                    <q-timeline-entry
                      v-for="activity in selectedUser.recentActivity || []"
                      :key="activity.id"
                      :title="activity.title"
                      :subtitle="activity.time"
                      :icon="activity.icon"
                    >
                      <div>{{ activity.description }}</div>
                    </q-timeline-entry>
                  </q-timeline>
                </q-tab-panel>

                <q-tab-panel name="permissions">
                  <div class="text-subtitle2 text-weight-medium q-mb-md">User Permissions</div>
                  <div class="row q-col-gutter-sm">
                    <div class="col-12 col-sm-6" v-for="permission in availablePermissions" :key="permission.key">
                      <q-item>
                        <q-item-section avatar>
                          <q-icon 
                            :name="selectedUser.permissions?.includes(permission.key) ? 'check_circle' : 'cancel'"
                            :color="selectedUser.permissions?.includes(permission.key) ? 'positive' : 'negative'"
                          />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ permission.label }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </div>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-lg q-gutter-md">
          <q-btn 
            flat 
            label="Close" 
            class="modern-btn" 
            @click="showViewUserDialog = false" 
          />
          <q-btn 
            label="Edit User" 
            icon="edit"
            class="modern-btn btn-primary" 
            @click="editUserFromView" 
          />
          <q-btn 
            label="Send Message" 
            icon="email"
            class="modern-btn btn-secondary" 
            @click="sendMessageFromView" 
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// Reactive data
const showAddUserDialog = ref(false)
const showViewUserDialog = ref(false)
const searchQuery = ref('')
const filterRole = ref('All')
const filterStatus = ref('All')
const filterDepartment = ref('All')
const sortBy = ref('name')
const viewMode = ref('table')
const selectedUser = ref(null)
const selectedUsers = ref([])
const addUserStep = ref(1)
const userDetailTab = ref('details')

// Pagination
const tablePagination = ref({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

// Form data
const newUser = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  role: '',
  department: '',
  jobTitle: '',
  avatar: '',
  active: true,
  emailNotifications: true,
  twoFactorAuth: false,
  sendWelcomeEmail: true,
  permissions: []
})

// Options
const roleOptions = ['Admin', 'Manager', 'Editor', 'User', 'Viewer']
const departmentOptions = ['IT', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations', 'Support']
const statusOptions = ['All', 'Active', 'Inactive', 'Pending', 'Suspended']
const sortOptions = [
  { label: 'Name', value: 'name' },
  { label: 'Email', value: 'email' },
  { label: 'Role', value: 'role' },
  { label: 'Department', value: 'department' },
  { label: 'Join Date', value: 'joinDate' },
  { label: 'Last Active', value: 'lastActive' }
]

const viewModeOptions = [
  { label: 'Table', value: 'table', icon: 'table_view' },
  { label: 'Cards', value: 'cards', icon: 'view_module' }
]

const availablePermissions = [
  { key: 'read_users', label: 'View Users' },
  { key: 'write_users', label: 'Manage Users' },
  { key: 'read_reports', label: 'View Reports' },
  { key: 'write_reports', label: 'Create Reports' },
  { key: 'admin_settings', label: 'Admin Settings' },
  { key: 'system_config', label: 'System Configuration' }
]

// Enhanced stats
const userStats = [
  { 
    title: 'Total Users', 
    value: '2,543', 
    icon: 'people', 
    change: '+12.5%', 
    trend: 'up',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    filter: 'all'
  },
  { 
    title: 'Active Users', 
    value: '2,234', 
    icon: 'online_prediction', 
    change: '+8.2%', 
    trend: 'up',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    filter: 'active'
  },
  { 
    title: 'New This Month', 
    value: '156', 
    icon: 'person_add', 
    change: '+23.1%', 
    trend: 'up',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    filter: 'new'
  },
  { 
    title: 'Pending Approval', 
    value: '12', 
    icon: 'pending', 
    change: '+2', 
    trend: 'up',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    filter: 'pending'
  }
]

// Enhanced table columns
const columns = [
  { name: 'avatar', label: '', field: 'avatar', align: 'center', style: 'width: 60px' },
  { name: 'name', required: true, label: 'Name', align: 'left', field: 'name', sortable: true },
  { name: 'role', align: 'left', label: 'Role', field: 'role', sortable: true },
  { name: 'department', align: 'left', label: 'Department', field: 'department', sortable: true },
  { name: 'status', align: 'center', label: 'Status', field: 'status', sortable: true },
  { name: 'lastActive', align: 'left', label: 'Last Active', field: 'lastActive', sortable: true },
  { name: 'actions', align: 'center', label: 'Actions', field: 'actions', style: 'width: 200px' }
]

// Enhanced users data
const users = ref([
  { 
    id: 1, 
    name: 'John Doe', 
    email: 'john@example.com', 
    role: 'Admin', 
    department: 'IT', 
    status: 'Active',
    joinDate: 'Jan 15, 2023',
    lastActive: 'Today, 2:30 PM',
    lastActiveDate: new Date(),
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    permissions: ['read_users', 'write_users', 'admin_settings'],
    recentActivity: [
      { id: 1, title: 'Logged in', description: 'User logged into the system', time: '2 hours ago', icon: 'login' },
      { id: 2, title: 'Updated profile', description: 'Changed profile information', time: '1 day ago', icon: 'edit' }
    ]
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    email: 'jane@example.com', 
    role: 'Manager', 
    department: 'Sales', 
    status: 'Active',
    joinDate: 'Feb 20, 2023',
    lastActive: 'Yesterday, 4:15 PM',
    lastActiveDate: new Date(Date.now() - 86400000),
    phone: '+1 (555) 234-5678',
    location: 'Los Angeles, USA',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    permissions: ['read_users', 'read_reports', 'write_reports']
  },
  { 
    id: 3, 
    name: 'Bob Johnson', 
    email: 'bob@example.com', 
    role: 'User', 
    department: 'Marketing', 
    status: 'Inactive',
    joinDate: 'Mar 10, 2023',
    lastActive: '3 days ago',
    lastActiveDate: new Date(Date.now() - 259200000),
    phone: '+1 (555) 345-6789',
    location: 'Chicago, USA',
    permissions: ['read_users']
  },
  { 
    id: 4, 
    name: 'Alice Brown', 
    email: 'alice@example.com', 
    role: 'Editor', 
    department: 'Content', 
    status: 'Active',
    joinDate: 'Apr 5, 2023',
    lastActive: 'Today, 10:45 AM',
    lastActiveDate: new Date(),
    phone: '+1 (555) 456-7890',
    location: 'Miami, USA',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    permissions: ['read_users', 'write_reports']
  },
  { 
    id: 5, 
    name: 'Charlie Wilson', 
    email: 'charlie@example.com', 
    role: 'User', 
    department: 'Support', 
    status: 'Pending',
    joinDate: 'May 12, 2023',
    lastActive: 'Never',
    lastActiveDate: null,
    phone: '+1 (555) 567-8901',
    location: 'Seattle, USA',
    permissions: []
  },
  { 
    id: 6, 
    name: 'Diana Prince', 
    email: 'diana@example.com', 
    role: 'Manager', 
    department: 'HR', 
    status: 'Active',
    joinDate: 'Jun 8, 2023',
    lastActive: '2 hours ago',
    lastActiveDate: new Date(Date.now() - 7200000),
    phone: '+1 (555) 678-9012',
    location: 'Boston, USA',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
    permissions: ['read_users', 'write_users']
  }
])

// Computed properties
const filteredUsers = computed(() => {
  let filtered = users.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.department?.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    )
  }

  if (filterRole.value && filterRole.value !== 'All') {
    filtered = filtered.filter(user => user.role === filterRole.value)
  }

  if (filterStatus.value && filterStatus.value !== 'All') {
    filtered = filtered.filter(user => user.status === filterStatus.value)
  }

  if (filterDepartment.value && filterDepartment.value !== 'All') {
    filtered = filtered.filter(user => user.department === filterDepartment.value)
  }

  // Sort
  if (sortBy.value) {
    filtered.sort((a, b) => {
      const aVal = a[sortBy.value] || ''
      const bVal = b[sortBy.value] || ''
      return aVal.localeCompare(bVal)
    })
  }

  return filtered
})

// Methods
const onRequest = (props) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  
  tablePagination.value.page = page
  tablePagination.value.rowsPerPage = rowsPerPage
  tablePagination.value.sortBy = sortBy
  tablePagination.value.descending = descending
  tablePagination.value.rowsNumber = filteredUsers.value.length
}

const getStatusColor = (status) => {
  const colors = {
    'Active': 'positive',
    'Inactive': 'negative',
    'Pending': 'warning',
    'Suspended': 'negative'
  }
  return colors[status] || 'grey'
}

const getStatusIcon = (status) => {
  const icons = {
    'Active': 'check_circle',
    'Inactive': 'cancel',
    'Pending': 'schedule',
    'Suspended': 'block'
  }
  return icons[status] || 'help'
}

const getTimeAgo = (date) => {
  if (!date) return 'Never'
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor(diff / (1000 * 60))
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  return 'Just now'
}

const filterByStatus = (filter) => {
  switch (filter) {
    case 'all':
      filterStatus.value = 'All'
      break
    case 'active':
      filterStatus.value = 'Active'
      break
    case 'new':
      // Filter by users joined this month
      break
    case 'pending':
      filterStatus.value = 'Pending'
      break
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  filterRole.value = 'All'
  filterStatus.value = 'All'
  filterDepartment.value = 'All'
  sortBy.value = 'name'
}

const addUser = () => {
  if (newUser.value.firstName && newUser.value.lastName && newUser.value.email && newUser.value.role) {
    const newId = Math.max(...users.value.map(u => u.id)) + 1
    users.value.push({
      id: newId,
      name: `${newUser.value.firstName} ${newUser.value.lastName}`,
      email: newUser.value.email,
      role: newUser.value.role,
      department: newUser.value.department,
      status: newUser.value.active ? 'Active' : 'Inactive',
      joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      lastActive: 'Never',
      lastActiveDate: null,
      phone: newUser.value.phone,
      avatar: newUser.value.avatar,
      permissions: newUser.value.permissions
    })
    
    closeAddUserDialog()
    
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

const closeAddUserDialog = () => {
  showAddUserDialog.value = false
  addUserStep.value = 1
  newUser.value = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    role: '',
    department: '',
    jobTitle: '',
    avatar: '',
    active: true,
    emailNotifications: true,
    twoFactorAuth: false,
    sendWelcomeEmail: true,
    permissions: []
  }
}

const viewUser = (user) => {
  selectedUser.value = user
  showViewUserDialog.value = true
  userDetailTab.value = 'details'
}

const editUser = (user) => {
  $q.notify({
    message: `Edit user: ${user.name}`,
    icon: 'edit',
    timeout: 1000
  })
}

const editUserFromView = () => {
  showViewUserDialog.value = false
  if (selectedUser.value) {
    editUser(selectedUser.value)
  }
}

const sendMessage = (user) => {
  $q.notify({
    message: `Send message to: ${user.name}`,
    icon: 'email',
    timeout: 1000
  })
}

const sendMessageFromView = () => {
  showViewUserDialog.value = false
  if (selectedUser.value) {
    sendMessage(selectedUser.value)
  }
}

const toggleUserStatus = (user) => {
  const newStatus = user.status === 'Active' ? 'Inactive' : 'Active'
  user.status = newStatus
  
  $q.notify({
    type: 'positive',
    message: `User ${newStatus.toLowerCase()} successfully!`,
    icon: newStatus === 'Active' ? 'check_circle' : 'block'
  })
}

const resetPassword = (user) => {
  $q.notify({
    message: `Password reset email sent to: ${user.email}`,
    icon: 'lock_reset',
    timeout: 2000
  })
}

const deleteUser = (user) => {
  $q.dialog({
    title: 'Confirm Delete',
    message: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
    cancel: true,
    persistent: true,
    color: 'negative'
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

const uploadAvatar = () => {
  $q.notify({
    type: 'info',
    message: 'Avatar upload feature coming soon!',
    icon: 'photo_camera'
  })
}

const importUsers = () => {
  $q.notify({
    type: 'info',
    message: 'User import feature coming soon!',
    icon: 'upload'
  })
}

const exportUsers = () => {
  $q.notify({
    type: 'positive',
    message: 'Users exported successfully!',
    icon: 'download'
  })
}

const bulkActions = () => {
  $q.notify({
    type: 'info',
    message: 'Bulk actions feature coming soon!',
    icon: 'checklist'
  })
}

onMounted(() => {
  tablePagination.value.rowsNumber = users.value.length
})
</script>

<style scoped>
.users-page {
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

.stat-card {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.user-avatar {
  border: 3px solid rgba(102, 126, 234, 0.2);
  transition: all 0.3s ease;
}

.user-avatar:hover {
  border-color: rgba(102, 126, 234, 0.4);
  transform: scale(1.05);
}

.user-avatar img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.user-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.user-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-color: rgba(102, 126, 234, 0.3);
}

.add-user-card {
  min-width: 700px;
  max-width: 900px;
  width: 90vw;
}

.view-user-card {
  min-width: 800px;
  max-width: 1000px;
  width: 90vw;
}

.profile-avatar {
  border: 4px solid rgba(102, 126, 234, 0.2);
  transition: all 0.3s ease;
}

.profile-avatar:hover {
  border-color: rgba(102, 126, 234, 0.4);
  transform: scale(1.05);
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
  .users-page {
    padding: 16px;
  }
  
  .page-header .row {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .add-user-card,
  .view-user-card {
    min-width: unset;
    width: 95vw;
    margin: 16px;
  }
}

@media (max-width: 599px) {
  .users-page {
    padding: 12px;
  }
  
  .page-header .text-h4 {
    font-size: 1.5rem !important;
  }
  
  .add-user-card .q-card-section,
  .view-user-card .q-card-section {
    padding: 16px !important;
  }
  
  .user-card {
    margin-bottom: 16px;
  }
}

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
</style>