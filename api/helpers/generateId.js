const { Buffer } = require('buffer');
const { randomFillSync } = require('crypto');

const _alphabet =
	'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';

/**
 * Converts any given number to a buffer with hex values
 *
 * @param {number} n Number to convert to hex
 * @returns {Buffer}
 */
const toHexBuffer = (n) => {
	let hexN = n.toString(16);
	hexN = (hexN.length % 2 == 0 ? '' : '0') + hexN;

	return Buffer.from(hexN.match(/.{2}/g).map((b) => parseInt('0x' + b)));
};

/**
 * Properly converts nonce into buffer
 *
 * @param {number} n nonce
 * @returns {Buffer}
 */
const toNonceBuffer = (n) =>
	Buffer.from(
		[...toHexBuffer(n)]
			.map((b) => `${b >> 6}${_alphabet[b & 63]}`)
			.join(''),
		'utf-8'
	);

/**
 * Converts the given buffer to a string
 *
 * @param {Buffer} buffer Buffer to convert to string
 * @returns {string}
 */
const bufferToString = (buffer) => {
	let id = '';
	for (let b of buffer) {
		id += _alphabet[b & 63];
	}
	return id;
};

/**
 * Generates a buffer with random values
 *
 * @returns {Buffer}
 */
const randomBuffer = () => {
	const pool = Buffer.allocUnsafe(8);
	randomFillSync(pool);

	return pool;
};

/**
 * Generates id from given nonce
 *
 * @param {number} nonce Nonce
 * @returns {string}
 */
const generateId = (prefix, nonce) =>
	bufferToString(
		Buffer.concat([
			Buffer.from(prefix, 'utf-8'),
			toHexBuffer(Date.now()),
			randomBuffer(),
			toNonceBuffer(nonce)
		])
	);

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
const genHomeId = () => generateId('HOM', ++homeNonce);

module.exports = {
	genHoaId,
	genUserId,
	genVisitorId,
	genLogId,
	genDueId,
	genRequestId,
	genHomeId
};
