<template>
  <div class="image-test">
    <el-card>
      <h2>图片显示测试</h2>
      
      <!-- 测试不同的图片URL -->
      <div class="test-section">
        <h3>测试图片URL</h3>
        <div class="image-grid">
          <div class="image-item">
            <h4>七牛云图片1</h4>
            <el-image 
              src="http://img.fznbd.xin/70852958-cfae-4257-9ae8-37d91ab3a496.webp"
              style="width: 200px; height: 200px; border-radius: 8px;"
              fit="cover"
              :preview-src-list="['http://img.fznbd.xin/70852958-cfae-4257-9ae8-37d91ab3a496.webp']"
              @error="handleImageError"
              @load="handleImageLoad"
            />
            <p>URL: http://img.fznbd.xin/3c136c7d-f5af-4fcb-8030-40ccff762e22.webp</p>
            <p>状态: {{ imageStatus.img1 }}</p>
          </div>
          
          <div class="image-item">
            <h4>七牛云图片2</h4>
            <el-image 
              src="http://img.fznbd.xin/cbcaa3f2-991a-4f49-a7cb-81a93c60503e.webp"
              style="width: 200px; height: 200px; border-radius: 8px;"
              fit="cover"
              :preview-src-list="['http://img.fznbd.xin/cbcaa3f2-991a-4f49-a7cb-81a93c60503e.webp']"
              @error="handleImageError"
              @load="handleImageLoad"
            />
            <p>URL: http://img.fznbd.xin/cbcaa3f2-991a-4f49-a7cb-81a93c60503e.webp</p>
            <p>状态: {{ imageStatus.img2 }}</p>
          </div>
          
          <div class="image-item">
            <h4>本地图片</h4>
            <el-image 
              src="http://localhost:3333/uploaded/cbcaa3f2-991a-4f49-a7cb-81a93c60503e.webp"
              style="width: 200px; height: 200px; border-radius: 8px;"
              fit="cover"
              :preview-src-list="['http://localhost:3333/uploaded/cbcaa3f2-991a-4f49-a7cb-81a93c60503e.webp']"
              @error="handleImageError"
              @load="handleImageLoad"
            />
            <p>URL: http://localhost:3333/uploaded/cbcaa3f2-991a-4f49-a7cb-81a93c60503e.webp</p>
            <p>状态: {{ imageStatus.local }}</p>
          </div>
          
          <div class="image-item">
            <h4>占位图片</h4>
            <el-image 
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNDA5ZWZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7lm77niYfliqDovb3lpLHotKU8L3RleHQ+PC9zdmc+"
              style="width: 200px; height: 200px; border-radius: 8px;"
              fit="cover"
              :preview-src-list="['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNDA5ZWZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7lm77niYfliqDovb3lpLHotKU8L3RleHQ+PC9zdmc+']"
              @error="handleImageError"
              @load="handleImageLoad"
            />
            <p>URL: data:image/svg+xml;base64,...</p>
            <p>状态: {{ imageStatus.placeholder }}</p>
          </div>
        </div>
      </div>
      
      <!-- 图片上传测试 -->
      <div class="test-section">
        <h3>图片上传测试</h3>
        <div class="upload-info">
          <p><strong>当前上传URL:</strong> {{ uploadUrl }}</p>
          <p><strong>设备类型:</strong> {{ deviceType }}</p>
          <p><strong>网络状态:</strong> {{ networkStatus }}</p>
        </div>
        
        <el-upload
          class="upload-demo"
          :action="uploadUrl"
          :show-file-list="false"
          :before-upload="beforeUpload"
          :on-success="handleSuccess"
          :on-error="handleError"
        >
          <el-button type="primary">点击上传图片</el-button>
          <template #tip>
            <div class="el-upload__tip">
              只能上传jpg/png文件，且不超过5MB
            </div>
          </template>
        </el-upload>
        
        <div v-if="imageUrl" class="image-preview">
          <h3>上传的图片:</h3>
          <el-image 
            :src="imageUrl" 
            style="width: 200px; height: 200px; border-radius: 8px;"
            fit="cover"
            :preview-src-list="[imageUrl]"
            @error="handleImageError"
            @load="handleImageLoad"
          />
          <p>图片URL: {{ imageUrl }}</p>
          <p>存储方式: {{ storageType }}</p>
          <p>状态: {{ imageStatus.uploaded }}</p>
          
          <!-- 测试不同设备访问 -->
          <div class="access-test">
            <h4>访问测试:</h4>
            <p><strong>本地访问:</strong> <a :href="imageUrl" target="_blank">{{ imageUrl }}</a></p>
            <p><strong>IP访问:</strong> <a :href="imageUrl.replace('localhost', window.location.hostname)" target="_blank">{{ imageUrl.replace('localhost', window.location.hostname) }}</a></p>
          </div>
        </div>
      </div>
      
      <!-- 调试信息 -->
      <div class="test-section">
        <h3>调试信息</h3>
        <pre>{{ debugInfo }}</pre>
      </div>
      
      <!-- 商品数据测试 -->
      <div class="test-section">
        <h3>商品数据测试</h3>
        <div class="data-info">
          <p><strong>商品总数:</strong> {{ productCount }}</p>
          <p><strong>有库存商品:</strong> {{ availableProductCount }}</p>
          <p><strong>当前URL参数:</strong> {{ currentQuery }}</p>
        </div>
        
        <div v-if="products.length > 0" class="product-list">
          <h4>商品列表:</h4>
          <div v-for="product in products" :key="product.id" class="product-item">
            <p><strong>ID:</strong> {{ product.id }} ({{ typeof product.id }})</p>
            <p><strong>名称:</strong> {{ product.name }}</p>
            <p><strong>库存:</strong> {{ product.stock }}</p>
            <p><strong>编码:</strong> {{ product.code }}</p>
          </div>
        </div>
        
        <div v-else class="no-products">
          <p>暂无商品数据</p>
          <el-button type="primary" @click="goToAddProduct">添加商品</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';

