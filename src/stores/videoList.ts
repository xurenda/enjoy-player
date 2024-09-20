import { defineStore } from 'pinia'
import useAppStore from './app'
import getList, { type CategoryResponse } from '@/api/list'
import getDetail, { type VideoDetailResponse } from '@/api/detail'
import { computed, ref, watch, watchEffect } from 'vue'
import { array2Tree, mapTreeNode, mapTreeNotLeafNode } from '@/utils/array2Tree'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import useKeepQueryRouter from '@/hooks/useKeepQueryRouter'
import useQueryParam from '@/hooks/useQueryParam'

export const allCategoryId = 0

const useVideoListStore = defineStore('videoList', () => {
  const appStore = useAppStore()
  const { t } = useI18n()
  const route = useRoute()
  const router = useKeepQueryRouter()
  const routeName = computed(() => route.name)
  const { data, change } = useQueryParam({
    word: { defaultValue: '', transFn: value => value.trim() },
    class: {
      defaultValue: allCategoryId,
      transFn: value => {
        const num = +value
        if (Number.isNaN(num) || !Number.isInteger(num)) {
          return allCategoryId
        }
        return num
      },
    },
    page: {
      defaultValue: 1,
      transFn: value => {
        const num = +value
        if (Number.isNaN(num) || num < 1 || !Number.isInteger(num)) {
          return 1
        }
        return num
      },
    },
  })
  let onlyChangePage = false

  const { word: curKeyword, class: curCategory, page: curPage } = data

  const gotoList = () => {
    setTimeout(() => {
      if (routeName.value !== 'videoList') {
        router.push({ name: 'videoList', query: { ep: undefined } })
      }
    })
  }

  const changeKeyword = (val: string) => {
    val = val.trim()
    if (val !== curKeyword.value) {
      onlyChangePage = false
      change({ word: val, class: allCategoryId, page: 1 })
    }
    gotoList()
  }

  const changeCategory = (val: number) => {
    if (val !== curCategory.value) {
      onlyChangePage = false
      change({ word: '', class: val, page: 1 })
    }
    gotoList()
  }

  const changePage = (val: number) => {
    if (val !== curPage.value) {
      onlyChangePage = true
      change({ page: val })
    }
    gotoList()
  }

  watch(
    () => appStore.curVideoSources?.api,
    () => {
      onlyChangePage = false
      curKeyword.value = ''
      curCategory.value = allCategoryId
      curPage.value = 1
      gotoList()
    },
  )

  const loading = ref(false)
  const error = ref<Error | null>(null)
  const list = ref<VideoDetailResponse[]>([])
  const total = ref(0)
  const categoryLoading = ref(false)
  const categoryError = ref<Error | null>(null)
  const category = ref<CategoryResponse[]>([])

  let lastUrl = ''
  const fetchData = async (url: string) => {
    const isNewApi = lastUrl !== url
    if (isNewApi) {
      lastUrl = url
    }
    loading.value = true
    error.value = null
    list.value = []
    if (!onlyChangePage) {
      total.value = 0
    }
    if (isNewApi) {
      categoryLoading.value = true
      categoryError.value = null
      category.value = []
    }
    const res = await getList(url, {
      pg: curPage.value,
      wd: curKeyword.value ? curKeyword.value : undefined,
      t: curCategory.value !== allCategoryId ? curCategory.value : undefined,
    }).catch(err => {
      if (isNewApi) {
        categoryLoading.value = false
        categoryError.value = err
        category.value = []
      }
    })
    if (isNewApi) {
      if (!Array.isArray(res?.class)) {
        categoryLoading.value = false
        categoryError.value = new Error('category is not an array')
        category.value = []
      } else {
        categoryLoading.value = false
        categoryError.value = null
        category.value = res.class
      }
    }
    if (!Array.isArray(res?.list)) {
      throw new Error('list is not an array')
    }
    if (!res.list.length) {
      return {
        list: [],
        total: res.total,
      }
    }
    const res2 = await getDetail(url, {
      ids: res.list.map(i => i.vod_id),
    })
    if (!Array.isArray(res2?.list)) {
      throw new Error('list is not an array')
    }
    return {
      list: res2.list,
      total: res.total,
    }
  }

  watchEffect(() => {
    if (!appStore.curVideoSources?.api) {
      return
    }
    fetchData(appStore.curVideoSources.api)
      .then(res => {
        list.value = res.list
        total.value = res.total
      })
      .catch(err => {
        error.value = err
      })
      .finally(() => {
        loading.value = false
      })
  })

  const categoryTree = computed(() => {
    const tree = array2Tree(category.value, 'type_id', 'type_pid', allCategoryId)
    mapTreeNotLeafNode(tree, node => {
      node.children?.unshift({
        type_id: node.type_id,
        type_name: `${node.type_name}[${t('all')}]`,
        type_pid: node.type_pid,
      })
    })
    tree.unshift({
      type_id: allCategoryId,
      type_name: t('all'),
      type_pid: allCategoryId,
    })

    const tree2 = mapTreeNode(tree, node => {
      return {
        ...node,
        key: node.type_id,
        label: node.type_name,
      }
    })
    return tree2
  })

  return {
    loading,
    error,
    list,
    total,
    categoryLoading,
    categoryError,
    category,
    curKeyword,
    curCategory,
    curPage,
    categoryTree,
    changeKeyword,
    changeCategory,
    changePage,
  }
})

export default useVideoListStore
