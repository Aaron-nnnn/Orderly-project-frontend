<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const token = localStorage.getItem('authToken')
const tab = ref(0)
const restaurantDialog = ref(false)
const menuDialog = ref(false)
const tableDialog = ref(false)

const restaurantForm = ref({
  name: '',
  location: '',
  total_tables: 1
})

const menuForm = ref({
  name: '',
  price: 0,
  preparation_time: 0
})

const tableForm = ref({
  table_number: null,
  total_seats: null,
  status: 'available'
})


const restaurantImage = ref(null)
const menuImage = ref(null)
const restaurants = ref([])
const restaurantId = ref(null)
const selectedRestaurant = ref(null)
const tables = ref([])
const orders = ref([])


async function fetchRestaurants() {
  const res = await api.get('owner/restaurants', {
    headers: { Authorization: `Bearer ${token}` }
  })

  restaurants.value = res.data || []

  if (restaurants.value.length > 0 && !restaurantId.value) {
    selectRestaurant(restaurants.value[0])
  }
}


function selectRestaurant(r) {
  selectedRestaurant.value = r
  restaurantId.value = r.id

  fetchTables()
  fetchOrders()
}


async function createRestaurant() {
  const formData = new FormData()

  formData.append('name', restaurantForm.value.name)
  formData.append('location', restaurantForm.value.location)
  formData.append('total_tables', restaurantForm.value.total_tables)

  if (restaurantImage.value) {
    formData.append('seating_layout', restaurantImage.value)
  }

  const res = await api.post('saveRestaurant', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  })

  restaurantDialog.value = false
  restaurantImage.value = null

  await fetchRestaurants()
  selectRestaurant(res.data.data)
}


async function createMenuItem() {
  const formData = new FormData()

  formData.append('restaurant_id', restaurantId.value)
  formData.append('name', menuForm.value.name)
  formData.append('price', menuForm.value.price)
  formData.append('preparation_time', menuForm.value.preparation_time)
  formData.append('is_available', 1)

  if (menuImage.value) {
    formData.append('image', menuImage.value)
  }

  await api.post('saveMenuItem', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  })

  menuDialog.value = false
  menuImage.value = null
}


async function createTable() {
  await api.post('saveRestaurantTable', {
    restaurant_id: restaurantId.value,
    table_number: tableForm.value.table_number,
    total_seats: tableForm.value.total_seats,
    status: tableForm.value.status
  }, {
    headers: { Authorization: `Bearer ${token}` }
  })

  tableDialog.value = false
}


async function fetchTables() {
  if (!restaurantId.value) return

  const res = await api.get(`getRestaurantTables/${restaurantId.value}`)
  tables.value = res.data
}


async function fetchOrders() {
  if (!restaurantId.value) return

  try {
    const res = await api.get(`restaurant/orders/${restaurantId.value}`, 
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )

    orders.value = res.data
  } catch (err) {
    console.error('Fetch orders failed:', err)
  }
}


async function markAsReady(orderId) {
  await api.post(
    `updateOrderStatus/${orderId}`,
    { status: 'ready' },
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  )

  fetchOrders()
}

onMounted(() => {
  fetchRestaurants()
})
</script>

<template>
  <v-container style="background-color:#FFFAF0">
    <v-row class="mb-4">
      <v-col class="text-center">
        <h1 class="text-h4 font-weight-bold d-inline-block"
            style="border-bottom: 5px solid black;"
        >
           Restaurant Dashboard
        </h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        v-for="r in restaurants"
        :key="r.id"
        cols="12"
        md="4"
      >
        <v-card
          class="pa-2"
          :class="{ 'border border-primary': restaurantId === r.id }"
          @click="selectRestaurant(r)"
          >
          <v-img
            :src="r.seating_layout
              ? `http://127.0.0.1:8000/storage/${r.seating_layout}`
              : 'https://via.placeholder.com/400x200'"
            height="180"
            cover
          />
          <div class="mt-2 font-weight-bold">
            {{ r.name }}
          </div>
          <div class="text-caption">
            {{ r.location }}
          </div>
        </v-card>
      </v-col>
    </v-row>


    <v-divider class="my-10" />


    <v-btn color="primary" @click="restaurantDialog = true">
      Create Restaurant
    </v-btn>

    <v-btn color="green" class="ml-2" @click="menuDialog = true">
      Add Menu Item
    </v-btn>

    <v-btn color="orange" class="ml-2" @click="tableDialog = true">
      Add Table
    </v-btn>


    <v-row class="mt-5">
      <v-col
        v-for="t in tables"
        :key="t.id"
        cols="6"
        md="3"
      >
        <v-card class="pa-3 text-center">
          Table {{ t.table_number }} <br>
          Seats: {{ t.total_seats }} <br>
          {{ t.status }}
        </v-card>
      </v-col>
    </v-row>


    <v-divider class="my-10" />


    <h3 class="text-h6 font-weight-bold mb-3">
      Incoming Orders
    </h3>

    <v-row>
      <v-col
        v-for="order in orders"
        :key="order.id"
        cols="12"
        md="4"
       >
        <v-card class="pa-3">

          <div class="font-weight-bold">Order #{{ order.id }}</div>
          <div>Type: {{ order.order_type }}</div>
          <div>Total: KES {{ order.total_amount }}</div>
          <div>Status: {{ order.status }}</div>

          <v-btn
            v-if="order.status !== 'ready' && order.status !== 'completed'"
            color="green"
            class="mt-3"
            block
            @click="markAsReady(order.id)"
          >
            Mark as Ready
          </v-btn>

          <v-btn
            v-else
            color="success"
            class="mt-3"
            block
            disabled
          >
            Ready ✔
          </v-btn>

        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="restaurantDialog" max-width="500">
      <v-card style="background-color:#FFFAF0">
        <v-card-title>Create Restaurant</v-card-title>

        <v-card-text>
          <v-text-field
          v-model="restaurantForm.name"
          label="Restaurant Name"
          />

          <v-text-field
          v-model="restaurantForm.location"
          label="Location"
          />

          <v-text-field
          v-model="restaurantForm.total_tables"
          label="Total Tables"
          type="number"
          />

          <v-file-input
          v-model="restaurantImage"
          label="Restaurant Image"
          accept="image/*"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn color="red" text @click="restaurantDialog = false">
            Cancel
          </v-btn>

          <v-btn color="green" @click="createRestaurant">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="menuDialog" max-width="500">
      <v-card style="background-color:#FFFAF0">
        <v-card-title>Add Menu Item</v-card-title>

        <v-card-text>
          <v-text-field
            v-model="menuForm.name"
            label="Item Name"
          />

          <v-text-field
            v-model="menuForm.price"
            label="Price"
            type="number"
          />

          <v-text-field
            v-model="menuForm.preparation_time"
            label="Prep Time (mins)"
            type="number"
          />

          <v-file-input
            v-model="menuImage"
            label="Menu Item Image"
            accept="image/*"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn color="red" text @click="menuDialog = false">
            Cancel
          </v-btn>

          <v-btn color="green" @click="createMenuItem">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="tableDialog" max-width="500">
      <v-card style="background-color:#FFFAF0">
        <v-card-title>Add Table</v-card-title>

        <v-card-text>
          <v-text-field
            v-model="tableForm.table_number"
            label="Table Number"
            type="number"
          />

          <v-text-field
            v-model="tableForm.total_seats"
            label="Seats"
            type="number"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn color="red" text @click="tableDialog = false">
            Cancel
          </v-btn>

          <v-btn color="green" @click="createTable">
            Save
          </v-btn>
        </v-card-actions>
     </v-card>
    </v-dialog>
  </v-container>
</template>