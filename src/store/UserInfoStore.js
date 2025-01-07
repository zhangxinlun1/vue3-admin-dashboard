"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInfoStore = void 0;
const pinia_1 = require("pinia");
exports.UserInfoStore = (0, pinia_1.defineStore)('UserInfoStore', {
    state: () => ({
        username: '',
        age: 18
    }),
    getters: {},
    actions: {
        changeAge() {
            this.age = this.state.age;
        }
    }
});
