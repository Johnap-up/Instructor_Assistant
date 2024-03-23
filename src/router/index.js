import { createRouter, createWebHistory } from 'vue-router'
import WelcomeView from "@/views/WelcomeView.vue";
import LoginPage from "@/views/welcome/LoginPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "welcome",
      component: WelcomeView,
      children: [
        {
          name: "loginPage",
          path: "",
          component: LoginPage
        }
      ]
    }
  ]
})

export default router
