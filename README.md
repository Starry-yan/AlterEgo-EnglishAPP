# Alter Ego - 英语口语实战 App

> 英语版的《模拟人生》——披着马甲的英语世界，允许犯错的乌托邦

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![Vite](https://img.shields.io/badge/Vite-5.1.0-646cff)

## 📖 项目介绍

Alter Ego 是一款结合心理学与 AI 技术的游戏化英语口语训练应用。通过"理想自我投射 + 场景化沉浸 + 思维矫正机制"三大核心创新，帮助用户突破"哑巴英语"与"中译英思维"双重障碍，实现从"不敢开口"到"流利表达"的完整蜕变。

### 核心特色

- **理想自我投射系统**：创建包容性虚拟角色，建立心理安全区，消除社交焦虑
- **沉浸式场景训练**：全英文虚拟世界（咖啡厅、机场、会议室等），通过语音交互触发场景剧情
- **思维矫正机制**：全英文界面，卡住时通过视觉高亮、语速放慢引导，而非中文提示
- **重述式隐性纠错**：虚拟角色不打断，用正确表达重述用户话语，潜移默化纠正错误
- **渐进式社交体系**：从 AI 陪练→虚拟形象联机→真人露脸，层层脱敏

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9 或 yarn >= 1.9

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

### 运行测试

```bash
# 开发模式（监听文件变化）
npm run test

# 一次性运行测试
npm run test:run

# 生成测试覆盖率报告
npm run test:coverage
```

### 代码检查

```bash
# ESLint 检查
npm run lint

# Prettier 格式化
npm run format
```

## 📁 项目结构

```
alter-ego/
├── .github/                    # GitHub 配置
│   ├── workflows/              # CI/CD 工作流
│   └── ISSUE_TEMPLATE/         # Issue 模板
├── .vscode/                    # VS Code 配置
├── docs/                       # 项目文档
│   ├── 01-product-concept.md   # 产品概念
│   ├── 02-mvp-specification.md # MVP 规格
│   ├── 03-market-analysis.md   # 市场分析
│   ├── 04-technical-architecture.md # 技术架构
│   └── 05-development-guide.md # 开发指南
├── public/                     # 静态资源
├── src/
│   ├── assets/                 # 静态资源
│   ├── components/             # React 组件
│   ├── config/                 # 配置文件
│   ├── hooks/                  # 自定义 Hooks
│   ├── pages/                  # 页面组件
│   ├── services/               # API 和服务
│   ├── utils/                  # 工具函数
│   ├── App.jsx                 # 根组件
│   ├── main.jsx                # 入口文件
│   └── index.css               # 全局样式
├── tests/                      # 测试文件
├── .eslintrc.cjs              # ESLint 配置
├── .prettierrc                # Prettier 配置
├── index.html                 # HTML 模板
├── package.json               # 项目依赖
├── postcss.config.js          # PostCSS 配置
├── tailwind.config.js         # Tailwind CSS 配置
├── vite.config.js             # Vite 配置
└── vitest.config.js           # Vitest 配置
```

## 🛠️ 技术栈

### 前端核心

- **React 18** - UI 框架
- **React Router 6** - 路由管理
- **Vite 5** - 构建工具

### 样式

- **Tailwind CSS 3** - 实用优先的 CSS 框架
- **PostCSS** - CSS 预处理

### 测试

- **Vitest** - 单元测试框架
- **Testing Library** - React 组件测试
- **jsdom** - DOM 模拟环境

### 代码质量

- **ESLint** - 代码 linting
- **Prettier** - 代码格式化

## 📝 开发指南

### 目录规范

- `components/` - 可复用的 UI 组件
- `pages/` - 页面级组件
- `hooks/` - 自定义 React Hooks
- `services/` - API 调用和外部服务
- `utils/` - 纯工具函数
- `config/` - 应用配置

### 提交规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 重构
- `test:` 测试相关
- `chore:` 构建/工具相关

示例：
```bash
git commit -m "feat: 添加咖啡厅场景对话功能"
git commit -m "fix: 修复语音识别在 Safari 上的兼容性问题"
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 📞 联系方式

- 项目问题：[GitHub Issues](https://github.com/your-username/alter-ego/issues)
- 邮箱：your-email@example.com

## 🙏 致谢

感谢以下开源项目：

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vitest](https://vitest.dev/)

---

Made with ❤️ by the Alter Ego Team