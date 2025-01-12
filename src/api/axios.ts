import axios from 'axios';

// 创建axios实例
const instance = axios.create({
    baseURL: '/', // 这里可以根据实际情况设置基础的请求URL，比如如果后端接口都以/api开头，可以设置为'/api'
    timeout: 5000 // 设置请求超时时间，单位是毫秒，可根据实际情况调整
});

// 请求拦截器
instance.interceptors.request.use((config) => {
    console.log('全局请求拦截 - 即将发起请求，配置信息如下：');
    console.log('请求URL：', config.url);
    console.log('请求方法：', config.method);
    console.log('请求头：', config.headers);
    console.log('请求数据：', config.data);
    return config;
}, (error) => {
    console.log('全局请求拦截 - 请求出现错误：', error);
    return Promise.reject(error);
});

// 响应拦截器
instance.interceptors.response.use((response) => {
    console.log('全局响应拦截 - 收到响应，响应信息如下：');
    console.log('响应状态码：', response.status);
    console.log('响应数据：', response.data);
    return response;
}, (error) => {
    console.log('全局响应拦截 - 响应出现错误：', error);
    return Promise.reject(error);
});

export default instance;