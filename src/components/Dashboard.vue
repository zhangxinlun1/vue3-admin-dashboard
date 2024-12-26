<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              用户总数
            </div>
          </template>
          <div class="text-center">
            <h2>1000</h2>
            <p>较上周增长 10%</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              订单总量
            </div>
          </template>
          <div class="text-center">
            <h2>500</h2>
            <p>较上月下降 5%</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              活跃用户数
            </div>
          </template>
          <div class="text-center">
            <h2>300</h2>
            <p>较昨日持平</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="mt-4">
      <el-col :span="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              近一周订单趋势
            </div>
          </template>
          {{lineChartOptions}}
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              用户地域分布
            </div>
          </template>
          {{pieChartOptions}}
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const lineChartOptions = ref({
  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [120, 100, 80, 90, 110, 130, 140],
      type: 'line',
    },
  ],
});

const pieChartOptions = ref({
  series: [
    {
      name: '地域',
      type: 'pie',
      radius: '55%',
      data: [
        { value: 300, name: '北京' },
        { value: 200, name: '上海' },
        { value: 150, name: '广州' },
        { value: 100, name: '深圳' },
        { value: 50, name: '其他' },
      ],
    },
  ],
});
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;
}
.box-card {
  height: 100%;
}
.card-header {
  font-size: 18px;
  font-weight: bold;
}
</style>