import CryptoJS from 'crypto-js';

export function hashPassword(password: string) {
  let hashedPassword = CryptoJS.SHA256(password);

  for (let i = 0; i < 10000; i++) {
    hashedPassword = CryptoJS.SHA256(hashedPassword.toString());
  }

  return hashedPassword.toString();
}

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
  const iv = vaultPassword.substring(0, 32);
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
      throw new Error('Unable to decrypt');
    }
  } else {
    throw new Error('Unable to decrypt vault');
  }
}
