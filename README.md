# 友链检查器 (Friend Link Checker)

一个使用Vite+Vue重构的自动检查友链状态的工具，每天0点自动运行，提供网页界面查看友链状态。

## 功能

- 从 `https://santisify.top/links.json` 获取友链数据
- 每天0点自动检查所有友链状态
- 每小时更新一次数据以保持新鲜度
- 提供Vue驱动的现代化网页界面实时查看友链状态
- 显示响应时间、状态码等详细信息

## 技术栈

- Vite 5
- Vue 3 (TypeScript)
- Node.js
- Express
- node-cron
- Axios

## 安装和运行

1. 安装依赖：
```bash
npm install
```

2. 开发模式运行（前端+后端）：
```bash
npm run dev-all
```

或者分别运行：
```bash
# 启动前端开发服务器
npm run dev

# 启动后端服务
npm run server
```

3. 构建生产版本：
```bash
npm run build
```

## 项目结构

```
check-fcl/
├── src/                 # Vue源代码
│   ├── components/      # Vue组件
│   ├── views/           # 页面视图
│   ├── services/        # API服务
│   ├── assets/          # 静态资源
│   ├── main.ts          # Vue应用入口
│   ├── App.vue          # 主组件
│   └── types.ts         # 类型定义
├── server/              # 服务端代码
│   └── index.ts         # Express服务器和定时任务
├── public/              # 静态资源
│   └── index.html       # HTML模板
├── vite.config.ts       # Vite配置
├── tsconfig.json        # TypeScript配置
├── package.json
└── README.md
```

## API 接口

- `GET /` - 主页面
- `GET /api/status` - 获取友链状态 JSON 数据

## 计划任务

- 每天 00:00（北京时间）运行一次完整检查
- 每小时运行一次更新以保持数据新鲜