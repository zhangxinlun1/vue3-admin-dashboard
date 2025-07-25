<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card revenue">
        <div class="stat-icon">
          <el-icon><Money /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">¥{{ formatNumber(todayRevenue) }}</div>
          <div class="stat-label">今日营业额</div>
          <div class="stat-change positive">
            <el-icon><ArrowUp /></el-icon>
            +{{ revenueGrowth }}%
          </div>
        </div>
      </div>
      
      <div class="stat-card profit">
        <div class="stat-icon">
          <el-icon><PieChart /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">¥{{ formatNumber(todayProfit) }}</div>
          <div class="stat-label">今日利润</div>
          <div class="stat-change positive">
            <el-icon><ArrowUp /></el-icon>
            +{{ profitGrowth }}%
          </div>
        </div>
      </div>
      
      <div class="stat-card orders">
        <div class="stat-icon">
          <el-icon><Document /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ todayOrders }}</div>
          <div class="stat-label">今日订单</div>
          <div class="stat-detail">{{ todayItems }}件</div>
          <div class="stat-change positive">
            <el-icon><ArrowUp /></el-icon>
            +{{ orderGrowth }}%
          </div>
        </div>
      </div>
      
      <div class="stat-card inventory">
        <div class="stat-icon">
          <el-icon><Box /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ totalProducts }}</div>
          <div class="stat-label">库存商品</div>
          <div class="stat-change neutral">
            <el-icon><Minus /></el-icon>
            {{ inventoryChange }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- 图表区域 -->
    <div class="charts-grid">
      <div class="chart-card">
        <div class="chart-header">
          <h3>营业额趋势</h3>
          <el-select v-model="revenuePeriod" size="small">
            <el-option label="最近7天" value="7" />
            <el-option label="最近30天" value="30" />
            <el-option label="最近90天" value="90" />
          </el-select>
        </div>
        <div class="chart-content">
          <div class="chart-placeholder">
            <el-icon><TrendCharts /></el-icon>
            <p>营业额趋势图表</p>
          </div>
        </div>
      </div>
      
      <div class="chart-card">
        <div class="chart-header">
          <h3>商品分类占比</h3>
        </div>
        <div class="chart-content">
          <div class="chart-placeholder">
            <el-icon><PieChart /></el-icon>
            <p>商品分类饼图</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 最近订单 -->
    <div class="recent-orders">
      <div class="section-header">
        <h3>最近订单</h3>
        <el-button type="primary" size="small" @click="viewAllOrders">
          查看全部
        </el-button>
      </div>
      
      <el-table :data="recentOrders" style="width: 100%" class="orders-table">
        <el-table-column prop="orderNo" label="订单号" width="120" />
        <el-table-column prop="customerName" label="客户姓名" width="120" />
        <el-table-column prop="products" label="商品" />
        <el-table-column prop="totalAmount" label="金额" width="100">
          <template #default="scope">
            ¥{{ formatNumber(scope.row.totalAmount) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button type="text" size="small" @click="viewOrder(scope.row)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 库存预警 -->
    <div class="inventory-alert">
      <div class="section-header">
        <h3>库存预警</h3>
        <el-button type="warning" size="small" @click="viewInventory">
          库存管理
        </el-button>
      </div>
      
      <div class="alert-list">
        <div v-for="item in lowStockItems" :key="item.id" class="alert-item">
          <div class="alert-icon">
            <el-icon><Warning /></el-icon>
          </div>
          <div class="alert-content">
            <div class="alert-title">{{ item.name }}</div>
            <div class="alert-desc">库存不足，当前剩余 {{ item.stock }} 件</div>
          </div>
          <div class="alert-action">
            <el-button type="primary" size="small" @click="restock(item)">
              补货
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { 
  Money, 
  PieChart, 
  Document, 
  Box, 
  ArrowUp, 
  ArrowDown, 
  Minus,
  TrendCharts,
  Plus,
  Warning
} from '@element-plus/icons-vue';
import { getProducts } from '@/api/admin/products';
import { getOrders } from '@/api/admin/orders';

const router = useRouter();

// 统计数据
const todayRevenue = ref(0);
const todayProfit = ref(0);
const todayOrders = ref(0);
const todayItems = ref(0);
const totalProducts = ref(0);

const revenueGrowth = ref(12.5);
const profitGrowth = ref(8.3);
const orderGrowth = ref(15.2);
const inventoryChange = ref('持平');

// 图表周期
const revenuePeriod = ref('7');

// 最近订单数据
const recentOrders = ref([]);

// 库存预警数据
const lowStockItems = ref([]);

// 格式化数字
const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN');
};

// 获取状态类型
const getStatusType = (status: string) => {
  const statusMap: Record<string, 'success' | 'warning' | 'info' | 'danger'> = {
    completed: 'success',
    processing: 'warning',
    pending: 'info',
    cancelled: 'danger'
  };
  return statusMap[status] || 'info';
};

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    completed: '已完成',
    processing: '处理中',
    pending: '待处理',
    cancelled: '已取消'
  };
  return statusMap[status] || '未知';
};

