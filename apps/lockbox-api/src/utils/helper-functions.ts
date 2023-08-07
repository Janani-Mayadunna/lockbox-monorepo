import * as crypto from 'crypto';

export function generateSalt() {
  return crypto.randomBytes(64).toString('hex');
}

export function generateUserKeyPair(): any {
  const userECDHKeyPair: crypto.ECDH = crypto.createECDH('secp256k1');
  userECDHKeyPair.generateKeys();
  const userPublicKey = userECDHKeyPair.getPublicKey().toString('base64');
  const userPrivateKey = userECDHKeyPair.getPrivateKey();
  return { userPublicKey, userPrivateKey };
}

export function restoreUserECDH(userPrivateKey: Buffer) {
  const userECDHKeyPair: crypto.ECDH = crypto.createECDH('secp256k1');
  userECDHKeyPair.setPrivateKey(userPrivateKey);
  return userECDHKeyPair;
}

export function computeSharedSecret(
  userPrivateKey: Buffer,
  otherUserPublicKey: string,
): string {
  const restoredUserECDHKeyPair = restoreUserECDH(userPrivateKey);
  const sharedSecret = restoredUserECDHKeyPair.computeSecret(
    otherUserPublicKey,
    'base64',
    'hex',
  );
  return sharedSecret;
}
