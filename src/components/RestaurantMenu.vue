<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const error = ref('')

const menuItems = ref([])
const cart = ref([])


async function fetchMenuItems() {
  loading.value = true
  try {
    const response = await api.get(`getMenuItems/${route.params.id}`)
    menuItems.value = response.data
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load menu items'
  } finally {
    loading.value = false
  }
}


function addToCart(item) {
  const exists = cart.value.find(i => i.id === item.id)

  if (exists) {
    exists.quantity++
  } else {
    cart.value.push({
      ...item,
      quantity: 1
    })
  }
}


function removeFromCart(itemId) {
  const item = cart.value.find(i => i.id === itemId)

  if (!item) return

  if (item.quantity > 1) {
    item.quantity--
  } else {
    cart.value = cart.value.filter(i => i.id !== itemId)
  }
}


const cartTotal = computed(() => {
  return cart.value.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
})


function goToCheckout() {
  router.push({
    path: '/checkout',
    query: {
      cart: JSON.stringify(cart.value),
      restaurant_id: route.params.id
    }
  })
}


onMounted(() => {
  fetchMenuItems()
})
</script>
<template>
  <v-container style="background-color:#FFFAF0">
     <v-row class="mb-4">
      <v-col class="text-center">
        <h1 class="text-h4 font-weight-bold d-inline-block"
            style="border-bottom: 5px solid black;"
        >
           Menu Items
        </h1>
      </v-col>
    </v-row>

    <v-alert v-if="error" type="error" class="mb-4">
      {{ error }}
    </v-alert>

    
    <v-progress-linear v-if="loading" indeterminate class="mb-4" />

    
    <v-row>
      <v-col
        v-for="item in menuItems"
        :key="item.id"
        cols="12"
        md="4"
        >
        <v-card class="rounded-xl" elevation="4">

          <v-img
            :src="item.image
              ? `http://127.0.0.1:8000/storage/${item.image}`
              : 'https://via.placeholder.com/400x250'"
            height="180"
            cover
          />

          <v-card-item>
            <v-card-title>
              {{ item.name }}
            </v-card-title>

            <v-card-subtitle>
              KES {{ item.price }}
            </v-card-subtitle>

            <v-card-text>
              {{ item.preparation_time }} mins
            </v-card-text>
          </v-card-item>

          <v-card-actions>
            <v-btn
              color="#7BC47F"
              block
              @click="addToCart(item)"
            >
              Add to Cart
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    
    <v-divider class="my-6" />

    <h3 class="text-h5 font-weight-bold">
      My Cart
    </h3>

    <v-list>
      <v-list-item
        v-for="item in cart"
        :key="item.id"
        >
        <v-list-item-title>
          {{ item.name }} x {{ item.quantity }}
        </v-list-item-title>

        <template v-slot:append>
          <div class="d-flex ga-5">
            <v-btn
              icon="mdi-minus"
              size="small"
              color="red"
              @click="removeFromCart(item.id)"
            />

            <v-btn
              icon="mdi-plus"
              size="small"
              color="green"
              @click="addToCart(item)"
            />
          </div>
        </template>
      </v-list-item>
    </v-list>

    <h3 class="mt-4 font-weight-bold">
      Total: KES {{ cartTotal }}
    </h3>

    <v-btn
      color="success"
      size="large"
      block
      class="mt-4"
      :disabled="cart.length === 0"
      @click="goToCheckout"
    >
      Proceed to Checkout
    </v-btn>

  </v-container>
</template>