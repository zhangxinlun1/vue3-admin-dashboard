<template>
  <div class="User-management">
    <el-card class="box-card">
      <h2>用户管理</h2>
      <el-button type="primary" @click="dialogFormVisible = true">添加用户</el-button>
      <el-table :data="users" style="width: 100%">
        <el-table-column prop="userId" label="用户 ID" width="80"></el-table-column>
        <el-table-column prop="userName" label="用户名"></el-table-column>
        <el-table-column prop="password" label="密码" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="realName" label="姓名"></el-table-column>
        <el-table-column prop="gender" label="性别"></el-table-column>
        <el-table-column prop="birthDate" label="出生日期"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="phoneNumber" label="手机号码"></el-table-column>
        <el-table-column prop="registerTime" label="注册时间"></el-table-column>
        <el-table-column prop="lastLoginTime" label="最后登录时间"></el-table-column>
        <el-table-column prop="userStatus" label="用户状态"></el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" @click="showEditUserModal(scope.row)">编辑</el-button>
            <el-button type="primary" @click="showEditUserModal(scope.row)">详细</el-button>
            <el-button type="primary" @click="deleteUser(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>


    <!-- 添加用户模态框 -->
    <AddUserModal
        :dialogFormVisible="dialogFormVisible"
        @close="showAddUserModal = false"
        @add="addUsers"
    />

    <!-- 编辑用户模态框 -->
<!--    <EditUserModal-->
<!--        v-if="showEditUserModal"-->
<!--        :User="UserToEdit"-->
<!--        @close="showEditUserModal = false"-->
<!--        @update="updateUsers"-->
<!--        visible/>-->
    <!-- 错误提示弹框 -->
    <el-dialog v-if="showErrorDialog" title="操作失败" :visible.sync="showErrorDialog">
      <p>{{ errorMessage }}</p>
      <template #footer>
        <el-button @click="showErrorDialog = false">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import EditUserModal from './EditUserModal.vue';

import AddUserModal from "@views/user/AddUserModal.vue";
import {getUsers,addUsers,deleteUsers} from "@api/user";

const users = ref([]);
const showAddUserModal = ref(false);
const UserToEdit = ref({});
const showErrorDialog = ref(false);
const errorMessage = ref('');

const dialogFormVisible = ref(false)


// 获取用户列表
onMounted(async () => {
  try {
    const result = await getUsers();
    users.value = result.data;
  } catch (error) {
    console.error('获取用户列表失败', error);
    showErrorDialog.value = true;
    errorMessage.value = '获取用户列表时出现错误，请稍后重试';
  }
});

const addUsers = async (newUser) => {
  try {
    console.log({newUser})
    const result = await addUsers(newUser);
    if (result.status === 201) {
      // 重新获取用户列表
      const newResult = await getUsers();
      users.value = newResult.data;
      showAddUserModal.value = false;
    }
  } catch (error) {
    console.error('添加用户失败', error);
    showErrorDialog.value = true;
    errorMessage.value = '添加用户时出现错误，请检查输入信息后重试';
  }
};

const deleteUser = async (UserId) => {
  try {
    const result = await deleteUsers(UserId);
    if (result.status === 204) {
      const newResult = await getUsers();
      users.value = newResult.data;
    }
  } catch (error) {
    console.error('删除用户失败', error);
    showErrorDialog.value = true;
    errorMessage.value = '删除用户时出现错误，请稍后重试';
  }
};

const showEditUserModal = (User) => {
  UserToEdit.value = {...User};
  showEditUserModal.value = true;
};

const updateUser = async (updatedUser) => {
  try {
    const result = await updateUser(updatedUser);
    if (result.status === 200) {
      const newResult = await getUsers();
      users.value = newResult.data;
      showEditUserModal.value = false;
    }
  } catch (error) {
    console.error('更新用户失败', error);
    showErrorDialog.value = true;
    errorMessage.value = '更新用户时出现错误，请检查输入信息后重试';
  }
};
</script>

<style scoped>
.User-management {
  padding: 20px;
}

.box-card {
  border: 1px solid #ccc;
}
</style>