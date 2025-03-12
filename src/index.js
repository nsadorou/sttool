#!/usr/bin/env node
const { program } = require('commander');
const BrowserService = require('./services/browser-service');
const { checkCookiesExist, loadCookies } = require('./utils/cookie-manager');

program
  .name('sttool')
  .description('Yahoo!ショッピング注文履歴スクリーンショットツール')
  .version('1.0.0');

program
  .option('-i, --init', '初期化（ログインしてクッキーを保存）')
  .option('-d, --device <type>', 'デバイスタイプ（PC/SP）')
  .option('-u, --url <url>', 'スクリーンショットを取得するURL');

program.parse(process.argv);
const options = program.opts();

async function main() {
  const browserService = new BrowserService();

  try {
    if (options.init) {
      // 初期化モード
      await browserService.initialize({ headless: false }); // ヘッドレスモードオフ
      await browserService.setupContext('PC'); // 初期化はPCモードで
      await browserService.handleInitialLogin();
      console.log('初期化が完了しました。クッキーが保存されました。');
    } else {
      // スクリーンショット取得モード
      if (!options.device || !options.url) {
        console.error('デバイスタイプとURLを指定してください。');
        program.help();
        return;
      }

      // デバイスタイプの検証（大文字小文字を問わない）
      const deviceType = options.device.toUpperCase();
      if (!['PC', 'SP'].includes(deviceType)) {
        console.error('デバイスタイプは PC または SP を指定してください。');
        return;
      }

      // URLの検証
      if (!options.url.startsWith('http')) {
        console.error('URLは http:// または https:// から始まる完全な形式で指定してください。');
        return;
      }

      // クッキーの存在確認
      const cookiesExist = await checkCookiesExist();
      if (!cookiesExist) {
        console.error('クッキーが見つかりません。--init オプションで初期化してください。');
        return;
      }

      // スクリーンショット取得
      const cookies = await loadCookies();
      await browserService.initialize({ headless: true });
      await browserService.setupContext(deviceType, cookies);
      await browserService.takeScreenshot(options.url, deviceType);
      console.log('スクリーンショットの取得が完了しました。');
    }
  } catch (error) {
    console.error('エラーが発生しました:', error);
    process.exit(1);
  } finally {
    await browserService.close();
  }
}

// メイン処理の実行
main().catch(error => {
  console.error('予期せぬエラーが発生しました:', error);
  process.exit(1);
});