# API 文档

后端基础地址：

```text
http://localhost:3000
```

需要用户身份的接口，请在请求头中传：

```text
x-user-id: u_demo
```

测试账号：

```text
手机号：13800000000
密码：123456
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

注册参数：

```json
{
  "nickname": "暖宠用户",
  "phone": "13800000000",
  "password": "123456"
}
```

登录参数：

```json
{
  "phone": "13800000000",
  "password": "123456"
}
```

## 宠物领养接口

| 方法 | 地址 | 说明 |
|---|---|---|
| GET | `/api/pets` | 获取宠物列表，支持 `keyword`、`type` 查询 |
| GET | `/api/pets/:id` | 获取宠物详情 |
| POST | `/api/pets` | 发布宠物救助信息 |
| GET | `/api/pets/mine/list` | 获取我的发布 |
| PUT | `/api/pets/:id/status` | 修改宠物状态 |

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
  "health": "已驱虫",
  "location": "广州市天河区救助点",
  "desc": "性格亲人，适合有耐心的家庭。"
}
```

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

审核申请参数：

```json
{
  "status": "已通过"
}
```

## 收藏接口

| 方法 | 地址 | 说明 |
|---|---|---|
| POST | `/api/favorites/pets/:id` | 收藏宠物 |
| DELETE | `/api/favorites/pets/:id` | 取消收藏宠物 |
| GET | `/api/favorites` | 获取我的收藏，包含宠物和动态 |

## 宠物圈接口

| 方法 | 地址 | 说明 |
|---|---|---|
| GET | `/api/posts` | 获取宠物圈动态列表 |
| GET | `/api/posts/:id` | 获取动态详情 |
| POST | `/api/posts` | 发布动态 |
| POST | `/api/posts/:id/like` | 点赞或取消点赞 |
| POST | `/api/posts/:id/favorite` | 收藏或取消收藏动态 |
| POST | `/api/posts/:id/comments` | 发布评论 |
| DELETE | `/api/posts/:postId/comments/:commentId` | 删除自己的评论 |

发布动态参数：

```json
{
  "content": "今天救助的小猫状态稳定，正在寻找领养人。"
}
```

发布评论参数：

```json
{
  "content": "希望它早点遇到家。"
}
```
