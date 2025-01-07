"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUsers = exports.updateUsers = exports.addUsers = exports.getUsers = void 0;
const tslib_1 = require("tslib");
// 引入模拟的makeUserRequest函数
const mockRequest_1 = require("./admin/mockRequest");
const interface_1 = require("@api/admin/interface");
// 获取用户列表
const getUsers = () => {
    return (0, mockRequest_1.makeUserRequest)({
        method: interface_1.HttpMethods.GET,
        url: '/api/users/user-list'
    });
};
exports.getUsers = getUsers;
// 添加用户
const addUsers = (users) => {
    return (0, mockRequest_1.makeUserRequest)({
        method: interface_1.HttpMethods.POST,
        url: '/api/users/user-list',
        params: {},
        data: users
    });
};
exports.addUsers = addUsers;
// 更新用户
const updateUsers = (users) => {
    const { id } = users, updateData = tslib_1.__rest(users, ["id"]);
    return (0, mockRequest_1.makeUserRequest)({
        method: interface_1.HttpMethods.PUT,
        url: `/api/users/user-list/${id}`,
        params: {},
        data: updateData
    });
};
exports.updateUsers = updateUsers;
// 删除用户
const deleteUsers = (usersId) => {
    return (0, mockRequest_1.makeUserRequest)({
        method: interface_1.HttpMethods.DELETE,
        url: `/api/admin/user-list/${usersId}`
    });
};
exports.deleteUsers = deleteUsers;
