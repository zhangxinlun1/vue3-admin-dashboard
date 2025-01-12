import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
export default defineConfig({
  plugins: [vue({
    // 开启声明文件生成功能
    script: {
      defineModel: true,
    }
  }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),],
  build: {
    outDir: 'dist'
  },
  // 以下是与TypeScript相关的配置示例
  resolve: {
    alias: {
      // 可以添加类型别名等相关配置
      '@': '/src',
      '@components': '/src/components',
      '@stores': '/src/stores',
      '@api': '/src/api',
      '@views': '/src/views'
    },
    extensions: [ '.json', '.ts','.js']
  },
  server:{
    proxy:{
      '/api': {
        target: 'http://localhost:3333',
        rewrite: (path) => path.replace(/^\/api/, ''),
        changeOrigin: true,
      },
    },cors: {
      origin: ['http://localhost:5173'], // 允许来自前端运行端口（5173）的跨域请求
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    },
  }
});
