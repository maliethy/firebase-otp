const twilio = require('twilio');
require('dotenv').config();

const accoutSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;

module.exports = new twilio.Twilio(accoutSid, authToken);
