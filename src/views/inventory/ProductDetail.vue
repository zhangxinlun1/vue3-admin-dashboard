<template>
  <div class="product-detail">
    <div class="page-header">
      <div class="header-left">
        <el-button @click="goBack" type="text">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <h2>商品详情</h2>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="editProduct">编辑商品</el-button>
        <el-button type="success" @click="sellProduct">销售商品</el-button>
      </div>
    </div>
    
    <div v-if="product" class="detail-content">
      <el-row :gutter="24">
        <!-- 商品图片 -->
        <el-col :xs="24" :sm="12" :md="8">
          <el-card class="image-card">
            <div class="product-images">
              <div class="main-image">
                <img 
                  :src="product.images?.[0] || 'https://via.placeholder.com/400x400'" 
                  :alt="product.name"
                />
              </div>
              <div v-if="product.images && product.images.length > 1" class="image-thumbnails">
                <div 
                  v-for="(image, index) in product.images" 
                  :key="index"
                  class="thumbnail"
                  :class="{ active: index === 0 }"
                >
                  <img :src="image" :alt="`${product.name} ${index + 1}`" />
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <!-- 商品信息 -->
        <el-col :xs="24" :sm="12" :md="16">
          <el-card class="info-card">
            <div class="product-info">
              <h1 class="product-name">{{ product.name }}</h1>
              <div class="product-meta">
                <el-tag :type="getCategoryType(product.category)" size="large">
                  {{ getCategoryText(product.category) }}
                </el-tag>
                <span class="product-code">编码: {{ product.code }}</span>
              </div>
              
              <div class="product-details">
                <div class="detail-item">
                  <span class="label">品牌:</span>
                  <span class="value">{{ product.brand }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">颜色:</span>
                  <span class="value">{{ product.color }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">规格:</span>
                  <span class="value">{{ product.specification }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">描述:</span>
                  <span class="value">{{ product.description || '暂无描述' }}</span>
                </div>
              </div>
              
              <div class="price-info">
                <div class="price-item">
                  <span class="label">进货价:</span>
                  <span class="value cost">¥{{ formatNumber(product.costPrice) }}</span>
                </div>
                <div class="price-item">
                  <span class="label">销售价:</span>
                  <span class="value sale">¥{{ formatNumber(product.salePrice) }}</span>
                </div>
                <div class="price-item">
                  <span class="label">利润率:</span>
                  <span class="value profit">{{ calculateProfitRate() }}%</span>
                </div>
              </div>
              
              <div class="stock-info">
                <div class="stock-item">
                  <span class="label">当前库存:</span>
                  <span class="value" :class="getStockClass()">{{ product.stock }}</span>
                </div>
                <div class="stock-item">
                  <span class="label">预警库存:</span>
                  <span class="value">{{ product.alertStock }}</span>
                </div>
                <div class="stock-item">
                  <span class="label">已售数量:</span>
                  <span class="value">{{ product.soldCount || 0 }}</span>
                </div>
                <div class="stock-item">
                  <span class="label">总销售额:</span>
                  <span class="value">¥{{ formatNumber(product.totalRevenue || 0) }}</span>
                </div>
              </div>
              
              <div class="time-info">
                <div class="time-item">
                  <span class="label">创建时间:</span>
                  <span class="value">{{ formatDate(product.createTime) }}</span>
                </div>
                <div class="time-item">
                  <span class="label">更新时间:</span>
                  <span class="value">{{ formatDate(product.updateTime) }}</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      
      <!-- 销售记录 -->
      <el-card class="sales-card">
        <div class="card-header">
          <h3>销售记录</h3>
        </div>
        <el-table :data="salesRecords" v-loading="loading">
          <el-table-column prop="saleTime" label="销售时间" width="180">
            <template #default="scope">
              {{ formatDate(scope.row.saleTime) }}
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
          <el-table-column prop="customerName" label="客户" width="120" />
          <el-table-column prop="remark" label="备注" />
        </el-table>
      </el-card>
    </div>
    
    <div v-else class="loading-state">
      <el-empty description="商品不存在或已删除" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { ArrowLeft } from '@element-plus/icons-vue';

const router = useRouter();
const route = useRoute();
const loading = ref(false);
const product = ref(null);
const salesRecords = ref([]);

// 获取商品详情
const loadProductDetail = () => {
  const productId = route.params.id;
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  product.value = products.find((p: any) => p.id === productId);
  
  if (product.value) {
    loadSalesRecords();
  }
};

// 加载销售记录
const loadSalesRecords = () => {
  const sales = JSON.parse(localStorage.getItem('sales') || '[]');
  salesRecords.value = sales.filter((sale: any) => sale.productId === product.value.id);
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

// 计算利润率
const calculateProfitRate = () => {
  if (!product.value) return 0;
  const profit = product.value.salePrice - product.value.costPrice;
  const rate = (profit / product.value.costPrice) * 100;
  return rate.toFixed(1);
};

// 获取库存状态样式
const getStockClass = () => {
  if (!product.value) return '';
  if (product.value.stock === 0) return 'out-of-stock';
  if (product.value.stock <= product.value.alertStock) return 'low-stock';
  return 'normal-stock';
};

// 返回上一页
const goBack = () => {
  router.back();
};

// 编辑商品
const editProduct = () => {
  ElMessage.info('编辑功能开发中...');
};

// 销售商品
const sellProduct = () => {
  if (product.value.stock <= 0) {
    ElMessage.warning('该商品库存不足，无法销售');
    return;
  }
  router.push(`/home/orders/create?productId=${product.value.id}`);
};

onMounted(() => {
  loadProductDetail();
});
</script>

<style lang="scss" scoped>
.product-detail {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
      
      h2 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
        color: #2c3e50;
      }
    }
    
    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      
      .header-actions {
        width: 100%;
        display: flex;
        gap: 12px;
        
        .el-button {
          flex: 1;
        }
      }
    }
  }
}

