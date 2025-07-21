<template>
  <div class="stock-adjustment">
    <div class="page-header">
      <div class="header-left">
        <el-button @click="goBack" type="text">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <h2>库存调整</h2>
      </div>
    </div>
    
    <el-card class="adjustment-card">
      <div v-if="product" class="product-info">
        <div class="product-summary">
          <img :src="product.images?.[0] || 'https://via.placeholder.com/80x80'" :alt="product.name" />
          <div class="summary-details">
            <h3>{{ product.name }}</h3>
            <p>{{ product.code }} | {{ getCategoryText(product.category) }}</p>
            <p>品牌: {{ product.brand }} | 颜色: {{ product.color }}</p>
          </div>
        </div>
        
        <div class="current-stock">
          <div class="stock-item">
            <span class="label">当前库存:</span>
            <span class="value" :class="getStockClass()">{{ product.stock }}</span>
          </div>
          <div class="stock-item">
            <span class="label">预警库存:</span>
            <span class="value">{{ product.alertStock }}</span>
          </div>
        </div>
      </div>
      
      <el-form :model="adjustmentForm" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="调整类型" prop="type">
          <el-radio-group v-model="adjustmentForm.type">
            <el-radio label="increase">增加库存</el-radio>
            <el-radio label="decrease">减少库存</el-radio>
            <el-radio label="set">设置库存</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="调整数量" prop="quantity">
          <el-input-number 
            v-model="adjustmentForm.quantity" 
            :min="1"
            :max="adjustmentForm.type === 'set' ? 9999 : (adjustmentForm.type === 'decrease' ? product?.stock : 9999)"
            style="width: 200px"
          />
        </el-form-item>
        
        <el-form-item label="调整原因" prop="reason">
          <el-select v-model="adjustmentForm.reason" placeholder="请选择调整原因" style="width: 200px">
            <el-option label="进货入库" value="purchase" />
            <el-option label="退货入库" value="return" />
            <el-option label="盘点调整" value="inventory" />
            <el-option label="损耗报废" value="damage" />
            <el-option label="其他原因" value="other" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="备注说明" prop="remark">
          <el-input 
            v-model="adjustmentForm.remark" 
            type="textarea" 
            :rows="3"
            placeholder="请输入调整备注说明"
          />
        </el-form-item>
        
        <el-form-item>
          <div class="preview-info">
            <h4>调整预览</h4>
            <div class="preview-item">
              <span class="label">调整前库存:</span>
              <span class="value">{{ product?.stock || 0 }}</span>
            </div>
            <div class="preview-item">
              <span class="label">调整数量:</span>
              <span class="value" :class="getAdjustmentClass()">
                {{ getAdjustmentText() }}
              </span>
            </div>
            <div class="preview-item">
              <span class="label">调整后库存:</span>
              <span class="value" :class="getNewStockClass()">
                {{ calculateNewStock() }}
              </span>
            </div>
          </div>
        </el-form-item>
        
        <el-form-item>
          <el-button @click="resetForm">重置</el-button>
          <el-button type="primary" @click="submitAdjustment" :loading="submitting">
            确认调整
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ArrowLeft } from '@element-plus/icons-vue';

const router = useRouter();
const route = useRoute();
const formRef = ref();
const submitting = ref(false);
const product = ref(null);

// 调整表单
const adjustmentForm = reactive({
  type: 'increase',
  quantity: 1,
  reason: '',
  remark: ''
});

// 表单验证规则
const rules = {
  type: [
    { required: true, message: '请选择调整类型', trigger: 'change' }
  ],
  quantity: [
    { required: true, message: '请输入调整数量', trigger: 'blur' },
    { type: 'number', min: 1, message: '调整数量必须大于0', trigger: 'blur' }
  ],
  reason: [
    { required: true, message: '请选择调整原因', trigger: 'change' }
  ]
};

