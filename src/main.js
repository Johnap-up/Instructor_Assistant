import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/reset/reset.css'
import axios from "axios";
import 'element-plus/theme-chalk/dark/css-vars.css'
import {createPinia} from "pinia";

axios.defaults.baseURL = "http://localhost:9856";

const app = createApp(App)
app.use(router)
app.use(createPinia())

app.mount('#app')
