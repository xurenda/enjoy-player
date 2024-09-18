import axios from 'axios'

const request = axios.create({})

request.interceptors.request.use(config => {
  // dev server 代理，解决跨域
  if (import.meta.env.DEV) {
    config.url = '/proxy/' + config.url
  }
  return config
})

request.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    return Promise.reject(error)
  },
)

export default request
