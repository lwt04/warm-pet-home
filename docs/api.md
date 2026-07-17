# API 文档

后端基础地址：

```text
http://localhost:3000
```

需要登录身份的接口，请在请求头中传入：

```text
x-user-id: 用户 id
```

登录接口会返回 `token`，本项目为了便于课程实训演示，直接使用用户 id 作为本地 token。

## 测试账号

```text
普通用户：13800000000 / 123456
志愿者：13900000000 / 123456
```

## 健康检查

| 方法 | 地址 | 说明 |
|---|---|---|
| GET | `/api/health` | 检查后端服务是否启动 |

## 用户接口

| 方法 | 地址 | 说明 |
|---|---|---|
| POST | `/api/auth/register` | 注册账号 |
| POST | `/api/auth/login` | 登录账号 |
| GET | `/api/users/me` | 获取当前用户资料 |
| PUT | `/api/users/me` | 修改当前用户资料 |

登录参数：

```json
{
  "phone": "13800000000",
  "password": "123456"
}
```

修改资料可包含头像字段：

```json
{
  "nickname": "暖宠用户",
  "avatar": "头像本地路径或图片地址",
  "city": "广州",
  "phone": "13800000000",
  "experience": "有基础养宠经验",
  "bio": "喜欢小动物。"
}
```

## 宠物领养接口

| 方法 | 地址 | 说明 |
|---|---|---|
| GET | `/api/pets` | 获取宠物列表，支持 `keyword`、`type` 查询 |
| GET | `/api/pets/:id` | 获取宠物详情，未登录也可查看 |
| POST | `/api/pets` | 发布宠物救助信息 |
| GET | `/api/pets/mine/list` | 获取我的发布 |
| PUT | `/api/pets/:id/status` | 修改宠物状态 |
| DELETE | `/api/pets/:id` | 删除自己发布的宠物 |

发布宠物参数：

```json
{
  "name": "小橘",
  "type": "猫咪",
  "age": "约 8 个月",
  "gender": "男孩",
  "city": "广州",
  "status": "待领养",
  "note": "亲人，会蹭手",
  "health": "已驱虫，精神状态良好",
  "location": "广州市天河区救助点",
  "desc": "性格亲人，适合有耐心的家庭领养。",
  "images": [
    "图片本地路径或图片地址"
  ]
}
```

发布要求：宠物基础信息必须填写完整，且至少上传 1 张图片。

## 领养申请接口

| 方法 | 地址 | 说明 |
|---|---|---|
| POST | `/api/applications` | 提交领养申请 |
| GET | `/api/applications/mine` | 查看我的申请 |
| GET | `/api/applications/received` | 查看收到的申请 |
| PUT | `/api/applications/:id/review` | 审核申请，同意或拒绝 |

提交申请参数：

```json
{
  "petId": "p_1001",
  "home": "和家人同住",
  "experience": "有养猫经验",
  "contact": "13800000000",
  "reason": "希望长期照顾它。"
}
```

申请限制：

- 不能申请自己发布的宠物
- 不能申请状态为“已领养”的宠物
- 同一个用户不能重复提交审核中的申请

审核申请参数：

```json
{
  "status": "已通过"
}
```

状态也可以传 `"已拒绝"`。审核通过后，宠物状态会自动更新为“已领养”。

## 收藏接口

| 方法 | 地址 | 说明 |
|---|---|---|
| POST | `/api/favorites/pets/:id` | 收藏宠物 |
| DELETE | `/api/favorites/pets/:id` | 取消收藏宠物 |
| GET | `/api/favorites` | 获取我的收藏，包含宠物和动态 |

## 宠物圈接口

| 方法 | 地址 | 说明 |
|---|---|---|
| GET | `/api/posts` | 获取宠物圈动态列表，未登录也可查看 |
| GET | `/api/posts/:id` | 获取动态详情，未登录也可查看 |
| GET | `/api/posts/mine/list` | 获取我发布的动态 |
| POST | `/api/posts` | 发布动态 |
| DELETE | `/api/posts/:id` | 删除自己发布的动态 |
| POST | `/api/posts/:id/like` | 点赞或取消点赞 |
| POST | `/api/posts/:id/favorite` | 收藏或取消收藏动态 |
| POST | `/api/posts/:id/comments` | 发布评论 |
| DELETE | `/api/posts/:postId/comments/:commentId` | 删除自己的评论 |

发布动态参数：

```json
{
  "content": "今天救助的小猫状态稳定，正在寻找领养人。",
  "images": [
    "图片本地路径或图片地址"
  ]
}
```

发布要求：动态内容不能为空，且至少上传 1 张图片。

发布评论参数：

```json
{
  "content": "希望它早点遇到家。"
}
```
