import { CopilotClient } from "@github/copilot-sdk";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

/**
 * 網頁內容分析代理人
 * 1. 下載網頁
 * 2. 提取主要內容
 * 3. 總結內容
 * 4. 生成 3 種風格的中文臉書貼文
 * 5. 翻譯為英文
 */

class WebContentAgent {
  constructor(options = {}) {
    this.client = new CopilotClient();
    this.debug = options.debug || false;
  }

  log(message, ...args) {
    if (this.debug) {
      const timestamp = new Date().toISOString();
      console.log(`[DEBUG ${timestamp}] ${message}`, ...args);
    }
  }

  logEvent(eventType, data) {
    if (this.debug) {
      const timestamp = new Date().toISOString();
      console.log(`[EVENT ${timestamp}] ${eventType}:`, JSON.stringify(data, null, 2));
    }
  }

  async start() {
    this.log("正在啟動 Copilot 客戶端...");
    await this.client.start();
    this.log("Copilot 客戶端啟動完成");
    console.log("✅ Copilot 客戶端已啟動\n");
  }

  async stop() {
    this.log("正在停止 Copilot 客戶端...");
    await this.client.stop();
    this.log("Copilot 客戶端已停止");
    console.log("\n✅ Copilot 客戶端已停止");
  }

  /**
   * 下載並提取網頁主要內容
   */
  async fetchAndExtractContent(url) {
    console.log(`📥 下載網頁: ${url}`);
    this.log(`開始 fetch: ${url}`);

    try {
      const response = await fetch(url);
      this.log(`HTTP 狀態碼: ${response.status} ${response.statusText}`);
      this.log(`Content-Type: ${response.headers.get('content-type')}`);

      const html = await response.text();
      this.log(`HTML 長度: ${html.length} 字元`);

      const dom = new JSDOM(html, { url });
      this.log("JSDOM 解析完成");

      const reader = new Readability(dom.window.document);
      const article = reader.parse();

      if (!article) {
        throw new Error("無法提取網頁內容");
      }

      this.log(`提取結果 - 標題: ${article.title}`);
      this.log(`提取結果 - 內容長度: ${article.textContent?.length || 0} 字元`);
      this.log(`提取結果 - 摘要長度: ${article.excerpt?.length || 0} 字元`);

      console.log(`✅ 成功提取內容: ${article.title}\n`);

      return {
        title: article.title,
        content: article.textContent,
        excerpt: article.excerpt,
      };
    } catch (error) {
      this.log(`下載或提取失敗: ${error.stack}`);
      console.error(`❌ 下載失敗: ${error.message}`);
      throw error;
    }
  }

