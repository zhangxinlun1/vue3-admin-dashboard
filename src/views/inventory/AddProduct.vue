<template>
  <div class="add-product">
    <div class="page-header">
      <h2>女装入库</h2>
      <p>添加新的女装商品到库存系统</p>
    </div>
    
    <el-card class="form-card">
      <el-form 
        ref="formRef" 
        :model="form" 
        :rules="rules" 
        label-width="120px"
        class="product-form"
      >
        <div class="form-section">
          <h3>基本信息</h3>
          <div class="form-row">
            <el-form-item label="商品名称" prop="name">
              <el-input 
                v-model="form.name" 
                placeholder="请输入商品名称"
                size="large"
              />
            </el-form-item>
            
            <el-form-item label="商品分类" prop="category">
              <el-select 
                v-model="form.category" 
                placeholder="请选择商品分类"
                size="large"
                style="width: 100%"
              >
                <el-option label="上衣" value="top" />
                <el-option label="裤子" value="pants" />
                <el-option label="裙子" value="dress" />
                <el-option label="外套" value="outerwear" />
                <el-option label="内衣" value="underwear" />
                <el-option label="配饰" value="accessories" />
              </el-select>
            </el-form-item>
          </div>
          
          <div class="form-row">
            <el-form-item label="商品编码" prop="code">
              <el-input 
                v-model="form.code" 
                placeholder="请输入商品编码"
                size="large"
              />
            </el-form-item>
            
            <el-form-item label="商品规格" prop="specification">
              <el-select 
                v-model="form.specification" 
                placeholder="请选择商品规格"
                size="large"
                style="width: 100%"
              >
                <el-option label="S" value="S" />
                <el-option label="M" value="M" />
                <el-option label="L" value="L" />
                <el-option label="XL" value="XL" />
                <el-option label="XXL" value="XXL" />
                <el-option label="均码" value="ONE_SIZE" />
              </el-select>
            </el-form-item>
          </div>
        </div>
        
        <div class="form-section">
          <h3>价格信息</h3>
          <div class="form-row">
            <el-form-item label="进货价格" prop="costPrice">
              <el-input-number 
                v-model="form.costPrice" 
                :min="0" 
                :precision="2"
                placeholder="请输入进货价格"
                size="large"
                style="width: 100%"
              >
                <template #prefix>¥</template>
              </el-input-number>
            </el-form-item>
            
            <el-form-item label="销售价格" prop="salePrice">
              <el-input-number 
                v-model="form.salePrice" 
                :min="0" 
                :precision="2"
                placeholder="请输入销售价格"
                size="large"
                style="width: 100%"
              >
                <template #prefix>¥</template>
              </el-input-number>
            </el-form-item>
          </div>
          
          <div class="form-row">
            <el-form-item label="库存数量" prop="stock">
              <el-input-number 
                v-model="form.stock" 
                :min="1" 
                :precision="0"
                placeholder="请输入库存数量"
                size="large"
                style="width: 100%"
              />
              <span class="stock-hint">默认1件，可点击增加</span>
            </el-form-item>
            
            <el-form-item label="商品颜色" prop="color">
              <el-select 
                v-model="form.color" 
                placeholder="请选择商品颜色"
                size="large"
                style="width: 100%"
              >
                <el-option label="白色" value="白色" />
                <el-option label="黑色" value="黑色" />
                <el-option label="红色" value="红色" />
                <el-option label="蓝色" value="蓝色" />
                <el-option label="绿色" value="绿色" />
                <el-option label="黄色" value="黄色" />
                <el-option label="粉色" value="粉色" />
                <el-option label="紫色" value="紫色" />
                <el-option label="灰色" value="灰色" />
                <el-option label="其他" value="其他" />
              </el-select>
            </el-form-item>
          </div>
        </div>
        
        <div class="form-section">
          <h3>商品图片</h3>
          <div class="upload-area">
            <el-upload
              ref="uploadRef"
              :action="uploadUrl"
              :headers="uploadHeaders"
              :before-upload="beforeUpload"
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
              :file-list="fileList"
              list-type="picture-card"
              :limit="5"
              accept="image/*"
              class="product-upload"
            >
              <el-icon><Plus /></el-icon>
              <div class="upload-text">
                <p>点击上传图片</p>
                <p class="upload-hint">支持 JPG、PNG 格式，最多 5 张</p>
              </div>
            </el-upload>
          </div>
        </div>
        
        <div class="form-section">
          <h3>商品描述</h3>
          <el-form-item label="商品描述" prop="description">
            <el-input 
              v-model="form.description" 
              type="textarea" 
              :rows="4"
              placeholder="请输入商品详细描述"
              size="large"
            />
          </el-form-item>
        </div>
        

        
        <div class="form-actions">
          <el-button @click="resetForm" size="large">重置</el-button>
          <el-button type="primary" @click="submitForm" size="large" :loading="submitting">
            保存商品
          </el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import type { FormInstance, UploadProps, UploadUserFile } from 'element-plus';
