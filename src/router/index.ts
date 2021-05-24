import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue'
import Intro from '../views/Intro.vue'
import Playing from '../views/Playing.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
path:'/intro',
name:'Intro',
component: Intro
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/playing',
    name: 'Playing',
    component: Playing
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
