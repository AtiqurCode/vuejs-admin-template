<template>
  <div class="settings-page">
    <!-- Page Header -->
    <div class="page-header q-mb-lg">
      <div class="row items-center justify-between">
        <div>
          <div class="text-h4 text-weight-bold q-mb-sm text-white">
            <q-icon name="settings" class="q-mr-sm" />
            Settings
          </div>
          <div class="text-subtitle1 text-white" style="opacity: 0.8;">
            Manage your account preferences and application settings
          </div>
        </div>
      </div>
    </div>

    <div class="row q-col-gutter-lg">
      <!-- User Profile Settings -->
      <div class="col-12 col-lg-8">
        <q-card class="content-card q-mb-lg">
          <q-card-section>
            <div class="text-h5 text-weight-bold q-mb-md">
              <q-icon name="person" class="q-mr-sm text-primary" />
              Profile Information
            </div>
            <div class="text-subtitle2 text-grey-6 q-mb-lg">
              Update your personal information and profile details
            </div>

            <div class="row q-col-gutter-md">
              <!-- Profile Picture Section -->
              <div class="col-12 text-center q-mb-lg">
                <div class="profile-picture-section">
                  <q-avatar size="120px" class="profile-avatar q-mb-md">
                    <img v-if="profileForm.avatar" :src="profileForm.avatar" />
                    <q-icon v-else name="person" size="4rem" />
                  </q-avatar>
                  <div>
                    <q-btn
                      flat
                      icon="photo_camera"
                      label="Change Photo"
                      class="modern-btn btn-primary"
                      @click="changeProfilePicture"
                    />
                  </div>
                </div>
              </div>

              <!-- Profile Form -->
              <div class="col-12 col-md-6">
                <q-input
                  v-model="profileForm.firstName"
                  label="First Name"
                  outlined
                  class="modern-input q-mb-md"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="profileForm.lastName"
                  label="Last Name"
                  outlined
                  class="modern-input q-mb-md"
                />
              </div>
              <div class="col-12">
                <q-input
                  v-model="profileForm.email"
                  label="Email Address"
                  type="email"
                  outlined
                  class="modern-input q-mb-md"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="profileForm.phone"
                  label="Phone Number"
                  outlined
                  class="modern-input q-mb-md"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="profileForm.department"
                  label="Department"
                  outlined
                  class="modern-input q-mb-md"
                />
              </div>
              <div class="col-12">
                <q-input
                  v-model="profileForm.bio"
                  label="Bio"
                  type="textarea"
                  outlined
                  :rows="3"
                  class="modern-input q-mb-md"
                />
              </div>
            </div>

            <div class="row justify-end q-gutter-md q-mt-md">
              <q-btn
                flat
                label="Cancel"
                class="modern-btn"
                @click="resetProfileForm"
              />
              <q-btn
                label="Save Changes"
                icon="save"
                class="modern-btn btn-primary"
                @click="saveProfile"
              />
            </div>
          </q-card-section>
        </q-card>

        <!-- Security Settings -->
        <q-card class="content-card">
          <q-card-section>
            <div class="text-h5 text-weight-bold q-mb-md">
              <q-icon name="security" class="q-mr-sm text-primary" />
              Security Settings
            </div>
            <div class="text-subtitle2 text-grey-6 q-mb-lg">
              Manage your password and security preferences
            </div>

            <div class="column q-gutter-md">
              <q-input
                v-model="securityForm.currentPassword"
                label="Current Password"
                type="password"
                outlined
                class="modern-input"
              />
              <q-input
                v-model="securityForm.newPassword"
                label="New Password"
                type="password"
                outlined
                class="modern-input"
              />
              <q-input
                v-model="securityForm.confirmPassword"
                label="Confirm New Password"
                type="password"
                outlined
                class="modern-input"
              />
            </div>

            <div class="row justify-end q-gutter-md q-mt-md">
              <q-btn
                flat
                label="Cancel"
                class="modern-btn"
                @click="resetSecurityForm"
              />
              <q-btn
                label="Update Password"
                icon="lock"
                class="modern-btn btn-primary"
                @click="updatePassword"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Settings Sidebar -->
      <div class="col-12 col-lg-4">
        <div class="column q-gutter-lg">
          <!-- Theme Settings -->
          <q-card class="content-card">
            <q-card-section>
              <div class="text-h6 text-weight-bold q-mb-md">
                <q-icon name="palette" class="q-mr-sm text-primary" />
                Theme Settings
              </div>

              <div class="column q-gutter-md">
                <div class="theme-option">
                  <div class="text-body1 text-weight-medium q-mb-sm">Color Scheme</div>
                  <q-option-group
                    v-model="themeSettings.colorScheme"
                    :options="colorSchemeOptions"
                    color="primary"
                    @update:model-value="updateColorScheme"
                  />
                </div>

                <q-separator />

                <div class="theme-option">
                  <div class="text-body1 text-weight-medium q-mb-sm">Font Size</div>
                  <q-slider
                    v-model="themeSettings.fontSize"
                    :min="12"
                    :max="18"
                    :step="1"
                    label
                    color="primary"
                    @update:model-value="updateFontSize"
                  />
                  <div class="text-caption text-grey-6 q-mt-xs">
                    Current: {{ themeSettings.fontSize }}px
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Notification Settings -->
          <q-card class="content-card">
            <q-card-section>
              <div class="text-h6 text-weight-bold q-mb-md">
                <q-icon name="notifications" class="q-mr-sm text-primary" />
                Notifications
              </div>

              <div class="column q-gutter-md">
                <q-toggle
                  v-model="notificationSettings.pushEnabled"
                  label="Push Notifications"
                  color="primary"
                  class="text-weight-medium"
                />
                <q-toggle
                  v-model="notificationSettings.emailEnabled"
                  label="Email Notifications"
                  color="primary"
                  class="text-weight-medium"
                />
                <q-toggle
                  v-model="notificationSettings.soundEnabled"
                  label="Sound Notifications"
                  color="primary"
                  class="text-weight-medium"
                />
                <q-toggle
                  v-model="notificationSettings.desktopEnabled"
                  label="Desktop Notifications"
                  color="primary"
                  class="text-weight-medium"
                />
              </div>

              <div class="row justify-end q-mt-md">
                <q-btn
                  label="Save Preferences"
                  icon="save"
                  class="modern-btn btn-primary"
                  @click="saveNotificationSettings"
                />
              </div>
            </q-card-section>
          </q-card>

          <!-- Privacy Settings -->
          <q-card class="content-card">
            <q-card-section>
              <div class="text-h6 text-weight-bold q-mb-md">
                <q-icon name="privacy_tip" class="q-mr-sm text-primary" />
                Privacy
              </div>

              <div class="column q-gutter-md">
                <q-toggle
                  v-model="privacySettings.profileVisible"
                  label="Profile Visible to Others"
                  color="primary"
                  class="text-weight-medium"
                />
                <q-toggle
                  v-model="privacySettings.activityVisible"
                  label="Show Activity Status"
                  color="primary"
                  class="text-weight-medium"
                />
                <q-toggle
                  v-model="privacySettings.dataCollection"
                  label="Allow Data Collection"
                  color="primary"
                  class="text-weight-medium"
                />
              </div>

              <div class="row justify-end q-mt-md">
                <q-btn
                  label="Update Privacy"
                  icon="shield"
                  class="modern-btn btn-primary"
                  @click="savePrivacySettings"
                />
              </div>
            </q-card-section>
          </q-card>

          <!-- Account Actions -->
          <q-card class="content-card">
            <q-card-section>
              <div class="text-h6 text-weight-bold q-mb-md">
                <q-icon name="account_circle" class="q-mr-sm text-primary" />
                Account Actions
              </div>

              <div class="column q-gutter-sm">
                <q-btn
                  flat
                  icon="download"
                  label="Export Data"
                  class="modern-btn btn-secondary full-width"
                  @click="exportData"
                />
                <q-btn
                  flat
                  icon="refresh"
                  label="Reset Settings"
                  class="modern-btn full-width"
                  @click="resetSettings"
                />
                <q-btn
                  flat
                  icon="delete_forever"
                  label="Delete Account"
                  class="modern-btn text-negative full-width"
                  @click="deleteAccount"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const profileForm = ref({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  department: 'Engineering',
  bio: 'Passionate software developer with 5+ years of experience in building modern web applications.',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'
})

const securityForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const themeSettings = ref({
  colorScheme: 'light',
  fontSize: 14
})

const notificationSettings = ref({
  pushEnabled: true,
  emailEnabled: true,
  soundEnabled: false,
  desktopEnabled: true
})

const privacySettings = ref({
  profileVisible: true,
  activityVisible: true,
  dataCollection: false
})

const colorSchemeOptions = [
  { label: 'Light', value: 'light' },
  { label: 'Auto', value: 'auto' }
]

const changeProfilePicture = () => {
  $q.notify({
    type: 'info',
    message: 'Profile picture upload feature coming soon!',
    icon: 'photo_camera'
  })
}

const saveProfile = () => {
  $q.notify({
    type: 'positive',
    message: 'Profile updated successfully!',
    icon: 'check_circle'
  })
}

const resetProfileForm = () => {
  // Reset to original values
  $q.notify({
    type: 'info',
    message: 'Changes discarded',
    icon: 'refresh'
  })
}

const updatePassword = () => {
  if (!securityForm.value.currentPassword || !securityForm.value.newPassword) {
    $q.notify({
      type: 'negative',
      message: 'Please fill in all password fields',
      icon: 'error'
    })
    return
  }

  if (securityForm.value.newPassword !== securityForm.value.confirmPassword) {
    $q.notify({
      type: 'negative',
      message: 'New passwords do not match',
      icon: 'error'
    })
    return
  }

  $q.notify({
    type: 'positive',
    message: 'Password updated successfully!',
    icon: 'lock'
  })
  
  resetSecurityForm()
}

