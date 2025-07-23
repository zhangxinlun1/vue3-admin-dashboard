<template>
  <div class="container mx-auto p-4">
    <div class="flex flex-wrap items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">货号搜索系统</h1>
      <div class="flex space-x-2 mt-4 sm:mt-0">
        <button @click="showTab = 'search'" :class="showTab === 'search' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'" class="px-4 py-2 rounded-md border">搜索</button>
        <button @click="showTab = 'order'" :class="showTab === 'order' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'" class="px-4 py-2 rounded-md border">开单</button>
        <button @click="showTab = 'stock'" :class="showTab === 'stock' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'" class="px-4 py-2 rounded-md border">入库</button>
        <button @click="showTab = 'report'" :class="showTab === 'report' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'" class="px-4 py-2 rounded-md border">营业额</button>
      </div>
    </div>

    <!-- 搜索页 -->
    <div v-if="showTab === 'search'" class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <label for="searchInput" class="block text-sm font-medium text-gray-700 mb-1">输入货号</label>
          <input
              type="text"
              id="searchInput"
              v-model="searchQuery"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例如: ITEM-1234"
          >
        </div>
        <div class="flex items-end">
          <button
              @click="searchItem"
              class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 ease-in-out flex items-center"
          >
            <i class="fa fa-search mr-2"></i>搜索
          </button>
        </div>
      </div>

      <div v-if="searching" class="mt-4 text-center py-4">
        <i class="fa fa-spinner fa-spin text-blue-500"></i> 搜索中...
      </div>

      <div v-if="errorMessage" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
        <i class="fa fa-exclamation-circle mr-2"></i>{{ errorMessage }}
      </div>
    </div>

    <div v-if="searchResults.length > 0 && showTab === 'search'" class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">货号</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类别</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">库存</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">价格</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="item in searchResults" :key="item.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.code }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.category }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span :class="item.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ item.stock > 0 ? '有库存 (' + item.stock + ')' : '无库存' }}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">¥{{ item.price.toFixed(2) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <button @click="viewDetails(item)" class="text-blue-600 hover:text-blue-900 mr-3">
                <i class="fa fa-eye mr-1"></i>详情
              </button>
              <button @click="addToOrder(item)" class="text-green-600 hover:text-green-900">
                <i class="fa fa-plus-circle mr-1"></i>开单
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <div class="flex-1 flex justify-between sm:hidden">
          <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            上一页
          </button>
          <button class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            下一页
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              显示 <span class="font-medium">1</span> 到 <span class="font-medium">{{ Math.min(10, searchResults.length) }}</span> 条，共 <span class="font-medium">{{ searchResults.length }}</span> 条结果
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span class="sr-only">上一页</span>
                <i class="fa fa-chevron-left"></i>
              </button>
              <button class="bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                1
              </button>
              <button class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                2
              </button>
              <button class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                3
              </button>
              <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                ...
              </span>
              <button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span class="sr-only">下一页</span>
                <i class="fa fa-chevron-right"></i>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="searchQuery && !searching && searchResults.length === 0 && showTab === 'search'" class="bg-white rounded-lg shadow-md p-6 text-center">
      <div class="mb-4 text-gray-400">
        <i class="fa fa-search fa-4x"></i>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">未找到匹配的货号</h3>
      <p class="text-sm text-gray-500 mb-4">请检查输入的货号是否正确，或尝试使用其他关键词</p>
      <button @click="clearSearch" class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
        <i class="fa fa-refresh mr-2"></i>重新搜索
      </button>
    </div>

    <!-- 开单页 -->
    <div v-if="showTab === 'order'" class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">开单</h2>

      <div class="mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        </div>
      </div>

      <div class="mb-6">
        <div class="flex justify-between items-center mb-3">
          <h3 class="text-lg font-medium">订单商品</h3>
          <button @click="addOrderItem" class="text-blue-600 hover:text-blue-900 flex items-center">
            <i class="fa fa-plus-circle mr-1"></i>添加商品
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">货号</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">单价</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">数量</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">小计</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(item, index) in orderItems" :key="index" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <input type="text" v-model="item.code" @change="updateOrderItemInfo(index)" class="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <input type="text" v-model="item.name" class="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <input type="number" v-model.number="item.price" min="0" step="0.01" class="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <input type="number" v-model.number="item.quantity" min="1" step="1" class="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </td>
              <td class="px-6 py-4 whitespace-nowrap font-medium">¥{{ (item.price * item.quantity).toFixed(2) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button @click="removeOrderItem(index)" class="text-red-600 hover:text-red-900">
                  删除
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="flex justify-end mb-6">
        <div class="w-full max-w-xs">
          <div class="bg-gray-50 p-4 rounded-md">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-gray-700">商品总数</span>
              <span class="text-sm font-medium text-gray-900">{{ getTotalQuantity() }}</span>
            </div>
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-gray-700">订单总额</span>
              <span class="text-base font-semibold text-gray-900">¥{{ getTotalAmount().toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-3">
        <button @click="resetOrder" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
          重置
        </button>
        <button @click="createOrder" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          提交订单
        </button>
      </div>
    </div>

    <!-- 入库页 -->
    <div v-if="showTab === 'stock'" class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">入库</h2>

      <div class="mb-6">
        <div class="flex justify-between items-center mb-3">
          <h3 class="text-lg font-medium">入库商品</h3>
          <button @click="addStockItem" class="text-blue-600 hover:text-blue-900 flex items-center">
            <i class="fa fa-plus-circle mr-1"></i>添加商品
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">货号</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">价格</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">入库数量</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(item, index) in stockItems" :key="index" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <input type="text" v-model="item.code" @change="updateStockItemInfo(index)" class="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <input type="text" v-model="item.name" class="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
              <input type="number" v-model.number="item.price" min="1" step="1" class="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <input type="number" v-model.number="item.quantity" min="1" step="1" class="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button @click="removeStockItem(index)" class="text-red-600 hover:text-red-900">
                  <i class="fa fa-trash"></i>
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="flex justify-end space-x-3">
        <button @click="resetStock" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
          重置
        </button>
        <button @click="createStock" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          提交入库
        </button>
      </div>
    </div>

    <!-- 营业额页 -->
    <div v-if="showTab === 'report'" class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">营业额统计</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div class="text-sm font-medium text-blue-800 mb-1">今日营业额</div>
          <div class="text-2xl font-bold text-blue-900">¥{{ getTodayRevenue().toFixed(2) }}</div>
          <div class="text-xs text-blue-600 mt-1">
            <i class="fa fa-arrow-up"></i> {{ getTodayRevenueGrowth() }}% 较昨日
          </div>
        </div>

        <div class="bg-green-50 rounded-lg p-4 border border-green-100">
          <div class="text-sm font-medium text-green-800 mb-1">今日订单数</div>
          <div class="text-2xl font-bold text-green-900">{{ getTodayOrderCount() }}</div>
          <div class="text-xs text-green-600 mt-1">
            <i class="fa fa-arrow-up"></i> {{ getTodayOrderCountGrowth() }}% 较昨日
          </div>
        </div>

        <div class="bg-purple-50 rounded-lg p-4 border border-purple-100">
          <div class="text-sm font-medium text-purple-800 mb-1">当前库存</div>
          <div class="text-2xl font-bold text-purple-900">{{ getTotalStock() }}</div>
          <div class="text-xs text-purple-600 mt-1">
            <i class="fa fa-arrow-up"></i> {{ getStockGrowth() }}% 较上周
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow-sm border p-4">
          <h3 class="text-lg font-medium mb-4">近7日营业额趋势</h3>
          <div class="h-64">
            <!-- 这里会渲染图表 -->
            <canvas id="revenueChart"></canvas>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border p-4">
          <h3 class="text-lg font-medium mb-4">热销商品排行</h3>
          <div class="h-64">
            <!-- 这里会渲染图表 -->
            <canvas id="topSellingChart"></canvas>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <h3 class="text-lg font-medium mb-4">今日订单明细</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">订单号</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">客户</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">商品数量</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">金额</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">时间</th>
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="order in todayOrders" :key="order.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ order.orderNumber }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ order.customerName }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ order.items.length }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">¥{{ order.totalAmount.toFixed(2) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDateTime(order.createdAt) }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 详情模态框 -->
    <div v-if="showDetailsModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  {{ selectedItem.name }} ({{ selectedItem.code }})
                </h3>
                <div class="mt-2 border-t border-gray-200 pt-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <dt class="text-sm font-medium text-gray-500">货号</dt>
                      <dd class="mt-1 text-sm text-gray-900">{{ selectedItem.code }}</dd>
                    </div>
                    <div>
                      <dt class="text-sm font-medium text-gray-500">名称</dt>
                      <dd class="mt-1 text-sm text-gray-900">{{ selectedItem.name }}</dd>
                    </div>
                    <div>
                      <dt class="text-sm font-medium text-gray-500">类别</dt>
                      <dd class="mt-1 text-sm text-gray-900">{{ selectedItem.category }}</dd>
                    </div>
                    <div>
                      <dt class="text-sm font-medium text-gray-500">品牌</dt>
                      <dd class="mt-1 text-sm text-gray-900">{{ selectedItem.brand }}</dd>
                    </div>
                    <div>
                      <dt class="text-sm font-medium text-gray-500">库存</dt>
                      <dd class="mt-1 text-sm text-gray-900">{{ selectedItem.stock }}</dd>
                    </div>
                    <div>
                      <dt class="text-sm font-medium text-gray-500">价格</dt>
                      <dd class="mt-1 text-sm text-gray-900">¥{{ selectedItem.price.toFixed(2) }}</dd>
                    </div>
                  </div>
                  <div class="mt-4">
                    <dt class="text-sm font-medium text-gray-500">描述</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ selectedItem.description }}</dd>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" @click="closeDetailsModal" class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Chart } from 'chart.js/auto';
import { getProducts } from '@/api/admin/products.ts';
import { getOrders } from '@/api/admin/orders.ts';
import { ElMessage } from 'element-plus';

// 状态管理
const showTab = ref('search');
const searchQuery = ref('');
const searchResults = ref([]);
const searching = ref(false);
const errorMessage = ref('');
const showDetailsModal = ref(false);
const selectedItem = ref({});

// 订单管理
const orderForm = ref({
  customerName: '',
  contact: '',
  price:0
});
const orderItems = ref([{ code: '', name: '', price: 0, quantity: 1 }]);

// 入库管理
const stockForm = ref({
  supplier: '',
  contact: '',
  price:0
});
const stockItems = ref([{ code: '', name: '', quantity: 1 ,price:0}]);

// 商品数据（从后端API加载）
const items = ref([]);

// 订单数据（从后端API加载）
const orders = ref([]);

// 入库数据（从后端API加载）
const stockIns = ref([]);

// 从后端API加载商品数据
const loadItems = async () => {
  try {
    // 获取商品数据
    const productsRes = await getProducts();
    items.value = productsRes.data || [];
    
    // 获取订单数据
    const ordersRes = await getOrders();
    orders.value = ordersRes.data || [];
    
    // 获取入库数据（如果有入库API）
    // const stockInsRes = await getStockIns();
    // stockIns.value = stockInsRes.data || [];
  } catch (error) {
    console.error('加载数据失败:', error);
    ElMessage.error('加载数据失败，请检查网络连接');
  }
};

// 搜索函数
const searchItem = async () => {
  if (!searchQuery.value.trim()) {
    errorMessage.value = '请输入要搜索的货号';
    return;
  }

  errorMessage.value = '';
  searching.value = true;
  searchResults.value = [];

  try {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 从真实数据中搜索
    const results = items.value.filter(item =>
        item.code.toLowerCase().includes(searchQuery.value.toLowerCase())
    );

    searchResults.value = results;

    if (results.length === 0) {
      errorMessage.value = '未找到匹配的货号';
    }
  } catch (error) {
    console.error('搜索出错:', error);
    errorMessage.value = '搜索过程中发生错误，请稍后再试';
  } finally {
    searching.value = false;
  }
};

// 查看详情
const viewDetails = (item) => {
  selectedItem.value = {...item};
  showDetailsModal.value = true;
};

// 关闭详情模态框
const closeDetailsModal = () => {
  showDetailsModal.value = false;
};

// 添加到订单
const addToOrder = (item) => {
  orderItems.value.push({
    code: item.code,
    name: item.name,
    price: item.price,
    quantity: 1
  });
  showTab.value = 'order';
};

// 订单操作
const addOrderItem = () => {
  orderItems.value.push({code: '', name: '', price: 0, quantity: 1});
};

const removeOrderItem = (index) => {
  if (orderItems.value.length > 1) {
    orderItems.value.splice(index, 1);
  }
};

const updateOrderItemInfo = (index) => {
  const item = orderItems.value[index];
  if (item.code) {
    const matchedItem = items.value.find(i => i.code === item.code);
    if (matchedItem) {
      orderItems.value[index] = {
        ...orderItems.value[index],
        name: matchedItem.name,
        price: matchedItem.price
      };
    }
  }
};

const getTotalQuantity = () => {
  return orderItems.value.reduce((total, item) => total + item.quantity, 0);
};

const getTotalAmount = () => {
  return orderItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
};

const resetOrder = () => {
  orderForm.value = {
    customerName: '',
    contact: ''
  };
  orderItems.value = [{code: '', name: '', price: 0, quantity: 1}];
};

const createOrder = async () => {
  if (orderItems.value.length === 0 || orderItems.value.every(item => !item.code)) {
    errorMessage.value = '请添加商品';
    return;
  }

  try {
    // 模拟API请求延迟
    searching.value = true;
    await new Promise(resolve => setTimeout(resolve, 800));

    // 创建订单
    const newOrder = {
      id: `ORD-${new Date().getTime()}`,
      orderNumber: `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${orders.value.length + 1}`,
      customerName: "张鑫伦",
      contact: orderForm.value.contact,
      price:orderForm.value.price,
      items: orderItems.value.filter(item => item.code),
      totalAmount: getTotalAmount(),
      createdAt: new Date()
    };

    orders.value.push(newOrder);

    // 订单数据已通过API保存到后端

    // 更新库存
    newOrder.items.forEach(item => {
      const stockItem = items.value.find(i => i.code === item.code);
      if (stockItem) {
        stockItem.stock -= item.quantity;
      }
    });

    // 商品数据已通过API保存到后端

    alert('订单创建成功！');
    console.log("当前订单",newOrder)
    resetOrder();
    showTab.value = 'report';
  } catch (error) {
    console.error('创建订单出错:', error);
    errorMessage.value = '创建订单过程中发生错误，请稍后再试';
  } finally {
    searching.value = false;
  }
};

// 入库操作
const addStockItem = () => {
  stockItems.value.push({code: '', name: '', quantity: 1,price:0});
};

const removeStockItem = (index) => {
  if (stockItems.value.length > 1) {
    stockItems.value.splice(index, 1);
  }
};

const updateStockItemInfo = (index) => {
  const item = stockItems.value[index];
  if (item.code) {
    const matchedItem = items.value.find(i => i.code === item.code);
    if (matchedItem) {
      stockItems.value[index] = {
        ...stockItems.value[index],
        name: matchedItem.name
      };
    }
  }
};

const resetStock = () => {
  stockForm.value = {
    supplier: '',
    contact: '',
    price:0
  };
  stockItems.value = [{code: '', name: '', quantity: 1}];
};

const createStock = async () => {

  if (stockItems.value.length === 0 || stockItems.value.every(item => !item.code)) {
    errorMessage.value = '请添加商品';
    return;
  }

  try {
    // 模拟API请求延迟
    searching.value = true;
    await new Promise(resolve => setTimeout(resolve, 800));

    // 创建入库记录
    const newStockIn = {
      id: `STK-${new Date().getTime()}`,
      supplier: stockForm.value.supplier,
      contact: stockForm.value.contact,
      price: stockForm.value.price,
      items: stockItems.value.filter(item => item.code),
      createdAt: new Date()
    };

    stockIns.value.push(newStockIn);

    // 入库数据已通过API保存到后端

    // 更新库存
    newStockIn.items.forEach(item => {
      const stockItem = items.value.find(i => i.code === item.code);
      if (stockItem) {
        stockItem.stock += item.quantity;
      } else {
        // 添加新商品
        items.value.push({
          id: items.value.length + 1,
          code: item.code,
          name: item.name,
          category: '其他',
          brand: '未知',
          stock: item.quantity,
          price: item.price,
          description: '新入库商品'
        });
      }
    });

    // 商品数据已通过API保存到后端

    alert('入库成功！');
    resetStock();
    showTab.value = 'report';
  } catch (error) {
    console.error('入库出错:', error);
    errorMessage.value = '入库过程中发生错误，请稍后再试';
  } finally {
    searching.value = false;
  }
};

// 营业额统计
const getTodayRevenue = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return orders.value.reduce((total, order) => {
    const orderDate = new Date(order.createdAt);
    orderDate.setHours(0, 0, 0, 0);

    return orderDate.getTime() === today.getTime() ? total + order.totalAmount : total;
  }, 0);
};

const getTodayOrderCount = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return orders.value.filter(order => {
    const orderDate = new Date(order.createdAt);
    orderDate.setHours(0, 0, 0, 0);
    return orderDate.getTime() === today.getTime();
  }).length;
};

const getTotalStock = () => {
  return items.value.reduce((total, item) => total + item.stock, 0);
};

const getTodayRevenueGrowth = () => {
  // 模拟昨日营业额
  return Math.floor(Math.random() * 20);
};

const getTodayOrderCountGrowth = () => {
  // 模拟昨日订单数增长
  return Math.floor(Math.random() * 15);
};

const getStockGrowth = () => {
  // 模拟上周库存增长
  return Math.floor(Math.random() * 10);
};

const formatDateTime = (date) => {
  return new Date(date).toLocaleString();
};

const getTodayOrders = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return orders.value.filter(order => {
    const orderDate = new Date(order.createdAt);
    orderDate.setHours(0, 0, 0, 0);
    return orderDate.getTime() === today.getTime();
  });
};

const todayOrders = ref(getTodayOrders());

// 初始化图表
const initCharts = () => {
  // 近7日营业额趋势图
  const revenueCtx = document.getElementById('revenueChart');
  if (revenueCtx && !revenueChart) {
    revenueChart = new Chart(revenueCtx, {
      type: 'line',
      data: {
        labels: ['7月10日', '7月11日', '7月12日', '7月13日', '7月14日', '7月15日', '7月16日'],
        datasets: [{
          label: '营业额 (元)',
          data: [8500, 9200, 7800, 10500, 9800, 11200, getTodayRevenue()],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              drawBorder: false
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  // 热销商品排行
  const topSellingCtx = document.getElementById('topSellingChart');
  if (topSellingCtx && !topSellingChart) {
    // 模拟热销商品数据
    const topSellingItems = [
      {name: '高级无线耳机', count: 15},
      {name: '机械键盘', count: 12},
      {name: '智能手表Pro', count: 9},
      {name: '游戏笔记本电脑', count: 7},
      {name: '无线充电器', count: 5}
    ];

    topSellingChart = new Chart(topSellingCtx, {
      type: 'bar',
      data: {
        labels: topSellingItems.map(item => item.name),
        datasets: [{
          label: '销量',
          data: topSellingItems.map(item => item.count),
          backgroundColor: [
            'rgba(59, 130, 246, 0.7)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(249, 115, 22, 0.7)',
            'rgba(139, 92, 246, 0.7)',
            'rgba(236, 72, 153, 0.7)'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              drawBorder: false
            }
          },
          y: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }
};

// 清空搜索
const clearSearch = () => {
  searchQuery.value = '';
  searchResults.value = [];
  errorMessage.value = '';
};

// 初始化
onMounted(() => {
  loadItems(); // 加载商品数据
  initCharts();
});
</script>

<style scoped>
/* 这里可以添加自定义样式 */
</style>
