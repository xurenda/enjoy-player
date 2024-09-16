import { useRoute, useRouter, type RouteLocationRaw, type Router } from 'vue-router'

export default function useKeepQueryRouter(): Router {
  const route = useRoute()
  const router = useRouter()

  const originPush = router.push
  const originReplace = router.replace
  router.push = (to: RouteLocationRaw) => {
    if (typeof to === 'object') {
      to.query = { ...route.query, ...to.query }
    }
    return originPush.call(router, to)
  }
  router.replace = (to: RouteLocationRaw) => {
    if (typeof to === 'object' && to.query) {
      to.query = { ...route.query, ...to.query }
    }
    return originReplace.call(router, to)
  }

  return router
}
