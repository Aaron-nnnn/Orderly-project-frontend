import { ref, computed } from 'vue'
import api from '@/services/api'

const storedUser = localStorage.getItem("user")
const user = ref(storedUser && storedUser !== "undefined"
  ? JSON.parse(storedUser)
  : null
)
const loading = ref(false)
const error = ref(null)

export function useAuth() {
    const isAuthenticated = computed(() => !!user.value)
    const isAdmin = computed(() => user.value?.role_id === 1)
    const isRestaurant = computed(() => user.value?.role_id === 2)
    const isUser = computed(() => user.value?.role_id === 3)

    
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

                console.log(user.value)

                localStorage.setItem("authToken", token);
                localStorage.setItem("user", JSON.stringify(user.value));

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

    
    async function register(formData) {
        loading.value = true
        error.value = null

        try {
            const response = await api.post('register', formData)
            const { token, user: userData } = response.data

            if (!userData) {
                throw new Error('Invalid response format from server')
            }

            user.value = userData
        
            if (token) {
                localStorage.setItem("authToken", token)
            }
            localStorage.setItem("user", JSON.stringify(user.value))

            return response

        } catch (err) {
            error.value = err.response?.data?.message || 'Registration failed'
            throw err
        } finally {
            loading.value = false
        }
    }

    
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
        isRestaurant,
        isUser,
        login,
        register,
        logout,
    }
}