  /**
   * 使用 Copilot 分析內容並生成貼文
   */
  async analyzeAndGenerate(article) {
    this.log("開始創建 Copilot Session...");
    const session = await this.client.createSession({
      model: "gpt-5-mini",
      streaming: false,
    });
    this.log(`Session 創建成功，模型: claude-sonnet-4.5`);

    try {
      // 步驟 1: 總結內容
      console.log("🤔 正在分析網頁內容...");
      this.log("=== 步驟 1: 開始總結內容 ===");
      const startTime1 = Date.now();
      const summary = await this.summarizeContent(session, article);
      const elapsed1 = ((Date.now() - startTime1) / 1000).toFixed(2);
      this.log(`summarizeContent Promise 已 resolve`);
      this.log(`總結完成，耗時: ${elapsed1} 秒`);
      this.log(`摘要長度: ${summary.length} 字元`);
      console.log(`\n📋 內容摘要:\n${summary}\n`);

      // 步驟 2: 生成 3 種風格的中文貼文
      console.log("✍️  正在生成臉書貼文...");
      this.log("=== 步驟 2: 開始生成貼文 ===");
      const startTime2 = Date.now();
      const posts = await this.generatePosts(session, article, summary);
      const elapsed2 = ((Date.now() - startTime2) / 1000).toFixed(2);
      this.log(`貼文生成完成，耗時: ${elapsed2} 秒`);
      this.log(`專業貼文長度: ${posts.professional.length} 字元`);
      this.log(`搞笑貼文長度: ${posts.humorous.length} 字元`);
      this.log(`聊天貼文長度: ${posts.casual.length} 字元`);

      console.log("\n📱 中文臉書貼文:\n");
      console.log("【1️⃣ 專業新聞報導】");
      console.log(posts.professional);
      console.log("\n【2️⃣ 輕鬆搞笑文筆】");
      console.log(posts.humorous);
      console.log("\n【3️⃣ 朋友聊天語氣】");
      console.log(posts.casual);

      // 步驟 3: 翻譯為英文
      console.log("\n🌐 正在翻譯為英文...");
      this.log("=== 步驟 3: 開始翻譯 ===");
      const startTime3 = Date.now();
      const translations = await this.translatePosts(session, posts);
      const elapsed3 = ((Date.now() - startTime3) / 1000).toFixed(2);
      this.log(`翻譯完成，耗時: ${elapsed3} 秒`);
      this.log(`專業翻譯長度: ${translations.professional.length} 字元`);
      this.log(`搞笑翻譯長度: ${translations.humorous.length} 字元`);
      this.log(`聊天翻譯長度: ${translations.casual.length} 字元`);

      console.log("\n📱 英文臉書貼文:\n");
      console.log("【1️⃣ Professional News Style】");
      console.log(translations.professional);
      console.log("\n【2️⃣ Light & Humorous Style】");
      console.log(translations.humorous);
      console.log("\n【3️⃣ Casual Chat Style】");
      console.log(translations.casual);

      return { summary, posts, translations };
    } finally {
      this.log("正在銷毀 Session...");
      await session.destroy();
      this.log("Session 已銷毀");
    }
  }

  async summarizeContent(session, article) {
    return new Promise((resolve, reject) => {
      let response = "";
      let eventCount = 0;

      const handler = (event) => {
        eventCount++;
        this.logEvent(`summarizeContent[${eventCount}]`, { type: event.type, dataKeys: Object.keys(event.data || {}) });

        if (event.type === "assistant.message") {
          response = event.data.content;
          this.log(`收到摘要響應，長度: ${response.length}`);
          this.log(`摘要內容: ${response}`);
        } else if (event.type === "session.idle") {
          this.log("摘要 session 進入 idle 狀態");
          this.log(`準備 resolve，response 長度: ${response.length}`);
          this.log("準備移除 handler");
          // 先 resolve，再移除 handler
          resolve(response);
          this.log("resolve 已調用，現在移除 handler");
          session.off(handler);
          this.log("handler 已移除");
        } else if (event.type === "error") {
          this.log(`摘要請求錯誤: ${event.data.message}`);
          session.off(handler);
          reject(new Error(event.data.message));
        }
      };

      session.on(handler);

      const prompt = `請用繁體中文總結以下文章的核心重點（200字以內）：

標題：${article.title}

內容：
${article.content.slice(0, 5000)}`;

      this.log(`發送摘要請求，prompt 長度: ${prompt.length}`);
      session.send({ prompt });
    });
  }

  async generatePosts(session, article, summary) {
    return new Promise((resolve, reject) => {
      let response = "";
      let eventCount = 0;

      const handler = (event) => {
        eventCount++;
        this.logEvent(`generatePosts[${eventCount}]`, { type: event.type, dataKeys: Object.keys(event.data || {}) });

        if (event.type === "assistant.message") {
          response = event.data.content;
          this.log(`收到貼文響應，長度: ${response.length}`);
        } else if (event.type === "session.idle") {
          this.log("貼文 session 進入 idle 狀態");

          const sections = response.split(/【.+?】/).filter(s => s.trim());
          this.log(`解析出 ${sections.length} 個區段`);

          resolve({
            professional: sections[0]?.trim() || "",
            humorous: sections[1]?.trim() || "",
            casual: sections[2]?.trim() || "",
          });
          session.off(handler);
        } else if (event.type === "error") {
          this.log(`貼文生成錯誤: ${event.data.message}`);
          session.off(handler);
          reject(new Error(event.data.message));
        }
      };

      session.on(handler);

      const prompt = `根據以下文章摘要，用繁體中文（zh-tw）撰寫 3 份臉書貼文：

文章摘要：
${summary}

請依照以下風格撰寫：
1. **專業新聞報導風格**：客觀、正式、有新聞感
2. **輕鬆搞笑文筆**：幽默、有梗、帶點玩笑
3. **朋友聊天語氣**：親切、口語化、像是跟朋友分享

每則貼文約 100-150 字，包含適當的 emoji。

請用以下格式輸出（不要用 markdown 格式）：

【專業新聞報導】
[內容]

【輕鬆搞笑】
[內容]

【朋友聊天】
[內容]`;

      this.log(`發送貼文生成請求，prompt 長度: ${prompt.length}`);
      session.send({ prompt });
    });
  }

