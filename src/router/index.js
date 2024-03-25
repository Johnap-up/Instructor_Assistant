import { createRouter, createWebHistory } from 'vue-router'
import {unauthorized} from "@/net/index.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "unauthorized-login",
      component: () => import("@/views/WelcomeView.vue"),
      children: [
        {
          name: "unauthorized-loginPage",
          path: "",
          component: () => import("@/views/welcome/LoginPage.vue")
        },
        {
          name: "unauthorized-registerPage",
          path: "/register",
          component: () => import("@/views/welcome/RegisterPage.vue")
        }
      ]
    },
    {
      path: "/index",
      name: "authorized-index",
      component: () => import("@/views/afterLogin/index/index.vue")
    }
  ]
})
router.beforeEach((to, from, next)=>{
  const isUnauthorized = unauthorized();
  if(to.name.startsWith("unauthorized-") && !isUnauthorized){   //用户已经登录并想访问登录页面，拒绝
    next("/index");
  }else if(to.name.startsWith("authorized-") && isUnauthorized){
    next("/");
  }else {
    next();
  }
})

export default router
