<script setup>
import { ref } from 'vue'
import { useRouter } from "vue-router";
import {useAuth} from '../services/auth'

const router = useRouter();

const { login, loading, error } = useAuth()
const localError = ref("")

  const rules = {
    required: value => !!value || 'Required.',
    min: v => v.length >= 8 || 'Min 8 characters',
    emailMatch: () => (`The email and password you entered don't match`),
  }

  const show1 = ref(false)
  const password = ref(null)
  const username = ref(null)

  async function handleLogin() {
    localError.value = ""
    loading.value = true
  
  if (!username.value || !password.value) {
    console.error('Email and password are required')
    return
  }
  
  try {
    await login({
      email: username.value,
      password: password.value
    })
    router.push('/homepage').then(() => {
        router.go(0);
    });
  } catch (err) {
    localError.value = "Invalid email or password"
  }finally {
        loading.value = false
    }
}

</script>

<template>
    <v-container width="50%" class="text-center mt-16 rounded-xl" style="background-color:#fffacd">
        <v-row>
            <v-col md="">
                <v-form>
                     <v-row>
                        <v-col>
                            <div class="text-display-small font-weight-medium">Welcome Back</div>
                        </v-col>
                    </v-row>
                    <v-row class="mt-1">
                        <v-col>
                            <div class="font-weight-medium">Login to your account</div>
                        </v-col>
                    </v-row>
                    <v-row justify="center" class="mt-15">
                        <v-col md="6">
                            <v-text-field :rules="[rules.required]" prepend-inner-icon="mdi-account" type="email" label="Email" variant="outlined" outlined dense color="#7BC47F" v-model="username"></v-text-field>
                             <v-text-field
                                label="Password"
                                v-model="password"
                                prepend-inner-icon="mdi-lock"
                                :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                :rules="[rules.required, rules.min]"
                                :type="show1 ? 'text' : 'password'"
                                variant="outlined"
                                outlined dense color="#7BC47F"
                                @click:append-inner="show1 = !show1"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col md="12">
                            <v-btn :loading="loading" width="250" color="#7BC47F" variant="elevated" @click="handleLogin">Login</v-btn>
                        </v-col>
                    </v-row>
                    <div v-if="localError" style="color:red; margin-top:10px;">
                        {{ localError }}
                    </div>
                    <v-row>
                        <v-col md="12">
                            <div>New to Orderly? 
                                <router-link to="/signup">Create an account</router-link>
                            </div>
                        </v-col>
                    </v-row>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>