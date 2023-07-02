const { randomBytes } = require('crypto');

const alphabet = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';

const dateToString = (date) => {
    let hex = date.toString(16);
    hex = '0'.repeat(hex.length % 2) + hex;
    return hex
        .match(/.{2}/g)
        .map((byte) => alphabet[parseInt(byte, 16) & 63])
        .join('');
};

/**
 * Generates id from given nonce
 *
 * @param {number} nonce Nonce
 * @returns {string}
 */
const generateId = (prefix, nonce) => `${prefix}${nonce}@${dateToString(Date.now())}`;

let hoaNonce = 0;
/**
 * Generates a unique id exclusive for HOAs
 *
 * @returns {string}
 */
const genHoaId = () => generateId('HOA', ++hoaNonce);

let userNonce = 0;
/**
 * Generates a unique id exclusive for Users
 *
 * @returns {string}
 */
const genUserId = () => generateId('USR', ++userNonce);

let visitorNonce = 0;
/**
 * Generates a unique id exclusive for Visitors
 *
 * @returns {string}
 */
const genVisitorId = () => generateId('VST', ++visitorNonce);

let logNonce = 0;
/**
 * Generates a unique id exclusive for Logs
 *
 * @returns {string}
 */
const genLogId = () => generateId('LOG', ++logNonce);

let dueNonce = 0;
/**
 * Generates a unique id exclusive for Dues
 *
 * @returns {string}
 */
const genDueId = () => generateId('DUE', ++dueNonce);

let requestNonce = 0;
/**
 * Generates a unique id exclusive for Requests
 *
 * @returns {string}
 */
const genRequestId = () => generateId('REQ', ++requestNonce);

let homeNonce = 0;
/**
 * Generates a unique id exclusive for Requests
 *
 * @returns {string}
 */
const genHomeId = () => generateId('HME', ++homeNonce);

let notificationNonce = 0;
const genNotificationId = () => generateId('NTF', ++notificationNonce);

const genPassword = () => [...randomBytes(8)].map((byte) => alphabet[byte & 63]).join('');

module.exports = {
    dateToString,
    genDueId,
    generateId,
    genHoaId,
    genHomeId,
    genLogId,
    genNotificationId,
    genPassword,
    genRequestId,
    genUserId,
    genVisitorId,
};