import { addProduct } from '@/api/admin/products';

const router = useRouter();
const formRef = ref<FormInstance>();
const uploadRef = ref();
const submitting = ref(false);

// 表单数据
const form = reactive({
  name: '',
  category: '',
  code: '',
  specification: '',
  costPrice: 0,
  salePrice: 0,
  description: '',
  color: '',
  stock: 1, // 默认库存为1
  images: [] as string[]
});

// 文件列表
const fileList = ref<UploadUserFile[]>([]);

// 上传配置
const uploadUrl = ref('');

// 动态设置上传URL
const setUploadUrl = () => {
  // 获取当前页面的协议和主机
  const protocol = window.location.protocol;
  const host = window.location.hostname;
  const port = '3333'; // 后端端口
  
  // 如果是localhost，尝试使用IP地址
  if (host === 'localhost' || host === '127.0.0.1') {
    // 在移动端，使用当前页面的IP地址
    uploadUrl.value = `${protocol}//${window.location.hostname}:${port}/files/upload`;
  } else {
    // 使用当前页面的主机地址
    uploadUrl.value = `${protocol}//${host}:${port}/files/upload`;
  }
  
  console.log('设置上传URL:', uploadUrl.value);
};

const uploadHeaders = {
  // 如果需要认证，在这里添加 token
};

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 2, max: 50, message: '商品名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择商品分类', trigger: 'change' }
  ],
  code: [
    { required: true, message: '请输入商品编码', trigger: 'blur' }
  ],
  costPrice: [
    { required: true, message: '请输入进货价格', trigger: 'blur' },
    { type: 'number' as const, min: 0, message: '价格不能为负数', trigger: 'blur' }
  ],
  salePrice: [
    { required: true, message: '请输入销售价格', trigger: 'blur' },
    { type: 'number' as const, min: 0, message: '价格不能为负数', trigger: 'blur' }
  ],
  specification: [
    { required: true, message: '请选择商品规格', trigger: 'change' }
  ],
  color: [
    { required: true, message: '请选择商品颜色', trigger: 'change' }
  ],
  stock: [
    { required: true, message: '请输入库存数量', trigger: 'blur' },
    { type: 'number' as const, min: 1, message: '库存数量不能少于1件', trigger: 'blur' }
  ]
};

// 上传前验证
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isImage = file.type.startsWith('image/');
  const isLt5M = file.size / 1024 / 1024 < 5;

  if (!isImage) {
    ElMessage.error('只能上传图片文件!');
    return false;
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB!');
    return false;
  }
  return true;
};

// 上传成功
const handleUploadSuccess: UploadProps['onSuccess'] = (response, file) => {
  console.log('上传响应:', response);
  console.log('文件信息:', file);
  
  if (response && response.data && response.data.url) {
    // 使用返回的URL（可能是七牛云或本地存储）
    form.images.push(response.data.url);
    console.log('图片URL:', response.data.url);
    console.log('存储类型:', response.data.storage);
    ElMessage.success(`图片上传成功！存储方式: ${response.data.storage}`);
  } else {
    ElMessage.error('图片上传失败，请重试');
  }
};

// 上传失败
const handleUploadError: UploadProps['onError'] = (error, file) => {
  console.error('上传失败:', error);
  console.error('文件信息:', file);
  
  let errorMessage = '图片上传失败，请重试';
  
  // 根据错误类型提供更具体的错误信息
  if (error && typeof error === 'object') {
    const errorObj = error as any;
    if (errorObj.status === 0) {
      errorMessage = '网络连接失败，请检查网络连接';
    } else if (errorObj.status === 413) {
      errorMessage = '文件太大，请选择小于5MB的图片';
    } else if (errorObj.status === 500) {
      errorMessage = '服务器错误，请稍后重试';
    } else if (errorObj.status === 404) {
      errorMessage = '上传接口不存在，请联系管理员';
    }
  }
  
  ElMessage.error(errorMessage);
};

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return;
  
  try {
    await formRef.value.validate();
    
    if (form.salePrice <= form.costPrice) {
      ElMessage.warning('销售价格应该大于进货价格');
      return;
    }
    
    submitting.value = true;
    
    // 生成商品ID
    const productId = Date.now().toString();
    
    // 创建商品对象，匹配后端DTO格式
    const product = {
      name: form.name,
      code: form.code,
      category: form.category,
      salePrice: form.salePrice, // 销售价
      costPrice: form.costPrice, // 进货价
      stock: form.stock,
      unit: '件', // 默认单位
      description: form.description,
      image: form.images.length > 0 ? form.images[0] : '',
      status: 'active' // 默认状态
    };
    
    // 通过API保存商品到数据库
    const result = await addProduct(product);
    
    if (result.status === 201) {
      ElMessage.success('商品入库成功！');
      router.push('/home/inventory/list');
    } else {
      ElMessage.error('商品入库失败，请重试');
    }
    
    ElMessage.success('商品入库成功！');
    router.push('/home/inventory/list');
    
  } catch (error) {
    console.error('表单验证失败:', error);
  } finally {
    submitting.value = false;
  }
};

