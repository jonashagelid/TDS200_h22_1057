import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue'
import DescriptionPage from '../views/DescriptionPage.vue'
import AuthenticationPage from '../views/AuthenticationPage.vue'
import NewGame from '../views/NewGame.vue'
import UserProfile from '../views/UserProfile.vue'
//import { authService } from "@/services/directus.service";
import { toastController } from "@ionic/vue";
import { authServce } from '@/services/directus.services';


const authenticationRequiredRouterGuard = async () => {
  const userAccessToken = localStorage.getItem("auth_token");
  if(!userAccessToken){
      return {name: "Login"}
  }

  const userAccessTokenExpiresAt = localStorage.getItem("auth_expires_at") as unknown as number;

  if(userAccessTokenExpiresAt < new Date().getTime()){
    const errorToast = await toastController.create({
      message: "User session expired",
      duration: 2000,
      color: "warning"
    });
    await errorToast.present();
    await authServce.logout();
    return {name: "Login"};
  }
};


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/description/:id',
    name: 'Description',
    component: DescriptionPage,
  },
  {
    path: '/authentication',
    name: 'Login',
    component: AuthenticationPage,
  },
  {
    path: '/new-game',
    name: 'New',
    component: NewGame,
    beforeEnter: [authenticationRequiredRouterGuard]
  },
  {
    path: '/user-info',
    name: 'User',
    component: UserProfile,
    beforeEnter: [authenticationRequiredRouterGuard]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