const resetSecurityForm = () => {
  securityForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}

const updateColorScheme = (value: string) => {
  $q.notify({
    type: 'info',
    message: `Color scheme changed to ${value}`,
    icon: 'palette'
  })
}

const updateFontSize = (value: number) => {
  document.documentElement.style.fontSize = `${value}px`
}

const saveNotificationSettings = () => {
  $q.notify({
    type: 'positive',
    message: 'Notification preferences saved!',
    icon: 'notifications'
  })
}

const savePrivacySettings = () => {
  $q.notify({
    type: 'positive',
    message: 'Privacy settings updated!',
    icon: 'privacy_tip'
  })
}

const exportData = () => {
  $q.notify({
    type: 'info',
    message: 'Data export started. You will receive an email when ready.',
    icon: 'download'
  })
}

const resetSettings = () => {
  $q.dialog({
    title: 'Reset Settings',
    message: 'Are you sure you want to reset all settings to default?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    $q.notify({
      type: 'positive',
      message: 'Settings reset to default!',
      icon: 'refresh'
    })
  })
}

const deleteAccount = () => {
  $q.dialog({
    title: 'Delete Account',
    message: 'This action cannot be undone. Are you sure you want to delete your account?',
    cancel: true,
    persistent: true,
    color: 'negative'
  }).onOk(() => {
    $q.notify({
      type: 'negative',
      message: 'Account deletion initiated. You will receive a confirmation email.',
      icon: 'delete_forever'
    })
  })
}

onMounted(() => {
  // Initialize settings from localStorage or API
  const savedFontSize = localStorage.getItem('fontSize')
  if (savedFontSize) {
    themeSettings.value.fontSize = parseInt(savedFontSize)
    updateFontSize(themeSettings.value.fontSize)
  }
})
</script>

<style scoped>
.settings-page {
  padding: 24px;
}

.page-header {
  animation: fadeInUp 0.6s ease-out;
}

.profile-picture-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-avatar {
  border: 4px solid rgba(30, 64, 175, 0.2);
  transition: all 0.3s ease;
}

.profile-avatar:hover {
  border-color: rgba(30, 64, 175, 0.4);
  transform: scale(1.05);
}

.profile-avatar img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.theme-option {
  padding: 8px 0;
}

@media (max-width: 768px) {
  .settings-page {
    padding: 16px;
  }
  
  .page-header .text-h4 {
    font-size: 1.5rem !important;
  }
}

@media (max-width: 599px) {
  .settings-page {
    padding: 12px;
  }
  
  .profile-avatar {
    width: 80px !important;
    height: 80px !important;
  }
}
</style>