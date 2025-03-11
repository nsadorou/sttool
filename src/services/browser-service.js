const { chromium } = require('playwright');
const { getDeviceConfig } = require('../config/device-config');
const { saveCookies, loadCookies } = require('../utils/cookie-manager');
const { saveScreenshot } = require('../utils/screenshot');

class BrowserService {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
  }

  /**
   * ブラウザの初期化
   * @param {Object} options - 初期化オプション
   * @param {boolean} options.headless - ヘッドレスモードで実行するかどうか
   */
  async initialize(options = { headless: true }) {
    this.browser = await chromium.launch({ headless: options.headless });
  }

  /**
   * ブラウザコンテキストの設定
   * @param {string} deviceType - デバイスタイプ（PC/SP）
   * @param {Array} cookies - クッキー配列（オプション）
   */
  async setupContext(deviceType, cookies = null) {
    const deviceConfig = getDeviceConfig(deviceType);
    
    this.context = await this.browser.newContext({
      viewport: deviceConfig.viewport,
      userAgent: deviceConfig.userAgent
    });

    if (cookies) {
      await this.context.addCookies(cookies);
    }

    this.page = await this.context.newPage();
  }

  /**
   * 初回ログインプロセス
   * @returns {Promise<Array>} 取得したクッキー
   */
  async handleInitialLogin() {
    try {
      await this.page.goto('https://odhistory.shopping.yahoo.co.jp/order-history/list');
      
      console.log('ログインしてEnterキーを押してください...');
      
      // ユーザーの入力を待つ
      await new Promise(resolve => {
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', data => {
          if (data[0] === 0x0d || data[0] === 0x0a) { // Enterキーを検出
            process.stdin.setRawMode(false);
            process.stdin.pause();
            resolve();
          }
        });
      });

      // クッキーを保存
      const cookies = await this.context.cookies();
      await saveCookies(cookies);
      
      return cookies;
    } catch (error) {
      console.error('ログインプロセスでエラーが発生しました:', error);
      throw error;
    }
  }

  /**
   * スクリーンショットの取得
   * @param {string} urlPath - アクセスするパス
   * @param {string} deviceType - デバイスタイプ（PC/SP）
   */
  async takeScreenshot(urlPath, deviceType) {
    try {
      const baseUrl = 'https://odhistory.shopping.yahoo.co.jp';
      const fullUrl = `${baseUrl}${urlPath}`;
      
      await this.page.goto(fullUrl);
      
      // ページ全体が表示されるまで待機
      await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await this.page.waitForTimeout(1000); // スクロール後の描画待ち
      
      const screenshot = await this.page.screenshot({
        fullPage: true,
        type: 'jpeg',
        quality: 90
      });
      
      await saveScreenshot(screenshot, urlPath, deviceType);
    } catch (error) {
      console.error('スクリーンショット取得でエラーが発生しました:', error);
      throw error;
    }
  }

  /**
   * ブラウザの終了
   */
  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.context = null;
      this.page = null;
    }
  }
}

module.exports = BrowserService;