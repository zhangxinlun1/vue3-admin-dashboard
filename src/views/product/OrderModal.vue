<template>
  <el-dialog 
  :visible.sync="dialogVisible" 
    title="开单" 
    width="500px"
    @close="handleClose"
  >
    <div class="order-form">
      <div class="product-info">
        <el-image 
          :src="product.img" 
          style="width: 100px; height: 100px; border-radius: 8px;"
          fit="cover"
        />
        <div class="product-details">
          <h3>{{ product.name }}</h3>
          <p>规格: {{ product.specification }}</p>
          <p>颜色: {{ product.color }}</p>
          <p>价格: ¥{{ product.price }}</p>
        </div>
      </div>
      
      <el-form :model="orderForm" label-width="80px" class="order-form-content">
        <el-form-item label="销售数量">
          <el-input-number 
            v-model="orderForm.quantity" 
            :min="1" 
            :max="product.stock || 999"
            placeholder="请输入销售数量"
          />
        </el-form-item>
        
        <el-form-item label="销售价格">
          <el-input-number 
            v-model="orderForm.salePrice" 
            :min="0"
            :precision="2"
            placeholder="请输入销售价格"
          />
        </el-form-item>
        
        <el-form-item label="客户信息">
          <el-input 
            v-model="orderForm.customerInfo" 
            placeholder="客户姓名或备注"
          />
        </el-form-item>
      </el-form>
      
      <div class="order-summary">
        <div class="summary-item">
          <span>销售数量:</span>
          <span>{{ orderForm.quantity }}</span>
        </div>
        <div class="summary-item">
          <span>销售价格:</span>
          <span>¥{{ orderForm.salePrice }}</span>
        </div>
        <div class="summary-item total">
          <span>总金额:</span>
          <span>¥{{ totalAmount }}</span>
        </div>
        <div class="summary-item profit">
          <span>预计利润:</span>
          <span>¥{{ estimatedProfit }}</span>
        </div>
      </div>
    </div>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm" :loading="submitting">
          确认开单
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  product: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update:visible', 'close', 'confirm']);
const { visible } = toRefs(props);
const dialogVisible = ref(props.visible);
watch(visible, (newVal) => {
  dialogVisible.value = newVal;
});
watch(dialogVisible, (newVal) => {
  emit('update:visible', newVal);
});
const submitting = ref(false);
const orderForm = ref({
  quantity: 1,
  salePrice: 0,
  customerInfo: ''
});

// 计算总金额
const totalAmount = computed(() => {
  return (orderForm.value.quantity * orderForm.value.salePrice).toFixed(2);
});

// 计算预计利润（假设成本价为原价的70%）
const estimatedProfit = computed(() => {
  const costPrice = props.product.price * 0.7; // 假设成本价为原价的70%
  const profit = (orderForm.value.salePrice - costPrice) * orderForm.value.quantity;
  return profit.toFixed(2);
});

// 监听商品变化，设置默认销售价格
watch(() => props.product, (newProduct) => {
  if (newProduct && newProduct.price) {
    orderForm.value.salePrice = newProduct.price;
  }
}, { immediate: true });

const handleClose = () => {
  emit('close');
  // 重置表单
  orderForm.value = {
    quantity: 1,
    salePrice: props.product.price || 0,
    customerInfo: ''
  };
};

const handleConfirm = async () => {
  if (!orderForm.value.quantity || orderForm.value.quantity <= 0) {
    ElMessage.error('请输入有效的销售数量');
    return;
  }
  
  if (!orderForm.value.salePrice || orderForm.value.salePrice <= 0) {
    ElMessage.error('请输入有效的销售价格');
    return;
  }
  
  if (orderForm.value.quantity > (props.product.stock || 999)) {
    ElMessage.error('销售数量不能超过库存');
    return;
  }
  
  submitting.value = true;
  
  try {
    const orderData = {
      productId: props.product.id,
      productName: props.product.name,
      quantity: orderForm.value.quantity,
      salePrice: orderForm.value.salePrice,
      totalAmount: parseFloat(totalAmount.value),
      profit: parseFloat(estimatedProfit.value),
      customerInfo: orderForm.value.customerInfo,
      orderTime: new Date().toISOString()
    };
    
    emit('confirm', orderData);
    ElMessage.success('开单成功！');
    handleClose();
  } catch (error) {
    ElMessage.error('开单失败，请重试');
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.order-form {
  padding: 20px 0;
}

.product-info {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.product-details h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.product-details p {
  margin: 5px 0;
  color: #666;
}

.order-form-content {
  margin-bottom: 20px;
}

.order-summary {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.summary-item.total {
  font-weight: bold;
  font-size: 16px;
  color: #409eff;
  border-top: 1px solid #ddd;
  padding-top: 8px;
  margin-top: 8px;
}

.summary-item.profit {
  font-weight: bold;
  font-size: 16px;
  color: #67c23a;
}

.dialog-footer {
  text-align: right;
}
</style> 