import { createRouter, createWebHistory } from 'vue-router'
import {unauthorized, accessRole, deleteAccessRole, deleteAccessToken} from "@/net/index.js";
import {ElMessage} from "element-plus";

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
      path: "/instructor",
      name: "authorized-instructor",
      component: () => import("@/views/afterLogin/index.vue"),
      children: [
        {
          path: "",
          name: "authorized-homePage",
          component: () => import("@/views/afterLogin/main/homePage/HomePage.vue")
        },
        {
          path: "user-setting",
          name: "authorized-user-setting",
          component: () => import("@/views/afterLogin/main/settings/UserSettings.vue")
        },
        {
          path: "crud-page",
          name: "authorized-crud-page",
          component: () => import("@/views/afterLogin/main/studentManage/CrudPage.vue")
        },
        {
          path: "charts",
          name: "authorized-charts",
          component: () => import("@/views/afterLogin/main/charts/AllCharts.vue")
        },
        {
          path: "logs",
          name: "authorized-logs",
          component: () => import("@/views/afterLogin/main/log/LogList.vue")
        },
        {
          path: "task",
          name: "authorized-task",
          component:() => import("@/views/afterLogin/main/taskList/Task.vue"),
          children: [
            {
              path: "list",
              name: "authorized-list",
              component: () => import("@/views/afterLogin/main/taskList/TaskList.vue")
            },
            {
              path: "task-detail/:taskId",
              name: "authorized-task-detail",
              component: () => import("@/views/afterLogin/main/taskList/TaskDetail.vue")
            }
          ]
        },
      ]
    },
    {
      path: "/index",
      name: "/authorized-index",
      component: () => import("@/views/afterLogin/index.vue"),
      children: [
        {
          path: "",
          name: "authorized-student-homePage",
          component: () => import("@/views/afterLogin/main/homePage/HomePage.vue")
        },
        {
          path: "student-setting",
          name: "authorized-student-setting",
          component: () => import("@/views/afterLogin/studentRole/settings/StudentSettings.vue")
        },
        // {
        //   path: "logs",
        //   name: "authorized-student-logs",
        //   component: () => import("@/views/afterLogin/publicContent/LogList.vue")
        // },
        {
          path: "task",
          name: "authorized-student-task",
          component:() => import("@/views/afterLogin/studentRole/taskList/StudentTask.vue"),
          children: [
            {
              path: "list",
              name: "authorized-student-list",
              component: () => import("@/views/afterLogin/studentRole/taskList/TaskList.vue")
            },
            {
              path: "task-detail/:taskId",
              name: "authorized-student-task-detail",
              component: () => import("@/views/afterLogin/studentRole/taskList/TaskDetail.vue")
            }
          ]
        },
      ],
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import("@/components/container/exception/NotFound.vue") }
  ]
})
router.beforeEach((to, from, next)=>{
  // next();
  const isUnauthorized = unauthorized();
  const role = accessRole();
  console.log(to.path)
  if (!role){
    console.log("role is null")
    deleteAccessRole();
    deleteAccessToken();
    if (to.path !== "/"){
      next("/");
      ElMessage("请重新登录");
    } else{
      next();
    }
  }else {
    if (role.includes("instructor")){
      console.log("1")
      routeHandler(to, next, isUnauthorized, "/instructor")
    }else if (role.includes("student")){
      console.log("2")
      routeHandler(to, next, isUnauthorized, "/index")
    }else {
      deleteAccessRole();
      deleteAccessToken();
      ElMessage("身份不存在，请重新登录");
      console.log("3")
      next("/");
    }
  }
})
function routeHandler(to, next, isUnauthorized, originPath){
  if(to.name.startsWith("unauthorized-") && !isUnauthorized){   //用户已经登录并想访问登录页面，拒绝
    next(originPath);
  }else if(to.name.startsWith("authorized-") && isUnauthorized){
    next("/");
  }else if(!to.path.startsWith(originPath)){
    next(originPath);
  }else {
    next();
  }
}

export default router
