<template>
  <el-container class="home-container">
    <!-- 侧边栏 -->
    <el-aside width="260px" class="sidebar" :class="{ 'sidebar-collapsed': isCollapsed }">
      <div class="sidebar-header">
        <div class="logo">
          <el-icon class="logo-icon"><DataBoard /></el-icon>
          <span class="logo-text">七哥店铺管理系统</span>
        </div>
      </div>
      
      <el-menu
        :default-active="$route.path"
        :router="true"
        class="sidebar-menu"
        background-color="#1a1a2e"
        text-color="#ffffff"
        active-text-color="#ff6b6b"
      >
        <el-menu-item index="/home/dashboard" class="menu-item">
          <el-icon><DataBoard /></el-icon>
          <span>数据概览</span>
        </el-menu-item>
        
        <el-sub-menu index="inventory" class="submenu">
          <template #title>
            <el-icon><Box /></el-icon>
            <span>商品管理</span>
          </template>
          <el-menu-item index="/home/inventory/add" class="submenu-item">
            <el-icon><Plus /></el-icon>
            <span>商品入库</span>
          </el-menu-item>
          <el-menu-item index="/home/inventory/list" class="submenu-item">
            <el-icon><List /></el-icon>
            <span>商品列表</span>
          </el-menu-item>
        </el-sub-menu>
        
        <el-sub-menu index="orders" class="submenu">
          <template #title>
            <el-icon><Document /></el-icon>
            <span>销售管理</span>
          </template>
          <el-menu-item index="/home/orders/create" class="submenu-item">
            <el-icon><Edit /></el-icon>
            <span>商品销售</span>
          </el-menu-item>
          <el-menu-item index="/home/orders/list" class="submenu-item">
            <el-icon><Tickets /></el-icon>
            <span>销售记录</span>
          </el-menu-item>
        </el-sub-menu>
        
        <el-sub-menu index="analytics" class="submenu">
          <template #title>
            <el-icon><TrendCharts /></el-icon>
            <span>数据分析</span>
          </template>
          <el-menu-item index="/home/analytics/revenue" class="submenu-item">
            <el-icon><Money /></el-icon>
            <span>营业额统计</span>
          </el-menu-item>
          <el-menu-item index="/home/analytics/profit" class="submenu-item">
            <el-icon><PieChart /></el-icon>
            <span>利润分析</span>
          </el-menu-item>
        </el-sub-menu>
        
        <el-menu-item index="/home/settings" class="menu-item">
          <el-icon><Setting /></el-icon>
          <span>系统设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <el-container>
      <!-- 顶部导航栏 -->
                        <el-header height="70px" class="header">
                    <div class="header-left">
                      <el-button 
                        type="text" 
                        @click="toggleSidebar"
                        class="sidebar-toggle"
                      >
                        <el-icon><Fold v-if="!isCollapsed" /><Expand v-else /></el-icon>
                      </el-button>
                      <el-breadcrumb separator="/" class="breadcrumb">
                        <el-breadcrumb-item :to="{ path: '/home/dashboard' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>{{ $route.meta?.title || '数据概览' }}</el-breadcrumb-item>
                      </el-breadcrumb>
                    </div>
        
        <div class="header-right">
          <div class="header-actions">
            <el-button type="primary" size="small" @click="showNotification">
              <el-icon><Bell /></el-icon>
              通知
            </el-button>
            
            <el-dropdown trigger="click" class="user-dropdown">
              <div class="user-info">
                <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                <span class="username">管理员</span>
                <el-icon><ArrowDown /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="goToProfile">
                    <el-icon><User /></el-icon>
                    个人中心
                  </el-dropdown-item>
                  <el-dropdown-item @click="logout" divided>
                    <el-icon><SwitchButton /></el-icon>
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
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
import { 
  DataBoard, Box, Plus, List, Document, Edit, 
  Tickets, TrendCharts, Money, PieChart, Setting, Bell, 
  ArrowDown, User, SwitchButton, Expand, Fold 
} from "@element-plus/icons-vue";
import { ElMessage } from 'element-plus';

const router = useRouter();

const isCollapsed = ref(false);

const logout = () => {
  ElMessage.success('退出登录成功');
  localStorage.removeItem('token');
  router.push('/login');
};

