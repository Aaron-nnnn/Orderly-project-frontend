import { ref, computed } from 'vue'
import api from '@/services/api'

const storedUser = localStorage.getItem("user")

const user = ref(storedUser && storedUser !== "undefined"
  ? JSON.parse(storedUser)
  : null
)
const loading = ref(false)
const error = ref(null)
const isAdmin = ref(
  localStorage.getItem("isAdmin")
    ? JSON.parse(localStorage.getItem("isAdmin"))
    : false
)
export function useAuth() {
    const isAuthenticated = computed(() => !!user.value)

    // Login
    async function login(credentials) {
        loading.value = true
        error.value = null

        try {

        if (!credentials.email || !credentials.password) {
            throw new Error('Email and password are required')
        }

        const response = await api.post('login', credentials)
        const { token, user: userData } = response.data

        console.log(response.data)

        if (token && userData) {
            user.value = userData

            isAdmin.value = user.value.role == 1

            console.log(user.value)

            localStorage.setItem("authToken", token);
            localStorage.setItem("user", JSON.stringify(user.value));
            localStorage.setItem("isAdmin", JSON.stringify(isAdmin.value));

            return response
        } else {
            throw new Error('Invalid response format from server')
        }

        } catch (err) {
            error.value = err.response?.data?.message || err.message || 'Login failed'
            throw err
        } finally {
            loading.value = false
        }
    }

    // Register
    async function register(formData) {
        loading.value = true
        error.value = null
        try {
             const response = await api.post('register', formData)
             const { token, user: userData } = response.data
            if (token && userData) {
                isAdmin.value = user.value.role == 1
                user.value = userData
                localStorage.setItem("authToken", token);
                localStorage.setItem("user", JSON.stringify(user.value));
                localStorage.setItem("isAdmin", JSON.stringify(isAdmin.value))

                return response
            } else {
                throw new Error('Invalid response format from server')
            }
        } catch (err) {
            error.value = err.response?.data?.message || 'Registration failed'
            throw err
        } finally {
            loading.value = false
        }
    }

    // Logout
    function logout() {
        user.value = null
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        localStorage.removeItem("isAdmin");
    }
    return {
        user,
        loading,
        error,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
    }
 }