// 演示数据生成工具

// 生成演示商品数据
export const generateDemoProducts = () => {
  const demoProducts = [
    {
      id: 'demo_1',
      name: '时尚连衣裙',
      code: 'DRESS001',
      category: 'dress',
      brand: '时尚品牌',
      color: '黑色',
      specification: 'S/M/L/XL',
      costPrice: 120,
      salePrice: 299,
      stock: 15,
      alertStock: 5,
      description: '经典黑色连衣裙，适合各种场合',
      images: ['https://via.placeholder.com/400x400/000000/FFFFFF?text=连衣裙'],
      createTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updateTime: new Date().toISOString(),
      soldCount: 8,
      totalRevenue: 2392
    },
    {
      id: 'demo_2',
      name: '休闲牛仔裤',
      code: 'PANTS001',
      category: 'pants',
      brand: '牛仔品牌',
      color: '蓝色',
      specification: '28/30/32/34',
      costPrice: 80,
      salePrice: 199,
      stock: 8,
      alertStock: 10,
      description: '舒适休闲牛仔裤，百搭款式',
      images: ['https://via.placeholder.com/400x400/0066CC/FFFFFF?text=牛仔裤'],
      createTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updateTime: new Date().toISOString(),
      soldCount: 12,
      totalRevenue: 2388
    },
    {
      id: 'demo_3',
      name: '针织开衫',
      code: 'OUTER001',
      category: 'outerwear',
      brand: '针织品牌',
      color: '米色',
      specification: 'S/M/L',
      costPrice: 95,
      salePrice: 259,
      stock: 22,
      alertStock: 8,
      description: '柔软针织开衫，春秋季节必备',
      images: ['https://via.placeholder.com/400x400/F5F5DC/000000?text=开衫'],
      createTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updateTime: new Date().toISOString(),
      soldCount: 5,
      totalRevenue: 1295
    },
    {
      id: 'demo_4',
      name: '基础T恤',
      code: 'TOP001',
      category: 'top',
      brand: '基础品牌',
      color: '白色',
      specification: 'S/M/L/XL',
      costPrice: 35,
      salePrice: 89,
      stock: 3,
      alertStock: 10,
      description: '纯棉基础T恤，舒适透气',
      images: ['https://via.placeholder.com/400x400/FFFFFF/000000?text=T恤'],
      createTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updateTime: new Date().toISOString(),
      soldCount: 25,
      totalRevenue: 2225
    },
    {
      id: 'demo_5',
      name: '蕾丝内衣套装',
      code: 'UNDER001',
      category: 'underwear',
      brand: '内衣品牌',
      color: '粉色',
      specification: 'S/M/L',
      costPrice: 45,
      salePrice: 129,
      stock: 18,
      alertStock: 5,
      description: '精致蕾丝内衣套装，舒适贴身',
      images: ['https://via.placeholder.com/400x400/FFC0CB/000000?text=内衣'],
      createTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updateTime: new Date().toISOString(),
      soldCount: 7,
      totalRevenue: 903
    }
  ];
  
  localStorage.setItem('products', JSON.stringify(demoProducts));
  return demoProducts;
};

// 生成演示销售数据
export const generateDemoSales = () => {
  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000);
  
  const demoSales = [
    {
      id: 'sale_1',
      productId: 'demo_1',
      productName: '时尚连衣裙',
      productCode: 'DRESS001',
      category: 'dress',
      quantity: 1,
      price: 299,
      totalAmount: 299,
      profit: 179,
      customerName: '张女士',
      customerPhone: '138****1234',
      remark: '客户很满意',
      saleTime: today.toISOString()
    },
    {
      id: 'sale_2',
      productId: 'demo_2',
      productName: '休闲牛仔裤',
      productCode: 'PANTS001',
      category: 'pants',
      quantity: 2,
      price: 199,
      totalAmount: 398,
      profit: 238,
      customerName: '李小姐',
      customerPhone: '139****5678',
      remark: '尺码合适',
      saleTime: today.toISOString()
    },
    {
      id: 'sale_3',
      productId: 'demo_4',
      productName: '基础T恤',
      productCode: 'TOP001',
      category: 'top',
      quantity: 3,
      price: 89,
      totalAmount: 267,
      profit: 162,
      customerName: '王女士',
      customerPhone: '137****9012',
      remark: '质量不错',
      saleTime: yesterday.toISOString()
    },
    {
      id: 'sale_4',
      productId: 'demo_3',
      productName: '针织开衫',
      productCode: 'OUTER001',
      category: 'outerwear',
      quantity: 1,
      price: 259,
      totalAmount: 259,
      profit: 164,
      customerName: '陈小姐',
      customerPhone: '136****3456',
      remark: '款式很喜欢',
      saleTime: yesterday.toISOString()
    },
    {
      id: 'sale_5',
      productId: 'demo_5',
      productName: '蕾丝内衣套装',
      productCode: 'UNDER001',
      category: 'underwear',
      quantity: 2,
      price: 129,
      totalAmount: 258,
      profit: 168,
      customerName: '刘女士',
      customerPhone: '135****7890',
      remark: '舒适度很好',
      saleTime: twoDaysAgo.toISOString()
    }
  ];
  
  localStorage.setItem('sales', JSON.stringify(demoSales));
  return demoSales;
};

// 生成演示库存调整数据
export const generateDemoStockAdjustments = () => {
  const demoAdjustments = [
    {
      id: 'adj_1',
      productId: 'demo_1',
      productName: '时尚连衣裙',
      oldStock: 10,
      newStock: 15,
      type: 'increase',
      quantity: 5,
      reason: 'purchase',
      remark: '新进货',
      adjustTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'adj_2',
      productId: 'demo_2',
      productName: '休闲牛仔裤',
      oldStock: 15,
      newStock: 8,
      type: 'decrease',
      quantity: 7,
      reason: 'damage',
      remark: '部分商品有瑕疵',
      adjustTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
  
  localStorage.setItem('stockAdjustments', JSON.stringify(demoAdjustments));
  return demoAdjustments;
};

// 初始化演示数据
export const initDemoData = () => {
  generateDemoProducts();
  generateDemoSales();
  generateDemoStockAdjustments();
  
  // 更新统计数据
  const sales = JSON.parse(localStorage.getItem('sales') || '[]');
  const today = new Date().toISOString().split('T')[0];
  
  const todaySales = sales.filter((sale: any) => 
    sale.saleTime.startsWith(today)
  );
  
  const todayRevenue = todaySales.reduce((sum: number, sale: any) => sum + sale.totalAmount, 0);
  const todayProfit = todaySales.reduce((sum: number, sale: any) => sum + sale.profit, 0);
  
  localStorage.setItem('stats', JSON.stringify({
    todayRevenue,
    todayProfit,
    totalSales: sales.length,
    lastUpdate: new Date().toISOString()
  }));
  
  return {
    products: JSON.parse(localStorage.getItem('products') || '[]'),
    sales: sales,
    adjustments: JSON.parse(localStorage.getItem('stockAdjustments') || '[]')
  };
}; 