const goToProfile = () => {
  ElMessage.info('跳转到个人中心');
};

const showNotification = () => {
  ElMessage.info('暂无新通知');
};

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};
</script>

<style lang="scss" scoped>
.home-container {
  height: 100vh;
  display: flex;
  overflow: hidden;
}

.sidebar {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  
  .sidebar-header {
    padding: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .logo-icon {
        font-size: 24px;
        color: #ff6b6b;
      }
      
      .logo-text {
        font-size: 18px;
        font-weight: 600;
        color: #ffffff;
      }
    }
  }
  
  .sidebar-menu {
    border: none;
    height: calc(100vh - 80px);
    padding-top: 20px;
    
    .menu-item {
      height: 56px;
      line-height: 56px;
      margin: 4px 16px;
      border-radius: 8px;
      transition: all 0.3s ease;
      
      &:hover {
        background-color: rgba(255, 107, 107, 0.1);
        color: #ff6b6b;
      }
      
      &.is-active {
        background-color: #ff6b6b;
        color: #ffffff;
      }
      
      .el-icon {
        margin-right: 12px;
        font-size: 18px;
      }
    }
    
    .submenu {
      margin: 4px 16px;
      
      .el-sub-menu__title {
        height: 56px;
        line-height: 56px;
        border-radius: 8px;
        transition: all 0.3s ease;
        
        &:hover {
          background-color: rgba(255, 107, 107, 0.1);
          color: #ff6b6b;
        }
        
        .el-icon {
          margin-right: 12px;
          font-size: 18px;
        }
      }
      
      .submenu-item {
        height: 48px;
        line-height: 48px;
        margin: 2px 0;
        padding-left: 48px;
        border-radius: 6px;
        transition: all 0.3s ease;
        
        &:hover {
          background-color: rgba(255, 107, 107, 0.1);
          color: #ff6b6b;
        }
        
        &.is-active {
          background-color: rgba(255, 107, 107, 0.2);
          color: #ff6b6b;
        }
        
        .el-icon {
          margin-right: 8px;
          font-size: 16px;
        }
      }
    }
  }
}

.header {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid #e9ecef;
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
    
    .sidebar-toggle {
      display: none;
      font-size: 20px;
      color: #6c757d;
      
      @media (max-width: 768px) {
        display: block;
      }
    }
    
    .breadcrumb {
      font-size: 14px;
      
      @media (max-width: 768px) {
        display: none;
      }
      
      :deep(.el-breadcrumb__item) {
        .el-breadcrumb__inner {
          color: #6c757d;
          font-weight: 500;
          
          &:hover {
            color: #ff6b6b;
          }
        }
        
        &:last-child {
          .el-breadcrumb__inner {
            color: #495057;
            font-weight: 600;
          }
        }
      }
    }
  }
  
  .header-right {
    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
      
      .user-dropdown {
        .user-info {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          
          &:hover {
            background-color: #f8f9fa;
          }
          
          .username {
            font-size: 14px;
            font-weight: 500;
            color: #495057;
          }
          
          .el-icon {
            color: #6c757d;
            font-size: 12px;
          }
        }
      }
    }
  }
}

.main {
  padding: 24px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background-color: #f1f3f4;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #c1c1c1;
    border-radius: 4px;
    
    &:hover {
      background-color: #a8a8a8;
    }
  }
}

// 移动端适配
@media (max-width: 768px) {
  .home-container {
    .sidebar {
      position: fixed;
      left: 0;
      top: 0;
      height: 100vh;
      z-index: 1000;
      transform: translateX(-100%);
      transition: transform 0.3s ease;
      
      &.sidebar-collapsed {
        transform: translateX(0);
      }
    }
    
    .header {
      padding: 0 16px;
      
      .header-right {
        .header-actions {
          gap: 8px;
          
          .el-button {
            padding: 8px 12px;
            font-size: 12px;
          }
          
          .user-dropdown {
            .user-info {
              .username {
                display: none;
              }
            }
          }
        }
      }
    }
    
    .main {
      padding: 16px;
    }
  }
}

// 平板适配
@media (min-width: 769px) and (max-width: 1024px) {
  .home-container {
    .sidebar {
      width: 200px !important;
    }
    
    .main {
      padding: 20px;
    }
  }
}
</style>