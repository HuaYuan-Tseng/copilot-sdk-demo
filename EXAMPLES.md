# 網頁分析代理人 - 使用範例

## 快速開始

### 1. 測試基本功能

使用一個簡單的網頁進行測試：

```bash
node webpage-analyzer-agent.js https://example.com
```

### 2. 分析新聞文章

```bash
# 分析 BBC 新聞
node webpage-analyzer-agent.js https://www.bbc.com/news

# 分析技術部落格
node webpage-analyzer-agent.js https://github.blog/changelog/
```

### 3. 分析中文內容

```bash
# 分析繁體中文新聞
node webpage-analyzer-agent.js https://www.ithome.com.tw/news

# 分析部落格文章
node webpage-analyzer-agent.js https://blog.miniasp.com/
```

## 輸出格式

程式會按照以下格式輸出結果：

```
╔══════════════════════════════════════╗
║     網頁分析代理人 v1.0              ║
╚══════════════════════════════════════╝

🚀 初始化 Copilot 客戶端...
✅ Copilot 客戶端已啟動

📥 正在下載網頁: https://example.com
✅ 網頁下載成功 (1234 bytes)

🔍 正在分析 HTML 並提取主要內容...
✅ 提取完成 - 標題: Example Domain
📝 內容長度: 500 字元

📊 正在總結內容...
✅ 內容總結完成

✍️  正在生成 3 種風格的繁體中文臉書貼文...
✅ 繁體中文貼文生成完成

🌐 正在將貼文翻譯為英文...
✅ 英文翻譯完成

═══════════════════════════════════════
📋 分析結果
═══════════════════════════════════════

🔖 標題:
Example Domain

──────────────────────────────────────

📝 摘要:
[摘要內容...]

──────────────────────────────────────

🇹🇼 繁體中文貼文:
---風格一：專業新聞報導---
[專業報導內容...]

---風格二：輕鬆搞笑---
[搞笑內容...]

---風格三：朋友聊天---
[聊天內容...]

──────────────────────────────────────

🇬🇧 英文貼文:
---Style 1: Professional News Report---
[Professional content...]

---Style 2: Casual & Humorous---
[Humorous content...]

---Style 3: Friendly Chat---
[Friendly content...]

══════════════════════════════════════

🧹 資源清理完成
✅ 所有任務完成！
```

## 錯誤處理範例

### 無效的 URL

```bash
$ node webpage-analyzer-agent.js invalid-url
❌ 無效的 URL 格式！
```

### 缺少 URL 參數

```bash
$ node webpage-analyzer-agent.js
❌ 請提供網址！

使用方式:
  node webpage-analyzer-agent.js <URL>

範例:
  node webpage-analyzer-agent.js https://example.com/article
```

### 網頁下載失敗

```bash
$ node webpage-analyzer-agent.js https://nonexistent-site-123456.com
📥 正在下載網頁: https://nonexistent-site-123456.com
❌ 錯誤: 下載網頁失敗: getaddrinfo ENOTFOUND
```

## 進階用法

### 使用 npm script

在 `package.json` 中已經定義了快捷指令：

```bash
npm run analyze https://example.com
```

### 輸出結果到檔案

```bash
node webpage-analyzer-agent.js https://example.com > result.txt 2>&1
```

### 批次處理多個網址

創建一個 shell 腳本：

```bash
#!/bin/bash
urls=(
  "https://example.com/article1"
  "https://example.com/article2"
  "https://example.com/article3"
)

for url in "${urls[@]}"; do
  echo "處理: $url"
  node webpage-analyzer-agent.js "$url"
  echo "---"
done
```

## 效能考量

- **網頁下載**: 約 1-3 秒（取決於網站回應速度）
- **內容提取**: < 1 秒
- **AI 處理**: 每個 Copilot 請求約 5-15 秒
  - 總結內容: ~5-10 秒
  - 生成貼文: ~10-15 秒
  - 翻譯: ~10-15 秒
- **總計**: 約 30-50 秒完成整個流程

## 注意事項

1. **網路連線**: 確保有穩定的網路連線
2. **Copilot 配額**: 注意 API 使用配額
3. **網頁大小**: 過大的網頁會被截斷（限制 3000 字元）
4. **特殊網頁**: 某些需要 JavaScript 渲染的網頁可能無法正確提取內容
5. **防護機制**: 某些網站可能會阻擋自動化請求

## 疑難排解

### Copilot CLI 未認證

```bash
copilot auth login
```

### 模組找不到

```bash
npm install
```

### ESM 錯誤

確保 `package.json` 包含：
```json
{
  "type": "module"
}
```