// 统计数据现在从后端API获取

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields();
  }
  // 手动重置库存数量为默认值
  form.stock = 1;
  form.images = [];
  fileList.value = [];
};

// 组件挂载时初始化
import { onMounted } from 'vue';

onMounted(() => {
  setUploadUrl();
});
</script>

<style lang="scss" scoped>
.add-product {
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

.form-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
}

.product-form {
  .form-section {
    margin-bottom: 32px;
    
    h3 {
      margin: 0 0 20px 0;
      font-size: 18px;
      font-weight: 600;
      color: #2c3e50;
      padding-bottom: 8px;
      border-bottom: 2px solid #f8f9fa;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }
  }
  
  .upload-area {
    .product-upload {
      :deep(.el-upload--picture-card) {
        width: 120px;
        height: 120px;
        border: 2px dashed #d9d9d9;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #fafafa;
        transition: all 0.3s ease;
        
        &:hover {
          border-color: #ff6b6b;
          background: #fff5f5;
        }
        
        .el-icon {
          font-size: 24px;
          color: #8c8c8c;
          margin-bottom: 8px;
        }
        
        .upload-text {
          text-align: center;
          
          p {
            margin: 0;
            font-size: 12px;
            color: #8c8c8c;
            
            &.upload-hint {
              font-size: 10px;
              color: #bfbfbf;
              margin-top: 4px;
            }
          }
        }
      }
      
      :deep(.el-upload-list--picture-card) {
        .el-upload-list__item {
          width: 120px;
          height: 120px;
          border-radius: 8px;
        }
      }
    }
  }
  
  .form-actions {
    display: flex;
    justify-content: center;
    gap: 16px;
    padding-top: 24px;
    border-top: 1px solid #e9ecef;
    margin-top: 32px;
    
    .el-button {
      min-width: 120px;
    }
  }
  
  .stock-hint {
    display: block;
    margin-top: 8px;
    font-size: 12px;
    color: #6c757d;
    text-align: right;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .add-product {
    .page-header {
      h2 {
        font-size: 20px;
      }
      
      p {
        font-size: 12px;
      }
    }
  }
  
  .form-card {
    .product-form {
      .form-section {
        .form-row {
          grid-template-columns: 1fr;
          gap: 16px;
        }
      }
      
      .upload-area {
        .product-upload {
          :deep(.el-upload--picture-card) {
            width: 100px;
            height: 100px;
          }
          
          :deep(.el-upload-list--picture-card) {
            .el-upload-list__item {
              width: 100px;
              height: 100px;
            }
          }
        }
      }
      
      .form-actions {
        flex-direction: column;
        gap: 12px;
        
        .el-button {
          width: 100%;
        }
      }
    }
  }
}

// 移动端select下拉框位置修复
@media (max-width: 768px) {
  .add-product {
    // 修复select下拉框位置
    :deep(.el-select-dropdown) {
      position: fixed !important;
      z-index: 3000 !important;
      
      &.el-popper {
        position: fixed !important;
      }
    }
    
    // 确保select组件在移动端正确显示
    :deep(.el-select) {
      .el-input {
        position: relative;
      }
    }
    
    // 修复移动端键盘弹出时的布局
    .form-card {
      .product-form {
        .form-section {
          .form-row {
            .el-form-item {
              .el-select {
                width: 100% !important;
              }
            }
          }
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .add-product {
    .page-header {
      h2 {
        font-size: 18px;
      }
    }
    
    .product-form {
      .form-actions {
        .el-button {
          max-width: 250px;
        }
      }
    }
  }
}
</style> 