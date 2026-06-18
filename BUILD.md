# 📺 智能提词器 — 部署指南

## 方式一：Gitee Pages（国内推荐，全功能）

免费、HTTPS、语音识别可用、不需要科学上网。

👉 **详细步骤见：[deploy-gitee.md](deploy-gitee.md)**

---

## 方式二：局域网快速启动

双击 `start.bat`，iPhone 连同一 WiFi，Safari 访问显示的地址。

> ⚠️ 局域网是 HTTP，语音识别不可用，但手动匀速滚动完全正常

---

## 方式三：Capacitor 打包原生 APP

打包成 `.ipa`（iOS）或 `.apk`，可上架 App Store。

```bash
npm install

# iOS（需要 Mac + Xcode + Apple Developer）
npx cap add ios && npx cap open ios

# Android（需要 Android Studio）
npx cap add android && npx cap open android
```

Xcode 中需手动添加：`Privacy - Microphone Usage Description = "需要使用麦克风进行语音识别"`

---

## 语音识别兼容性

| 平台 | 浏览器 | 语音识别 |
|------|--------|----------|
| iOS 14.5+ | Safari | ✅ 支持 |
| iOS 14.5+ | Chrome | ⚠️ 部分支持 |
| Android | Chrome | ✅ 支持 |
| Android | 微信内置浏览器 | ❌ 不支持 |
| 桌面 | Chrome/Edge | ✅ 支持 |

> 微信内置浏览器不支持，请用 Safari 或 Chrome 打开。
