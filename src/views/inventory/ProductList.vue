<template>
  <div class="product-list">
    <div class="page-header">
      <div class="header-left">
        <h2>商品管理</h2>
        <p>管理所有女装商品信息</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="addProduct">
          <el-icon><Plus /></el-icon>
          添加商品
        </el-button>
      </div>
    </div>
    
    <!-- 搜索和筛选 -->
    <el-card class="search-card">
      <div class="search-form">
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索商品名称或编码"
          style="width: 300px"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        
        <el-select v-model="searchForm.category" placeholder="商品分类" clearable style="width: 150px">
          <el-option label="全部" value="" />
          <el-option label="上衣" value="top" />
          <el-option label="裤子" value="pants" />
          <el-option label="裙子" value="dress" />
          <el-option label="外套" value="outerwear" />
          <el-option label="内衣" value="underwear" />
          <el-option label="配饰" value="accessories" />
        </el-select>
        
        <el-select v-model="searchForm.stockStatus" placeholder="库存状态" clearable style="width: 150px">
          <el-option label="全部" value="" />
          <el-option label="充足" value="sufficient" />
          <el-option label="预警" value="warning" />
          <el-option label="缺货" value="out" />
        </el-select>
        
        <el-button type="primary" @click="handleSearch">
          <el-icon><Search /></el-icon>
          搜索
        </el-button>
        
        <el-button @click="resetSearch">
          <el-icon><Refresh /></el-icon>
          重置
        </el-button>
      </div>
    </el-card>
    
    <!-- 商品列表 -->
    <el-card class="list-card">
      <el-table 
        :data="productList" 
        style="width: 100%"
        v-loading="loading"
        class="product-table"
      >
        <el-table-column prop="image" label="商品图片" width="100">
          <template #default="scope">
            <el-image
              :src="scope.row.image || 'https://via.placeholder.com/60x60'"
              :preview-src-list="[scope.row.image]"
              fit="cover"
              style="width: 60px; height: 60px; border-radius: 8px;"
            />
          </template>
        </el-table-column>
        
        <el-table-column prop="name" label="商品名称" min-width="150">
          <template #default="scope">
            <div class="product-info">
              <div class="product-name">{{ scope.row.name }}</div>
              <div class="product-code">{{ scope.row.code }}</div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="category" label="分类" width="100">
          <template #default="scope">
            <el-tag :type="getCategoryType(scope.row.category)">
              {{ getCategoryText(scope.row.category) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="stock" label="库存" width="100">
          <template #default="scope">
            <div class="stock-info">
              <span class="stock-number">{{ scope.row.stock }}</span>
              <el-tag 
                :type="getStockStatusType(scope.row.stock, scope.row.alertStock)"
                size="small"
              >
                {{ getStockStatusText(scope.row.stock, scope.row.alertStock) }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="costPrice" label="进货价" width="100">
          <template #default="scope">
            ¥{{ formatNumber(scope.row.costPrice) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="salePrice" label="销售价" width="100">
          <template #default="scope">
            ¥{{ formatNumber(scope.row.salePrice) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="brand" label="品牌" width="120" />
        <el-table-column prop="color" label="颜色" width="80" />
        
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="text" size="small" @click="viewProduct(scope.row)">
              查看
            </el-button>
            <el-button type="text" size="small" @click="editProduct(scope.row)">
              编辑
            </el-button>
            <el-button type="text" size="small" @click="adjustStock(scope.row)">
              调库存
            </el-button>
            <el-button 
              type="text" 
              size="small" 
              @click="deleteProduct(scope.row)"
              style="color: #f56c6c;"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
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
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus, Search, Refresh } from '@element-plus/icons-vue';

const router = useRouter();
const loading = ref(false);

// 搜索表单
const searchForm = reactive({
  keyword: '',
  category: '',
  stockStatus: ''
});

// 分页信息
const pagination = reactive({
  current: 1,
  size: 20,
  total: 0
});

// 商品列表数据
const productList = ref([]);

// 从本地存储加载商品数据
const loadProducts = () => {
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  productList.value = products;
  pagination.total = products.length;
};

// 格式化数字
const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN');
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

// 获取库存状态类型
const getStockStatusType = (stock: number, alertStock: number) => {
  if (stock === 0) return 'danger';
  if (stock <= alertStock) return 'warning';
  return 'success';
};

// 获取库存状态文本
const getStockStatusText = (stock: number, alertStock: number) => {
  if (stock === 0) return '缺货';
  if (stock <= alertStock) return '预警';
  return '充足';
};

// 搜索
const handleSearch = () => {
  loading.value = true;
  
  // 从本地存储获取所有商品
  const allProducts = JSON.parse(localStorage.getItem('products') || '[]');
  
  // 根据搜索条件过滤
  let filteredProducts = allProducts.filter((product: any) => {
    const keywordMatch = !searchForm.keyword || 
      product.name.toLowerCase().includes(searchForm.keyword.toLowerCase()) ||
      product.code.toLowerCase().includes(searchForm.keyword.toLowerCase());
    
    const categoryMatch = !searchForm.category || product.category === searchForm.category;
    
    let stockStatusMatch = true;
    if (searchForm.stockStatus) {
      if (searchForm.stockStatus === 'out') {
        stockStatusMatch = product.stock === 0;
      } else if (searchForm.stockStatus === 'low') {
        stockStatusMatch = product.stock > 0 && product.stock <= product.alertStock;
      } else if (searchForm.stockStatus === 'normal') {
        stockStatusMatch = product.stock > product.alertStock;
      }
    }
    
    return keywordMatch && categoryMatch && stockStatusMatch;
  });
  
  productList.value = filteredProducts;
  pagination.total = filteredProducts.length;
  pagination.current = 1;
  
  loading.value = false;
  ElMessage.success(`找到 ${filteredProducts.length} 个商品`);
};

// 重置搜索
const resetSearch = () => {
  searchForm.keyword = '';
  searchForm.category = '';
  searchForm.stockStatus = '';
  loadProducts();
};

// 添加商品
const addProduct = () => {
  router.push('/home/inventory/add');
};

// 查看商品详情
const viewProduct = (product: any) => {
  router.push(`/home/inventory/detail/${product.id}`);
};

// 编辑商品
const editProduct = (product: any) => {
  ElMessage.info(`编辑商品：${product.name}`);
  // 这里可以跳转到编辑页面或打开编辑弹窗
};

// 调整库存
const adjustStock = (product: any) => {
  router.push(`/home/inventory/adjust/${product.id}`);
};

// 删除商品
const deleteProduct = async (product: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除商品"${product.name}"吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );
    
    // 从本地存储中删除商品
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const updatedProducts = products.filter((p: any) => p.id !== product.id);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    
    // 重新加载商品列表
    loadProducts();
    
    ElMessage.success('商品删除成功');
  } catch (error) {
    // 用户取消删除
  }
};



// 分页大小改变
const handleSizeChange = (size: number) => {
  pagination.size = size;
  pagination.current = 1;
  loadProducts();
};

// 当前页改变
const handleCurrentChange = (current: number) => {
  pagination.current = current;
  loadProducts();
};

onMounted(() => {
  loadProducts();
});
</script>

<style lang="scss" scoped>
.product-list {
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
      
      .el-input, .el-select {
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
  
  .product-table {
    :deep(.el-table__header) {
      background-color: #f8f9fa;
    }
    
    :deep(.el-table__row) {
      &:hover {
        background-color: #f8f9fa;
      }
    }
  }
  
  .product-info {
    .product-name {
      font-weight: 500;
      color: #2c3e50;
      margin-bottom: 4px;
    }
    
    .product-code {
      font-size: 12px;
      color: #6c757d;
    }
  }
  
  .stock-info {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .stock-number {
      font-weight: 500;
      color: #2c3e50;
    }
  }
  
  .pagination-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid #e9ecef;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .product-list {
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
  
  .list-card {
    .product-table {
      :deep(.el-table) {
        font-size: 12px;
      }
      
      :deep(.el-table__cell) {
        padding: 8px 4px;
      }
    }
    
    .pagination-wrapper {
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

@media (max-width: 480px) {
  .product-list {
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