<template>
  <el-dialog v-model="props.dialogFormVisible" title="Shipping address" width="500">
    <el-form :model="product" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="product.name"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="product.description"></el-input>
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input type="number" v-model="product.price" step="0.01"></el-input>
      </el-form-item>
      <el-form-item label="类别" prop="category">
        <el-input v-model="product.category"></el-input>
      </el-form-item>
      <el-form-item label="库存" prop="stock">
        <el-input type="number" v-model="product.stock"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close()">Cancel</el-button>
        <el-button type="primary" @click="addProduct()">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref} from 'vue';

const props = defineProps({
  dialogFormVisible: {
    type: Boolean,
    default: false
  }
});
const formLabelWidth = '140px'
const emit = defineEmits(['close', 'add']);

const addProduct = () => {
  emit('add',product.value)
}

const close = () => {
  emit('close')
}
const product = ref({
  name: '',
  description: '',
  price: 0,
  category: '',
  stock: 0,
});

const handleClose = () => {
  emit('close');
};

const handleSubmit = () => {
  emit('add', product.value);
};
</script>