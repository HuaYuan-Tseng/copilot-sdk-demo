# 技術實作說明

## 專案概述

這是一個使用 **GitHub Copilot SDK for Node.js** 開發的智能網頁分析代理人，展示了完整的非同步流程處理和 AI 代理人架構。

## 核心技術棧

- **GitHub Copilot SDK**: v0.1.19 (ESM 模式)
- **Node.js**: 18+ (ECMAScript Modules)
- **網頁抓取**: axios + cheerio
- **AI 模型**: GPT-5

## 架構設計

### 類別結構

```typescript
class WebpageAnalyzerAgent {
  client: CopilotClient | null
  
  // 生命週期管理
  async initialize()
  async cleanup()
  
  // 核心功能
  async downloadWebpage(url)
  extractMainContent(html)
  async processWithCopilot(prompt)
  async summarizeContent(title, content)
  async generateFacebookPosts(title, summary)
  async translateToEnglish(posts)
  
  // 主流程
  async analyze(url)
}
```

### 資料流程

```
URL 輸入
  ↓
網頁下載 (axios)
  ↓
HTML 解析 (cheerio)
  ↓
內容提取
  ↓
AI 總結 (Copilot SDK)
  ↓
生成 3 種風格貼文 (Copilot SDK)
  ↓
翻譯成英文 (Copilot SDK)
  ↓
輸出結果
```

## 關鍵實作細節

### 1. ESM 模式配置

**package.json 必須包含:**
```json
{
  "type": "module"
}
```

**使用 import/export:**
```javascript
import { CopilotClient } from "@github/copilot-sdk";
import axios from "axios";
import * as cheerio from "cheerio";
```

### 2. 非同步處理最佳實踐

#### ✅ 正確的會話管理

每個 Copilot 請求都創建獨立的會話並在 finally 區塊中清理：

```javascript
async processWithCopilot(prompt) {
  let session = null;
  
  try {
    session = await this.client.createSession({
      model: "gpt-5",
      streaming: false
    });

    const result = await new Promise((resolve, reject) => {
      // 事件處理器必須在 send 之前註冊
      session.on((event) => {
        if (event.type === "assistant.message") {
          resolve(event.data.content || "");
        } else if (event.type === "error") {
          reject(new Error(event.data?.message));
        }
      });

      // 非同步發送，錯誤傳遞給 Promise
      session.send({ prompt }).catch(reject);
    });

    return result;

  } finally {
    // 確保資源釋放
    if (session) {
      await session.destroy();
    }
  }
}
```

**關鍵要點:**
- ✅ 使用局部變數 `session` 而非實例變數
- ✅ 每個會話都在 `finally` 區塊中清理
- ✅ 避免 Promise constructor anti-pattern
- ✅ 事件處理器在 `send()` 之前註冊
- ✅ `send()` 的錯誤透過 `.catch(reject)` 傳遞

#### ❌ 常見錯誤

**錯誤 1: Promise Constructor Anti-pattern**
```javascript
// ❌ 不要這樣做
async processWithCopilot(prompt) {
  return new Promise(async (resolve, reject) => {
    // async 在 Promise constructor 中會導致錯誤處理問題
    await this.doSomething();
  });
}
```

**錯誤 2: 會話資源洩漏**
```javascript
// ❌ 不要這樣做
async processWithCopilot(prompt) {
  this.session = await this.client.createSession();
  // 如果多次調用，前面的 session 不會被清理
}
```

**錯誤 3: 缺少頂層錯誤處理**
```javascript
// ❌ 不要這樣做
main(); // 未捕獲的 Promise rejection

// ✅ 應該這樣做
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

### 3. HTML 內容提取策略

使用多重選擇器策略提取主要內容：

```javascript
const possibleSelectors = [
  "article",           // HTML5 語意標籤
  "main",              // 主要內容區域
  '[role="main"]',     // ARIA role
  ".content",          // 常見類別名稱
  ".main-content",
  "#content",
  ".post-content",
  ".entry-content"
];

for (const selector of possibleSelectors) {
  const element = $(selector);
  if (element.length > 0) {
    mainContent = element.text();
    break;
  }
}
```

### 4. 錯誤處理架構

#### 多層錯誤處理

1. **函數級別**: try-catch 處理特定錯誤
2. **流程級別**: analyze() 方法的 try-finally
3. **頂層級別**: main() 的 .catch()

```javascript
async analyze(url) {
  try {
    await this.initialize();
    // ... 執行各項任務
  } catch (error) {
    console.error("❌ 錯誤:", error.message);
    throw error;
  } finally {
    // 確保資源清理
    await this.cleanup();
  }
}

