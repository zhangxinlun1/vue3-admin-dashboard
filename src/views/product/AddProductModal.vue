<template>
  <el-dialog v-model="props.dialogFormVisible" title="Shipping address" width="500">
    <el-form :model="product" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="product.name"></el-input>
      </el-form-item>
      <el-form-item label="图片">
        <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-success="handleUpload"
            :on-error="handleUploadError"
        >
          <img style="width: 100px;height: 100px" v-if="product.img" :src="product.img" class="avatar" alt=""/>
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
<!--      <div>-->
<!--        <input type="file" ref="fileInput" @change="handleFileChange" />-->
<!--        <button @click="uploadImage">上传图片</button>-->
<!--        <div v-if="product.img">-->
<!--          <img :src="product.img" alt="上传的图片" style="max-width: 300px" />-->
<!--          <p>图片访问地址：{{ product.img }}</p>-->
<!--        </div>-->
<!--      </div>-->

      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="product.description"></el-input>
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input type="number" v-model="product.price" step="0.01"></el-input>
      </el-form-item>
      <el-form-item label="类别" prop="category">
        <el-select v-model="product.category" placeholder="请选择商品类别" style="width: 100%">
          <el-option label="上衣" value="top" />
          <el-option label="裤子" value="pants" />
          <el-option label="裙子" value="dress" />
          <el-option label="外套" value="outerwear" />
          <el-option label="内衣" value="underwear" />
          <el-option label="配饰" value="accessories" />
        </el-select>
      </el-form-item>
      <el-form-item label="规格" prop="specification">
        <el-select v-model="product.specification" placeholder="请选择商品规格" style="width: 100%">
          <el-option label="S" value="S" />
          <el-option label="M" value="M" />
          <el-option label="L" value="L" />
          <el-option label="XL" value="XL" />
          <el-option label="XXL" value="XXL" />
          <el-option label="均码" value="ONE_SIZE" />
        </el-select>
      </el-form-item>
      <el-form-item label="颜色" prop="color">
        <el-select v-model="product.color" placeholder="请选择商品颜色" style="width: 100%">
          <el-option label="黑色" value="black" />
          <el-option label="白色" value="white" />
          <el-option label="红色" value="red" />
          <el-option label="蓝色" value="blue" />
          <el-option label="绿色" value="green" />
          <el-option label="黄色" value="yellow" />
          <el-option label="粉色" value="pink" />
          <el-option label="紫色" value="purple" />
          <el-option label="灰色" value="gray" />
          <el-option label="棕色" value="brown" />
        </el-select>
      </el-form-item>
      <el-form-item label="库存" prop="stock">
        <el-input-number v-model="product.stock" :min="0" placeholder="请输入库存数量" style="width: 100%" />
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
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import instance from "@/api/axios";
import axios from "axios";
const { proxy } = getCurrentInstance();
const $axios = proxy.$axios;
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
const handleUpload = async (response, file, fileList)=>{
  console.log('上传响应:', response);
  console.log('文件信息:', file);
  console.log('文件列表:', fileList);
  
  if (response && response.data && response.data.url) {
    product.value.img = response.data.url;
    console.log('图片URL:', response.data.url);
    console.log('存储类型:', response.data.storage);
    ElMessage.success(`图片上传成功！存储方式: ${response.data.storage}`);
  } else {
    ElMessage.error('图片上传失败，请重试');
  }
}

const handleUploadError = (error, file) => {
  console.error('上传失败:', error);
  console.error('文件信息:', file);
  
  let errorMessage = '图片上传失败，请重试';
  
  if (error && typeof error === 'object') {
    if (error.status === 0) {
      errorMessage = '网络连接失败，请检查网络连接';
    } else if (error.status === 413) {
      errorMessage = '文件太大，请选择小于5MB的图片';
    } else if (error.status === 500) {
      errorMessage = '服务器错误，请稍后重试';
    } else if (error.status === 404) {
      errorMessage = '上传接口不存在，请联系管理员';
    }
  }
  
  ElMessage.error(errorMessage);
};
const uploadImageToServer = async (file) => {
  console.log({file})
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post('/api/files/upload', formDatas);
  return
  try {

    return await response.json();
  } catch (error) {
    throw error;
  }
};
const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) {
    alert('请选择要上传的图片');
    return;
  }
  console.log({file})
  // 这里可以添加更多文件类型验证逻辑，比如只允许特定图片格式
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    alert('不允许的文件类型，请选择图片文件');
    return;
  }
};
const fileInput = ref()
const uploadImage = async () => {
  const file = fileInput.value.files[0];
  if (!file) {
    alert('请先选择要上传的图片');
    return;
  }
  console.log(file,'sss')
  const response = await uploadImageToServer(file);
  console.log({response})
  return
  // try {
  //   if (response && response.url) {
  //     product.value.img = response.url;
  //   } else {
  //     alert('图片上传失败，请稍后重试');
  //   }
  // } catch (error) {
  //   console.error('图片上传出错：', error);
  //   alert('图片上传出现错误，请检查网络或联系管理员');
  // }
};
const close = () => {
  emit('close')
}
const product = ref({
  name: '',
  description: '',
  price: 0,
  category: '',
  specification: '',
  color: '',
  stock: 0,
  img:""
});
onMounted(()=>{
})
const handleClose = () => {
  emit('close');
};
const beforeUpload = (file)=> {
  const allowedFileTypes = ['image/jpeg', 'image/png','image/jpg', 'image/gif']; // 允许的文件类型列表
  if (!allowedFileTypes.includes(file.type)) {
    ElMessage.error('不允许的文件类型');
    return false; // 返回false则阻止文件上传
  }
  const maxFileSize = 1024 * 1024 * 5; // 最大文件大小限制（5MB，可调整）
  if (file.size > maxFileSize) {
    ElMessage.error('文件大小超出限制');
    return false;
  }
  return true; // 返回true允许文件上传
}
const handleSubmit = () => {
  emit('add', product.value);
};

// 动态设置上传URL
const uploadUrl = ref('');

const setUploadUrl = () => {
  const protocol = window.location.protocol;
  const host = window.location.hostname;
  const port = '3333';
  
  if (host === 'localhost' || host === '127.0.0.1') {
    uploadUrl.value = `${protocol}//${window.location.hostname}:${port}/files/upload`;
  } else {
    uploadUrl.value = `${protocol}//${host}:${port}/files/upload`;
  }
  
  console.log('设置上传URL:', uploadUrl.value);
};

// 组件挂载时初始化
onMounted(() => {
  setUploadUrl();
});
</script>

<style lang="scss"
 scoped>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>