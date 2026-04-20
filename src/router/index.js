import { createRouter, createWebHistory } from 'vue-router'
import Admin from '@/components/Admin.vue'
import HomePage from '@/components/HomePage.vue'
import LandingPage from '@/components/LandingPage.vue'
import Login from '@/components/Login.vue'
import Profile from '@/components/Profile.vue'
import SignUp from '@/components/SignUp.vue'
import RestaurantDashboard from '@/components/RestaurantDashboard.vue'
import OwnershipRequests from '@/components/OwnershipRequests.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landingpage',
      component: LandingPage,
    },
     {
      path: '/login',
      name: 'login',
      component: Login,
    },
     {
      path: '/signup',
      name: 'signup',
      component: SignUp,
    },
     {
      path: '/homepage',
      name: 'homepage',
      component: HomePage,
    },
     {
      path: '/profile',
      name: 'profile',
      component: Profile,
    },
     {
      path: '/restaurantdashboard',
      name: 'restaurantdashboard',
      component: RestaurantDashboard,
    },
     {
      path: '/admin',
      name: 'admin',
      component: Admin,
    },
     {
      path: '/ownershiprequests',
      name: 'ownershiprequests',
      component: OwnershipRequests,
    },
  ],
})

export default router
