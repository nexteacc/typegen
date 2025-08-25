# 项目总结：TypeGen

这是一个基于 Next.js 的现代化 Web 应用，旨在提供一个简洁、美观的文本输入界面。项目利用了最新的前端技术栈，实现了响应式布局和动态主题切换，为用户提供了流畅的输入体验。

## 技术栈

- **框架**: [Next.js](https://nextjs.org/) 15.2.0 (使用 Turbopack 进行开发)
- **UI 库**: [React](https://reactjs.org/) 19.0.0
- **样式**: [Tailwind CSS](https://tailwindcss.com/) 4.1.11
- **UI 组件**: 自定义组件，灵感来自 [shadcn/ui](https://ui.shadcn.com/)，并使用了 `clsx` 和 `tailwind-merge` 进行样式合并。
- **动画**: [Motion One](https://motion.dev/)，一个轻量级的动画库。
- **语言**: [TypeScript](https://www.typescriptlang.org/) 5
- **包管理器**: [pnpm](https://pnpm.io/)

## 配置文件

- **`package.json`**: 定义了项目依赖、脚本和 pnpm 的 overrides。
- **`next.config.ts`**: Next.js 的配置文件，目前为空，但可以用于未来的高级配置。
- **`tailwind.config.ts`**: Tailwind CSS 的配置文件，定义了内容扫描路径和主题扩展（如背景和前景颜色）。
- **`postcss.config.mjs`**: PostCSS 的配置文件，用于与 Tailwind CSS 集成。
- **`tsconfig.json`**: TypeScript 的配置文件，定义了编译选项和路径别名（如 `@/*`）。
- **`eslint.config.mjs`**: ESLint 的配置文件，用于代码规范和质量检查。

## 功能

- **动态主题**: 支持浅色和深色模式，通过 CSS 变量和 `prefers-color-scheme` 实现。
- **自适应文本输入框**: 一个类似 ChatGPT 的自适应高度文本输入框，当用户输入内容时，输入框会自动扩展高度。
- **居中的 Placeholder**: 输入框的 placeholder 文本在垂直和水平方向上居中显示，提升了视觉吸引力。
- **左对齐的输入文本**: 当用户开始输入时，文本会自动左对齐，以提供更自然的输入体验。

## 页面布局

- **`app/layout.tsx`**: 定义了应用的根布局，包括 `<html>` 和 `<body>` 标签。
- **`app/page.tsx`**: 应用的主页面，包含一个居中的输入区域。
- **`app/globals.css`**: 全局样式文件，定义了基础样式、主题变量和自定义 CSS 类。

### 布局结构

页面采用 Flexbox 布局，将内容垂直和水平居中。主要结构如下：

1.  一个 `div` 作为根容器，使用 `flex`、`flex-col`、`items-center` 和 `justify-center` 将内容居中。
2.  一个相对定位的 `div`（`w-[500px]`）作为输入区域的容器。
3.  一个带有虚线边框的 `div`（`custom-dash`），用于包裹输入框。
4.  一个自适应高度的 `textarea` 组件（`<Input>`），作为用户的输入区域。

### 样式亮点

- **`custom-dash`**: 一个带有虚线边框和圆角的样式，为输入区域增添了视觉趣味。
- **`center-placeholder-textarea`**: 一个自定义的 CSS 类，利用 `:placeholder-shown` 伪类实现了 placeholder 的居中显示，同时确保用户输入的文本左对齐。
- **动态背景**: `background-wrapper` 类（虽然在当前页面未使用）展示了如何使用背景图片和阴影来创建更丰富的视觉效果。

## API配置

### OpenAI API集成

本项目已集成真实的OpenAI API进行文本风格转换。要使用此功能，请按以下步骤配置：

1. **获取OpenAI API密钥**
   - 访问 [OpenAI Platform](https://platform.openai.com/account/api-keys)
   - 创建新的API密钥

2. **配置环境变量**
   ```bash
   cp .env.example .env.local
   ```
   
   编辑 `.env.local` 文件，设置你的API密钥：
   ```bash
   OPENAI_API_KEY=sk-proj-your_api_key_here
   ```

3. **可选配置**
   - `OPENAI_MODEL`: 使用的GPT模型 (默认: gpt-4o-mini)
   - `OPENAI_MAX_TOKENS`: 最大token数 (默认: 2000)
   - `OPENAI_TEMPERATURE`: 创造性参数 (默认: 0.7)
   - `API_TIMEOUT`: API超时时间 (默认: 30秒)
   - `API_MAX_RETRIES`: 最大重试次数 (默认: 3)

### 支持的风格转换

- **AP Style**: 美联社新闻风格
- **X Style**: 社交媒体风格
- **Inverted Pyramid**: 倒金字塔新闻结构
- **Breaking News**: 突发新闻风格
- **Academic**: 学术论文风格

## 未来可扩展方向

- **功能增强**: 可以增加文本格式化、实时协作等功能。
- **更多风格**: 添加更多专业写作风格（商业邮件、创意写作、技术文档等）。
- **状态管理**: 对于更复杂的应用，可以引入状态管理库，如 Zustand 或 Redux Toolkit。
- **路由**: 可以添加更多的页面和路由，以构建一个功能更完整的应用。
