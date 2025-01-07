// 引入模拟的makeUserRequest函数
import {makeUserRequest} from "./admin/mockRequest"
import {HttpMethods, IUser} from "@api/admin/interface";
// 获取用户列表
export const getUsers = () => {
	return makeUserRequest({
		method: HttpMethods.GET,
		url: '/api/users/user-list'
	});
};

// 添加用户
export const addUsers = (users: IUser) => {
	return makeUserRequest({
		method: HttpMethods.POST,
		url: '/api/users/user-list',
		params: {},
		data: users
	});
};

// 更新用户
export const updateUsers = (users: IUser) => {
	const {id, ...updateData} = users;
	return makeUserRequest({
		method: HttpMethods.PUT,
		url: `/api/users/user-list/${id}`,
		params: {},
		data: updateData
	});
};

// 删除用户
export const deleteUsers = (usersId: IUser) => {
	return makeUserRequest({
		method: HttpMethods.DELETE,
		url: `/api/admin/user-list/${usersId}`
	});
};