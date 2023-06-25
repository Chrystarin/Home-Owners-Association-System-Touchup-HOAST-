const emailjs = require('@emailjs/nodejs');
const { SERVICE_ID, TEMPLATE_ID, EMAILJS_PUBLIC, EMAILJS_PRIVATE } = process.env;

module.exports = (email, message) => emailjs.send(SERVICE_ID, TEMPLATE_ID, { email, message }, { publicKey: EMAILJS_PUBLIC, privateKey: EMAILJS_PRIVATE })