.detail-content {
  .image-card {
    .product-images {
      .main-image {
        width: 100%;
        height: 400px;
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: 16px;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      
      .image-thumbnails {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        
        .thumbnail {
          width: 80px;
          height: 80px;
          border-radius: 4px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.3s ease;
          
          &.active {
            border-color: #409eff;
          }
          
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
    }
  }
  
  .info-card {
    .product-info {
      .product-name {
        margin: 0 0 16px 0;
        font-size: 28px;
        font-weight: 600;
        color: #2c3e50;
      }
      
      .product-meta {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 24px;
        
        .product-code {
          color: #6c757d;
          font-size: 14px;
        }
      }
      
      .product-details, .price-info, .stock-info, .time-info {
        margin-bottom: 24px;
        
        .detail-item, .price-item, .stock-item, .time-item {
          display: flex;
          margin-bottom: 12px;
          
          .label {
            width: 100px;
            color: #6c757d;
            font-weight: 500;
          }
          
          .value {
            flex: 1;
            color: #2c3e50;
            
            &.cost {
              color: #e74c3c;
              font-weight: 600;
            }
            
            &.sale {
              color: #27ae60;
              font-weight: 600;
              font-size: 18px;
            }
            
            &.profit {
              color: #f39c12;
              font-weight: 600;
            }
            
            &.out-of-stock {
              color: #e74c3c;
              font-weight: 600;
            }
            
            &.low-stock {
              color: #f39c12;
              font-weight: 600;
            }
            
            &.normal-stock {
              color: #27ae60;
              font-weight: 600;
            }
          }
        }
      }
    }
  }
  
  .sales-card {
    margin-top: 24px;
    
    .card-header {
      margin-bottom: 20px;
      
      h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #2c3e50;
      }
    }
  }
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.profit {
  color: #27ae60;
  font-weight: 600;
}

@media (max-width: 768px) {
  .product-detail {
    .detail-content {
      .el-row {
        .el-col {
          margin-bottom: 16px;
        }
      }
    }
  }
}
</style> 