# 暖宠归家

流浪动物救助与领养平台，使用 HBuilder X / uni-app 开发。

## 当前阶段

已完成项目骨架、底部 Tab 页面、主要子页面占位、Tab 图标替换、前端本地数据联动流程、Node.js / Express / SQLite 后端骨架，并已将主要前端页面接入后端 API。

当前主要数据来自本地运行的后端服务：`http://localhost:3000`。登录状态会在前端本地保存用户 ID，用于后续接口请求。

## 已完成功能

- 4 个底部 Tab：领养首页、宠物圈、注意事项、个人中心
- 登录、注册、修改个人资料的本地模拟流程
- 发布宠物信息，并同步展示到领养首页
- 宠物详情页按宠物 ID 展示对应信息
- 宠物收藏、取消收藏、收藏页展示
- 领养申请提交、我的申请状态展示
- 收到申请、同意/拒绝审核流程
- 宠物圈动态发布、点赞、收藏、评论、删除自己的评论
- 我的点赞、我的收藏、消息通知等个人中心入口
- Node.js / Express 后端服务
- SQLite 数据库初始化与种子数据
- 用户、宠物、申请、收藏、宠物圈等 API 接口
- 前端页面接入后端 API：宠物列表、详情、发布、申请、审核、收藏、动态、评论等
- API 文档：`docs/api.md`

## 后端启动

在项目根目录运行：

```bash
npm.cmd run server
```

启动后访问：

```text
http://localhost:3000/api/health
```

## 前端运行顺序

1. 先启动后端：

```bash
npm.cmd run server
```

2. 再在 HBuilder X 中运行前端：

```text
运行 -> 运行到浏览器
```

如果前端提示“后端服务未连接”，请先确认 `http://localhost:3000/api/health` 可以正常打开。

## Tab 图标路径

底部导航图标放在 `static/tabbar/` 目录，文件名如下：

- `adopt.png`
- `adopt-active.png`
- `community.png`
- `community-active.png`
- `guide.png`
- `guide-active.png`
- `profile.png`
- `profile-active.png`

建议尺寸：81px * 81px，单张小于 40KB。

## 开发进度

- 2026-07-14：完成 uni-app 项目骨架、页面路由和底部 Tab 配置
- 2026-07-15：完成 Tab 图标替换和前端本地数据联动流程
- 2026-07-16：更新 README，补充项目进度和已完成功能说明
- 2026-07-16：完成 Express + SQLite 后端骨架和 API 文档
- 2026-07-16：将主要前端页面接入后端 API

## 下一步计划

- 继续完善页面样式、表单校验和异常提示
- 补充图片上传或图片占位优化
- 补充 API 文档、Prompt 日志、Code Review 报告和项目演示材料
