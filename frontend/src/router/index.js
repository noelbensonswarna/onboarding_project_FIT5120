
import { createRouter, createWebHistory } from 'vue-router'

import LocationInput from '../views/LocationInput.vue'
import Awareness from '../views/Awareness.vue'

const routes = [
  {
    path: '/',
    name: 'LocationInput',
    component: LocationInput
  },
  {
    path: '/awareness',
    name: 'Awareness',
    component: Awareness
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