// 頂層捕獲
main().catch((error) => {
  console.error("\n💥 未預期的錯誤:", error);
  process.exit(1);
});
```

### 5. Copilot SDK 事件處理

#### 關鍵事件類型

| 事件 | 說明 | 使用時機 |
|------|------|---------|
| `assistant.message` | 完整回應 | 取得 AI 回應內容 |
| `assistant.message_delta` | 串流片段 | streaming: true 時使用 |
| `session.idle` | 會話閒置 | 確認處理完成 |
| `error` | 錯誤事件 | 處理錯誤情況 |

#### 事件處理模式

```javascript
session.on((event) => {
  // 使用 event.data.content 而非 event.content
  if (event.type === "assistant.message") {
    const content = event.data.content || "";
    // 處理內容
  } else if (event.type === "session.idle") {
    // 確認完成
  } else if (event.type === "error") {
    // 處理錯誤
  }
});
```

## 效能優化

### 1. 內容長度限制

```javascript
const maxLength = 3000;
if (mainContent.length > maxLength) {
  mainContent = mainContent.substring(0, maxLength) + "...";
}
```

避免超出 AI 模型的 token 限制。

### 2. 請求超時設定

```javascript
const response = await axios.get(url, {
  timeout: 15000  // 15 秒超時
});
```

### 3. 會話即時清理

每個 Copilot 請求完成後立即清理會話，避免資源累積。

## 測試建議

### 單元測試重點

1. **網頁下載**: 測試正常、超時、404 情況
2. **內容提取**: 測試不同 HTML 結構
3. **錯誤處理**: 測試各種錯誤情境
4. **資源清理**: 確認 session 和 client 都被清理

### 整合測試

```javascript
// 測試完整流程
const agent = new WebpageAnalyzerAgent();
const result = await agent.analyze("https://example.com");
expect(result).toHaveProperty("title");
expect(result).toHaveProperty("summary");
expect(result).toHaveProperty("chinesePosts");
expect(result).toHaveProperty("englishPosts");
```

## 安全性考量

1. **URL 驗證**: 使用 `new URL()` 驗證格式
2. **錯誤訊息**: 不洩漏敏感資訊
3. **資源限制**: 限制內容長度和請求超時
4. **依賴版本**: 使用固定版本避免供應鏈攻擊

## 部署注意事項

### 環境需求

- Node.js 18+
- GitHub Copilot CLI 已認證
- 網路連線（存取網頁和 Copilot API）

### 環境變數

可選的環境變數配置：

```bash
# Copilot API 端點（如使用自訂端點）
COPILOT_API_URL=https://custom-endpoint.com

# 超時設定
HTTP_TIMEOUT=15000
```

### 監控指標

建議監控：
- 請求成功率
- 平均處理時間
- API 配額使用量
- 錯誤率和類型

## 擴展可能性

### 1. 支援更多輸出格式

```javascript
async generateTwitterThread(title, summary) { }
async generateInstagramCaption(title, summary) { }
async generateLinkedInPost(title, summary) { }
```

### 2. 批次處理

```javascript
async analyzeBatch(urls) {
  return Promise.all(urls.map(url => this.analyze(url)));
}
```

### 3. 快取機制

```javascript
const cache = new Map();
if (cache.has(url)) {
  return cache.get(url);
}
```

### 4. 自訂 AI 模型

```javascript
session = await this.client.createSession({
  model: "claude-sonnet-4.5",  // 或其他模型
  streaming: true
});
```

## 疑難排解

### 常見問題

**Q: Import 錯誤**
```
Error [ERR_REQUIRE_ESM]: require() of ES Module not supported
```
**A:** 確認 `package.json` 包含 `"type": "module"`

**Q: 事件內容為空**
```javascript
event.content === undefined
```
**A:** 使用 `event.data.content` 而非 `event.content`

**Q: 會話未清理**
```
Warning: Multiple sessions created
```
**A:** 確認每個 session 都在 finally 區塊中 destroy

## 總結

這個專案展示了：
✅ ESM 模式的正確使用  
✅ 非同步流程的最佳實踐  
✅ Copilot SDK 的正確整合  
✅ 完整的錯誤處理和資源管理  
✅ 可擴展的架構設計  

所有的非同步處理都經過仔細檢查和修正，確保沒有資源洩漏、未捕獲的 Promise rejection 或競態條件。
