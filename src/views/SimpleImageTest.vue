<template>
  <div class="simple-test">
    <h2>简单图片测试</h2>
    
    <div class="test-section">
      <h3>1. 内联SVG图片（应该能显示）</h3>
      <div class="image-container">
        <svg width="200" height="200" style="border: 1px solid #ccc;">
          <rect width="100%" height="100%" fill="#409eff"/>
          <text x="50%" y="50%" font-family="Arial" font-size="14" fill="white" text-anchor="middle" dy=".3em">测试图片</text>
        </svg>
      </div>
    </div>
    
    <div class="test-section">
      <h3>2. Base64图片（应该能显示）</h3>
      <div class="image-container">
        <img 
          src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNjdjMjNhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7lm77niYfliqDovb3lpLHotKU8L3RleHQ+PC9zdmc+"
          style="width: 200px; height: 200px; border: 1px solid #ccc;"
          @error="handleError"
          @load="handleLoad"
        />
      </div>
    </div>
    
    <div class="test-section">
      <h3>3. 七牛云图片测试</h3>
      <div class="image-container">
        <img 
          src="http://img.fznbd.xin/3c136c7d-f5af-4fcb-8030-40ccff762e22.webp"
          style="width: 200px; height: 200px; border: 1px solid #ccc;"
          @error="handleError"
          @load="handleLoad"
        />
        <p>状态: {{ status.qiniu }}</p>
      </div>
    </div>
    
    <div class="test-section">
      <h3>4. 本地图片测试</h3>
      <div class="image-container">
        <img 
          src="http://localhost:3333/uploaded/cbcaa3f2-991a-4f49-a7cb-81a93c60503e.webp"
          style="width: 200px; height: 200px; border: 1px solid #ccc;"
          @error="handleError"
          @load="handleLoad"
        />
        <p>状态: {{ status.local }}</p>
      </div>
    </div>
    
    <div class="test-section">
      <h3>5. 图片上传测试</h3>
      <input type="file" @change="handleFileChange" accept="image/*" />
      <div v-if="uploadedImage" class="image-container">
        <img 
          :src="uploadedImage" 
          style="width: 200px; height: 200px; border: 1px solid #ccc;"
          @error="handleError"
          @load="handleLoad"
        />
        <p>上传的图片: {{ uploadedImage }}</p>
        <p>状态: {{ status.uploaded }}</p>
      </div>
    </div>
    
    <div class="test-section">
      <h3>调试信息</h3>
      <pre>{{ debugInfo }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const status = ref({
  qiniu: '未加载',
  local: '未加载',
  uploaded: '未加载'
});

const uploadedImage = ref('');
const debugInfo = ref('');

const handleError = (e) => {
  const src = e.target.src;
  debugInfo.value += `\n图片加载失败: ${src}`;
  
  if (src.includes('img.fznbd.xin')) {
    status.value.qiniu = '加载失败';
  } else if (src.includes('localhost:3333')) {
    status.value.local = '加载失败';
  } else if (uploadedImage.value && src.includes(uploadedImage.value)) {
    status.value.uploaded = '加载失败';
  }
};

const handleLoad = (e) => {
  const src = e.target.src;
  debugInfo.value += `\n图片加载成功: ${src}`;
  
  if (src.includes('img.fznbd.xin')) {
    status.value.qiniu = '加载成功';
  } else if (src.includes('localhost:3333')) {
    status.value.local = '加载成功';
  } else if (uploadedImage.value && src.includes(uploadedImage.value)) {
    status.value.uploaded = '加载成功';
  }
};

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedImage.value = e.target.result;
      status.value.uploaded = '已选择';
    };
    reader.readAsDataURL(file);
  }
};
</script>

<style scoped>
.simple-test {
  padding: 20px;
}

.test-section {
  margin-bottom: 30px;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
}

.test-section h3 {
  margin-bottom: 15px;
  color: #333;
}

.image-container {
  text-align: center;
}

pre {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.4;
  max-height: 200px;
  overflow-y: auto;
}
</style> 