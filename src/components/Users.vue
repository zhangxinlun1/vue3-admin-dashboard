<template>
  <div class="users-container">
    <el-button type="primary" class="mb-4" @click="openAddUserDialog">添加用户</el-button>
    <el-table
        :data="userList"
        style="width: 100%"
        border
    >
      <el-table-column
          prop="username"
          label="用户名"
          width="150"
      />
      <el-table-column
          prop="email"
          label="邮箱"
          width="200"
      />
      <el-table-column
          prop="role"
          label="角色"
          width="100"
      />
      <el-table-column
          label="操作"
          width="150"
      >
        <template #default="scope">
          <el-button type="text" @click="editUser(scope.row)">编辑</el-button>
          <el-button type="text" @click="deleteUser(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
        v-model="addUserDialogVisible"
        title="添加用户"
        width="400px"
    >
      <el-form
          :model="addUserForm"
          :rules="addUserRules"
          ref="addUserFormRef"
      >
        <el-form-item
            label="用户名"
            prop="username"
        >
          <el-input
              v-model="addUserForm.username"
          />
        </el-form-item>
        <el-form-item
            label="邮箱"
            prop="email"
        >
          <el-input
              v-model="addUserForm.email"
          />
        </el-form-item>
        <el-form-item
            label="密码"
            prop="password"
        >
          <el-input
              v-model="addUserForm.password"
              type="password"
          />
        </el-form-item>
        <el-form-item
            label="角色"
            prop="role"
        >
          <el-select
              v-model="addUserForm.role"
          >
            <el-option
                v-for="role in roles"
                :key="role.value"
                :label="role.label"
                :value="role.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addUserDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAddUser">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import {ElForm} from "element-plus";

const userList = ref([
  { username: 'user1', email: 'user1@example.com', role: 'admin' },
  { username: 'user2', email: 'user2@example.com', role: 'user' },
  // 更多用户数据示例
]);

const addUserDialogVisible = ref(false);
const addUserForm = reactive({
  username: '',
  email: '',
  password: '',
  role: '',
});

const addUserRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'blur' },
  ],
});

const roles = ref([
  { label: '管理员', value: 'admin' },
  { label: '普通用户', value: 'user' },
]);

const addUserFormRef = ref<InstanceType<typeof ElForm>>();

const openAddUserDialog = () => {
  addUserDialogVisible.value = true;
};

const editUser = (user: any) => {
  // 这里编写跳转到编辑用户页面或者弹出编辑用户对话框等逻辑，此处简单示意
  console.log('编辑用户:', user);
};

const deleteUser = (user: any) => {
  // 这里编写删除用户的逻辑，比如发送请求到后端删除对应的数据等，此处简单示意
  console.log('删除用户:', user);
};

const handleAddUser = () => {
  addUserFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      // 这里假设将用户数据发送到后端进行添加操作，成功后刷新用户列表等逻辑
      console.log('添加用户数据:', addUserForm);
      addUserDialogVisible.value = false;
    } else {
      return false;
    }
  });
};
</script>

<style lang="scss" scoped>
.users-container {
  padding: 20px;
}
</style>