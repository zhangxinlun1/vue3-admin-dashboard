<template>
  <el-container class="home-container">
    <!-- 侧边栏 -->
    <el-aside width="200px" class="sidebar">
      <el-menu
          :default-openeds="['1', '2']"
          :router="true"
          class="sidebar-menu"
      >
        <el-sub-menu index="1">
          <template #title>
            <el-icon><Menu/></el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item index="/home/dashboard">
            <el-icon><Monitor/></el-icon>
            <span>仪表盘</span>
          </el-menu-item>
          <el-menu-item index="/home/users">
            <el-icon><User/></el-icon>
            <span>用户管理</span>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>
            <el-icon><Setting/></el-icon>
            <span>设置</span>
          </template>
          <el-menu-item index="/settings/security">
            <el-icon><Setting/></el-icon>
            <span>安全设置</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <!-- 顶部导航栏 -->
      <el-header height="60px" class="header">
        <div class="header-left">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ $route.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right text-gray-600">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              <i class="el-icon-user-solid"></i>
              管理员
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <!-- 主要内容区域 -->
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {Menu, Monitor, Setting, User} from "@element-plus/icons-vue";

const router = useRouter();
const logout = () => {
  // 这里执行退出登录的逻辑，例如清除登录状态、跳转到登录页等
  localStorage.removeItem('token');
  router.push('/login');
};
</script>

<style lang="scss" scoped>
.home-container {
  height: 100vh;
  display: flex;
  overflow: hidden;
}

.sidebar {
  background-color: #2c3e50;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: width 0.3s ease;

  &:hover {
    width: 250px;
  }

  .sidebar-menu {
    border: none;
    height: 100%;

    .el-menu-item {
      height: 50px;
      line-height: 50px;
      padding-left: 30px;
      &:hover {
        background-color: #1abc9c;
      }
      i {
        margin-right: 10px;
      }
    }

    .el-submenu__title {
      height: 50px;
      line-height: 50px;
      padding-left: 30px;
      &:hover {
        background-color: #1abc9c;
      }
      i {
        margin-right: 10px;
      }
    }
  }
}

.header {
  color: #fdc5c5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-left {
  flex: 1;
}

.header-right {
  display: flex;
  align-items: center;

  .el-dropdown-link {
    display: flex;
    align-items: center;
    cursor: pointer;
    i {
      margin-right: 5px;
    }
  }
}

.main {
  padding: 20px;
  overflow-y: auto;
  background-color: #ecf0f1;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background-color: #ddd;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 4px;
  }
}

.el-menu-item.is-active {
  background-color: #16a085!important;
}
</style>