<template>
  <div class="product-management">
    <!-- 营业额统计卡片 -->
    <el-card class="stats-card">
      <div class="stats-container">
        <div class="stat-item">
          <div class="stat-value">¥{{ todayRevenue.toFixed(2) }}</div>
          <div class="stat-label">今日营业额</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">¥{{ todayProfit.toFixed(2) }}</div>
          <div class="stat-label">今日利润</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ todayOrders }}</div>
          <div class="stat-label">今日订单</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ totalProducts }}</div>
          <div class="stat-label">商品总数</div>
        </div>
      </div>
    </el-card>

    <el-card class="box-card">
      <h2>商品管理</h2>

      <ItemSerach></ItemSerach>
      <el-button type="primary" @click="dialogFormVisible = true">添加商品</el-button>
      <el-table :data="Products" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="img" label="图片">
          <template #default="scope">
            <el-image 
              :src="scope.row.img" 
              style="width: 100px; height: 100px; border-radius: 8px;"
              fit="cover"
              :preview-src-list="[scope.row.img]"
            />
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="price" label="价格"></el-table-column>
        <el-table-column prop="category" label="类别"></el-table-column>
        <el-table-column prop="specification" label="规格"></el-table-column>
        <el-table-column prop="color" label="颜色"></el-table-column>
        <el-table-column prop="stock" label="库存">
          <template #default="scope">
            <el-tag :type="scope.row.stock > 10 ? 'success' : scope.row.stock > 0 ? 'warning' : 'danger'">
              {{ scope.row.stock || 0 }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="success" @click="openOrderModal(scope.row)">开单</el-button>
            <el-button type="warning" @click="editProduct(scope.row)">编辑</el-button>
            <el-button type="danger" @click="deleteProducts(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>


    <!-- 添加商品模态框 -->
    <AddProductModal
        :dialogFormVisible="dialogFormVisible"
        @close="showAddProductModal = false"
        @add="addProducts"
    />

    <!-- 开单模态框 -->
    <OrderModal
        :visible="showOrderModal"
        :product="selectedProduct"
        @close="showOrderModal = false"
        @confirm="handleOrderConfirm"
    />

    <!-- 编辑商品模态框 -->
    <EditProductModal
        v-if="showEditProductModal"
        :product="productToEdit"
        @close="showEditProductModal = false"
        @update="updateProducts"
        visible/>

    <!-- 错误提示弹框 -->
    <el-dialog v-if="showErrorDialog" title="操作失败" :visible.sync="showErrorDialog">
      <p>{{ errorMessage }}</p>
      <template #footer>
        <el-button @click="showErrorDialog = false">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {ref, reactive, onMounted, computed} from 'vue';
import AddProductModal from './AddProductModal.vue';
import EditProductModal from './EditProductModal.vue';
import OrderModal from './OrderModal.vue';
import {getProducts} from "@/api/admin/products.ts";
import ItemSerach from "@/views/product/ItemSerach.vue";
import { ElMessage } from 'element-plus';

const showAddProductModal = ref(false);
const productToEdit = ref({});
const showErrorDialog = ref(false);
const errorMessage = ref('');

const dialogFormVisible = ref(false);
const showOrderModal = ref(false);
const selectedProduct = ref({});

const Products = ref([]);
const orders = ref([]); // 存储订单数据
// 营业额统计计算
const todayRevenue = computed(() => {
  const today = new Date().toDateString();
  return orders.value
    .filter(order => new Date(order.orderTime).toDateString() === today)
    .reduce((sum, order) => sum + order.totalAmount, 0);
});

const todayProfit = computed(() => {
  const today = new Date().toDateString();
  return orders.value
    .filter(order => new Date(order.orderTime).toDateString() === today)
    .reduce((sum, order) => sum + order.profit, 0);
});

const todayOrders = computed(() => {
  const today = new Date().toDateString();
  return orders.value.filter(order => new Date(order.orderTime).toDateString() === today).length;
});

const totalProducts = computed(() => Products.value.length);

// 获取商品列表
onMounted(async () => {
  try {
    await getProducts().then((res) => {
      Products.value = res.data || [];
    });
    console.log(Products.value);
    
    // 从本地存储加载订单数据
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      orders.value = JSON.parse(savedOrders);
    }
  } catch (error) {
    console.error('获取商品列表失败', error);
    showErrorDialog.value = true;
    errorMessage.value = '获取商品列表时出现错误，请稍后重试';
  }
});

const addProducts = async (newProduct) => {
  // try {
  //   console.log({newProduct})
  //   return
  //
  //   const result = await addProduct(newProduct);
  //   if (result.status === 201) {
  //     // 重新获取商品列表
  //     const newResult = await getProducts();
  //     products.value = newResult.data;
  //     showAddProductModal.value = false;
  //   }
  // } catch (error) {
  //   console.error('添加商品失败', error);
  //   showErrorDialog.value = true;
  //   errorMessage.value = '添加商品时出现错误，请检查输入信息后重试';
  // }
};
const popOpen = () => {
  showAddProductModal.value = true
  console.log('popstate')
}
const deleteProducts = async (productId) => {
  // try {
  //   const result = await deleteProduct(productId);
  //   if (result.status === 204) {
  //     const newResult = await getProducts();
  //     products.value = newResult.data;
  //   }
  // } catch (error) {
  //   console.error('删除商品失败', error);
  //   showErrorDialog.value = true;
  //   errorMessage.value = '删除商品时出现错误，请稍后重试';
  // }
};
// 开单相关函数
const openOrderModal = (product) => {
  selectedProduct.value = { ...product };
  showOrderModal.value = true;
};

const handleOrderConfirm = (orderData) => {
  // 添加订单到列表
  orders.value.push(orderData);
  
  // 更新商品库存
  const productIndex = Products.value.findIndex(p => p.id === orderData.productId);
  if (productIndex !== -1) {
    Products.value[productIndex].stock = (Products.value[productIndex].stock || 0) - orderData.quantity;
  }
  
  // 保存订单数据到本地存储
  localStorage.setItem('orders', JSON.stringify(orders.value));
  
  ElMessage.success(`开单成功！营业额增加 ¥${orderData.totalAmount}`);
};

const editProduct = (product) => {
  productToEdit.value = { ...product };
  showEditProductModal.value = true;
};

const updateProducts = async (updatedProduct) => {
  // try {
  //   const result = await updateProduct(updatedProduct);
  //   if (result.status === 200) {
  //     const newResult = await getProducts();
  //     products.value = newResult.data;
  //     showEditProductModal.value = false;
  //   }
  // } catch (error) {
  //   console.error('更新商品失败', error);
  //   showErrorDialog.value = true;
  //   errorMessage.value = '更新商品时出现错误，请检查输入信息后重试';
  // }
};
</script>

<style scoped>
.product-management {
  padding: 20px;
}

.stats-card {
  margin-bottom: 20px;
  border: 1px solid #e4e7ed;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.stat-item:nth-child(2) {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-item:nth-child(3) {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-item:nth-child(4) {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
}

.box-card {
  border: 1px solid #e4e7ed;
  margin-top: 20px;
}
</style>