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
              <el-input 
                v-model="form.specification" 
                placeholder="如：S/M/L/XL/XXL"
                size="large"
              />
            </el-form-item>
          </div>
        </div>
        
        <div class="form-section">
          <h3>价格信息</h3>
          <div class="form-row">
            <el-form-item label="进货价格" prop="costPrice">
              <el-input-number 
                v-model="form.costPrice" 
                :precision="2"
                :min="0"
                placeholder="进货价格"
                size="large"
                style="width: 100%"
              />
            </el-form-item>
            
            <el-form-item label="销售价格" prop="salePrice">
              <el-input-number 
                v-model="form.salePrice" 
                :precision="2"
                :min="0"
                placeholder="销售价格"
                size="large"
                style="width: 100%"
              />
            </el-form-item>
          </div>
          
          <div class="form-row">
            <el-form-item label="库存数量" prop="stock">
              <el-input-number 
                v-model="form.stock" 
                :min="0"
                placeholder="库存数量"
                size="large"
                style="width: 100%"
              />
            </el-form-item>
            
            <el-form-item label="预警数量" prop="alertStock">
              <el-input-number 
                v-model="form.alertStock" 
                :min="0"
                placeholder="预警数量"
                size="large"
                style="width: 100%"
              />
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
        
        <div class="form-section">
          <h3>商品信息</h3>
          <div class="form-row">
            <el-form-item label="品牌" prop="brand">
              <el-input 
                v-model="form.brand" 
                placeholder="请输入品牌名称"
                size="large"
              />
            </el-form-item>
            
            <el-form-item label="颜色" prop="color">
              <el-input 
                v-model="form.color" 
                placeholder="请输入商品颜色"
                size="large"
              />
            </el-form-item>
          </div>
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
  stock: 0,
  alertStock: 10,
  description: '',
  brand: '',
  color: '',
  images: [] as string[]
});

// 文件列表
const fileList = ref<UploadUserFile[]>([]);

// 上传配置
const uploadUrl = 'http://localhost:3333/api/upload';
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
  stock: [
    { required: true, message: '请输入库存数量', trigger: 'blur' },
    { type: 'number' as const, min: 0, message: '库存不能为负数', trigger: 'blur' }
  ],
  brand: [
    { required: true, message: '请输入品牌名称', trigger: 'blur' }
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
  ElMessage.success('图片上传成功');
  form.images.push(response.url || file.url || '');
};

// 上传失败
const handleUploadError: UploadProps['onError'] = () => {
  ElMessage.error('图片上传失败，请重试');
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
    
    // 创建商品对象
    const product = {
      id: productId,
      ...form,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
      soldCount: 0,
      totalRevenue: 0
    };
    
    // 获取现有商品列表
    const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
    
    // 添加新商品
    existingProducts.push(product);
    
    // 保存到本地存储
    localStorage.setItem('products', JSON.stringify(existingProducts));
    
    // 更新统计数据
    updateStats();
    
    ElMessage.success('商品入库成功！');
    router.push('/home/inventory/list');
    
  } catch (error) {
    console.error('表单验证失败:', error);
  } finally {
    submitting.value = false;
  }
};

// 更新统计数据
const updateStats = () => {
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  const totalProducts = products.length;
  const totalStock = products.reduce((sum: number, product: any) => sum + product.stock, 0);
  const totalValue = products.reduce((sum: number, product: any) => sum + (product.stock * product.costPrice), 0);
  
  localStorage.setItem('stats', JSON.stringify({
    totalProducts,
    totalStock,
    totalValue,
    lastUpdate: new Date().toISOString()
  }));
};

// 重置表单
const resetForm = () => {
  if (!formRef.value) return;
  
  ElMessageBox.confirm(
    '确定要重置表单吗？所有已填写的信息将被清空。',
    '确认重置',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    formRef.value?.resetFields();
    fileList.value = [];
    form.images = [];
    ElMessage.success('表单已重置');
  }).catch(() => {
    // 用户取消
  });
};
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
  
  .product-form {
    .form-section {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
    
    .form-actions {
      flex-direction: column;
      align-items: center;
      
      .el-button {
        width: 100%;
        max-width: 300px;
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