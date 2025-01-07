<template>
  <el-dialog title="编辑商品" :visible.sync="visible" @close="handleClose">
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
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">更新</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  product: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['close', 'update']);

const product = ref({...props.product });

watch(props.product, (newVal) => {
  product.value = {...newVal };
});

const handleClose = () => {
  emit('close');
};

const handleSubmit = () => {
  emit('update', product.value);
};
</script>