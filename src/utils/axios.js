import axios from 'axios';
export function makeRequest(method, url, params = {}, body = {}, config = {}) {
    const baseURL = process.env.API_URL;
    if (!baseURL) {
        return Promise.reject(new Error('API_URL environment variable is not defined!'));
    }
    // 获取请求超时时间环境变量，并确保转换为数字类型，这里进行了类型断言，也可以添加更严谨的类型判断逻辑
    const requestTimeout = parseInt(process.env.REQUEST_TIMEOUT || '5000', 10);
    return new Promise((resolve, reject) => {
        const source = axios.CancelToken.source();
        const timeoutId = setTimeout(() => {
            source.cancel('请求超时');
            reject(new Error('请求超时'));
        }, requestTimeout);
        // 根据不同请求方法来构建请求配置并发起请求
        switch (method.toLowerCase()) {
            case 'get':
                axios.get(`${baseURL}${url}`, {
                    params,
                    ...config,
                    cancelToken: source.token
                })
                    .then((response) => handleResponse(response, resolve, reject))
                    .catch((error) => handleError(error, timeoutId, reject));
                break;
            case 'post':
                axios.post(`${baseURL}${url}`, body, {
                    ...config,
                    cancelToken: source.token
                })
                    .then((response) => handleResponse(response, resolve, reject))
                    .catch((error) => handleError(error, timeoutId, reject));
                break;
            case 'put':
                axios.put(`${baseURL}${url}`, body, {
                    ...config,
                    cancelToken: source.token
                })
                    .then((response) => handleResponse(response, resolve, reject))
                    .catch((error) => handleError(error, timeoutId, reject));
                break;
            case 'delete':
                axios.delete(`${baseURL}${url}`, {
                    ...config,
                    cancelToken: source.token
                })
                    .then((response) => handleResponse(response, resolve, reject))
                    .catch((error) => handleError(error, timeoutId, reject));
                break;
            default:
                reject(new Error('不支持的请求方法'));
        }
    });
}
function handleResponse(response, resolve, reject) {
    if (response.status < 200 || response.status >= 300) {
        reject(new Error(`请求失败，状态码：${response.status}`));
    }
    resolve(response.data);
}
// 定义handleError函数，添加类型注解
function handleError(error, timeoutId, reject) {
    clearTimeout(timeoutId);
    if (axios.isCancel(error)) {
        reject(new Error('请求超时'));
    }
    else {
        console.error('请求出错：', error);
        reject(error);
    }
}
