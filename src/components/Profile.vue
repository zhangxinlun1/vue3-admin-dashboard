<template>
  <div class="profile-container">
    <el-form
        :model="profileForm"
        label-width="80px"
    >
      <el-form-item
          label="用户名"
          prop="username"
      >
        <el-input
            v-model="profileForm.username"
            disabled
        />
      </el-form-item>
      <el-form-item
          label="邮箱"
          prop="email"
      >
        <el-input
            v-model="profileForm.email"
        />
      </el-form-item>
      <el-form-item
          label="电话"
          prop="phone"
      >
        <el-input
            v-model="profileForm.phone"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveProfile">保存修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const profileForm = reactive({
  username: '当前用户名',
  email: '',
  phone: '',
});

const saveProfile = () => {
  // 这里编写将修改后的数据发送到后端保存的逻辑，此处简单示意
  console.log('保存个人资料:', profileForm);
};
</script>

<style lang="scoped">
.profile-container {
  padding: 20px;
}
</style>