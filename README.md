# 🎭 Alter Ego - 英语口语实战 App

> 英语版的《模拟人生》——披着马甲的英语世界，允许犯错的乌托邦

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MVP](https://img.shields.io/badge/Status-MVP-green.svg)](https://github.com/Starry-yan/Alter-Ego)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-orange.svg)](https://vitejs.dev)

## 📖 项目介绍

Alter Ego（第二自我）是一款结合心理学与 AI 技术的游戏化英语口语训练应用。通过"理想自我投射 + 场景化沉浸 + 思维矫正机制"三大核心创新，帮助用户突破"哑巴英语"与"中译英思维"双重障碍，实现从"不敢开口"到"流利表达"的完整蜕变。

### 核心特性

| 特性 | 描述 |
|------|------|
| 🎭 **理想自我投射** | 创建包容性虚拟角色，采用"重述法"隐性纠错，建立心理安全区 |
| 🌍 **沉浸式场景** | 全英文虚拟场景（咖啡厅、机场等），通过语音交互触发剧情 |
| 💡 **思维矫正** | 全英文界面，卡住时通过视觉高亮、语速放慢引导，而非中文提示 |
| 📈 **渐进式成长** | 从 AI 陪练→虚拟形象联机→真人露脸，层层脱敏 |

### 产品定位

```
第一阶段（AI）：练胆、建立自信（我是谁）
第二阶段（虚拟形象 + 真人）：实战、去敏感化（我是安全的）
第三阶段（真人）：融合、完全体（我就是我）
```

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm 或 yarn 或 pnpm

### 安装

```bash
# 克隆项目
git clone https://github.com/Starry-yan/Alter-Ego.git

# 进入项目目录
cd alter-ego

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 构建生产版本

```bash
npm run build
```

---

## 📁 项目结构

```
AlterEgo-English-App/
├── .github/                      # GitHub 配置
│   ├── ISSUE_TEMPLATE/           # Issue 模板
│   └── workflows/                # CI/CD 工作流
├── docs/                         # 产品文档
│   ├── 01-product-concept.md     # 产品概念
│   ├── 02-mvp-specification.md   # MVP 规格说明书
│   ├── 03-product-evaluation.md  # 产品评估报告
│   ├── 04-technical-architecture.md
│   └── 05-api-documentation.md
├── flows/                        # AI 工作流配置
├── assets/                       # 资源文件
├── src/                          # 源代码
│   ├── components/               # React 组件
│   ├── hooks/                    # 自定义 Hooks
│   ├── services/                 # API 服务
│   ├── utils/                    # 工具函数
│   └── pages/                    # 页面组件
├── scripts/                      # 自动化脚本
├── tests/                        # 测试用例
├── README.md                     # 项目说明
├── CHANGELOG.md                  # 版本记录
├── package.json                  # 项目依赖
└── vite.config.js               # Vite 配置
```

---

## 🛠️ 技术栈

### 前端
- **React 18** - UI 框架
- **Vite** - 构建工具
- **Tailwind CSS** - 样式方案
- **Web Speech API** - 语音识别与合成（免费）

### AI 服务
- **Google Gemini API** - 免费 AI 对话（MVP 阶段）
- **Dify Workflow** - 自定义 AI 工作流（未来扩展）

### 数据存储
- **localStorage** - MVP 阶段本地存储
- **Supabase** - 未来云端存储

### 部署
- **Vercel** - 免费静态网站托管

---

## 📋 开发指南

### Git 工作流

本项目采用 **GitHub Flow**：

```
main (生产环境)
  │
  ├── develop (开发分支)
  │     │
  │     ├── feature/speech-recognition    # 语音识别功能
  │     ├── feature/ai-dialogue           # AI 对话功能
  │     └── feature/avatar-system         # 虚拟形象系统
  │
  └── hotfix/urgent-fix                   # 紧急修复
```

### 提交规范

```
feat:     新增功能
fix:      修复 bug
docs:     文档更新
style:    代码格式调整
refactor: 代码重构
test:     测试相关
chore:    构建/工具相关
```

示例：
```bash
git commit -m "feat: 实现语音识别功能"
git commit -m "docs: 更新 API 文档"
```

---

## 🗺️ 开发路线图

### MVP (v0.1.0) - 当前阶段
- [x] 项目架构搭建
- [ ] 角色创建（3 种预设形象）
- [ ] 咖啡厅场景对话
- [ ] 语音输入 + 语音输出
- [ ] 重述法纠错
- [ ] 基础视觉提示
- [ ] 对话历史记录
- [ ] 简单进度追踪

### v0.2.0 - 功能扩展
- [ ] 更多场景解锁（办公室、机场）
- [ ] 自定义形象上传
- [ ] 学习数据分析
- [ ] 成就系统

### v1.0.0 - 正式发布
- [ ] 多人联机匹配
- [ ] 真人语音通话
- [ ] 付费订阅系统
- [ ] 移动端适配

---

## 📄 文档

详细文档请参考：

- [产品概念](./docs/01-product-concept.md)
- [MVP 规格说明书](./docs/02-mvp-specification.md)
- [产品评估报告](./docs/03-product-evaluation.md)
- [技术架构](./docs/04-technical-architecture.md)
- [API 文档](./docs/05-api-documentation.md)

---

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📝 许可证

本项目采用 MIT 开源协议。详见 [LICENSE](LICENSE) 文件。

---

## 🙏 致谢

感谢以下开源项目的支持：

- [React](https://react.dev) - UI 框架
- [Vite](https://vitejs.dev) - 构建工具
- [Tailwind CSS](https://tailwindcss.com) - 样式框架
- [Google Gemini](https://aistudio.google.com) - AI 模型
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) - 语音服务

---

## 📧 联系方式

- 项目问题：[GitHub Issues](https://github.com/Starry-yan/Alter-Ego/issues)
- 邮箱：your-email@example.com

---

<div align="center">

**让英语成为探索世界的钥匙，而不是试卷上的分数** 🗝️

⭐ 如果这个项目对你有帮助，请给一个 Star！

</div>