<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const restaurants = ref([])
const loading = ref(false)
const error = ref('')

async function fetchRestaurants() {
  loading.value = true
  try {
    const response = await api.get('getRestaurants')
    restaurants.value = response.data
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load restaurants'
  } finally {
    loading.value = false
  }
}

function getImageUrl(path) {
  if (!path) {
    return 'https://via.placeholder.com/400x250'
  }

  return `http://127.0.0.1:8000/storage/${path}`
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
           Explore Restaurants
        </h1>
      </v-col>
    </v-row>
    <v-alert v-if="error" type="error" class="mb-4">
      {{ error }}
    </v-alert>

    <v-progress-linear v-if="loading" indeterminate />

    <v-row>
      <v-col
        v-for="restaurant in restaurants"
        :key="restaurant.id"
        cols="12"
        md="4"
        >
        <v-card elevation="4" class="rounded-xl">

         <v-img
            :src="getImageUrl(restaurant.seating_layout)"
            height="200"
            cover
          />

          <v-card-item>
            <v-card-title class="text-h6">
              {{ restaurant.name }}
            </v-card-title>

            <v-card-subtitle>
              {{ restaurant.location }}
            </v-card-subtitle>

            <v-card-text>
              Tables: {{ restaurant.total_tables }}
            </v-card-text>
          </v-card-item>

          <v-card-actions>
            <v-btn
              color="#7BC47F"
              block
              @click="$router.push(`/restaurants/${restaurant.id}`)"
            >
              View Details
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>