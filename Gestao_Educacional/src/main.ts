import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueCookies from 'vue-cookies';
import Swal from 'sweetalert2'


const app = createApp(App)

app.use(router)
app.mount('#app')
