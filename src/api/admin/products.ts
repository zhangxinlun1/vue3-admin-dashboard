// 引入真实的axios请求
import axios from 'axios';
import {HttpMethods, IAxiosResponse, IProduct} from "./interface";

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:3333',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 获取商品列表
export const getProducts = async (): Promise<IAxiosResponse<IProduct[] | [] | string>> => {
  try {
    const response = await api.get('/product');
    return {
      status: response.status,
      data: response.data,
      message: '获取产品数据成功'
    };
  } catch (error) {
    console.error('获取产品数据出现错误:', error);
    const errorProducts: IProduct[] = [];
    return { status: 500, data: errorProducts, message: '获取产品数据失败' };
  }
};

// 根据ID获取单个商品
export const getProductById = async (productId: number): Promise<IAxiosResponse<IProduct>> => {
  try {
    const response = await api.get(`/product/${productId}`);
    return {
      status: response.status,
      data: response.data,
      message: '获取商品详情成功'
    };
  } catch (error) {
    console.error('获取商品详情失败:', error);
    throw error;
  }
};

// 添加商品
export const addProduct = async (product: IProduct): Promise<IAxiosResponse<any>> => {
  try {
    const response = await api.post('/product', product);
    return {
      status: response.status,
      data: response.data,
      message: '添加商品成功'
    };
  } catch (error) {
    console.error('添加商品失败:', error);
    throw error;
  }
};

// 更新商品
export const updateProduct = async (product: IProduct): Promise<IAxiosResponse<any>> => {
  try {
    const {id, ...updateData} = product;
    const response = await api.put(`/product/${id}`, updateData);
    return {
      status: response.status,
      data: response.data,
      message: '更新商品成功'
    };
  } catch (error) {
    console.error('更新商品失败:', error);
    throw error;
  }
};

// 删除商品
export const deleteProduct = async (productId: number): Promise<IAxiosResponse<any>> => {
  try {
    const response = await api.delete(`/product/${productId}`);
    return {
      status: response.status,
      data: response.data,
      message: '删除商品成功'
    };
  } catch (error) {
    console.error('删除商品失败:', error);
    throw error;
  }
};