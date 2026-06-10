#!/bin/bash
# 抚心合香 H5 — 一键部署脚本
# 在宝塔面板的终端中运行

set -e

echo "=== 抚心合香 H5 部署 ==="

# 1. 创建网站目录
mkdir -p /www/wwwroot/fuxin-hexiang

# 2. 创建 Node.js API 代理目录
mkdir -p /www/wwwroot/fuxin-hexiang/api

# 3. 安装 PM2（Node 进程管理）
if ! command -v pm2 &> /dev/null; then
    echo "安装 PM2..."
    npm install -g pm2
fi

# 4. 写入环境变量
export DEEPSEEK_API_KEY="sk-UlmK35ylSzzEq4rQ_rm6Og"
export PROXY_PORT=3001

# 5. 用 PM2 启动 API 代理
cd /www/wwwroot/fuxin-hexiang/api
pm2 delete fuxin-proxy 2>/dev/null || true
pm2 start server.js --name fuxin-proxy
pm2 save

echo "=== 部署完成 ==="
echo "静态文件目录: /www/wwwroot/fuxin-hexiang"
echo "API 代理运行在: 127.0.0.1:3001"
echo ""
echo "下一步: 在宝塔面板中创建网站，设置根目录为 /www/wwwroot/fuxin-hexiang"
