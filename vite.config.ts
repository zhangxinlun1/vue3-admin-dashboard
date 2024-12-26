import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),],
  // 以下是与TypeScript相关的配置示例
  resolve: {
    alias: {
      // 可以添加类型别名等相关配置
      '@': '/src',
      '@components': '/src/components',
      '@stores': '/src/stores',
      '@api': '/src/api',
      '@views': '/src/views'
    }
  },

});
