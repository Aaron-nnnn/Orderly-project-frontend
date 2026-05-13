<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const cart = ref(
  route.query.cart ? JSON.parse(route.query.cart) : []
)
const restaurantId = ref(route.query.restaurant_id)
const orderType = ref('') 
const tables = ref([])
const selectedTable = ref(null)
const loading = ref(false)
const error = ref('')

const total = computed(() => {
  return cart.value.reduce((sum, item) => {
    return sum + item.price * item.quantity
  }, 0)
})

function selectTable(table) {
  if (table.status !== 'available') return
  selectedTable.value = table
}


async function fetchTables() {
  loading.value = true
  error.value = ''

  try {
    const res = await api.get(`getRestaurantTables/${restaurantId.value}`)
    tables.value = res.data
  } catch (err) {
    error.value = 'Failed to load tables'
  } finally {
    loading.value = false
  }  
}


async function placeOrder() {
  try {
    if (!orderType.value) {
      error.value = 'Please select order type'
      return
    }

    loading.value = true
    error.value = ''

    const payload = {
      restaurant_id: restaurantId.value,
      table_id:
        orderType.value === 'dine_in'
          ? selectedTable.value?.id || null
          : null,
      order_type: orderType.value,
      total_amount: total.value,
      items: cart.value
    }

    const res = await api.post('saveOrder', payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    })

    console.log('Order success:', res.data)

    cart.value = []
    selectedTable.value = null
    orderType.value = ''

    alert('Order placed successfully!')

  } catch (err) {
    console.log(err.response?.data || err)
    error.value = err.response?.data?.message || 'Checkout failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-container>

    <h2 class="text-h4 font-weight-bold mb-4">
       Checkout
    </h2>

    <!-- ORDER TYPE -->
    <v-radio-group v-model="orderType">
      <v-radio label="Eat at Restaurant" value="dine_in" />
      <v-radio label="Take Away" value="takeaway" />
    </v-radio-group>

    <!-- TABLES -->
    <div v-if="orderType === 'dine_in'">

      <v-btn color="primary" class="mb-3" @click="fetchTables">
        Load Tables
      </v-btn>

      <v-progress-linear v-if="loading" indeterminate />

      <v-alert v-if="error" type="error">
        {{ error }}
      </v-alert>

      <v-row>
        <v-col
          v-for="table in tables"
          :key="table.id"
          cols="6"
          md="3"
        >
          <v-card
            class="pa-3 text-center"
            :color="table.status === 'available' ? 'green' : 'red'"
            dark
            @click="selectTable(table)"
          >
            <div>Table {{ table.table_number }}</div>
            <div>{{ table.status }}</div>
          </v-card>
        </v-col>
      </v-row>

      <div v-if="selectedTable" class="mt-3">
         Selected Table: {{ selectedTable.table_number }}
      </div>

    </div>

    <v-divider class="my-6" />

    <!-- ORDER SUMMARY -->
    <h3 class="text-h5 font-weight-bold mb-3">
       Order Summary
    </h3>

    <v-card class="pa-4">

      <div
        v-for="item in cart"
        :key="item.id"
        class="d-flex justify-space-between mb-2"
      >
        <span>{{ item.name }} x {{ item.quantity }}</span>
        <span>KES {{ item.price * item.quantity }}</span>
      </div>

      <v-divider class="my-3" />

      <div class="d-flex justify-space-between font-weight-bold">
        <span>Total</span>
        <span>KES {{ total }}</span>
      </div>

      <div class="mt-3">
        <strong>Order Type:</strong> {{ orderType || '-' }}
      </div>

      <div v-if="selectedTable">
        <strong>Table:</strong> {{ selectedTable.table_number }}
      </div>

    </v-card>

    <!-- CHECKOUT BUTTON -->
    <v-btn
      color="primary"
      class="mt-4"
      block
      @click="placeOrder"
    >
       Checkout Now
    </v-btn>

  </v-container>
</template>