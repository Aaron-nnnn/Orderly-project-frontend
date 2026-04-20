<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const requests = ref([])
const loading = ref(false)

async function fetchRequests() {
  loading.value = true
  try {
    const res = await api.get('owner-requests')
    requests.value = res.data
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
}

async function approve(id) {
  try {
    await api.post(`owner-requests/${id}/approve`)
    fetchRequests()
  } catch (err) {
    console.log(err)
  }
}

async function reject(id) {
  try {
    await api.post(`owner-requests/${id}/reject`)
    fetchRequests()
  } catch (err) {
    console.log(err)
  }
}

onMounted(() => {
  fetchRequests()
})
</script>
<template>
  <v-container>
    <v-table>
      <thead>
        <tr>
          <th>User</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="req in requests" :key="req.id">
          <td>{{ req.user.name }}</td>
          <td>{{ req.status }}</td>

          <td>
            <v-btn
              color="green"
              size="small"
              @click="approve(req.id)"
              :disabled="req.status !== 'pending'"
            >
              Approve
            </v-btn>

            <v-btn
              color="red"
              size="small"
              @click="reject(req.id)"
              :disabled="req.status !== 'pending'"
            >
              Reject
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>