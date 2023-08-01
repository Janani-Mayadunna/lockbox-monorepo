import CryptoJS from 'crypto-js';

export function hashPassword(password: string) {
  // (`${email}:${password}`)
  return CryptoJS.SHA256(password).toString();
}

//to generate the vault key original passowrd, email and the randomly generated salt stored on server is needed
// to get the salt original password and email is needed
export function generateVaultKey({
  email,
  hashedPassword,
  salt,
}: {
  email: string;
  hashedPassword: string;
  salt: any;
}) {
  return CryptoJS.PBKDF2(`${email}:${hashedPassword}`, salt, {
    keySize: 32,
  }).toString();
}

export function encryptVault({
  vaultPassword,
  vaultKey,
}: {
  vaultPassword: string;
  vaultKey: string;
}) {
  const iv = CryptoJS.lib.WordArray.random(16);

  const encrypted = CryptoJS.AES.encrypt(vaultPassword, vaultKey, {
    iv: iv,
  }).toString();

  return `${iv.toString()}${encrypted}`;
}

export function decryptVault({
  vaultPassword,
  vaultKey,
}: {
  vaultPassword: string;
  vaultKey: string;
}) {
  // get the iv which is in the first 16 characters
  const iv = vaultPassword.substring(0, 32);
  // get the encrypted vaultPassword which is the rest of the string
  vaultPassword = vaultPassword.substring(32);

  const decrypted = CryptoJS.AES.decrypt(vaultPassword, vaultKey, {
    iv: CryptoJS.enc.Hex.parse(iv),
  });

  if (decrypted) {
    try {
      const str = decrypted.toString(CryptoJS.enc.Utf8);
      if (str.length > 0) {
        return str;
      }
    } catch (error: any) {
      throw new Error('Unable to decrypt', error.message);
    }
  } else {
    throw new Error('Unable to decrypt vault');
  }
}
