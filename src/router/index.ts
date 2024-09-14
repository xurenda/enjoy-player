import EmptyLayout from '@/layouts/EmptyLayout.vue'
import WithHeader from '@/layouts/WithHeader/index.vue'
import TheSettings from '@/pages/TheSettings/index.vue'
import TheList from '@/pages/TheList.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: WithHeader,
      children: [
        {
          path: '',
          component: TheList,
        },
      ],
    },
    {
      path: '/',
      component: EmptyLayout,
      children: [
        {
          path: 'settings',
          component: TheSettings,
        },
      ],
    },
  ],
})

export default router
