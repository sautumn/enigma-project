const crypto = require('crypto');
const sjcl = require('sjcl');

const expirations = {};

exports.genPassPhrase = () => {
  const rand = (Math.random() * 20).toString();
  // Generate random md5 hash for passphrase
  const passphrase = crypto.createHash('md5').update(rand).digest('hex');
  return passphrase.substring(0, 5);
};

exports.encryptMessage = (urlHash, messageText, date) =>
  new Promise((resolve, reject) => {
    try {
      const encrypted = sjcl.encrypt(urlHash, messageText);
      expirations[urlHash] = date;
      return resolve(Buffer.from(encrypted, 'ascii').toString('base64'));
    } catch (e) {
      return reject(e);
    }
  });

exports.decryptMessage = (urlHash, encryptedMessage) =>
  new Promise((resolve, reject) => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    if (expirations[urlHash].getFullYear() >= year) {
      if (expirations[urlHash].getMonth() >= month) {
        if (expirations[urlHash].getDate() >= day) {
          // valid date, continue with decryption
          const decodedMessage = Buffer.from(encryptedMessage, 'base64').toString('ascii');
          // check if the urlHash is valid, if not return error message to client
          try {
            return resolve(sjcl.decrypt(urlHash, decodedMessage));
          } catch (e) {
            return reject('Invalid encrypted message');
          }
        }
      }
    }
    return reject('Message has expired');
  });
