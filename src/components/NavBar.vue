<script setup>
import {useRouter} from "vue-router";
import {useAuth} from '../services/auth'

const router = useRouter();
const { isAdmin, isRestaurant, isAuthenticated } = useAuth()

const { logout } = useAuth()

const isLoggedIn = localStorage.getItem( "authToken")

</script>
<template>
    <v-app-bar color="#fffacd">
        <v-app-bar-title>
            <v-icon icon="mdi-circle-outline"></v-icon>
            <router-link to="/">rderly</router-link>
        </v-app-bar-title>
        <v-btn  v-if="isAdmin" to="/ownershiprequests">Requests</v-btn>
        <v-btn  v-if="isAdmin" to="/admin">Admin</v-btn>
        <v-btn  v-if="isAuthenticated" to="/homepage">Home</v-btn>
        <v-btn  v-if="isRestaurant" to="/restaurantdashboard">Dashboard</v-btn>
        <v-btn icon="mdi-account" v-if="isLoggedIn">P
            <v-menu activator="parent">
                <v-list>
                    <v-list-item>
                        <v-btn color="primary" to="/profile">Profile</v-btn>                        
                    </v-list-item>
                    
                    <v-list-item>
                        <v-btn color="primary" @click="()=> {logout(); router.push('/')}">Logout</v-btn>                        
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-btn>
        <v-btn to="/login" v-else>Login</v-btn>
    </v-app-bar>
</template>