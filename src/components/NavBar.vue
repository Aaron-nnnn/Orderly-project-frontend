<script setup>
import {useRouter} from "vue-router";
import {useAuth} from '../services/auth'

const router = useRouter();

const { logout } = useAuth()

const isLoggedIn = localStorage.getItem( "authToken")
const isAdmin = true

</script>
<template>
    <v-app-bar color="#fffacd">
        <v-app-bar-title>
            <v-icon icon="$vuetify"></v-icon>
            <router-link to="/">Orderly</router-link>
        </v-app-bar-title>
        <v-btn to="/admin">Admin</v-btn>
        <v-btn to="/homepage">Home</v-btn>
        <v-btn to="/restaurantdashboard">Dashboard</v-btn>
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