<script setup>
</script>

<template>
   <v-container style="background-color:white" class="text-center" max-width="100%">
         <v-row>
            <v-col md="8" class="  mt-15 text-centre">
                <div class="text-display-large font-weight-medium mb-5" >Welcome. Order food and more</div>
                <div class="text-display-small font-weight-large">Your favourite dishes are ready. Order now and enjoy from anywhere!</div>
            </v-col>
            <v-col md="4" class="d-flex align-centre justify-centre fill-height">
                <v-img src="60.jpg" cover></v-img>
            </v-col>
         </v-row>
    </v-container>
    <v-container style="background-color:#fffacd" class="mt-12 text-center">
       <v-row>
            <v-col>
                <div class="text-display-small font-weight-large justify-center">How to order</div>
                <div class="text-display-large font-weight-medium mb-5">It's as easy as this</div>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-col md="3">
                <v-card class="text-center">
                    <v-icon color="#FFDDAA" icon="mdi-account" size="large" class="mt-8"></v-icon>
                    <v-card-title color="#FFDDAA">Have an a account</v-card-title>
                    <v-card-text color="#FFDDAA">Login to your account or create one for free</v-card-text>
                </v-card>
            </v-col>
            <v-col md="3">
                <v-card class="text-center">
                    <v-icon color="#FFDDAA" icon="mdi-food" size="large" class="mt-8"></v-icon>
                    <v-card-title color="#FFDDAA">Find what you want</v-card-title>
                    <v-card-text color="#FFDDAA">Find dishes you want from restaurants around you</v-card-text>
                </v-card>
            </v-col>
            <v-col md="3">
                <v-card class="text-center">
                    <v-icon color="#FFDDAA" icon="mdi-clock-time-five" size="large" class="mt-8"></v-icon>
                    <v-card-title color="#FFDDAA">Order your food</v-card-title>
                    <v-card-text color="#FFDDAA">Order and track your food and collect it when ready</v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
    <v-col md="8" class="  mt-15 text-center">
      <div class="text-display-large font-weight-medium mb-5" >All your favourite foods are here and ready</div>
    </v-col>
    <v-container max-width="100%">
        <v-row>
            <v-carousel>
                <v-carousel-item src="hermes-rivera-OzBLe_Eg1mg-unsplash.jpg" cover></v-carousel-item>
                <v-carousel-item src="jonathan-borba-8l8Yl2ruUsg-unsplash.jpg" cover></v-carousel-item>
                <v-carousel-item src="kobby-mendez-xBFTjrMIC0c-unsplash.jpg" cover></v-carousel-item>
            </v-carousel>
        </v-row>
    </v-container>
    <v-col md="8" class="  mt-15 text-center">
     <div class="text-display-large font-weight-medium mb-5" >Jump in and get started</div>
     <v-btn to="/signup" color="#7BC47F">Get started</v-btn>
     
    </v-col>
    <v-container style="background-color:#FFFAF0" max-width="100%" class="mt-15">
      <v-row class="text-centre">
        <v-col>
          <div class="text-display-small font-weight-large">Contact Us:</div>
          <div class="text-title-large font-weight-light text-medium-emphasis mb-8">Phone: 0796534016  |  0712345678 </div>
          <div class="text-title-large font-weight-light text-medium-emphasis mb-8">Email: orderly@gmail.com</div>
          <div class="text-title-large font-weight-light text-medium-emphasis mb-8">Instagram: @Orderlyy</div>
        </v-col>
      </v-row>
    </v-container>
</template>