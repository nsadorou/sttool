const fs = require('fs').promises;
const path = require('path');

// クッキーファイルのパス
const COOKIE_FILE_PATH = path.join(process.cwd(), 'storage', 'cookies', 'yahoo-shopping.json');

/**
 * クッキーの保存
 * @param {Array} cookies - ブラウザから取得したクッキー配列
 */
async function saveCookies(cookies) {
  try {
    await fs.writeFile(COOKIE_FILE_PATH, JSON.stringify(cookies, null, 2));
    console.log('クッキーを保存しました');
  } catch (error) {
    console.error('クッキーの保存に失敗しました:', error);
    throw error;
  }
}

/**
 * 保存済みクッキーの読み込み
 * @returns {Array} 保存済みのクッキー配列
 */
async function loadCookies() {
  try {
    const cookieData = await fs.readFile(COOKIE_FILE_PATH, 'utf8');
    return JSON.parse(cookieData);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('保存済みのクッキーが見つかりません。--initオプションで初期化してください。');
    } else {
      console.error('クッキーの読み込みに失敗しました:', error);
    }
    throw error;
  }
}

/**
 * クッキーファイルの存在確認
 * @returns {Promise<boolean>} クッキーファイルが存在するかどうか
 */
async function checkCookiesExist() {
  try {
    await fs.access(COOKIE_FILE_PATH);
    return true;
  } catch {
    return false;
  }
}

module.exports = {
  saveCookies,
  loadCookies,
  checkCookiesExist
};