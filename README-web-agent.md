# 網頁內容分析代理人

使用 GitHub Copilot SDK 建立的智能代理人，可以自動分析網頁內容並生成多風格的社群媒體貼文。

## 功能

1. 📥 **下載網頁內容** - 自動擷取網頁 HTML
2. 📄 **提取主要內容** - 使用 Readability 演算法過濾廣告和雜訊
3. 🤔 **智能摘要** - 用 AI 總結文章核心重點
4. ✍️ **多風格貼文生成** - 生成 3 種風格的繁體中文臉書貼文：
   - 專業新聞報導風格
   - 輕鬆搞笑文筆
   - 朋友聊天語氣
5. 🌐 **英文翻譯** - 保持原風格翻譯為英文

## 安裝

```bash
npm install
```

`npm install` 會自動套用一個 `vscode-jsonrpc` 的 Node.js 22 ESM 相容修補，避免 `@github/copilot-sdk` 在啟動時因 `vscode-jsonrpc/node` 匯入失敗而中斷。

## 使用方式

```bash
node web-content-agent.js [選項] <網址>
```

### 選項

- `--debug` 或 `-d`: 啟用詳細除錯日誌，顯示所有事件和處理過程

### 範例

**一般模式：**
```bash
node web-content-agent.js https://blog.miniasp.com/post/2024/01/15/sample-article
```

**除錯模式：**
```bash
node web-content-agent.js --debug https://blog.miniasp.com/post/2024/01/15/sample-article
```

## 輸出範例

```
🚀 啟動網頁內容分析代理人

==================================================
📥 下載網頁: https://example.com/article
✅ 成功提取內容: 文章標題

✅ Copilot 客戶端已啟動

🤔 正在分析網頁內容...

📋 內容摘要:
[AI 生成的摘要]

✍️  正在生成臉書貼文...

📱 中文臉書貼文:

【1️⃣ 專業新聞報導】
[正式報導風格的貼文]

【2️⃣ 輕鬆搞笑文筆】
[幽默風趣的貼文]

【3️⃣ 朋友聊天語氣】
[親切口語的貼文]

🌐 正在翻譯為英文...

📱 英文臉書貼文:

【1️⃣ Professional News Style】
[Formal news-style post]

【2️⃣ Light & Humorous Style】
[Funny and entertaining post]

【3️⃣ Casual Chat Style】
[Friendly conversational post]

==================================================
🎉 分析完成！

✅ Copilot 客戶端已停止
```

## 技術架構

- **GitHub Copilot SDK** - AI 代理人核心引擎
- **JSDOM** - 網頁內容解析
- **Mozilla Readability** - 文章主要內容提取
- **Claude Sonnet 4.5** - AI 模型（可在程式碼中調整）

## 自訂配置

在 `web-content-agent.js` 中可調整：

- `model` - 更換 AI 模型（如 `gpt-5`, `claude-opus-4.5`）
- 貼文長度限制
- 摘要字數
- 生成風格的提示詞

## 授權

MIT License
