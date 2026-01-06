# 友链检查器 (Friend Link Checker)

一个自动检查友链状态的工具，每天0点自动运行，提供网页界面查看友链状态。

## 功能

- 从 `https://santisify.top/links.json` 获取友链数据
- 每天0点自动检查所有友链状态
- 每小时更新一次数据以保持新鲜度
- 提供网页界面实时查看友链状态
- 显示响应时间、状态码等详细信息

## 技术栈

- TypeScript
- Node.js
- Express
- node-cron
- Axios

## 安装和运行

1. 安装依赖：
```bash
npm install
```

2. 编译 TypeScript：
```bash
npm run build
```

3. 启动服务器：
```bash
npm start
```

## 开发模式

在开发模式下运行（自动重启）：
```bash
npm run dev
```

## 项目结构

```
check-fcl/
├── index.ts          # 主程序文件
├── types.ts          # 类型定义
├── public/           # 静态文件
│   └── index.html    # 前端页面
├── package.json
└── tsconfig.json
```

## API 接口

- `GET /` - 主页面
- `GET /api/status` - 获取友链状态 JSON 数据

## 计划任务

- 每天 00:00（北京时间）运行一次完整检查
- 每小时运行一次更新以保持数据新鲜