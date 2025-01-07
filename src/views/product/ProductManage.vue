<template>
  <div class="product-management">
    <el-card class="box-card">
      <h2>商品管理</h2>
      <el-button type="primary" @click="dialogFormVisible = true">添加商品</el-button>
      <el-table :data="Products" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="price" label="价格"></el-table-column>
        <el-table-column prop="category" label="类别"></el-table-column>
        <el-table-column prop="stock" label="库存"></el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" @click="showEditProductModal(scope.row)">编辑</el-button>
            <el-button type="primary" @click="deleteProducts(scope.row.id)">删除</el-button>
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
import {ref, reactive,onMounted} from 'vue';
import AddProductModal from './AddProductModal.vue';
import EditProductModal from './EditProductModal.vue';
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from '@/api/admin/products';
import {IProduct} from "@api/admin/interface";

const showAddProductModal = ref(false);
const productToEdit = ref({});
const showErrorDialog = ref(false);
const errorMessage = ref('');

const dialogFormVisible = ref(false)

const Products = ref<IProduct[]>([{}])
// 获取商品列表
onMounted(async () => {
  try {
    const result = await getProducts();
   Products.value = result.data
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

const showEditProductModal = (product) => {
  productToEdit.value = {...product};
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

.box-card {
  border: 1px solid #ccc;
}
</style>