<template>
  <div class="bg-gray-100 min-h-screen flex items-center justify-center w-full">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <h2 class="text-2xl font-bold text-center mb-6">后台管理登录</h2>
        <el-form :model="form" label-width="auto" style="max-width: 600px">
          <el-form-item class="mb-4" >
            <el-input
                class="w-full"
                v-model="form.username"
                placeholder="请输入用户名"
            >
              <template #prefix>
                <el-icon class="el-input__icon"><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item class="mb-6">
            <el-input
                class="w-full"
                v-model="form.password"
                placeholder="请输入密码"
            >
              <template #prefix>
                <el-icon class="el-input__icon"><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>

        </el-form>
      <div class="flex items-center justify-between">
        <el-button type="primary" @click="handleSubmit">登录</el-button>
        <a href="#" class="text-sm text-gray-600 hover:text-gray-900">忘记密码？</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {router} from "@/router/index.ts";
import { User,Lock} from '@element-plus/icons-vue'
const form = ref({
  username:'',
  password:''
})
const handleSubmit = () => {
  // 这里简单打印，实际中可发送请求到后端进行验证等操作
  console.log('用户名:', form.value.username);
  console.log('密码:', form.value.password);
  localStorage.setItem('token', 'ok');
  router.push('home')
};
</script>

<style scoped lang="ts">
</style>