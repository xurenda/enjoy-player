import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import packageJson from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    __curVersion__: `'${packageJson.version}'`,
  },
  server: {
    proxy: {
      '/proxy': {
        target: '',
        changeOrigin: false,
        secure: false, // 如果目标是 https，需要设置为 false
        configure: proxy => {
          // 动态设置代理目标
          proxy.on('proxyReq', (proxyReq, req) => {
            try {
              if (!req.url) return
              const targetUrl = req.url.replace(/^\/proxy\//, '')
              const urlObj = new URL(targetUrl) // 使用 URL 对象确保合法
              // 设置请求头和路径
              proxyReq.setHeader('host', urlObj.host)
              proxyReq.path = urlObj.href
              ;(proxy as any).options.target = urlObj.origin
            } catch (error) {
              console.error('------Error in proxyReq configuration:', error)
            }
          })
        },
      },
    },
  },
})
