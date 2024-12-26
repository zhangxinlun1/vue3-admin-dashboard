<template>
  <div class="p-8">
    <h2 class="text-2xl font-bold mb-4">用户列表</h2>
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
      <tr>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户名</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">邮箱</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
      </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
      <tr v-for="user in users" :key="user.id">
        <td class="px-6 py-4 whitespace-nowrap">{{ user.id }}</td>
        <td class="px-6 py-4 whitespace-nowrap">{{ user.username }}</td>
        <td class="px-6 py-4 whitespace-nowrap">{{ user.email }}</td>
        <td class="px-6 py-4 whitespace-nowrap">
          <button class="text-blue-500 hover:text-blue-700 mr-2">编辑</button>
          <button class="text-red-500 hover:text-red-700">删除</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const users = [
  { id: 1, username: 'user1', email: 'user1@example.com' },
  { id: 2, username: 'user2', email: 'user2@example.com' },
];
</script>

<style scoped>
</style>