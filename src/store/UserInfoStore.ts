import { defineStore } from 'pinia';
export const UserInfoStore = defineStore('UserInfoStore',  {
    state: () => ({
        username: '',
        age:18
    }),
    getters: {

    },
    actions: {
        changeAge() {
            this.age = this.state.age;
        }
    }
});