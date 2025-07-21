<template>
  <div class="order-list">
    <div class="page-header">
      <div class="header-left">
        <h2>销售记录</h2>
        <p>查看所有商品销售记录</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="goToCreateOrder">
          <el-icon><Plus /></el-icon>新增销售
        </el-button>
      </div>
    </div>
    
    <el-card class="search-card">
      <div class="search-form">
        <el-input 
          v-model="searchForm.keyword" 
          placeholder="搜索商品名称或客户姓名"
          clearable
        />
        <el-select v-model="searchForm.category" placeholder="商品分类" clearable>
          <el-option label="全部" value="" />
          <el-option label="上衣" value="top" />
          <el-option label="裤子" value="pants" />
          <el-option label="裙子" value="dress" />
          <el-option label="外套" value="outerwear" />
          <el-option label="内衣" value="underwear" />
          <el-option label="配饰" value="accessories" />
        </el-select>
        <el-date-picker
          v-model="searchForm.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>
    </el-card>
    
    <el-card class="list-card">
      <div class="stats-summary">
        <div class="stat-item">
          <span class="stat-label">今日销售额</span>
          <span class="stat-value">¥{{ formatNumber(todayRevenue) }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">今日利润</span>
          <span class="stat-value profit">¥{{ formatNumber(todayProfit) }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">今日订单</span>
          <span class="stat-value">{{ todayOrders }}</span>
        </div>
      </div>
      
      <el-table :data="saleList" v-loading="loading" class="sale-table">
        <el-table-column prop="productName" label="商品名称" min-width="120" />
        <el-table-column prop="productCode" label="商品编码" width="100" />
        <el-table-column prop="category" label="分类" width="80">
          <template #default="scope">
            <el-tag :type="getCategoryType(scope.row.category)" size="small">
              {{ getCategoryText(scope.row.category) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量" width="80" />
        <el-table-column prop="price" label="单价" width="100">
          <template #default="scope">
            ¥{{ formatNumber(scope.row.price) }}
          </template>
        </el-table-column>
        <el-table-column prop="totalAmount" label="总金额" width="120">
          <template #default="scope">
            ¥{{ formatNumber(scope.row.totalAmount) }}
          </template>
        </el-table-column>
        <el-table-column prop="profit" label="利润" width="100">
          <template #default="scope">
            <span class="profit">¥{{ formatNumber(scope.row.profit) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="customerName" label="客户" width="100" />
        <el-table-column prop="saleTime" label="销售时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.saleTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="scope">
            <el-button type="text" @click="viewSaleDetail(scope.row)">查看</el-button>
            <el-button type="text" @click="printSale(scope.row)">打印</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';

const router = useRouter();
const loading = ref(false);

// 搜索表单
const searchForm = reactive({
  keyword: '',
  category: '',
  dateRange: []
});

// 分页信息
const pagination = reactive({
  current: 1,
  size: 20,
  total: 0
});

// 销售记录列表
const saleList = ref([]);

// 统计数据
const todayRevenue = ref(0);
const todayProfit = ref(0);
const todayOrders = ref(0);

// 从本地存储加载销售数据
const loadSales = () => {
  const sales = JSON.parse(localStorage.getItem('sales') || '[]');
  saleList.value = sales;
  pagination.total = sales.length;
  calculateStats();
};

// 计算统计数据
const calculateStats = () => {
  const today = new Date().toISOString().split('T')[0];
  const todaySales = saleList.value.filter((sale: any) => 
    sale.saleTime.startsWith(today)
  );
  
  todayRevenue.value = todaySales.reduce((sum: number, sale: any) => sum + sale.totalAmount, 0);
  todayProfit.value = todaySales.reduce((sum: number, sale: any) => sum + sale.profit, 0);
  todayOrders.value = todaySales.length;
};

// 搜索
const handleSearch = () => {
  loading.value = true;
  
  const allSales = JSON.parse(localStorage.getItem('sales') || '[]');
  
  let filteredSales = allSales.filter((sale: any) => {
    const keywordMatch = !searchForm.keyword || 
      sale.productName.toLowerCase().includes(searchForm.keyword.toLowerCase()) ||
      sale.customerName.toLowerCase().includes(searchForm.keyword.toLowerCase());
    
    const categoryMatch = !searchForm.category || sale.category === searchForm.category;
    
    let dateMatch = true;
    if (searchForm.dateRange && searchForm.dateRange.length === 2) {
      const saleDate = sale.saleTime.split('T')[0];
      dateMatch = saleDate >= searchForm.dateRange[0] && saleDate <= searchForm.dateRange[1];
    }
    
    return keywordMatch && categoryMatch && dateMatch;
  });
  
  saleList.value = filteredSales;
  pagination.total = filteredSales.length;
  pagination.current = 1;
  
  loading.value = false;
  ElMessage.success(`找到 ${filteredSales.length} 条销售记录`);
};

// 重置搜索
const resetSearch = () => {
  searchForm.keyword = '';
  searchForm.category = '';
  searchForm.dateRange = [];
  loadSales();
};

// 获取分类类型
const getCategoryType = (category: string) => {
  const typeMap: Record<string, 'success' | 'warning' | 'info' | 'primary' | 'danger'> = {
    top: 'primary',
    pants: 'success',
    dress: 'danger',
    outerwear: 'warning',
    underwear: 'info',
    accessories: 'info'
  };
  return typeMap[category] || 'info';
};

// 获取分类文本
const getCategoryText = (category: string) => {
  const textMap: Record<string, string> = {
    top: '上衣',
    pants: '裤子',
    dress: '裙子',
    outerwear: '外套',
    underwear: '内衣',
    accessories: '配饰'
  };
  return textMap[category] || '未知';
};

// 格式化数字
const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN');
};

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 跳转到创建销售页面
const goToCreateOrder = () => {
  router.push('/home/orders/create');
};

// 查看销售详情
const viewSaleDetail = (sale: any) => {
  ElMessage.info(`查看销售记录：${sale.productName}`);
  // 这里可以打开详情弹窗或跳转到详情页面
};

// 打印销售记录
const printSale = (sale: any) => {
  ElMessage.info(`打印销售记录：${sale.productName}`);
  // 这里可以实现打印功能
};

// 分页大小改变
const handleSizeChange = (size: number) => {
  pagination.size = size;
  pagination.current = 1;
  loadSales();
};

// 当前页改变
const handleCurrentChange = (current: number) => {
  pagination.current = current;
  loadSales();
};

onMounted(() => {
  loadSales();
});
</script>

<style lang="scss" scoped>
.order-list {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    
    .header-left {
      h2 {
        margin: 0 0 8px 0;
        font-size: 24px;
        font-weight: 600;
        color: #2c3e50;
      }
      
      p {
        margin: 0;
        color: #6c757d;
        font-size: 14px;
      }
    }
  }
}

.search-card {
  margin-bottom: 24px;
  border-radius: 12px;
  
  .search-form {
    display: flex;
    gap: 16px;
    align-items: center;
    flex-wrap: wrap;
    
    @media (max-width: 768px) {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
      
      .el-input, .el-select, .el-date-picker {
        width: 100%;
      }
      
      .el-button {
        width: 100%;
      }
    }
  }
}

.list-card {
  border-radius: 12px;
  
  .stats-summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
    padding: 16px;
    background-color: #f8f9fa;
    border-radius: 8px;
    
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      
      .stat-label {
        font-size: 14px;
        color: #6c757d;
        margin-bottom: 8px;
      }
      
      .stat-value {
        font-size: 24px;
        font-weight: 600;
        color: #2c3e50;
        
        &.profit {
          color: #27ae60;
        }
      }
    }
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 12px;
      
      .stat-item {
        .stat-value {
          font-size: 20px;
        }
      }
    }
  }
  
  .sale-table {
    :deep(.el-table__header) {
      background-color: #f8f9fa;
      
      th {
        background-color: transparent;
        color: #495057;
        font-weight: 600;
        border-bottom: 2px solid #dee2e6;
      }
    }
    
    :deep(.el-table__row) {
      &:hover {
        background-color: #f8f9fa;
      }
    }
    
    :deep(.el-table__cell) {
      padding: 16px 8px;
    }
    
    @media (max-width: 768px) {
      :deep(.el-table) {
        font-size: 12px;
      }
      
      :deep(.el-table__cell) {
        padding: 8px 4px;
      }
    }
  }
  
  .pagination-wrapper {
    display: flex;
    justify-content: center;
    padding: 24px 0;
    
    @media (max-width: 768px) {
      padding: 16px 0;
      
      :deep(.el-pagination) {
        font-size: 12px;
        
        .el-pagination__sizes {
          display: none;
        }
      }
    }
  }
}

.profit {
  color: #27ae60;
  font-weight: 600;
}

// 响应式设计
@media (max-width: 768px) {
  .order-list {
    .page-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      
      .header-actions {
        width: 100%;
        
        .el-button {
          width: 100%;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .order-list {
    .page-header {
      h2 {
        font-size: 18px;
      }
      
      p {
        font-size: 12px;
      }
    }
  }
}
</style> 