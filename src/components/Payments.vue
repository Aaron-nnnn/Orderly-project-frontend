<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref('')

const orderId = route.query.order_id
const total = route.query.total

const amount = ref(total)
const paymentMethod = ref('')

async function pay() {
  try {
    loading.value = true
    error.value = ''

    await api.post(
      'payOrder',
      {
        order_id: orderId,
        amount_paid: amount.value,
        payment_method: paymentMethod.value
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      }
    )

    alert('Payment successful')

    router.push('/profile')

  } catch (err) {
    console.log(err.response?.data || err)

    error.value =
      err.response?.data?.message || 'Payment failed'

  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-container class="mt-10" max-width="600" style="background-color:#FFFAF0">
    <v-card class="pa-6">
       <v-row class="mb-4">
      <v-col class="text-center">
        <h1 class="text-h4 font-weight-bold d-inline-block"
            style="border-bottom: 5px solid black;"
        >
           Payments
        </h1>
      </v-col>
    </v-row>

      <div class="mb-4">
        <div>
          <strong>Order ID:</strong>
          {{ orderId }}
        </div>

        <div>
          <strong>Total Amount:</strong>
          KES {{ total }}
        </div>
      </div>

      <v-alert
        v-if="error"
        type="error"
        class="mb-4"
      >
        {{ error }}
      </v-alert>

      <v-select
        v-model="paymentMethod"
        label="Select Payment Method"
        :items="[
          'mpesa',
          'cash',
          'card'
        ]"
        variant="outlined"
        class="mb-4"
      />

      <v-text-field
        v-model="amount"
        label="Amount"
        type="number"
        variant="outlined"
        class="mb-4"
      />

      <v-btn
        color="green"
        block
        :loading="loading"
        @click="pay"
      >
        Pay Now
      </v-btn>
    </v-card>
  </v-container>
</template>