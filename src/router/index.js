import { createRouter, createWebHistory } from 'vue-router'
import {unauthorized} from "@/net/index.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {       //这是登录前的路由
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
        },
        {
          name: "unauthorized-resetPage",
          path: "/reset",
          component: () => import("@/views/welcome/ResetPage.vue")
        }
      ]
    },
    {
      path: "/index",
      name: "authorized-index",
      component: () => import("@/views/afterLogin/index.vue"),
      children: [
        {
          path: "",
          name: "authorized-homePage",
          component: () => import("@/views/afterLogin/main/homePage/homePage.vue")
        },
        {
          path: "user-setting",
          name: "authorized-user-setting",
          component: () => import("@/views/afterLogin/main/settings/UserSettings.vue")
        },
        {
          path: "crud-page",
          name: "authorized-crud-page",
          component: () => import("@/views/afterLogin/main/studentManage/crudPage.vue")
        },
        {
          path: "big-learning",
          name: "authorized-big-learning",
          component: () => import("@/views/afterLogin/main/taskList/learning/learningPage.vue")
        }
      ]
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
