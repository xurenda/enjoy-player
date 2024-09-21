import axios from 'axios'

const request = axios.create({})

request.interceptors.request.use(config => {
  // dev server 代理，解决跨域
  if (import.meta.env.DEV && !window.electronAPI) {
    config.url = '/proxy/' + config.url
  }
  return config
})

request.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    if (axios.isCancel(error)) {
      // 永远 padding 的 promise
      return new Promise(() => {})
    }
    return Promise.reject(error)
  },
)

export default request