  async translatePosts(session, posts) {
    return new Promise((resolve, reject) => {
      let response = "";
      let eventCount = 0;

      const handler = (event) => {
        eventCount++;
        this.logEvent(`translatePosts[${eventCount}]`, { type: event.type, dataKeys: Object.keys(event.data || {}) });

        if (event.type === "assistant.message") {
          response = event.data.content;
          this.log(`收到翻譯響應，長度: ${response.length}`);
        } else if (event.type === "session.idle") {
          this.log("翻譯 session 進入 idle 狀態");

          const sections = response.split(/【.+?】/).filter(s => s.trim());
          this.log(`解析出 ${sections.length} 個區段`);

          resolve({
            professional: sections[0]?.trim() || "",
            humorous: sections[1]?.trim() || "",
            casual: sections[2]?.trim() || "",
          });
          session.off(handler);
        } else if (event.type === "error") {
          this.log(`翻譯錯誤: ${event.data.message}`);
          session.off(handler);
          reject(new Error(event.data.message));
        }
      };

      session.on(handler);

      const prompt = `請將以下 3 則中文臉書貼文翻譯為英文，保持原本的風格和語氣：

【專業新聞報導】
${posts.professional}

【輕鬆搞笑】
${posts.humorous}

【朋友聊天】
${posts.casual}

請用以下格式輸出（不要用 markdown 格式）：

【Professional News】
[content]

【Light & Humorous】
[content]

【Casual Chat】
[content]`;

      this.log(`發送翻譯請求，prompt 長度: ${prompt.length}`);
      session.send({ prompt });
    });
  }

  /**
   * 主流程
   */
  async process(url) {
    console.log("🚀 啟動網頁內容分析代理人\n");
    console.log("=".repeat(50));

    const totalStartTime = Date.now();
    this.log(`開始處理 URL: ${url}`);

    await this.start();

    try {
      const article = await this.fetchAndExtractContent(url);
      const result = await this.analyzeAndGenerate(article);

      const totalElapsed = ((Date.now() - totalStartTime) / 1000).toFixed(2);
      this.log(`總處理時間: ${totalElapsed} 秒`);

      console.log("\n" + "=".repeat(50));
      console.log("🎉 分析完成！");

      return result;
    } catch (error) {
      this.log(`處理失敗: ${error.stack}`);
      console.error(`\n❌ 處理失敗: ${error.message}`);
      throw error;
    } finally {
      await this.stop();
    }
  }
}

// 執行
const args = process.argv.slice(2);
const debugMode = args.includes("--debug") || args.includes("-d");
const url = args.find(arg => !arg.startsWith("-"));

if (!url) {
  console.error("❌ 請提供網址");
  console.log("\n使用方式：");
  console.log("  node web-content-agent.js [選項] <網址>");
  console.log("\n選項：");
  console.log("  --debug, -d    啟用詳細除錯日誌");
  console.log("\n範例：");
  console.log("  node web-content-agent.js https://example.com/article");
  console.log("  node web-content-agent.js --debug https://example.com/article");
  process.exit(1);
}

const agent = new WebContentAgent({ debug: debugMode });

if (debugMode) {
  console.log("🐛 除錯模式已啟用\n");
}

agent.process(url).catch(console.error);
