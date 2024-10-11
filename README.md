# Interview
=======
# 面试复盘网页应用

这是一个基于[Next.js](https://nextjs.org)的面试复盘网页应用，允许用户上传记录面试经过的音频文件，通过AI将录音文件转录成问答的文案展示给用户，并且能够通过AI对面试内容进行评价、总结。

## 功能特点

- 用户登录和注册
- 用户简历信息管理（教育背景、技能、项目经历、工作经历）
- 面试音频上传和转文本
- AI分析面试问题和答案
- 面试总结和评价
- 历史面试记录管理

## 开始使用

首先，运行开发服务器：

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
# 或
bun dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

## 项目结构

- `app/`: 包含所有页面和组件
- `components/`: 可重用的React组件
- `lib/`: 工具函数和API调用
- `styles/`: 全局样式和CSS模块
- `public/`: 静态资源

## 技术栈

- Next.js
- React
- TypeScript
- Tailwind CSS
- NextAuth.js (用于身份验证)
- Prisma (用于数据库操作)
- OpenAI API (用于AI分析)

## 了解更多

要了解更多关于Next.js的信息，请查看以下资源：

- [Next.js文档](https://nextjs.org/docs) - 了解Next.js的特性和API。
- [学习Next.js](https://nextjs.org/learn) - 一个交互式的Next.js教程。

## 部署

推荐使用[Vercel平台](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)部署您的Next.js应用。

查看[Next.js部署文档](https://nextjs.org/docs/app/building-your-application/deploying)了解更多详情。
>>>>>>> origin/master
