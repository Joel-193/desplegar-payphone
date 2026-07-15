require('dotenv').config();

module.exports = {
  token: process.env.PAYPHONE_TOKEN || '',
  storeId: process.env.PAYPHONE_STORE_ID || '',
  confirmUrl: process.env.PAYPHONE_CONFIRM_URL || 'https://pay.payphonetodoesposible.com/api/button/V2/Confirm',
};
