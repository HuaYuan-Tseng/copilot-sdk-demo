# 快速開始 - 網頁分析代理人

## 🚀 30 秒快速測試

```bash
# 1. 確認依賴已安裝
npm install

# 2. 執行測試
node webpage-analyzer-agent.js https://example.com
```

## ✅ 完整檢查清單

### 前置需求

- [ ] Node.js 18+ 已安裝
- [ ] GitHub Copilot CLI 已安裝且認證
  ```bash
  copilot --version
  ```
- [ ] 網路連線正常

### 安裝步驟

```bash
# 1. 進入專案目錄
cd copilot-demo

# 2. 安裝依賴
npm install

# 3. 驗證安裝
node -e "import('@github/copilot-sdk').then(() => console.log('✅ SDK 已安裝'))"
```

### 第一次執行

```bash
# 簡單測試
node webpage-analyzer-agent.js https://example.com

# 預期輸出：
# ✅ Copilot 客戶端已啟動
# ✅ 網頁下載成功
# ✅ 提取完成
# ✅ 內容總結完成
# ✅ 繁體中文貼文生成完成
# ✅ 英文翻譯完成
# ✅ 所有任務完成！
```

## 📝 推薦測試案例

### 1. 簡單測試
```bash
node webpage-analyzer-agent.js https://example.com
```

### 2. 新聞網站
```bash
node webpage-analyzer-agent.js https://www.bbc.com/news
```

### 3. 技術部落格
```bash
node webpage-analyzer-agent.js https://github.blog/changelog/
```

### 4. 中文內容
```bash
node webpage-analyzer-agent.js https://www.ithome.com.tw/news
```

## ⚡ 效能參考

- **總執行時間**: 30-50 秒
- **網頁下載**: 1-3 秒
- **AI 處理**: 25-45 秒
  - 內容總結: ~5-10 秒
  - 生成貼文: ~10-15 秒
  - 翻譯: ~10-15 秒

## 🔧 疑難排解

### 問題 1: Copilot CLI 未認證

```bash
# 錯誤訊息
Error: GitHub Copilot CLI is not authenticated

# 解決方法
copilot auth login
```

### 問題 2: ESM 錯誤

```bash
# 錯誤訊息
Error [ERR_REQUIRE_ESM]: require() of ES Module

# 解決方法
# 確認 package.json 包含:
{
  "type": "module"
}
```

### 問題 3: 模組找不到

```bash
# 錯誤訊息
Cannot find module '@github/copilot-sdk'

# 解決方法
npm install
```

### 問題 4: 網頁下載失敗

```bash
# 錯誤訊息
下載網頁失敗: timeout of 15000ms exceeded

# 可能原因
# 1. 網路連線問題
# 2. 網站回應太慢
# 3. 網站阻擋自動化請求

# 解決方法
# 嘗試其他網址或檢查網路連線
```

## 📚 更多資訊

- **完整文件**: 查看 [README.md](README.md)
- **使用範例**: 查看 [EXAMPLES.md](EXAMPLES.md)
- **技術細節**: 查看 [TECHNICAL.md](TECHNICAL.md)

## 💡 下一步

1. ✅ **測試基本功能** - 使用 example.com 進行測試
2. ✅ **嘗試真實網站** - 分析新聞或部落格文章
3. ✅ **查看輸出** - 檢視生成的貼文品質
4. ✅ **客製化** - 修改提示詞以符合需求
5. ✅ **擴展功能** - 參考 TECHNICAL.md 的擴展建議

## 🎯 成功指標

你會看到以下輸出代表成功：

```
╔══════════════════════════════════════╗
║     網頁分析代理人 v1.0              ║
╚══════════════════════════════════════╝

🚀 初始化 Copilot 客戶端...
✅ Copilot 客戶端已啟動

📥 正在下載網頁: ...
✅ 網頁下載成功

🔍 正在分析 HTML 並提取主要內容...
✅ 提取完成

📊 正在總結內容...
✅ 內容總結完成

✍️  正在生成 3 種風格的繁體中文臉書貼文...
✅ 繁體中文貼文生成完成

🌐 正在將貼文翻譯為英文...
✅ 英文翻譯完成

═══════════════════════════════════════
📋 分析結果
═══════════════════════════════════════

[結果輸出...]

🧹 資源清理完成
✅ 所有任務完成！
```

## 🆘 需要幫助？

遇到問題？檢查：
1. [EXAMPLES.md](EXAMPLES.md) - 更多使用範例
2. [TECHNICAL.md](TECHNICAL.md) - 技術細節和疑難排解
3. GitHub Issues - 回報問題
