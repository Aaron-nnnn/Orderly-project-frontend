<script setup>
import { ref, onMounted } from "vue"
import api from "@/services/api"

const token = localStorage.getItem("authToken")

let userDetails = null
try {
  userDetails = JSON.parse(localStorage.getItem("user"))
} catch (e) {
  userDetails = null
}

const status = ref("none") 
const orders = ref([])

const fetchStatus = async () => {
  try {
    const res = await api.get("owner-request/status", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    status.value = res.data.status || "none"
  } catch (e) {
    console.log(e)
  }
}

const requestOwnership = async () => {
  try {
    await api.post(
      "owner-request",
      { message: "Request to become owner" },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    status.value = "pending"
  } catch (e) {
    console.log(e)
  }
}

const fetchOrders = async () => {
  try {
    const res = await api.get("getOrders", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    orders.value = res.data
  } catch (e) {
    console.log(e)
  }
}

onMounted(() => {
  fetchStatus()
  fetchOrders()
})
</script>

<template>
  <v-container width="50%" style="background-color:#FFFAF0" class="mt-12">
    <v-row>
      <v-col>
        <v-card class="text-left pa-4">
          <v-img
            src="296fe121-5dfa-43f4-98b5-db50019738a7.jpg"
            class="mx-auto"
            width="250"
            height="200"
          />

          <v-card-title>Name: {{ userDetails?.name }}</v-card-title>
          <v-card-title>Email: {{ userDetails?.email }}</v-card-title>
          <v-card-title>Contact: {{ userDetails?.phoneNumber }}</v-card-title>

          <v-card-text>
            <div v-if="status === 'pending'">
               Your request is pending approval
            </div>

            <div v-else-if="status === 'approved'">
               You are now an owner
            </div>

            <div v-else-if="status === 'rejected'">
               Request was rejected
            </div>

            <v-btn
              v-if="userDetails?.role_id === 3"
              color="primary"
              class="mt-3"
              @click="requestOwnership"
            >
              Request to be Owner
            </v-btn>

            <v-divider class="my-4" />

            <h3 class="text-h6 font-weight-bold mb-2">
               My Orders
            </h3>

            <div v-if="orders.length === 0">
              No orders yet.
            </div>

            <v-card
              v-for="order in orders"
              :key="order.id"
              class="mb-2 pa-3"
              variant="outlined"
              >
              <div>Order ID: {{ order.id }}</div>
              <div>Type: {{ order.order_type }}</div>
              <div>Total: KES {{ order.total_amount }}</div>
              <div>Status: {{ order.status }}</div>
              <div class="mt-2">
                <strong>Items:</strong>
                <div
                  v-for="item in order.items"
                  :key="item.id"
                  class="ml-2"
                >
                  • {{ item.menu_item.name }} x {{ item.quantity }}
                </div>
              </div>
              <v-btn
                v-if="order.status !== 'completed' && order.status == 'ready'"
                color="green"
                class="mt-2"
                @click="$router.push({
                  path: '/payments',
                  query: {
                    order_id: order.id,
                    total: order.total_amount
                  }
                })"
                >
                Pay Now
             </v-btn>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>