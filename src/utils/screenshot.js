const path = require('path');
const fs = require('fs').promises;

/**
 * スクリーンショットのファイル名を生成
 * @param {string} urlPath - URLのパス部分
 * @param {string} deviceType - デバイスタイプ（PC/SP）
 * @returns {string} ファイル名
 */
function generateFileName(urlPath, deviceType) {
  // URLパスから不適切な文字を削除
  const sanitizedPath = urlPath.replace(/[^a-zA-Z0-9-_]/g, '_');
  
  // 現在時刻をYYMMDDHHMISS形式で取得
  const now = new Date();
  const timestamp = now.getFullYear().toString().slice(-2) +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0') +
    String(now.getSeconds()).padStart(2, '0');

  return `${sanitizedPath}_${timestamp}_${deviceType}.jpg`;
}

/**
 * スクリーンショットの保存
 * @param {Buffer} buffer - スクリーンショットのバッファデータ
 * @param {string} urlPath - URLのパス部分
 * @param {string} deviceType - デバイスタイプ（PC/SP）
 * @returns {Promise<string>} 保存したファイルのパス
 */
async function saveScreenshot(buffer, urlPath, deviceType) {
  const fileName = generateFileName(urlPath, deviceType);
  const filePath = path.join(process.cwd(), 'storage', 'screenshots', fileName);

  try {
    await fs.writeFile(filePath, buffer);
    console.log(`スクリーンショットを保存しました: ${fileName}`);
    return filePath;
  } catch (error) {
    console.error('スクリーンショットの保存に失敗しました:', error);
    throw error;
  }
}

module.exports = {
  generateFileName,
  saveScreenshot
};