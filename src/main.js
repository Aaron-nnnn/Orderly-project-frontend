import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import * as labsComponents from 'vuetify/labs/components' //For date and time

// Components

const vuetify = createVuetify({
   components: {
    ...components,
    ...labsComponents,
  },
  directives,
   icons: {
    defaultSet: 'mdi', // This is already the default value - only for display purposes
  },
  theme:{
    defaultTheme: 'light',
    themes:{
      light:{
        colors:{
          primary: "#fffacd",
          secondary: "#7BC47F"
        }
      }
    }
  }
})

const app = createApp(App)

app.use(router)
app.use(vuetify)
app.mount('#app')
