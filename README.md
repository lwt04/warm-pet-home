# 暖宠归家

流浪动物救助与领养平台，使用 HBuilder X / uni-app 开发。

## 当前阶段

已完成项目骨架、底部 Tab 页面、主要子页面占位、Tab 图标替换，以及前端本地数据联动流程。

当前数据暂时使用 `uni.setStorageSync` / `uni.getStorageSync` 保存在本地，后续会替换为 Node.js/Express 后端接口和数据库。

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

## 下一步计划

- 继续完善页面样式和异常提示
- 搭建 Node.js / Express 后端
- 设计 SQLite 数据库表
- 将本地缓存数据替换为后端 API 请求
- 补充 API 文档、Prompt 日志、Code Review 报告和项目演示材料
