export interface IUser{
	id: number;
	userName: string;
	password: string;
	realName: string;
	gender: string;
	birthDate: string;
	email: string;
	phoneNumber: string;
	registerTime: string;
	lastLoginTime: string;
	userStatus: string;
}
export enum HttpMethods {
	GET = 'GET',
	POST = 'POST',
	DELETE = 'DELETE',
	PUT = 'PUT',
	PATCH = 'PATCH'
}
export interface IAxiosResponse<T> {
	status: number;
	data: T;
	message?: string; // 对于像用户注册成功等情况有消息提示时可以使用
}
export interface IProduct {
	id: number;
	name: string;
	description: string;
	price: number;
	category: string;
	stock: number;
	img:string;
}
export interface IAxiosRequestOptions {
	method: HttpMethods;
	url: string;
	data?: any; // 请求体数据，类型可根据实际情况细化，比如对于 POST 请求可能是个对象等
	params?: any; // 查询参数，同样类型可按需细化
}
