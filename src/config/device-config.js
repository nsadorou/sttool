/**
 * デバイス設定
 * PC/SPそれぞれの画面サイズとユーザーエージェントを定義
 */
const devices = {
  PC: {
    name: 'desktop',
    viewport: {
      width: 1280,
      height: 800 // 初期値（実際のスクリーンショットはフルサイズ）
    },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  },
  SP: {
    name: 'mobile',
    viewport: {
      width: 375,
      height: 667 // 初期値（実際のスクリーンショットはフルサイズ）
    },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1'
  }
};

/**
 * デバイス種別の判定
 * @param {string} deviceType - デバイスタイプ（'PC' または 'SP'）
 * @returns {Object} デバイス設定
 * @throws {Error} 無効なデバイスタイプの場合
 */
const getDeviceConfig = (deviceType) => {
  if (!devices[deviceType]) {
    throw new Error(`Invalid device type: ${deviceType}. Must be either 'PC' or 'SP'`);
  }
  return devices[deviceType];
};

module.exports = {
  getDeviceConfig
};