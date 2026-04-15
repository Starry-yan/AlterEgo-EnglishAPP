# 开发指南

## 环境要求

- Node.js >= 18.x
- npm >= 9.x
- Git >= 2.x

## 项目结构

```
AlterEgo-EnglishAPP/
├── .github/                    # GitHub 配置
│   ├── workflows/              # CI/CD 工作流
│   ├── ISSUE_TEMPLATE/         # Issue 模板
│   └── PULL_REQUEST_TEMPLATE.md
├── docs/                       # 项目文档
│   ├── 01-product-concept.md   # 产品概念
│   ├── 02-mvp-specification.md # MVP 规格
│   ├── 03-product-evaluation.md # 产品评估
│   ├── 04-technical-architecture.md # 技术架构
│   └── 05-development-guide.md # 开发指南
├── src/                        # 源代码
│   ├── components/             # React 组件
│   ├── hooks/                  # 自定义 Hooks
│   ├── pages/                  # 页面组件
│   ├── services/               # 服务层
│   ├── utils/                  # 工具函数
│   ├── config/                 # 配置文件
│   ├── assets/                 # 静态资源
│   ├── App.jsx                 # 根组件
│   ├── main.jsx                # 入口文件
│   └── index.css               # 全局样式
├── tests/                      # 测试文件
├── flows/                      # 用户流程图
├── scripts/                    # 构建脚本
├── assets/                     # 项目资源
├── .eslintrc.cjs               # ESLint 配置
├── .prettierrc                 # Prettier 配置
├── index.html                  # HTML 模板
├── package.json                # 依赖配置
├── vite.config.js              # Vite 配置
├── tailwind.config.js          # Tailwind CSS 配置
└── README.md                   # 项目说明
```

## 开发流程

### 1. 环境设置

```bash
# 克隆项目
git clone https://github.com/Starry-yan/AlterEgo-EnglishAPP.git

# 进入项目目录
cd AlterEgo-EnglishAPP

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 2. 代码规范

#### ESLint 规则

项目使用 ESLint 进行代码质量检查。主要规则：

- 允许未使用变量（以 `_` 开头）
- 允许 `console.warn` 和 `console.error`
- React 组件必须使用 Hooks 语法
- 导出组件前必须命名

#### Prettier 规则

- 单引号
- 分号：是
- 缩进：2 空格
- 尾随逗号：es5
- 行宽：100

### 3. 分支策略

```
main          # 生产分支（受保护）
  │
  ├── develop # 开发分支
  │     │
  │     ├── feature/*    # 功能分支
  │     ├── bugfix/*     # 修复分支
  │     └── hotfix/*     # 热修复
  │
  └── release/* # 发布分支
```

#### 分支命名规范

- 功能分支：`feature/功能名称`
- 修复分支：`bugfix/问题描述`
- 热修复：`hotfix/紧急问题`
- 发布分支：`release/v1.0.0`

### 4. 提交规范

使用 Conventional Commits 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Type 类型

| 类型 | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档更新 |
| `style` | 代码格式（不影响功能） |
| `refactor` | 重构 |
| `perf` | 性能优化 |
| `test` | 测试相关 |
| `chore` | 构建/工具相关 |

#### 示例

```bash
# 新功能
git commit -m "feat(avatar): 添加虚拟形象创建功能"

# Bug 修复
git commit -m "fix(dialogue): 修复语音识别延迟问题"

# 文档更新
git commit -m "docs(readme): 更新安装说明"
```

### 5. 开发注意事项

#### API 配置

在 `src/config/api.js` 中配置 API 端点：

```javascript
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000
}
```

#### 环境变量

创建 `.env` 文件：

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_TITLE=Alter Ego
```

#### 组件开发

1. 在 `src/components` 创建组件
2. 使用函数式组件 + Hooks
3. 添加 PropTypes 类型检查
4. 编写单元测试

#### 页面开发

1. 在 `src/pages` 创建页面组件
2. 使用 React Router 路由
3. 添加页面级数据获取
4. 实现加载状态和错误处理

### 6. 测试

```bash
# 运行测试
npm run test

# 测试覆盖率
npm run test:coverage

# E2E 测试
npm run test:e2e
```

### 7. 构建和部署

```bash
# 生产构建
npm run build

# 预览构建结果
npm run preview

# 部署到 GitHub Pages
npm run deploy
```

## 常见问题

### Q: 如何添加新的 API 服务？

A: 在 `src/services` 目录创建新的服务文件，使用 `fetch` 或 `axios` 调用 API。

### Q: 如何添加新的路由？

A: 在 `src/router/index.jsx` 中添加路由配置。

### Q: 如何管理全局状态？

A: 使用 React Context API 或 Zustand 进行状态管理。

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

查看 [LICENSE](../LICENSE) 文件了解详情。