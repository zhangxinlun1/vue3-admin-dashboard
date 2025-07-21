// 导出数据工具函数

// 导出商品数据为CSV
export const exportProductsToCSV = () => {
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  
  if (products.length === 0) {
    return '没有商品数据可导出';
  }
  
  const headers = [
    '商品名称',
    '商品编码',
    '分类',
    '品牌',
    '颜色',
    '规格',
    '进货价',
    '销售价',
    '当前库存',
    '预警库存',
    '已售数量',
    '总销售额',
    '创建时间',
    '更新时间'
  ];
  
  const csvContent = [
    headers.join(','),
    ...products.map((product: any) => [
      `"${product.name}"`,
      `"${product.code}"`,
      `"${getCategoryText(product.category)}"`,
      `"${product.brand}"`,
      `"${product.color}"`,
      `"${product.specification}"`,
      product.costPrice,
      product.salePrice,
      product.stock,
      product.alertStock,
      product.soldCount || 0,
      product.totalRevenue || 0,
      `"${formatDate(product.createTime)}"`,
      `"${formatDate(product.updateTime)}"`
    ].join(','))
  ].join('\n');
  
  downloadCSV(csvContent, `商品数据_${formatDateForFilename(new Date())}.csv`);
};

// 导出销售数据为CSV
export const exportSalesToCSV = () => {
  const sales = JSON.parse(localStorage.getItem('sales') || '[]');
  
  if (sales.length === 0) {
    return '没有销售数据可导出';
  }
  
  const headers = [
    '销售ID',
    '商品名称',
    '商品编码',
    '分类',
    '数量',
    '单价',
    '总金额',
    '利润',
    '客户姓名',
    '联系电话',
    '备注',
    '销售时间'
  ];
  
  const csvContent = [
    headers.join(','),
    ...sales.map((sale: any) => [
      sale.id,
      `"${sale.productName}"`,
      `"${sale.productCode}"`,
      `"${getCategoryText(sale.category)}"`,
      sale.quantity,
      sale.price,
      sale.totalAmount,
      sale.profit,
      `"${sale.customerName || ''}"`,
      `"${sale.customerPhone || ''}"`,
      `"${sale.remark || ''}"`,
      `"${formatDate(sale.saleTime)}"`
    ].join(','))
  ].join('\n');
  
  downloadCSV(csvContent, `销售数据_${formatDateForFilename(new Date())}.csv`);
};

// 导出库存调整记录为CSV
export const exportStockAdjustmentsToCSV = () => {
  const adjustments = JSON.parse(localStorage.getItem('stockAdjustments') || '[]');
  
  if (adjustments.length === 0) {
    return '没有库存调整记录可导出';
  }
  
  const headers = [
    '调整ID',
    '商品名称',
    '调整前库存',
    '调整后库存',
    '调整类型',
    '调整数量',
    '调整原因',
    '备注',
    '调整时间'
  ];
  
  const csvContent = [
    headers.join(','),
    ...adjustments.map((adjustment: any) => [
      adjustment.id,
      `"${adjustment.productName}"`,
      adjustment.oldStock,
      adjustment.newStock,
      `"${getAdjustmentTypeText(adjustment.type)}"`,
      adjustment.quantity,
      `"${getAdjustmentReasonText(adjustment.reason)}"`,
      `"${adjustment.remark || ''}"`,
      `"${formatDate(adjustment.adjustTime)}"`
    ].join(','))
  ].join('\n');
  
  downloadCSV(csvContent, `库存调整记录_${formatDateForFilename(new Date())}.csv`);
};

// 下载CSV文件
const downloadCSV = (content: string, filename: string) => {
  const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// 获取分类文本
const getCategoryText = (category: string) => {
  const textMap: Record<string, string> = {
    top: '上衣',
    pants: '裤子',
    dress: '裙子',
    outerwear: '外套',
    underwear: '内衣',
    accessories: '配饰'
  };
  return textMap[category] || '未知';
};

// 获取调整类型文本
const getAdjustmentTypeText = (type: string) => {
  const textMap: Record<string, string> = {
    increase: '增加库存',
    decrease: '减少库存',
    set: '设置库存'
  };
  return textMap[type] || '未知';
};

// 获取调整原因文本
const getAdjustmentReasonText = (reason: string) => {
  const textMap: Record<string, string> = {
    purchase: '进货入库',
    return: '退货入库',
    inventory: '盘点调整',
    damage: '损耗报废',
    other: '其他原因'
  };
  return textMap[reason] || '未知';
};

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 格式化日期用于文件名
const formatDateForFilename = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).length === 1 ? `0${date.getMonth() + 1}` : String(date.getMonth() + 1);
  const day = String(date.getDate()).length === 1 ? `0${date.getDate()}` : String(date.getDate());
  const hour = String(date.getHours()).length === 1 ? `0${date.getHours()}` : String(date.getHours());
  const minute = String(date.getMinutes()).length === 1 ? `0${date.getMinutes()}` : String(date.getMinutes());
  
  return `${year}${month}${day}_${hour}${minute}`;
}; 