# 后端服务说明

本目录是“暖宠归家”的 Node.js / Express / SQLite 后端。

## 启动方式

在项目根目录运行：

```bash
npm.cmd run server
```

启动后访问：

```text
http://localhost:3000/api/health
```

## 测试账号

- 手机号：`13800000000`
- 密码：`123456`

接口默认会使用 `u_demo` 作为当前用户。前端正式接入时，可以在请求头中传：

```text
x-user-id: u_demo
```

或使用登录接口返回的 `token` 作为用户 ID。
