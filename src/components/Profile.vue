<script setup>
import { ref, onMounted } from "vue"
import api from "@/services/api"

const userDetails = JSON.parse(localStorage.getItem('user'))

const status = ref("none") // none | pending | approved | rejected

// get request status from backend
const fetchStatus = async () => {
  try {
    const res = await api.get("owner-request/status")
    status.value = res.data.status
  } catch (e) {
    console.log(e)
  }
}

// send request
const requestOwnership = async () => {
  try {
    await api.post("owner-request",{
       message: "Request to become owner"
    })
    status.value = "pending"
  } catch (e) {
    console.log(e)
  }
}

onMounted(() => {
  fetchStatus()
})
</script>

<template>
  <v-container width="50%" style="background-color:#FFFAF0" class="mt-12">
    <V-row>
      <v-col>
        <v-card class="text-left">
          <v-img src="296fe121-5dfa-43f4-98b5-db50019738a7.jpg" class="mx-auto" width="250" height="200"></v-img>

          <v-card-title>Name: {{ userDetails.name }}</v-card-title>
          <v-card-title>Email: {{ userDetails.email }}</v-card-title>
          <v-card-title>Contact: {{ userDetails.phoneNumber }}</v-card-title>

          <!-- 👇 ADD THIS SECTION HERE -->
          <v-card-text>
            
            <!-- Pending -->
            <div v-if="status === 'pending'">
              ⏳ Your request is pending approval
            </div>

            <!-- Approved -->
            <div v-else-if="status === 'approved'">
              ✅ You are now an owner
            </div>

            <!-- Rejected -->
            <div v-else-if="status === 'rejected'">
              ❌ Request was rejected
            </div>

            <!-- Show button -->
            <v-btn
              v-else-if="userDetails && userDetails.role_id != 2"
              color="primary"
              @click="requestOwnership"
            >
              Request to be Owner
            </v-btn>

          </v-card-text>
          <!-- 👆 END -->
          
        </v-card>
      </v-col>
    </V-row>
  </v-container>
</template>