<template>
  <div class="create-order">
    <div class="page-header">
      <h2>商品销售</h2>
      <p>{{ hasPreSelectedProduct ? '确认商品销售信息' : '选择商品进行销售' }}</p>
    </div>
    
    <el-card class="order-card">
      <div class="order-form">
        <!-- 商品选择 - 只在没有预选商品时显示 -->
        <div v-if="!hasPreSelectedProduct" class="form-section">
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
          
          <!-- 空状态显示 -->
          <div v-if="filteredProducts.length === 0" class="empty-state">
            <el-empty 
              description="暂无商品可销售" 
              :image-size="200"
            >
              <el-button type="primary" @click="goToAddProduct">
                添加商品
              </el-button>
            </el-empty>
          </div>
          
          <div v-else class="product-list">
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
              <img :src="selectedProduct.img || selectedProduct.images?.[0] || 'https://via.placeholder.com/80x80'" :alt="selectedProduct.name" />
              <div class="summary-info">
                <h4>{{ selectedProduct.name }}</h4>
                <p>{{ selectedProduct.code }} | {{ getCategoryText(selectedProduct.category) }}</p>
                <p>规格: {{ selectedProduct.specification }} | 颜色: {{ selectedProduct.color }}</p>
                <p>进货价: ¥{{ formatNumber(selectedProduct.costPrice) }} | 销售价: ¥{{ formatNumber(selectedProduct.salePrice) }}</p>
              </div>
            </div>
            
            <!-- 库存信息卡片 -->
            <el-card class="stock-info-card" shadow="never">
              <div class="stock-header">
                <h4>库存信息</h4>
                <el-tag :type="getStockType()" size="large">
                  {{ getStockText() }}
                </el-tag>
              </div>
              <div class="stock-details">
                <div class="stock-item">
                  <span class="label">当前库存:</span>
                  <span class="value">{{ selectedProduct.stock }} 件</span>
                </div>
                <div class="stock-item">
                  <span class="label">已售数量:</span>
                  <span class="value">{{ selectedProduct.soldCount || 0 }} 件</span>
                </div>
                <div class="stock-item">
                  <span class="label">总销售额:</span>
                  <span class="value">¥{{ formatNumber(selectedProduct.totalRevenue || 0) }}</span>
                </div>
              </div>
            </el-card>
            
            <div class="sale-details">
              <el-form :model="saleForm" label-width="100px">
                <el-form-item label="销售数量">
                  <el-input-number 
                    v-model="saleForm.quantity" 
                    :min="1" 
                    :max="selectedProduct.stock"
                    @change="calculateTotal"
                    size="large"
                    style="width: 200px"
                  />
                  <span class="quantity-hint">最多可销售 {{ selectedProduct.stock }} 件</span>
                </el-form-item>
                
                <el-form-item label="销售价格">
                  <el-input 
                    v-model="saleForm.price" 
                    type="number"
                    @input="calculateTotal"
                    size="large"
                    style="width: 200px"
                  >
                    <template #prefix>¥</template>
                  </el-input>
                  <span class="price-hint">建议售价: ¥{{ formatNumber(selectedProduct.salePrice) }}</span>
                </el-form-item>
                
                <el-form-item label="客户姓名">
                  <el-input v-model="saleForm.customerName" placeholder="请输入客户姓名" size="large" />
                </el-form-item>
                
                <el-form-item label="联系电话">
                  <el-input v-model="saleForm.customerPhone" placeholder="请输入联系电话" size="large" />
                </el-form-item>
                
                <el-form-item label="备注">
                  <el-input 
                    v-model="saleForm.remark" 
                    type="textarea" 
                    placeholder="可选备注信息"
                    :rows="3"
                    size="large"
                  />
                </el-form-item>
              </el-form>
            </div>
            
            <!-- 订单汇总 -->
            <el-card class="order-summary-card" shadow="never">
              <div class="summary-header">
                <h4>订单汇总</h4>
              </div>
              <div class="summary-details">
                <div class="summary-item">
                  <span class="label">销售数量:</span>
                  <span class="value">{{ saleForm.quantity }} 件</span>
                </div>
                <div class="summary-item">
                  <span class="label">单价:</span>
                  <span class="value">¥{{ formatNumber(saleForm.price) }}</span>
                </div>
                <div class="summary-item total">
                  <span class="label">商品总价:</span>
                  <span class="value total-price">¥{{ formatNumber(totalPrice) }}</span>
                </div>
                <div class="summary-item profit">
                  <span class="label">预计利润:</span>
                  <span class="value profit">¥{{ formatNumber(estimatedProfit) }}</span>
                </div>
                <div class="summary-item">
                  <span class="label">剩余库存:</span>
                  <span class="value" :class="getRemainingStockClass()">
                    {{ selectedProduct.stock - saleForm.quantity }} 件
                  </span>
                </div>
              </div>
            </el-card>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="form-actions">
          <el-button @click="goBack" size="large">返回</el-button>
          <el-button 
            type="primary" 
            @click="showConfirmDialog"
            :disabled="!selectedProduct || !saleForm.quantity || !saleForm.price"
            size="large"
          >
            确认开单
          </el-button>
        </div>
        
        <!-- 确认开单对话框 -->
        <el-dialog
          v-model="confirmDialogVisible"
          title="确认开单"
          width="500px"
          :close-on-click-modal="false"
        >
          <div class="confirm-content">
            <div class="confirm-product">
              <img :src="selectedProduct?.img || selectedProduct?.images?.[0] || 'https://via.placeholder.com/60x60'" :alt="selectedProduct?.name" />
              <div class="confirm-info">
                <h4>{{ selectedProduct?.name }}</h4>
                <p>{{ selectedProduct?.code }} | {{ getCategoryText(selectedProduct?.category) }}</p>
              </div>
            </div>
            
            <div class="confirm-details">
              <div class="confirm-item">
                <span class="label">销售数量:</span>
                <span class="value">{{ saleForm.quantity }} 件</span>
              </div>
              <div class="confirm-item">
                <span class="label">销售价格:</span>
                <span class="value">¥{{ formatNumber(saleForm.price) }}</span>
              </div>
              <div class="confirm-item">
                <span class="label">总金额:</span>
                <span class="value total">¥{{ formatNumber(totalPrice) }}</span>
              </div>
              <div class="confirm-item">
                <span class="label">客户姓名:</span>
                <span class="value">{{ saleForm.customerName || '未填写' }}</span>
              </div>
              <div class="confirm-item">
                <span class="label">联系电话:</span>
                <span class="value">{{ saleForm.customerPhone || '未填写' }}</span>
              </div>
            </div>
            
            <div class="confirm-warning">
              <el-alert
                title="开单后将自动扣减库存"
                type="warning"
                :closable="false"
                show-icon
              />
            </div>
          </div>
          
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="confirmDialogVisible = false">取消</el-button>
              <el-button 
                type="primary" 
                @click="submitSale"
                :loading="submitting"
              >
                确认开单
              </el-button>
            </div>
          </template>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
