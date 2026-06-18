@echo off
chcp 65001 >nul

cd /d "%~dp0"

echo.
echo ═══════════════════════════════════════
echo    📺 智能提词器 — HTTPS 局域网模式
echo    （语音识别可用 🎤）
echo ═══════════════════════════════════════
echo.
echo    首次运行会生成 SSL 证书，稍等几秒…
echo.

node server.js

pause
