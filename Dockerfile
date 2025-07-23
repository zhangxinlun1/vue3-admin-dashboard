FROM node:18-alpine AS build

# 设置工作目录
WORKDIR /app

# 复制依赖配置
COPY package.json yarn.lock ./

# 安装依赖
RUN yarn install --registry=https://registry.npmjs.org

# 复制所有代码
COPY . .

# 构建前端
RUN yarn build

# 生产阶段（Nginx 部署）
FROM nginx:1.23-alpine

# 复制构建产物到 Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# 暴露 80 端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]