// 查看所有订单
const viewAllOrders = () => {
  router.push('/home/orders/list');
};

// 查看订单详情
const viewOrder = (order: any) => {
  ElMessage.info(`查看订单: ${order.orderNo}`);
};

// 查看库存管理
const viewInventory = () => {
  router.push('/home/inventory/list');
};

// 补货
const restock = (item: any) => {
  ElMessage.success(`已为 ${item.name} 创建补货订单`);
};

// 加载统计数据
const loadStats = async () => {
  try {
    // 从API加载商品数据
    const productsResponse = await getProducts();
    const products = productsResponse.data || [];
    totalProducts.value = products.length;
    
    // 从API加载订单数据
    const ordersResponse = await getOrders();
    const orders = ordersResponse.data || [];
    const today = new Date().toISOString().split('T')[0];
    
    const todayOrders = orders.filter((order: any) => 
      order.createdAt.startsWith(today)
    );
    
    todayRevenue.value = todayOrders.reduce((sum: number, order: any) => sum + order.totalAmount, 0);
    todayProfit.value = todayOrders.reduce((sum: number, order: any) => sum + order.profit, 0);
    todayOrders.value = todayOrders.length;
    todayItems.value = todayOrders.reduce((sum: number, order: any) => {
      return sum + order.items.reduce((itemSum: number, item: any) => itemSum + item.quantity, 0);
    }, 0);
    
    // 更新最近订单
    recentOrders.value = orders.slice(-5).map((order: any) => ({
      id: order.id,
      orderNo: order.orderNumber,
      customerName: order.customerName || '匿名客户',
      products: order.items.map((item: any) => `${item.productName} x${item.quantity}`).join(', '),
      totalAmount: order.totalAmount,
      status: order.status,
      createTime: order.createdAt
    }));
    
    // 更新库存预警
    const lowStockProducts = products.filter((product: any) => 
      product.stock <= product.alertStock && product.stock > 0
    );
    
    lowStockItems.value = lowStockProducts.slice(0, 5).map((product: any) => ({
      id: product.id,
      name: product.name,
      stock: product.stock
    }));
  } catch (error) {
    console.error('加载统计数据失败:', error);
    ElMessage.error('加载统计数据失败，请检查网络连接');
  }
};

onMounted(() => {
  loadStats();
});
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

.stat-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
  
  .stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: #ffffff;
    
    &.revenue {
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
    }
    
    &.profit {
      background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
    }
    
    &.orders {
      background: linear-gradient(135deg, #45b7d1 0%, #96c93d 100%);
    }
    
    &.inventory {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }
  }
  
  .stat-content {
    flex: 1;
    
    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: #2c3e50;
      margin-bottom: 4px;
    }
    
    .stat-label {
      font-size: 14px;
      color: #6c757d;
      margin-bottom: 8px;
    }
    
    .stat-detail {
      font-size: 12px;
      color: #409eff;
      font-weight: 500;
      margin-bottom: 8px;
      background: rgba(64, 158, 255, 0.1);
      padding: 2px 8px;
      border-radius: 4px;
      display: inline-block;
    }
    
    .stat-change {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      font-weight: 500;
      
      &.positive {
        color: #28a745;
      }
      
      &.negative {
        color: #dc3545;
      }
      
      &.neutral {
        color: #6c757d;
      }
    }
  }
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

.chart-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
  
  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #2c3e50;
    }
  }
  
  .chart-content {
    height: 300px;
    
    .chart-placeholder {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #6c757d;
      background: #f8f9fa;
      border-radius: 8px;
      border: 2px dashed #dee2e6;
      
      .el-icon {
        font-size: 48px;
        margin-bottom: 16px;
        color: #adb5bd;
      }
      
      p {
        margin: 0;
        font-size: 14px;
      }
    }
  }
}

.recent-orders, .inventory-alert {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
  margin-bottom: 24px;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #2c3e50;
    }
  }
}

.orders-table {
  :deep(.el-table__header) {
    background-color: #f8f9fa;
  }
  
  :deep(.el-table__row) {
    &:hover {
      background-color: #f8f9fa;
    }
  }
}

.alert-list {
  .alert-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: #fff3cd;
    border: 1px solid #ffeaa7;
    border-radius: 8px;
    margin-bottom: 12px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .alert-icon {
      width: 40px;
      height: 40px;
      background: #ffc107;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 18px;
    }
    
    .alert-content {
      flex: 1;
      
      .alert-title {
        font-weight: 600;
        color: #856404;
        margin-bottom: 4px;
      }
      
      .alert-desc {
        font-size: 14px;
        color: #856404;
      }
    }
    
    .alert-action {
      .el-button {
        background: #ffc107;
        border-color: #ffc107;
        color: #ffffff;
        
        &:hover {
          background: #e0a800;
          border-color: #e0a800;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .stat-card {
    padding: 16px;
    
    .stat-icon {
      width: 50px;
      height: 50px;
      font-size: 20px;
    }
    
    .stat-content {
      .stat-value {
        font-size: 24px;
      }
    }
  }
}
</style> 