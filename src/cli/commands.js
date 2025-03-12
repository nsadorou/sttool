const { program } = require('commander');
const BrowserService = require('../services/browser-service');
const browserService = new BrowserService();

program
  .command('screenshot')
  .description('指定したURLのスクリーンショットを取得します')
  .option('-u, --url <url>', '取得するURL（クエリパラメータを含む完全なURL）')
  .option('-d, --device <type>', 'デバイスタイプ (pc/sp)', 'pc')
  .action(async (options) => {
    await browserService.initialize();
    await browserService.setupContext(options.device);
    await browserService.takeScreenshot(options.url, options.device);
    await browserService.close();
  });

program.parse(process.argv);