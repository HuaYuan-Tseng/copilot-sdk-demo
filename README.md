# 網頁分析代理人

使用 GitHub Copilot SDK 開發的智能網頁分析代理人，能夠自動下載網頁、提取內容、生成多風格社群貼文並翻譯。

## 功能特點

✅ **自動下載網頁** - 支援任何公開網址  
✅ **智能內容提取** - 自動識別並提取網頁主要內容  
✅ **AI 內容總結** - 使用 GPT-5 生成精確摘要  
✅ **多風格貼文生成** - 3 種不同風格的繁體中文臉書貼文：
   - 專業新聞報導風格
   - 輕鬆搞笑風格
   - 朋友聊天語氣
✅ **自動翻譯** - 將所有貼文翻譯為英文  
✅ **完整非同步處理** - 正確使用 async/await 確保流程穩定

## 技術架構

- **語言**: TypeScript/JavaScript (ESM)
- **AI SDK**: GitHub Copilot SDK v0.1.19
- **網頁抓取**: axios + cheerio
- **模型**: GPT-5

## 安裝

```bash
npm install
```

## 使用方式

### 基本用法

```bash
node webpage-analyzer-agent.js <網址>
```

### 範例

```bash
# 分析新聞文章
node webpage-analyzer-agent.js https://example.com/news/article

# 使用 npm script
npm run analyze https://blog.example.com/post
```

## 輸出範例

程式會依序執行以下步驟並輸出結果：

1. 📥 下載網頁
2. 🔍 提取主要內容
3. 📊 生成內容摘要
4. ✍️  生成 3 種風格繁體中文貼文
5. 🌐 翻譯成英文

最終輸出包含：
- 🔖 網頁標題
- 📝 內容摘要
- 🇹🇼 3 種風格繁體中文貼文
- 🇬🇧 3 種風格英文貼文

## 程式架構

```javascript
class WebpageAnalyzerAgent {
  async initialize()           // 初始化 Copilot 客戶端
  async downloadWebpage()      // 下載網頁內容
  extractMainContent()         // 提取主要內容
  async summarizeContent()     // 總結內容
  async generateFacebookPosts() // 生成貼文
  async translateToEnglish()   // 翻譯成英文
  async cleanup()              // 清理資源
  async analyze()              // 執行完整流程
}
```

## 注意事項

⚠️ **ESM 模式** - 專案使用 ECMAScript Modules（`"type": "module"`）  
⚠️ **網路連線** - 需要網路連線以下載網頁並使用 Copilot API  
⚠️ **Copilot 訂閱** - 需要有效的 GitHub Copilot 訂閱  
⚠️ **資源清理** - 程式會自動清理 Copilot 會話和客戶端資源

## 錯誤處理

- ✅ 網頁下載失敗會顯示錯誤訊息
- ✅ 無效 URL 會在執行前驗證
- ✅ Copilot 錯誤會被捕獲並顯示
- ✅ 使用 try-finally 確保資源正確清理

## 系統需求

- Node.js 18+
- GitHub Copilot CLI (已認證)
- 網路連線

## 授權

MIT License

## 作者

Will 保哥 <doggy.huang@gmail.com>
