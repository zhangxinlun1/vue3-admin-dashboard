<script setup>
import { mobileViewportHandler } from './utils/mobileViewport.js';

// 初始化移动端视口处理
mobileViewportHandler;
</script>

<template>
    <router-view></router-view>
</template>

<style scoped lang="scss">

</style>

<style>
#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

/* 全局移动端select下拉框位置修复 */
@media (max-width: 1024px) {
  /* 修复所有select下拉框的位置 */
  .el-select-dropdown {
    position: fixed !important;
    z-index: 3000 !important;
    background-color: #ffffff !important;
    border: 1px solid #dcdfe6 !important;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1) !important;
  }
  
  .el-select-dropdown.el-popper {
    position: fixed !important;
    background-color: #ffffff !important;
  }
  
  /* 确保select组件在移动端正确显示 */
  .el-select .el-input {
    position: relative;
    background-color: #ffffff !important;
  }
  
  .el-select .el-input__wrapper {
    background-color: #ffffff !important;
    border: 1px solid #dcdfe6 !important;
  }
  
  /* 修复移动端键盘弹出时的视口问题 */
  html, body {
    height: 100%;
    overflow-x: hidden;
  }
  
  /* 使用CSS变量设置视口高度 */
  :root {
    --vh: 1vh;
  }
  
  /* 修复移动端视口高度 */
  .home-container {
    height: 100vh;
    height: calc(var(--vh, 1vh) * 100);
  }
  
  /* 防止页面在键盘弹出时跳动 */
  body {
    position: fixed;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  /* 修复移动端表单布局 */
  .el-form-item {
    .el-select {
      width: 100% !important;
    }
  }
}

/* 确保select组件在所有设备上都正确显示 */
.el-select {
  background-color: #ffffff !important;
}

.el-select .el-input__wrapper {
  background-color: #ffffff !important;
  border: 1px solid #dcdfe6 !important;
}

.el-select-dropdown {
  background-color: #ffffff !important;
  border: 1px solid #dcdfe6 !important;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1) !important;
}

.el-select-dropdown .el-select-dropdown__item {
  background-color: #ffffff !important;
}

.el-select-dropdown .el-select-dropdown__item:hover {
  background-color: #f5f7fa !important;
}

.el-select-dropdown .el-select-dropdown__item.selected {
  background-color: #409eff !important;
  color: #ffffff !important;
}

/* 强制覆盖Tailwind CSS的透明背景 */
.el-select,
.el-select *,
.el-select-dropdown,
.el-select-dropdown * {
  background-color: #ffffff !important;
}

.el-select .el-input__wrapper {
  background-color: #ffffff !important;
  border: 1px solid #dcdfe6 !important;
  box-shadow: 0 0 0 1px #dcdfe6 inset !important;
}

.el-select .el-input__inner {
  background-color: #ffffff !important;
  color: #606266 !important;
}

.el-select-dropdown {
  background-color: #ffffff !important;
  border: 1px solid #dcdfe6 !important;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1) !important;
}

.el-select-dropdown .el-select-dropdown__item {
  background-color: #ffffff !important;
  color: #606266 !important;
}

.el-select-dropdown .el-select-dropdown__item:hover {
  background-color: #f5f7fa !important;
  color: #409eff !important;
}

.el-select-dropdown .el-select-dropdown__item.selected {
  background-color: #409eff !important;
  color: #ffffff !important;
}

.el-select-dropdown .el-select-dropdown__item.selected.hover {
  background-color: #409eff !important;
  color: #ffffff !important;
}

/* 处理Tailwind CSS可能的干扰 */
.el-select[class*="bg-"],
.el-select-dropdown[class*="bg-"] {
  background-color: #ffffff !important;
}

.el-select .el-input__wrapper[class*="bg-"] {
  background-color: #ffffff !important;
}

/* 确保select组件在表单中正确显示 */
.el-form-item .el-select {
  background-color: #ffffff !important;
}

.el-form-item .el-select .el-input__wrapper {
  background-color: #ffffff !important;
  border: 1px solid #dcdfe6 !important;
}

/* 处理可能的透明背景问题 */
.el-select:not([style*="background"]),
.el-select-dropdown:not([style*="background"]) {
  background-color: #ffffff !important;
}

/* 确保下拉选项正确显示 */
.el-select-dropdown__list {
  background-color: #ffffff !important;
}

.el-select-dropdown__wrap {
  background-color: #ffffff !important;
}
</style>
