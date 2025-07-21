<template>
  <div class="create-order">
    <div class="page-header">
      <h2>商品销售</h2>
      <p>选择商品进行销售</p>
    </div>
    
    <el-card class="order-card">
      <div class="order-form">
        <!-- 商品选择 -->
        <div class="form-section">
          <h3>选择商品</h3>
          <div class="product-search">
            <el-input 
              v-model="searchKeyword" 
              placeholder="搜索商品名称或编码"
              @input="searchProducts"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
          
          <div class="product-list">
            <div 
              v-for="product in filteredProducts" 
              :key="product.id"
              class="product-item"
              :class="{ selected: selectedProduct?.id === product.id }"
              @click="selectProduct(product)"
            >
              <div class="product-image">
                <img :src="product.images?.[0] || 'https://via.placeholder.com/60x60'" :alt="product.name" />
              </div>
              <div class="product-info">
                <div class="product-name">{{ product.name }}</div>
                <div class="product-details">
                  <span class="product-code">{{ product.code }}</span>
                  <span class="product-category">{{ getCategoryText(product.category) }}</span>
                  <span class="product-spec">{{ product.specification }}</span>
                </div>
                <div class="product-price">
                  <span class="sale-price">¥{{ formatNumber(product.salePrice) }}</span>
                  <span class="stock">库存: {{ product.stock }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 销售信息 -->
        <div v-if="selectedProduct" class="form-section">
          <h3>销售信息</h3>
          <div class="sale-form">
            <div class="product-summary">
              <img :src="selectedProduct.images?.[0] || 'https://via.placeholder.com/80x80'" :alt="selectedProduct.name" />
              <div class="summary-info">
                <h4>{{ selectedProduct.name }}</h4>
                <p>{{ selectedProduct.code }} | {{ getCategoryText(selectedProduct.category) }}</p>
                <p>品牌: {{ selectedProduct.brand }} | 颜色: {{ selectedProduct.color }}</p>
              </div>
            </div>
            
            <div class="sale-details">
              <el-form :model="saleForm" label-width="100px">
                <el-form-item label="销售数量">
                  <el-input-number 
                    v-model="saleForm.quantity" 
                    :min="1" 
                    :max="selectedProduct.stock"
                    @change="calculateTotal"
                  />
                </el-form-item>
                
                <el-form-item label="销售价格">
                  <el-input 
                    v-model="saleForm.price" 
                    type="number"
                    @input="calculateTotal"
                  >
                    <template #prefix>¥</template>
                  </el-input>
                </el-form-item>
                
                <el-form-item label="客户姓名">
                  <el-input v-model="saleForm.customerName" placeholder="请输入客户姓名" />
                </el-form-item>
                
                <el-form-item label="联系电话">
                  <el-input v-model="saleForm.customerPhone" placeholder="请输入联系电话" />
                </el-form-item>
                
                <el-form-item label="备注">
                  <el-input 
                    v-model="saleForm.remark" 
                    type="textarea" 
                    placeholder="可选备注信息"
                    :rows="3"
                  />
                </el-form-item>
              </el-form>
            </div>
            
            <div class="total-section">
              <div class="total-item">
                <span>商品总价:</span>
                <span class="total-price">¥{{ formatNumber(totalPrice) }}</span>
              </div>
              <div class="total-item">
                <span>预计利润:</span>
                <span class="profit">¥{{ formatNumber(estimatedProfit) }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="form-actions">
          <el-button @click="resetForm">重置</el-button>
          <el-button 
            type="primary" 
            @click="submitSale"
            :disabled="!selectedProduct || !saleForm.quantity || !saleForm.price"
            :loading="submitting"
          >
            确认销售
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Search } from '@element-plus/icons-vue';

const router = useRouter();
const route = useRoute();
const submitting = ref(false);
const searchKeyword = ref('');

// 商品列表
const products = ref([]);
const selectedProduct = ref(null);

// 销售表单
const saleForm = reactive({
  quantity: 1,
  price: 0,
  customerName: '',
  customerPhone: '',
  remark: ''
});

// 计算属性
const filteredProducts = computed(() => {
  if (!searchKeyword.value) return products.value;
  
  return products.value.filter((product: any) => 
    product.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
    product.code.toLowerCase().includes(searchKeyword.value.toLowerCase())
  );
});

const totalPrice = computed(() => {
  if (!selectedProduct.value || !saleForm.quantity || !saleForm.price) return 0;
  return saleForm.quantity * saleForm.price;
});

const estimatedProfit = computed(() => {
  if (!selectedProduct.value || !saleForm.quantity || !saleForm.price) return 0;
  const cost = saleForm.quantity * selectedProduct.value.costPrice;
  const revenue = saleForm.quantity * saleForm.price;
  return revenue - cost;
});

// 加载商品数据
const loadProducts = () => {
  const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
  products.value = storedProducts.filter((product: any) => product.stock > 0);
  
  // 检查是否有预选商品
  const productId = route.query.productId;
  if (productId) {
    const preSelectedProduct = products.value.find((p: any) => p.id === productId);
    if (preSelectedProduct) {
      selectProduct(preSelectedProduct);
    }
  }
};

// 搜索商品
const searchProducts = () => {
  // 实时搜索，通过计算属性实现
};

// 选择商品
const selectProduct = (product: any) => {
  selectedProduct.value = product;
  saleForm.price = product.salePrice;
  calculateTotal();
};

// 计算总价
const calculateTotal = () => {
  // 通过计算属性自动计算
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

// 提交销售
const submitSale = async () => {
  if (!selectedProduct.value) {
    ElMessage.warning('请选择要销售的商品');
    return;
  }
  
  if (!saleForm.quantity || saleForm.quantity <= 0) {
    ElMessage.warning('请输入有效的销售数量');
    return;
  }
  
  if (!saleForm.price || saleForm.price <= 0) {
    ElMessage.warning('请输入有效的销售价格');
    return;
  }
  
  if (saleForm.quantity > selectedProduct.value.stock) {
    ElMessage.warning('销售数量不能超过库存数量');
    return;
  }
  
  submitting.value = true;
  
  try {
    // 生成销售记录ID
    const saleId = Date.now().toString();
    
    // 创建销售记录
    const saleRecord = {
      id: saleId,
      productId: selectedProduct.value.id,
      productName: selectedProduct.value.name,
      productCode: selectedProduct.value.code,
      category: selectedProduct.value.category,
      quantity: saleForm.quantity,
      price: saleForm.price,
      totalAmount: totalPrice.value,
      profit: estimatedProfit.value,
      customerName: saleForm.customerName,
      customerPhone: saleForm.customerPhone,
      remark: saleForm.remark,
      saleTime: new Date().toISOString()
    };
    
    // 保存销售记录
    const existingSales = JSON.parse(localStorage.getItem('sales') || '[]');
    existingSales.push(saleRecord);
    localStorage.setItem('sales', JSON.stringify(existingSales));
    
    // 更新商品库存
    const updatedProducts = products.value.map((product: any) => {
      if (product.id === selectedProduct.value.id) {
        return {
          ...product,
          stock: product.stock - saleForm.quantity,
          soldCount: (product.soldCount || 0) + saleForm.quantity,
          totalRevenue: (product.totalRevenue || 0) + totalPrice.value
        };
      }
      return product;
    });
    
    // 更新本地存储中的商品数据
    const allProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const updatedAllProducts = allProducts.map((product: any) => {
      if (product.id === selectedProduct.value.id) {
        return {
          ...product,
          stock: product.stock - saleForm.quantity,
          soldCount: (product.soldCount || 0) + saleForm.quantity,
          totalRevenue: (product.totalRevenue || 0) + totalPrice.value
        };
      }
      return product;
    });
    localStorage.setItem('products', JSON.stringify(updatedAllProducts));
    
    // 更新统计数据
    updateStats();
    
    ElMessage.success('销售成功！');
    resetForm();
    
  } catch (error) {
    console.error('销售失败:', error);
    ElMessage.error('销售失败，请重试');
  } finally {
    submitting.value = false;
  }
};

// 更新统计数据
const updateStats = () => {
  const sales = JSON.parse(localStorage.getItem('sales') || '[]');
  const today = new Date().toISOString().split('T')[0];
  
  const todaySales = sales.filter((sale: any) => 
    sale.saleTime.startsWith(today)
  );
  
  const todayRevenue = todaySales.reduce((sum: number, sale: any) => sum + sale.totalAmount, 0);
  const todayProfit = todaySales.reduce((sum: number, sale: any) => sum + sale.profit, 0);
  
  localStorage.setItem('stats', JSON.stringify({
    todayRevenue,
    todayProfit,
    totalSales: sales.length,
    lastUpdate: new Date().toISOString()
  }));
};

// 重置表单
const resetForm = () => {
  selectedProduct.value = null;
  saleForm.quantity = 1;
  saleForm.price = 0;
  saleForm.customerName = '';
  saleForm.customerPhone = '';
  saleForm.remark = '';
  searchKeyword.value = '';
};

onMounted(() => {
  loadProducts();
});
</script>

<style lang="scss" scoped>
.create-order {
  .page-header {
    margin-bottom: 24px;
    
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

.order-card {
  border-radius: 12px;
  
  .order-form {
    .form-section {
      margin-bottom: 32px;
      
      h3 {
        margin: 0 0 16px 0;
        font-size: 18px;
        font-weight: 600;
        color: #2c3e50;
        border-bottom: 2px solid #e9ecef;
        padding-bottom: 8px;
      }
    }
  }
}

.product-search {
  margin-bottom: 16px;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  max-height: 400px;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-height: 300px;
  }
  
  .product-item {
    display: flex;
    padding: 16px;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: #409eff;
      box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
    }
    
    &.selected {
      border-color: #409eff;
      background-color: #f0f9ff;
    }
    
    .product-image {
      margin-right: 12px;
      
      img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 4px;
      }
    }
    
    .product-info {
      flex: 1;
      
      .product-name {
        font-weight: 600;
        color: #2c3e50;
        margin-bottom: 4px;
      }
      
      .product-details {
        display: flex;
        gap: 8px;
        margin-bottom: 8px;
        
        span {
          font-size: 12px;
          color: #6c757d;
          background-color: #f8f9fa;
          padding: 2px 6px;
          border-radius: 4px;
        }
      }
      
      .product-price {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .sale-price {
          font-weight: 600;
          color: #e74c3c;
          font-size: 16px;
        }
        
        .stock {
          font-size: 12px;
          color: #6c757d;
        }
      }
    }
  }
}

.sale-form {
  .product-summary {
    display: flex;
    align-items: center;
    padding: 16px;
    background-color: #f8f9fa;
    border-radius: 8px;
    margin-bottom: 24px;
    
    img {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 8px;
      margin-right: 16px;
    }
    
    .summary-info {
      h4 {
        margin: 0 0 8px 0;
        font-size: 18px;
        font-weight: 600;
        color: #2c3e50;
      }
      
      p {
        margin: 0 0 4px 0;
        color: #6c757d;
        font-size: 14px;
      }
    }
  }
  
  .sale-details {
    margin-bottom: 24px;
  }
  
  .total-section {
    background-color: #f8f9fa;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 24px;
    
    .total-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      
      &:last-child {
        margin-bottom: 0;
        padding-top: 8px;
        border-top: 1px solid #dee2e6;
      }
      
      .total-price {
        font-weight: 600;
        color: #e74c3c;
        font-size: 18px;
      }
      
      .profit {
        font-weight: 600;
        color: #27ae60;
        font-size: 18px;
      }
    }
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid #e9ecef;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    
    .el-button {
      width: 100%;
    }
  }
}
</style> 