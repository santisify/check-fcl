# 友链检查器 (Friend Link Checker)

一个使用Vite+Vue重构的自动检查友链状态的工具，部署在Vercel上，提供网页界面查看友链状态。

## 功能

- 从 `https://santisify.top/links.json` 获取友链数据
- 按需检查友链状态（每小时自动刷新一次）
- 提供Vue驱动的现代化网页界面实时查看友链状态
- 显示响应时间、状态码等详细信息

## 技术栈

- Vite 5
- Vue 3 (TypeScript)
- Vercel Serverless Functions
- Axios

## 部署到Vercel

1. 安装Vercel CLI：
```bash
npm install -g vercel
```

2. 部署到Vercel：
```bash
vercel --prod
```

或者直接连接到您的GitHub仓库，在Vercel dashboard中进行部署。

## 本地开发

1. 安装依赖：
```bash
npm install
```

2. 开发模式运行：
```bash
npm run dev
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
├── api/                 # Vercel Serverless Functions
│   └── functions/       # API端点
│       └── status.ts    # 友链状态API
├── public/              # 静态资源
│   └── index.html       # HTML模板
├── vite.config.ts       # Vite配置
├── vercel.json          # Vercel配置
├── tsconfig.json        # TypeScript配置
├── package.json
└── README.md
```

## API 接口

- `GET /api/status` - 获取友链状态 JSON 数据

## 工作方式

由于Serverless环境的限制，定时任务改为按需检查：
- 当API被调用时，如果距离上次检查超过1小时，则自动刷新数据
- 否则返回缓存的数据以提高响应速度