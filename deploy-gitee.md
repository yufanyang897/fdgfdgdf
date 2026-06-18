# 部署到 Gitee Pages（国内免费，HTTPS，语音识别可用）

## 前提

- 电脑上已安装 Git：[下载地址](https://git-scm.com/download/win)
- 注册 Gitee 账号：[https://gitee.com](https://gitee.com)（需手机号实名）

---

## 第一步：创建仓库

1. 登录 Gitee → 右上角 **+** → **新建仓库**
2. 仓库名称：`teleprompter`
3. 选择 **公开**
4. **不要**勾选「使用 Readme 文件初始化」
5. 点 **创建**

---

## 第二步：上传代码

创建后，页面上会显示你的仓库地址，类似 `https://gitee.com/你的用户名/teleprompter`

在命令行中执行：

```bash
cd e:/题词器

# 初始化并推送
git init
git add .
git commit -m "智能提词器 v1"
git remote add origin https://gitee.com/你的用户名/teleprompter.git
git branch -M master
git push -u origin master
```

> 推送时会弹出 Gitee 登录窗口，输入账号密码即可。

---

## 第三步：开启 Pages 服务

1. 在仓库页面，点顶部 **服务** → **Gitee Pages**
2. 部署分支选 `master`，目录留空
3. 点 **启动**
4. 等待审核（首次通常 2-12 小时，之后更新是实时的）

审核通过后，页面会显示访问地址：

```
https://你的用户名.gitee.io/teleprompter
```

---

## 第四步：iPhone 安装到主屏幕

1. **Safari** 打开上面的地址
2. 底部 **分享按钮** → **添加到主屏幕**
3. 命名「提词器」→ 添加

---

## 以后更新代码

```bash
cd e:/题词器
git add .
git commit -m "更新内容"
git push
```

然后在 Gitee Pages 页面点 **更新** 按钮，等 1 分钟生效。

---

## 两个都配好之后

| 场景 | 用哪个 |
|------|--------|
| 正常使用（语音识别 + 全功能）| Gitee Pages 桌面图标 |
| 调试修改中想看效果 | 双击 `start.bat`（局域网） |
| 没有网络 | 局域网（HTTP，手动滚动） |
