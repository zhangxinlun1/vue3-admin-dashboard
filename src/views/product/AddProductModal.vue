<template>
  <el-dialog v-model="props.dialogFormVisible" title="Shipping address" width="500">
    <el-form :model="product" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="product.name"></el-input>
      </el-form-item>
      <el-form-item label="图片">
        <el-upload
            class="avatar-uploader"
            action="/api/files/upload"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-success="handleUpload"
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
import {ref,onMounted,getCurrentInstance} from 'vue';


import {Plus} from "@element-plus/icons-vue";
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
  console.log(response,file,fileList);
  product.value.img = response.data.url
  // 这里假设你的服务器端有一个接收图片上传的接口地址为 /api/upload，根据实际情况修改

}
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
    this.$message.error('不允许的文件类型');
    return false; // 返回false则阻止文件上传
  }
  const maxFileSize = 1024 * 1024 * 5; // 最大文件大小限制（5MB，可调整）
  if (file.size > maxFileSize) {
    this.$message.error('文件大小超出限制');
    return false;
  }
  return true; // 返回true允许文件上传
}
const handleSubmit = () => {
  emit('add', product.value);
};
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