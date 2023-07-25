import CryptoJS from 'crypto-js';

export function hashPassword(password) {
  // (`${email}:${password}`)
  return CryptoJS.SHA256(password).toString();
}

//to generate the vault key original passowrd, email and the randomly generated salt stored on server is needed
// to get the salt original password and email is needed
export function generateVaultKey({ email, hashedPassword, salt }) {
  return CryptoJS.PBKDF2(`${email}:${hashedPassword}`, salt, {
    keySize: 32,
  }).toString();
}

export function decryptVault({ vault, vaultKey }) {
  const decrypted = CryptoJS.AES.decrypt(vault, vaultKey);

  if (decrypted) {
    try {
      const str = decrypted.toString(CryptoJS.enc.Utf8);
      if (str.length > 0) {
        return str;
      } else {
        return 'error 1';
      }
    } catch (e) {
      return 'error 2';
    }
  }
  return 'error 3';
}

export function encryptVault({ vault, vaultKey }) {
  return CryptoJS.AES.encrypt(vault, vaultKey).toString();
}