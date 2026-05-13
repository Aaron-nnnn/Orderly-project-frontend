<script setup>
import { ref, onMounted} from 'vue'
import api  from '../services/api';

const token = localStorage.getItem('authToken');
const error = ref('')
const loading = ref(false)
const tab = ref(null)
const showEditUserDialog = ref(false)

function formatDate(date) {
    if (!date) return null
    return new Date(date).toISOString().split('T')[0]
}

const rules = {
    required: value => !!value || 'Required.',
    min: v => v.length >= 8 || 'Min 8 characters',
}

const fullName =ref(null)
const firstName =ref(null)
const lastName =ref(null)
const email =ref(null)
const phoneNumber =ref(null)
const gender =ref(null)
const dob =ref(null)
const users = ref(null)
const userIdNo = ref(null)


async function fetchUsers() {
    try {
        loading.value = true

        const response = await api.get('users', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        users.value = response.data.data

    } catch (err) {
        error.value = err.response?.data?.message || 'Retrieving data failed'
    } finally {
        loading.value = false
    }
}


function editUser(data){
    userIdNo.value = data.id
    fullName.value = data.name
    email.value = data.email
    phoneNumber.value = data.phoneNumber
    dob.value = data.dob
    gender.value = data.gender
    showEditUserDialog.value = true
}
async function updateUser(){
    const formData = new FormData()
    formData.append('name', fullName.value)
    formData.append("email", email.value);
    formData.append("phoneNumber", phoneNumber.value);
    formData.append("dob", formatDate(dob.value));
    formData.append("gender", gender.value);

   try {
      await api.put('users/' + userIdNo.value, formData,
         { headers: { 'Authorization': `Bearer ${token}` } })
         .then(function (response) {
            error.value = ''
            loading.value = false
            close()
            fetchUsers();
        })
   } catch (err) {
      error.value = err.response?.data?.message || 'Creating screening data failed'
      throw err
   } 
}

function close(){
    showEditUserDialog.value = false
    fullName.value = null
    firstName.value = null
    lastName.value = null
    email.value = null
    phoneNumber.value = null
    dob.value = null
    gender.value = null
}

onMounted(() => {
  fetchUsers();
    
});
</script>
<template>
   <v-container class="text-center mt-12" style="background-color:#CFD0D6">
        <v-card>
            <v-tabs v-model="tab" align-tabs="center" color="primary" >
                <v-tab :value="1">Users</v-tab>
            </v-tabs>
            <v-tabs-window v-model="tab">
    <!-- Users -->
                <v-tabs-window-item :value="1">
                    <div v-if="users == null||users==undefined||Object.keys(users).length == 0" align="center">
                        <v-row>
                            <v-col cols="12" md="6" sm="12" >
                                <div class="text-h6">No users found</div> 
                            </v-col>
                        </v-row>
                    </div>
                    <div v-else>
                        <v-container>
                            <v-row>
                                <v-col>
                                    <v-table class="border">
                                        <thead>
                                            <tr>
                                                <th class="text-left"> Name </th>
                                                <th class="text-left"> Email </th>
                                                <th class="text-left"> Phone </th>
                                                <th class="text-left"> Date of Birth </th>
                                                <th class="text-left"> Gender </th>
                                                <th class="text-center" colspan="3"> Action </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="item in users" :key="item.id" >
                                                <td>{{ item.name }}</td>
                                                <td>{{ item.email }}</td>
                                                <td>{{ item.phoneNumber }}</td>
                                                <td>{{ item.dob }}</td>
                                                <td>{{ item.gender }}</td>
                                                <td v-if="item.deleted_at == null">
                                                    <v-btn color="primary" size="small" @click="editUser(item)"><v-icon icon="mdi-pencil" ></v-icon> Edit User</v-btn>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </v-table>
                                </v-col>
                            </v-row>
                        </v-container>
                    </div>
                </v-tabs-window-item>
            </v-tabs-window>
        </v-card>
   </v-container>
    <!-- Edit User Dialog -->
        <v-dialog v-model="showEditUserDialog" max-width="600">
            <v-form @submit.prevent >
                <v-card>
                    <v-card-title class="pa-6">
                        <v-row>
                            Edit User
                            <v-spacer></v-spacer>
                            <v-btn class="ma-2" color="blue-darken-2" icon="mdi-close" @click="close();"></v-btn>
                        </v-row>
                    </v-card-title>
                    <v-card-text>
                        <v-row dense>
                            <v-col >
                                 <v-text-field label="Name" v-model="fullName" required :rules="[rules.required]"></v-text-field>
                            </v-col>
                        </v-row>
                            
                        <v-row>
                            <v-col md="6">
                                 <v-text-field label="Email" v-model="email" required :rules="[rules.required]"></v-text-field>
                            </v-col>
                            <v-col md="6">
                                <v-text-field label="Phone Number" v-model="phoneNumber" required :rules="[rules.required]"></v-text-field>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col md="6">
                                <v-date-input label="Date of Birth" v-model="dob" required :rules="[rules.required]"></v-date-input>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" md="2" sm="6" > Gender: </v-col>
                            <v-col cols="12" md="10" sm="6">
                                <v-radio-group v-model="gender" :rules="[rules.required]" inline>
                                    <v-radio label="Male" value="Male"></v-radio>
                                    <v-radio label="Female" value="Female"></v-radio>
                                </v-radio-group>
                            </v-col>
                        </v-row>
                    </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn text="Close" variant="plain" @click="close()" ></v-btn>
                            <v-btn color="primary" type="submit" text="Update" variant="tonal" @click="updateUser()" ></v-btn>
                        </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
</template>