import * as crypto from 'crypto';

export function generateSalt() {
  return crypto.randomBytes(64).toString('hex');
}

export function generateKeyPair(): crypto.ECDH {
  const keyPair: crypto.ECDH = crypto.createECDH('secp256k1');
  keyPair.generateKeys();
  const pubKey = keyPair.getPublicKey().toString('base64');
  console.log('Public Key: ', pubKey);
  const privKey = keyPair.getPrivateKey();
  keyPair.setPrivateKey(privKey);
  console.log('Private Key: ', privKey);

  const keyPair2: crypto.ECDH = crypto.createECDH('secp256k1');
  keyPair2.generateKeys();
  const pubKey2 = keyPair2.getPublicKey().toString('base64');
  console.log('Public Key: ', pubKey2);
  const privKey2 = keyPair2.getPrivateKey();
  console.log('Private Key: ', privKey2);

  const keyPair3: crypto.ECDH = crypto.createECDH('secp256k1');
  keyPair3.generateKeys();
  const pubKey3 = keyPair3.getPublicKey().toString('base64');
  console.log('Public Key: ', pubKey3);
  const privKey3 = keyPair3.getPrivateKey();
  console.log('Private Key: ', privKey3);

  const sharedSecret = keyPair.computeSecret(pubKey2, 'base64', 'hex');
  console.log('Shared Secret 1: ', sharedSecret);
  console.log('Key pair', keyPair);

  const sharedSecret2 = keyPair2.computeSecret(pubKey, 'base64', 'hex');
  console.log('Shared Secret 2: ', sharedSecret2);

  const sharedSecret3 = keyPair3.computeSecret(pubKey, 'base64', 'hex');
  console.log('Shared Secret 3: ', sharedSecret3);

  restoredECDH({ privateKey: privKey, publicKeyOther: pubKey2 });

  return keyPair;
}

export function restoredECDH({ privateKey, publicKeyOther }) {
  const restored: crypto.ECDH = crypto.createECDH('secp256k1');
  restored.setPrivateKey(privateKey);

  const sharedSecret = restored.computeSecret(publicKeyOther, 'base64', 'hex');
  console.log('Shared Secret 4: ', sharedSecret);

  generateUserPublicKey();
  generateUserPrivateKey();
}

// from here on

const userECDHKeyPair: crypto.ECDH = crypto.createECDH('secp256k1');
userECDHKeyPair.generateKeys();

export function generateUserPublicKey(): string {
  const userPublicKey = userECDHKeyPair.getPublicKey().toString('base64');
  console.log('User Public Key: ', userPublicKey);
  return userPublicKey;
}

export function generateUserPrivateKey(): Buffer {
  const userPrivateKey = userECDHKeyPair.getPrivateKey();
  console.log('User Private Key: ', userPrivateKey);
  return userPrivateKey;
}

export function restoreUserECDH(userPrivateKey: Buffer) {
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
  console.log('Shared Secret: ', sharedSecret);
  return sharedSecret;
}