const imageUrl = ref('');
const storageType = ref('');
const uploadUrl = ref('');
const deviceType = ref('');
const networkStatus = ref('');

const imageStatus = ref({
  img1: '未加载',
  img2: '未加载',
  local: '未加载',
  placeholder: '未加载',
  uploaded: '未加载'
});
const debugInfo = ref('');

// 商品数据测试
const products = ref([]);
const productCount = ref(0);
const availableProductCount = ref(0);
const currentQuery = ref('');

// 加载商品数据
const loadProductData = () => {
  // 暂时使用空数组，因为现在使用后端API
  products.value = [];
  productCount.value = 0;
  availableProductCount.value = 0;
  
  // 获取当前URL参数
  const urlParams = new URLSearchParams(window.location.search);
  currentQuery.value = urlParams.toString();
  
  console.log('商品数据:', products.value);
  console.log('URL参数:', currentQuery.value);
};

// 跳转到添加商品页面
const goToAddProduct = () => {
  window.location.href = '/home/inventory/add';
};

// 设置上传URL
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

// 检测设备类型
const detectDevice = () => {
  const userAgent = navigator.userAgent;
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    deviceType.value = '移动设备';
  } else {
    deviceType.value = '桌面设备';
  }
};

// 检测网络状态
const checkNetwork = () => {
  if (navigator.onLine) {
    networkStatus.value = '在线';
  } else {
    networkStatus.value = '离线';
  }
};

// 组件挂载时初始化
onMounted(() => {
  setUploadUrl();
  detectDevice();
  checkNetwork();
  loadProductData(); // 在组件挂载时加载商品数据
  
  // 监听网络状态变化
  window.addEventListener('online', () => {
    networkStatus.value = '在线';
  });
  window.addEventListener('offline', () => {
    networkStatus.value = '离线';
  });
});

const beforeUpload = (file) => {
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

const handleSuccess = (response, file) => {
  console.log('上传成功响应:', response);
  console.log('文件信息:', file);
  
  debugInfo.value = JSON.stringify({ response, file }, null, 2);
  
  if (response && response.data && response.data.url) {
    imageUrl.value = response.data.url;
    storageType.value = response.data.storage || 'unknown';
    imageStatus.value.uploaded = '上传成功';
    ElMessage.success(`图片上传成功！存储方式: ${storageType.value}`);
  } else {
    imageStatus.value.uploaded = '上传失败';
    ElMessage.error('图片上传失败，响应格式错误');
  }
};

const handleError = (error, file) => {
  console.error('上传失败:', error);
  imageStatus.value.uploaded = '上传失败';
  debugInfo.value = JSON.stringify({ error, file }, null, 2);
  ElMessage.error('图片上传失败，请重试');
};

const handleImageError = (e) => {
  console.error('图片加载失败:', e);
  const target = e.target;
  const src = target.src;
  
  debugInfo.value += `\n图片加载失败: ${src}`;
  debugInfo.value += `\n错误详情: ${JSON.stringify({
    type: e.type,
    target: target.tagName,
    src: src,
    naturalWidth: target.naturalWidth,
    naturalHeight: target.naturalHeight
  }, null, 2)}`;
  
  if (src.includes('3c136c7d-f5af-4fcb-8030-40ccff762e22.webp')) {
    imageStatus.value.img1 = '加载失败';
  } else if (src.includes('cbcaa3f2-991a-4f49-a7cb-81a93c60503e.webp')) {
    imageStatus.value.img2 = '加载失败';
  } else if (src.includes('localhost:3333')) {
    imageStatus.value.local = '加载失败';
  } else if (src.includes('data:image/svg+xml')) {
    imageStatus.value.placeholder = '加载失败';
  } else if (imageUrl.value && src.includes(imageUrl.value)) {
    imageStatus.value.uploaded = '加载失败';
  }
};

const handleImageLoad = (e) => {
  console.log('图片加载成功:', e);
  const target = e.target;
  const src = target.src;
  
  if (src.includes('3c136c7d-f5af-4fcb-8030-40ccff762e22.webp')) {
    imageStatus.value.img1 = '加载成功';
  } else if (src.includes('cbcaa3f2-991a-4f49-a7cb-81a93c60503e.webp')) {
    imageStatus.value.img2 = '加载成功';
  } else if (src.includes('localhost:3333')) {
    imageStatus.value.local = '加载成功';
  } else if (src.includes('via.placeholder.com')) {
    imageStatus.value.placeholder = '加载成功';
  } else if (imageUrl.value && src.includes(imageUrl.value)) {
    imageStatus.value.uploaded = '加载成功';
  }
  
  debugInfo.value += `\n图片加载成功: ${src}`;
};
</script>

<style scoped>
.image-test {
  padding: 20px;
}

.test-section {
  margin-bottom: 30px;
}

.test-section h3 {
  margin-bottom: 20px;
  color: #333;
  border-bottom: 2px solid #409eff;
  padding-bottom: 10px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.image-item {
  text-align: center;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.image-item h4 {
  margin-bottom: 10px;
  color: #333;
}

.image-item p {
  margin-top: 10px;
  word-break: break-all;
  color: #666;
  font-size: 12px;
}

.image-preview {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.image-preview h3 {
  margin-bottom: 15px;
  color: #333;
}

.image-preview p {
  margin-top: 10px;
  word-break: break-all;
  color: #666;
  font-size: 14px;
}

pre {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.4;
}
</style> 