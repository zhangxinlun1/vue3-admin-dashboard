import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:3333',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 订单接口类型定义
export interface IOrderItem {
  productId: number;
  quantity: number;
  price: number;
  costPrice: number;
  totalPrice: number;
  profit: number;
}

export interface IOrder {
  id?: number;
  orderNumber: string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  totalAmount: number;
  profit: number;
  status: string;
  remark?: string;
  items: IOrderItem[];
  createTime?: string;
  updateTime?: string;
}

// 创建订单
export const createOrder = async (order: IOrder): Promise<any> => {
  try {
    const response = await api.post('/order', order);
    return {
      status: response.status,
      data: response.data,
      message: '创建订单成功'
    };
  } catch (error) {
    console.error('创建订单失败:', error);
    throw error;
  }
};

// 获取订单列表
export const getOrders = async (): Promise<any> => {
  try {
    const response = await api.get('/order');
    return {
      status: response.status,
      data: response.data,
      message: '获取订单列表成功'
    };
  } catch (error) {
    console.error('获取订单列表失败:', error);
    throw error;
  }
};

// 获取订单详情
export const getOrderById = async (id: number): Promise<any> => {
  try {
    const response = await api.get(`/order/${id}`);
    return {
      status: response.status,
      data: response.data,
      message: '获取订单详情成功'
    };
  } catch (error) {
    console.error('获取订单详情失败:', error);
    throw error;
  }
};

// 获取每日统计
export const getDailyStatistics = async (): Promise<any> => {
  try {
    const response = await api.get('/order/statistics/daily');
    return {
      status: response.status,
      data: response.data,
      message: '获取每日统计成功'
    };
  } catch (error) {
    console.error('获取每日统计失败:', error);
    throw error;
  }
}; 