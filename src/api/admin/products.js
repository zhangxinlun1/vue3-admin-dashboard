"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.addProduct = exports.getProducts = void 0;
const tslib_1 = require("tslib");
// 引入模拟的makeRequest函数
const mockRequest_1 = require("./mockRequest");
const interface_1 = require("@api/admin/interface");
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
const getProducts = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return (0, mockRequest_1.makeRequest)({
        method: interface_1.HttpMethods.GET,
        url: '/api/admin/products'
    }).catch((error) => {
        console.error('获取产品数据出现错误:', error);
        // 创建一个空的IProduct[]类型数据作为错误时的返回
        const errorProducts = [];
        return Promise.resolve({ status: 500, data: errorProducts, message: '获取产品数据失败' });
    });
});
exports.getProducts = getProducts;
// 添加商品
const addProduct = (product) => {
    return (0, mockRequest_1.makeRequest)({
        method: interface_1.HttpMethods.POST,
        url: '/api/admin/products',
        params: {},
        data: product
    });
};
exports.addProduct = addProduct;
// 更新商品
const updateProduct = (product) => {
    const { id } = product, updateData = tslib_1.__rest(product, ["id"]);
    return (0, mockRequest_1.makeRequest)({
        method: interface_1.HttpMethods.POST,
        url: `/api/admin/products/${id}`,
        params: {},
        data: updateData
    });
};
exports.updateProduct = updateProduct;
// 删除商品
const deleteProduct = (productId) => {
    return (0, mockRequest_1.makeRequest)({
        method: interface_1.HttpMethods.DELETE,
        url: `/api/admin/products/${productId}`
    });
};
exports.deleteProduct = deleteProduct;
