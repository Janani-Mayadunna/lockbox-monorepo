import * as crypto from 'crypto';

export function generateSalt() {
  return crypto.randomBytes(64).toString('hex');
}

export function generateUserKeyPair(): any {
  const userECDHKeyPair: crypto.ECDH = crypto.createECDH('secp256k1');

  userECDHKeyPair.generateKeys();

  const userPublicKey = userECDHKeyPair.getPublicKey().toString('base64');
  const userPrivateKey = userECDHKeyPair.getPrivateKey().toString('base64');

  return { userPublicKey, userPrivateKey };
}

export function restoreUserECDH(userPrivateKey: Buffer) {
  const userECDHKeyPair: crypto.ECDH = crypto.createECDH('secp256k1');
  userECDHKeyPair.setPrivateKey(userPrivateKey);

  return userECDHKeyPair;
}

export function computeSharedSecret(
  userPrivateKey: string,
  otherUserPublicKey: string,
): string {
  const privateKeyBuffer = Buffer.from(userPrivateKey, 'base64');
  const restoredUserECDHKeyPair = restoreUserECDH(privateKeyBuffer);

  const sharedSecret = restoredUserECDHKeyPair.computeSecret(
    otherUserPublicKey,
    'base64',
    'hex',
  );

  return sharedSecret;
}
