<script setup>
import { ref } from 'vue'
import { useRouter } from "vue-router";
import {useAuth} from '../services/auth'

const router = useRouter();
const { register, loading, error } = useAuth()
  const rules = {
    required: value => !!value || 'Required.',
    min: v => v.length >= 8 || 'Min 8 characters',
    passwordMatch: () => password.value === confirmPassword.value || 'Passwords must match'
  }

  const show1 = ref(false)
  const show1confirm = ref(false)

// models
const firstName = ref(null)
const lastName = ref(null)
const email = ref(null)
const gender = ref(null)
const phoneNumber = ref(null)
const dob = ref(null)
const password = ref(null)
const confirmPassword = ref(null)

const signUp = async () => {

    loading.value = true;
    error.value = "";

    const formData = new FormData();
    formData.append("name", `${firstName.value} ${lastName.value}`.trim());
    formData.append("email", email.value);
    formData.append("phoneNumber", phoneNumber.value);
    formData.append("dob", dob.value);
    formData.append("gender", gender.value);
    formData.append("password", password.value);
    formData.append("password_confirmation", confirmPassword.value);

    try {
        await register(formData)
        router.push('/homepage')
    } catch (err) {
        console.error('Sign up failed', err)
    }
};

</script>

<template>
    <v-container  style="max-width: 600px; background-color:#fffacd" class="text-center mt-16">
        <v-row>
            <v-col md="12">
                <v-form  @submit.prevent="signUp">
                    <v-row>
                        <v-col>
                            <div class="text-display-small font-weight-medium">Sign up</div>
                        </v-col>
                    </v-row>
                    <v-row justify="center">
                        <v-col md="6">
                            <v-text-field  :rules="[rules.required]" label="First Name" variant="outlined" color="#7BC47F" v-model="firstName"></v-text-field>
                        </v-col>
                         <v-col md="6">
                            <v-text-field label="Last Name" variant="outlined" color="#7BC47F"  :rules="[rules.required]" v-model="lastName"></v-text-field>
                        </v-col>
                    </v-row>
                     <v-row>
                        <v-col md="6">
                            <v-text-field label="Email" prepend-inner-icon="mdi-email-box"  :rules="[rules.required]" variant="outlined" color="#7BC47F" v-model="email"></v-text-field>
                        </v-col>
                        <v-col md="6">
                            <v-text-field label="Phone Number" prepend-inner-icon="mdi-phone" variant="outlined" color="#7BC47F" type="text" v-model="phoneNumber"></v-text-field>
                        </v-col>
                    </v-row>
                     <v-row>
                        <v-col md="6">
                           <v-radio-group inline v-model="gender">
                           <v-radio label="Male" value="male"></v-radio>
                           <v-radio label="Female" value="female"></v-radio>
                           <v-radio label="Other" value="other"></v-radio>
                           </v-radio-group>
                        </v-col>
                         <v-col md="6">
                            <v-date-input label="Date of Birth" variant="outlined" color="#7BC47F" v-model="dob"></v-date-input>
                        </v-col>
                    </v-row>
                     <v-row>
                        <v-col md="6">
                            <v-text-field
                                v-model="password"
                                color="#7BC47F"
                                prepend-inner-icon="mdi-lock"
                                :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                :rules="[rules.required, rules.min]"
                                :type="show1 ? 'text' : 'password'"
                                variant="outlined"
                                label="Password"
                                @click:append-inner="show1 = !show1"
                            ></v-text-field>
                        </v-col>
                          <v-col md="6">
                            <v-text-field
                                v-model="confirmPassword"
                                color="#7BC47F"
                                prepend-inner-icon="mdi-lock"
                                :append-inner-icon="show1confirm ? 'mdi-eye' : 'mdi-eye-off'"
                                :rules="[rules.required, rules.min, rules.passwordMatch]"
                                :type="show1confirm ? 'text' : 'password'"
                                variant="outlined"
                                label="Confirm Password"
                                @click:append-inner="show1confirm = !show1confirm"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col md="12">
                            <v-btn :disabled="!firstName || !email || !password" width="250" :loading="loading" color="#7BC47F" variant="elevated" type="submit">Sign up</v-btn>
                        </v-col>
                    </v-row>
                    <div v-if="error" style="color:red; margin-top:10px;">
                        {{ error }}
                    </div>
                    <v-row>
                        <v-col md="12">
                            <div>Already have an account?
                                <router-link to="/login">Back to Login</router-link>
                            </div>
                        </v-col>
                    </v-row>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>