import WithHeader from '@/layouts/WithHeader/index.vue'
import VideoList from '@/pages/VideoList/index.vue'
import VideoDetail from '@/pages/VideoDetail/index.vue'
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
          name: 'videoList',
          component: VideoList,
        },
        {
          path: 'video/:id',
          name: 'videoDetail',
          component: VideoDetail,
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
