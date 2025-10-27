<template>
  <q-dialog v-model="showAuth" persistent class="auth-dialog">
    <q-card class="auth-card">
      <q-card-section>
        <div class="text-h5 text-weight-bold text-center q-mb-md">
          <q-icon name="dashboard" class="q-mr-sm text-primary" size="md" />
          Dashboard
        </div>
        <div class="text-h6 text-center">{{ isLogin ? 'Welcome Back' : 'Create Account' }}</div>
        <div class="text-subtitle2 text-grey-6">
          {{ isLogin ? 'Sign in to your account' : 'Sign up to get started' }}
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="handleAuth" class="q-gutter-md">
          <q-input
            v-model="email"
            label="Email"
            type="email"
            outlined
            class="modern-input"
            :rules="[val => !!val || 'Email is required']"
          />
          
          <q-input
            v-model="password"
            label="Password"
            type="password"
            outlined
            class="modern-input"
            :rules="[val => !!val || 'Password is required']"
          />

          <div class="row q-gutter-sm">
            <q-btn
              :label="isLogin ? 'Sign In' : 'Sign Up'"
              type="submit"
              color="primary"
              class="modern-btn btn-primary full-width"
              :loading="loading"
            />
          </div>
        </q-form>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn
          flat
          class="modern-btn"
          :label="isLogin ? 'Need an account? Sign up' : 'Have an account? Sign in'"
          @click="isLogin = !isLogin"
        />
        <q-btn
          flat
          class="modern-btn"
          label="Skip for now"
          color="grey-6"
          @click="skipAuth"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { supabase } from '../lib/supabase'

const $q = useQuasar()
const showAuth = ref(false)
const isLogin = ref(true)
const email = ref('')
const password = ref('')
const loading = ref(false)

const emit = defineEmits<{
  authenticated: [user: any]
}>()

const handleAuth = async () => {
  loading.value = true
  
  try {
    let result
    
    if (isLogin.value) {
      result = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value
      })
    } else {
      result = await supabase.auth.signUp({
        email: email.value,
        password: password.value
      })
    }

    if (result.error) throw result.error

    if (result.data.user) {
      showAuth.value = false
      emit('authenticated', result.data.user)
      
      $q.notify({
        type: 'positive',
        message: isLogin.value ? 'Welcome back!' : 'Account created successfully!',
        icon: 'check_circle'
      })
    }
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Authentication failed',
      icon: 'error'
    })
  } finally {
    loading.value = false
  }
}

const skipAuth = () => {
  showAuth.value = false
  emit('authenticated', { email: 'demo@example.com', id: 'demo-user' })
  
  $q.notify({
    type: 'info',
    message: 'Continuing in demo mode',
    icon: 'info'
  })
}

const checkAuth = async () => {
  // Don't show auth modal automatically
  // Only show when explicitly called
}

onMounted(() => {
  // Don't check auth on mount
})

defineExpose({
  show: () => { showAuth.value = true }
})
</script>

<style scoped>
.auth-dialog .q-dialog__inner {
  padding: 16px;
}

.auth-card {
  min-width: 400px;
  max-width: 500px;
  width: 90vw;
  background: rgba(255, 255, 255, 1);
  border-radius: 24px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

@media (max-width: 599px) {
  .auth-card {
    min-width: unset;
    width: 95vw;
    margin: 16px;
  }
}

</style>