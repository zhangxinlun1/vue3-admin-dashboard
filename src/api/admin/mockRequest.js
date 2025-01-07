"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeUserRequest = exports.requestHandlers = exports.makeRequest = void 0;
// export const makeRequest = (object:IAxiosRequestOptions):Promise<IAxiosResponse<IProduct[] | [] | string>> => {
//     if (object.url === '/api/admin/products') {
//         switch (object.method) {
//             case 'GET':
//                 const mockProducts:IProduct[] = [
//                     {
//                         id: 1,
//                         name: '时尚白色T恤',
//                         description: '纯棉材质，简约百搭，夏季必备单品。',
//                         price: 29.99,
//                         category: 'T-shirt',
//                         stock: 50,
//                     },
//                     {
//                         id: 2,
//                         name: '复古蓝色牛仔裤',
//                         description: '经典牛仔布料，复古版型，修饰腿型。',
//                         price: 79.99,
//                         category: 'Jeans',
//                         stock: 30,
//                     },
//                     {
//                         id: 3,
//                         name: '优雅黑色连衣裙',
//                         description: '蕾丝与内衬结合，尽显优雅气质，适合多种场合。',
//                         price: 129.99,
//                         category: 'Dress',
//                         stock: 20,
//                     },
//                 ];
//                 return Promise.resolve({ data: mockProducts,status:200 });
//             case 'POST':
//                 return Promise.resolve({ status: 201,data:[] });
//             case 'PUT':
//                 return Promise.resolve({ status: 200,data:[] });
//             case 'DELETE':
//                 return Promise.resolve({ status: 204,data:[] });
//             default:
//                 return Promise.reject(new Error('不支持的请求方法'));
//         }
//     }
//
//     // 如果是其他路径（比如这里假设的 /api/user 等其他情况，可按需扩展更多路径模拟）
//     if (object.url === '/api/user') {
//         switch (object.method) {
//             case 'POST':
//                 // 这里简单模拟用户注册成功返回，可根据实际业务细化返回数据
//                 return Promise.resolve({ status: 201,data:[], message: '用户注册成功' });
//             default:
//                 return Promise.reject(new Error('不支持的请求方法'));
//         }
//     }
//
//     return Promise.reject(new Error('未匹配到对应的模拟API路径'));
// };
const makeRequest = (object) => {
    const pathHandlers = exports.requestHandlers[object.url];
    if (pathHandlers) {
        const methodHandler = pathHandlers[object.method];
        if (methodHandler) {
            return methodHandler();
        }
    }
    return Promise.reject(new Error('未匹配到对应的模拟API路径'));
};
exports.makeRequest = makeRequest;
exports.requestHandlers = {
    '/api/admin/products': {
        'GET': () => {
            const mockProducts = [
            // 产品数据定义不变
            ];
            return Promise.resolve({ status: 200, data: mockProducts });
        },
        'POST': () => Promise.resolve({ status: 201, data: [] }),
        'PUT': () => Promise.resolve({ status: 200, data: [] }),
        'DELETE': () => Promise.resolve({ status: 204, data: [] })
    },
    '/api/user': {
        'POST': () => Promise.resolve({ status: 201, data: '用户注册成功', message: '用户注册成功' })
    }
};
const makeUserRequest = (object) => {
    if (object.url === '/api/users/user-list') {
        switch (object.method) {
            case 'GET':
                const mockUsers = [
                    {
                        userId: 1,
                        userName: 'user001',
                        password: 'encryptedPassword',
                        realName: '张三',
                        gender: '男',
                        birthDate: '1990-01-01',
                        email: 'zhangsan@example.com',
                        phoneNumber: '13800138000',
                        registerTime: '2023-05-10 10:00:00',
                        lastLoginTime: '2023-07-20 15:00:00',
                        userStatus: '正常'
                    },
                ];
                return Promise.resolve({ data: mockUsers });
            case 'POST':
                return Promise.resolve({ status: 201 });
            case 'PUT':
                return Promise.resolve({ status: 200 });
            case 'DELETE':
                return Promise.resolve({ status: 204 });
            default:
                return Promise.reject(new Error('不支持的请求方法'));
        }
    }
    // 如果是其他路径（比如这里假设的 /api/user 等其他情况，可按需扩展更多路径模拟）
    if (object.url === '/api/user') {
        switch (object.method) {
            case 'POST':
                // 这里简单模拟用户注册成功返回，可根据实际业务细化返回数据
                return Promise.resolve({ status: 201, message: '用户注册成功' });
            default:
                return Promise.reject(new Error('不支持的请求方法'));
        }
    }
    return Promise.reject(new Error('未匹配到对应的模拟API路径'));
};
exports.makeUserRequest = makeUserRequest;
