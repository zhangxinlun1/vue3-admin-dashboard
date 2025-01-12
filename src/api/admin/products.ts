// 引入模拟的makeRequest函数
import {makeRequest} from "./mockRequest"
import {HttpMethods, IAxiosResponse, IProduct} from "./interface";
// 获取商品列表
// export const getProducts = (): Promise<IAxiosResponse<IProduct[]>> => {
// 	return makeRequest({
// 		method: HttpMethods.GET,
// 		url: '/api/admin/products'
// 	}).catch((error) => {
// 		console.error('获取产品数据出现错误:', error);
// 		// 可以根据具体需求，决定是抛出自定义的错误，还是返回一个特定的默认响应结构来表示错误情况
// 		return Promise.resolve({ status: 500, data: [], message: '获取产品数据失败' });
// 	});
// };
export const getProducts = async ():Promise<IAxiosResponse<IProduct[] | [] | string>>  => {
	return makeRequest({
		method: HttpMethods.GET,
		url: '/api/admin/products'
	}).catch((error) => {
		console.error('获取产品数据出现错误:', error);
		// 创建一个空的IProduct[]类型数据作为错误时的返回
		const errorProducts: IProduct[] = [];
		return Promise.resolve({ status: 500, data: errorProducts, message: '获取产品数据失败' });
	});
};
// 添加商品
export const addProduct = (product:IProduct) => {
	return makeRequest({
		method: HttpMethods.POST,
		url: '/api/admin/products',
		params: {},
		data: product
	});
};

// 更新商品
export const updateProduct = (product:IProduct) => {
	const {id, ...updateData} = product;
	return makeRequest({
		method: HttpMethods.POST,
		url: `/api/admin/products/${id}`,
		params: {},
		data: updateData
	});
};

// 删除商品
export const deleteProduct = (productId:IProduct) => {
	return makeRequest({
		method:HttpMethods.DELETE,
		url:`/api/admin/products/${productId}`
	});
};