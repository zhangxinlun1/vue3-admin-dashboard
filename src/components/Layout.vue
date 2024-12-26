<script setup lang="ts">


const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};
</script>

<template>
  <nav class="bg-white shadow-md p-4">
    <div class="container mx-auto flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <span class="text-gray-700 font-semibold">欢迎，管理员</span>
        <button @click="logout" class="text-blue-500 hover:text-blue-700">退出登录</button>
      </div>
    </div>
  </nav>
</template>

<style scoped>

</style>