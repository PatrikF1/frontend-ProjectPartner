<template>
  <div
    class="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gray-900 text-white"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-sm mt-4">
      <img
        class="mx-auto w-full max-w-xs h-auto object-contain"
        :src="logo"
        alt="ProjectPartner"
        style="background: transparent; max-height: 100px"
      />
      <h2 class="mt-4 text-center text-2xl/9 font-bold tracking-tight text-white">
        Create a new account
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-5" @submit.prevent="onSubmit">
        <div>
          <label class="block text-sm/6 font-medium text-gray-100">First name</label>
          <input
            v-model.trim="form.name"
            type="text"
            required
            class="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            placeholder="Enter your first name"
          />
        </div>

        <div>
          <label class="block text-sm/6 font-medium text-gray-100">Last name</label>
          <input
            v-model.trim="form.lastname"
            type="text"
            required
            class="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            placeholder="Enter your last name"
          />
        </div>

        <div>
          <label class="block text-sm/6 font-medium text-gray-100">Email</label>
          <input
            v-model.trim="form.email"
            type="email"
            required
            autocomplete="email"
            class="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label class="block text-sm/6 font-medium text-gray-100">Password</label>
          <input
            v-model="form.password"
            type="password"
            required
            autocomplete="new-password"
            class="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            placeholder="Enter your password"
          />
          <p class="mt-1 text-xs text-gray-400">
            Password must be at least 8 characters long and contain at least one uppercase letter,
            one lowercase letter, one number, and one special character.
          </p>
        </div>

        <div>
          <label class="block text-sm/6 font-medium text-gray-100">Confirm password</label>
          <input
            v-model="form.c_password"
            type="password"
            required
            autocomplete="new-password"
            class="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            placeholder="Re-enter your password"
          />
        </div>

        <div>
          <label class="block text-sm/6 font-medium text-gray-100"
            >Admin Private Key (optional)</label
          >
          <input
            v-model.trim="form.adminKey"
            type="password"
            autocomplete="off"
            class="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            placeholder="Enter admin private key to register as admin"
          />
          <p class="mt-1 text-xs text-gray-400">Leave empty to register as a regular user.</p>
        </div>

        <Alert ref="alertRef" />

        <div>
          <button
            type="submit"
            :disabled="authStore.isLoading"
            class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-60"
          >
            {{ authStore.isLoading ? 'Signing up…' : 'Sign up' }}
          </button>
        </div>
      </form>

      <p class="mt-8 text-center text-sm/6 text-gray-400">
        Already have an account?
        <RouterLink to="/login" class="font-semibold text-indigo-400 hover:text-indigo-300"
          >Sign in</RouterLink
        >
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Alert from '@/components/Alert.vue'
import logo from '@/assets/pp_logo.png'

var router = useRouter()
var authStore = useAuthStore()
var alertRef = ref(null)

var form = reactive({
  name: '',
  lastname: '',
  email: '',
  password: '',
  c_password: '',
  adminKey: '',
})

function validatePassword(password) {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long'
  }
  var hasUpperCase = false
  var hasLowerCase = false
  var hasNumber = false
  var hasSpecial = false
  for (var i = 0; i < password.length; i++) {
    var char = password[i]
    if (char >= 'A' && char <= 'Z') {
      hasUpperCase = true
    } else if (char >= 'a' && char <= 'z') {
      hasLowerCase = true
    } else if (char >= '0' && char <= '9') {
      hasNumber = true
    } else {
      hasSpecial = true
    }
  }
  if (!hasUpperCase) {
    return 'Password must contain at least one uppercase letter'
  }
  if (!hasLowerCase) {
    return 'Password must contain at least one lowercase letter'
  }
  if (!hasNumber) {
    return 'Password must contain at least one number'
  }
  if (!hasSpecial) {
    return 'Password must contain at least one special character'
  }
  return ''
}

async function onSubmit() {
  var passwordError = validatePassword(form.password)
  if (passwordError) {
    if (alertRef.value) {
      alertRef.value.show('error', passwordError)
    }
    return
  }

  if (form.password !== form.c_password) {
    if (alertRef.value) {
      alertRef.value.show('error', 'Passwords do not match')
    }
    return
  }

  authStore.setLoading(true)
  try {
    var nameValue = form.name.trim()
    var lastnameValue = form.lastname.trim()
    var emailValue = form.email.trim()
    emailValue = emailValue.toLowerCase()

    var payload = {
      name: nameValue,
      lastname: lastnameValue,
      email: emailValue,
      password: form.password,
      c_password: form.c_password,
    }

    if (form.adminKey && form.adminKey.trim()) {
      payload.adminKey = form.adminKey.trim()
    }

    var response = await authStore.register(payload)

    authStore.setUser(response)
    authStore.setToken(response.token)

    if (alertRef.value) {
      alertRef.value.show('success', 'Account created successfully! Redirecting...', {
        autoClose: true,
        duration: 2000,
      })
    }

    setTimeout(function () {
      router.push('/dashboard')
    }, 200)
  } catch (error) {
    var errorMessage = 'Error registering'
    if (error && error.response && error.response.data && error.response.data.msg) {
      errorMessage = error.response.data.msg
    }
    if (alertRef.value) {
      alertRef.value.show('error', errorMessage)
    }
    console.error(error)
  } finally {
    authStore.setLoading(false)
  }
}
</script>