// 加载商品信息
const loadProduct = () => {
  const productId = route.params.id;
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  product.value = products.find((p: any) => p.id === productId);
  
  if (!product.value) {
    ElMessage.error('商品不存在');
    router.back();
  }
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

// 获取库存状态样式
const getStockClass = () => {
  if (!product.value) return '';
  if (product.value.stock === 0) return 'out-of-stock';
  if (product.value.stock <= product.value.alertStock) return 'low-stock';
  return 'normal-stock';
};

// 计算新库存
const calculateNewStock = () => {
  if (!product.value || !adjustmentForm.quantity) return product.value?.stock || 0;
  
  switch (adjustmentForm.type) {
    case 'increase':
      return product.value.stock + adjustmentForm.quantity;
    case 'decrease':
      return product.value.stock - adjustmentForm.quantity;
    case 'set':
      return adjustmentForm.quantity;
    default:
      return product.value.stock;
  }
};

// 获取调整文本
const getAdjustmentText = () => {
  if (!adjustmentForm.quantity) return '0';
  
  switch (adjustmentForm.type) {
    case 'increase':
      return `+${adjustmentForm.quantity}`;
    case 'decrease':
      return `-${adjustmentForm.quantity}`;
    case 'set':
      return `设置为 ${adjustmentForm.quantity}`;
    default:
      return '0';
  }
};

// 获取调整样式
const getAdjustmentClass = () => {
  switch (adjustmentForm.type) {
    case 'increase':
      return 'positive';
    case 'decrease':
      return 'negative';
    case 'set':
      return 'neutral';
    default:
      return '';
  }
};

// 获取新库存样式
const getNewStockClass = () => {
  const newStock = calculateNewStock();
  if (newStock === 0) return 'out-of-stock';
  if (newStock <= (product.value?.alertStock || 0)) return 'low-stock';
  return 'normal-stock';
};

// 重置表单
const resetForm = () => {
  adjustmentForm.type = 'increase';
  adjustmentForm.quantity = 1;
  adjustmentForm.reason = '';
  adjustmentForm.remark = '';
  formRef.value?.resetFields();
};

// 提交调整
const submitAdjustment = async () => {
  if (!formRef.value) return;
  
  try {
    await formRef.value.validate();
    
    if (adjustmentForm.type === 'decrease' && adjustmentForm.quantity > product.value.stock) {
      ElMessage.warning('减少数量不能超过当前库存');
      return;
    }
    
    const newStock = calculateNewStock();
    if (newStock < 0) {
      ElMessage.warning('调整后库存不能为负数');
      return;
    }
    
    submitting.value = true;
    
    // 更新商品库存
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const updatedProducts = products.map((p: any) => {
      if (p.id === product.value.id) {
        return {
          ...p,
          stock: newStock,
          updateTime: new Date().toISOString()
        };
      }
      return p;
    });
    
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    
    // 记录库存调整历史
    const adjustmentHistory = JSON.parse(localStorage.getItem('stockAdjustments') || '[]');
    adjustmentHistory.push({
      id: Date.now().toString(),
      productId: product.value.id,
      productName: product.value.name,
      oldStock: product.value.stock,
      newStock: newStock,
      type: adjustmentForm.type,
      quantity: adjustmentForm.quantity,
      reason: adjustmentForm.reason,
      remark: adjustmentForm.remark,
      adjustTime: new Date().toISOString()
    });
    
    localStorage.setItem('stockAdjustments', JSON.stringify(adjustmentHistory));
    
    ElMessage.success('库存调整成功');
    router.back();
    
  } catch (error) {
    console.error('表单验证失败:', error);
  } finally {
    submitting.value = false;
  }
};

// 返回上一页
const goBack = () => {
  router.back();
};

onMounted(() => {
  loadProduct();
});
</script>

<style lang="scss" scoped>
.stock-adjustment {
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
  }
}

.adjustment-card {
  border-radius: 12px;
  
  .product-info {
    margin-bottom: 32px;
    padding-bottom: 24px;
    border-bottom: 1px solid #e9ecef;
    
    .product-summary {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      
      img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 8px;
        margin-right: 16px;
      }
      
      .summary-details {
        h3 {
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
    
    .current-stock {
      display: flex;
      gap: 32px;
      
      .stock-item {
        display: flex;
        align-items: center;
        gap: 8px;
        
        .label {
          color: #6c757d;
          font-weight: 500;
        }
        
        .value {
          font-weight: 600;
          font-size: 16px;
          
          &.out-of-stock {
            color: #e74c3c;
          }
          
          &.low-stock {
            color: #f39c12;
          }
          
          &.normal-stock {
            color: #27ae60;
          }
        }
      }
    }
  }
  
  .preview-info {
    background-color: #f8f9fa;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 24px;
    
    h4 {
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 600;
      color: #2c3e50;
    }
    
    .preview-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .label {
        color: #6c757d;
        font-weight: 500;
      }
      
      .value {
        font-weight: 600;
        
        &.positive {
          color: #27ae60;
        }
        
        &.negative {
          color: #e74c3c;
        }
        
        &.neutral {
          color: #6c757d;
        }
        
        &.out-of-stock {
          color: #e74c3c;
        }
        
        &.low-stock {
          color: #f39c12;
        }
        
        &.normal-stock {
          color: #27ae60;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .stock-adjustment {
    .page-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }
    
    .adjustment-card {
      .product-info {
        .current-stock {
          flex-direction: column;
          gap: 16px;
        }
      }
    }
  }
}
</style> 