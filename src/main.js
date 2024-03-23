import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/reset/reset.css'
import axios from "axios";

axios.defaults.baseURL = "http://localhost:9856";

const app = createApp(App)
app.use(router)

app.mount('#app')