import { getProducts } from '@/api/admin/products';
import { createOrder } from '@/api/admin/orders';

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

// 确认开单对话框
const confirmDialogVisible = ref(false);

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

// 判断是否有预选商品
const hasPreSelectedProduct = computed(() => {
  return route.query.productId !== undefined;
});

// 加载商品数据
const loadProducts = async () => {
  try {
    const response = await getProducts();
    const allProducts = response.data || [];
    products.value = allProducts.filter((product: any) => product.stock > 0);
    
    console.log('加载的商品数量:', products.value.length);
    console.log('所有商品:', allProducts);
    
    // 检查是否有预选商品
    const productId = route.query.productId;
    if (productId) {
      console.log('查找商品ID:', productId, '类型:', typeof productId);
      console.log('可用商品:', products.value.map(p => ({ id: p.id, name: p.name, type: typeof p.id })));
      
      // 尝试多种匹配方式
      let preSelectedProduct = products.value.find((p: any) => p.id === productId);
      
      // 如果没找到，尝试字符串转换匹配
      if (!preSelectedProduct) {
        preSelectedProduct = products.value.find((p: any) => String(p.id) === String(productId));
      }
      
      // 如果还没找到，尝试数字转换匹配
      if (!preSelectedProduct && !isNaN(Number(productId))) {
        preSelectedProduct = products.value.find((p: any) => Number(p.id) === Number(productId));
      }
      
      if (preSelectedProduct) {
        console.log('找到预选商品:', preSelectedProduct);
        selectProduct(preSelectedProduct);
      } else {
        console.error('未找到商品，ID:', productId);
        console.error('可用商品列表:', products.value);
        
        // 检查是否是因为没有商品数据
        if (allProducts.length === 0) {
          ElMessage.warning('暂无商品数据，请先添加商品');
        } else if (products.value.length === 0) {
          ElMessage.warning('暂无有库存的商品，请先添加商品或调整库存');
        } else {
          ElMessage.error('商品不存在或已售罄');
        }
        
        router.push('/home/inventory/list');
      }
    }
  } catch (error) {
    console.error('加载商品数据失败:', error);
    ElMessage.error('加载商品数据失败，请检查网络连接');
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

// 获取库存类型
const getStockType = () => {
  if (selectedProduct.value?.stock - saleForm.quantity <= 0) {
    return 'danger';
  } else if (selectedProduct.value?.stock - saleForm.quantity <= 10) {
    return 'warning';
  }
  return 'success';
};

// 获取库存文本
const getStockText = () => {
  if (selectedProduct.value?.stock - saleForm.quantity <= 0) {
    return '库存不足';
  } else if (selectedProduct.value?.stock - saleForm.quantity <= 10) {
    return '库存紧张';
  }
  return '库存充足';
};

// 获取剩余库存类名
const getRemainingStockClass = () => {
  if (selectedProduct.value?.stock - saleForm.quantity <= 0) {
    return 'danger';
  } else if (selectedProduct.value?.stock - saleForm.quantity <= 10) {
    return 'warning';
  }
  return '';
};

// 显示确认开单对话框
const showConfirmDialog = () => {
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
  confirmDialogVisible.value = true;
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
    
    // 通过API创建订单
    try {
      const orderData = {
        orderNumber: `ORD${Date.now()}`,
        customerName: saleForm.customerName || '匿名客户',
        customerPhone: saleForm.customerPhone || '',
        totalAmount: totalPrice.value,
        profit: estimatedProfit.value,
        status: 'completed',
        remark: saleForm.remark,
        items: [{
          productId: selectedProduct.value.id,
          quantity: saleForm.quantity,
          price: saleForm.price,
          costPrice: selectedProduct.value.costPrice,
          totalPrice: totalPrice.value,
          profit: estimatedProfit.value
        }]
      };
      
      const result = await createOrder(orderData);
      
      if (result.status === 201) {
        ElMessage.success('销售成功！');
        resetForm();
        confirmDialogVisible.value = false;
      } else {
        ElMessage.error('销售失败，请重试');
      }
    } catch (error) {
      console.error('销售失败:', error);
      ElMessage.error('销售失败，请检查网络连接');
    }
    
    ElMessage.success('销售成功！');
    resetForm();
    confirmDialogVisible.value = false; // 关闭确认对话框
    
  } catch (error) {
    console.error('销售失败:', error);
    ElMessage.error('销售失败，请重试');
  } finally {
    submitting.value = false;
  }
};

// 更新统计数据
const updateStats = () => {
  // 统计数据现在由后端API管理，这里暂时留空
  // 后续可以添加统计API调用
  console.log('统计数据已更新');
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

// 返回上一页
const goBack = () => {
  router.go(-1);
};

// 跳转到添加商品页面
const goToAddProduct = () => {
  router.push('/home/inventory/add');
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
  
  .stock-info-card {
    margin-bottom: 24px;
    border-radius: 8px;
    border: 1px solid #e9ecef;
    
    .stock-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 12px;
      border-bottom: 1px solid #e9ecef;
      
      h4 {
        margin: 0;
        font-size: 16px;
        color: #2c3e50;
      }
    }
    
    .stock-details {
      padding: 16px;
      
      .stock-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .label {
          font-size: 14px;
          color: #6c757d;
        }
        
        .value {
          font-weight: 600;
          font-size: 16px;
          color: #2c3e50;
        }
      }
    }
  }
  
  .sale-details {
    margin-bottom: 24px;
  }
  
  .order-summary-card {
    border-radius: 8px;
    border: 1px solid #e9ecef;
    
    .summary-header {
      padding-bottom: 12px;
      border-bottom: 1px solid #e9ecef;
      
      h4 {
        margin: 0;
        font-size: 16px;
        color: #2c3e50;
      }
    }
    
    .summary-details {
      padding: 16px;
      
      .summary-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .label {
          font-size: 14px;
          color: #6c757d;
        }
        
        .value {
          font-weight: 600;
          font-size: 16px;
          color: #2c3e50;
          
          &.total-price {
            color: #e74c3c;
          }
          
          &.profit {
            color: #27ae60;
          }
        }
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

.confirm-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .confirm-product {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    
    img {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 4px;
      margin-right: 12px;
    }
    
    .confirm-info {
      h4 {
        margin: 0 0 4px 0;
        font-size: 16px;
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
  
  .confirm-details {
    width: 100%;
    margin-bottom: 16px;
    
    .confirm-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .label {
        font-size: 14px;
        color: #6c757d;
      }
      
      .value {
        font-weight: 600;
        font-size: 16px;
        color: #2c3e50;
        
        &.total {
          color: #e74c3c;
        }
      }
    }
  }
  
  .confirm-warning {
    width: 100%;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

.quantity-hint {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: #6c757d;
  text-align: right;
}

.price-hint {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: #6c757d;
  text-align: right;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px; /* Ensure it takes up space */
  background-color: #f5f7fa;
  border-radius: 8px;
  margin-top: 24px;
}
</style> 