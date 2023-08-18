/* eslint-disable no-console */
export default class CustomCrypto {
  private static iteration = 100000;
  private static encryptionAlgorithm = 'AES-GCM';
  private static ivLength = 12;
  private static saltLength = 16;
  private static digest = 'SHA-256'; // digest algorithms of string type.

  private static encoder = new TextEncoder();
  private static decoder = new TextDecoder();

  // encode Uint8Array to base64 string
  private static base64Encode(u8Array: Uint8Array): string {
    return btoa(String.fromCharCode.apply(undefined, [...u8Array]));
  }

  // decode base64 string to Uint8Array
  private static base64Decode(str: string): Uint8Array {
    return Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
  }

  // create a password based key (PBKDF2) that will be used to derive the AES-GCM key used for encryption/decryption.
  private static getPasswordKey(secretKey: string): Promise<CryptoKey> {
    return window.crypto.subtle.importKey(
      'raw',
      CustomCrypto.encoder.encode(secretKey),
      'PBKDF2',
      false,
      ['deriveKey'],
    );
  }

  // to derive a secret key from a master key for encryption/decryption
  private static deriveKey(
    passwordKey: CryptoKey,
    salt: Uint8Array,
    iteration: number,
    digest: string,
    encryptionAlgorithm: string,
    keyUsage: ['encrypt'] | ['decrypt'],
  ): Promise<CryptoKey> {
    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: iteration,
        hash: digest,
      },
      passwordKey,
      {
        name: encryptionAlgorithm,
        length: 256,
      },
      false,
      keyUsage,
    );
  }

  public static async encrypt(
    secretKey: string,
    data: string,
  ): Promise<string> {
    try {
      // generate random salt
      const salt = window.crypto.getRandomValues(
        new Uint8Array(CustomCrypto.saltLength),
      );

      const iv = window.crypto.getRandomValues(
        new Uint8Array(CustomCrypto.ivLength),
      );

      // create master key from vaultKey(secretkey)
      const passwordKey = await CustomCrypto.getPasswordKey(secretKey);

      // to derive a secret key from a master key for encryption
      // Create an AES-GCM key using the PBKDF2 key and a randomized salt value.
      const aesKey = await CustomCrypto.deriveKey(
        passwordKey,
        salt,
        CustomCrypto.iteration,
        CustomCrypto.digest,
        CustomCrypto.encryptionAlgorithm,
        ['encrypt'],
      );

      const encryptedContent = await window.crypto.subtle.encrypt(
        {
          name: CustomCrypto.encryptionAlgorithm,
          iv,
        },
        aesKey,
        CustomCrypto.encoder.encode(data),
      );

      // convert encrypted string to buffer
      const encryptedContentArr: Uint8Array = new Uint8Array(encryptedContent);

      // create buffer array with length [salt + iv + encryptedContentArr]
      const buff: Uint8Array = new Uint8Array(
        salt.byteLength + iv.byteLength + encryptedContentArr.byteLength,
      );

      // set salt at first postion
      buff.set(salt, 0);

      // set iv at second postion
      buff.set(iv, salt.byteLength);

      // set encrypted at third postion
      buff.set(encryptedContentArr, salt.byteLength + iv.byteLength);

      // encode the buffer array
      const base64Buff: string = CustomCrypto.base64Encode(buff);

      // return encrypted string
      return base64Buff;
    } catch (error) {
      console.error(`Error: ${error}`);
      return '';
    }
  }

  public static async decrypt(secretKey: string, ciphertext: string) {
    try {
      // Creates a new Buffer containing the given JavaScript string {str}
      const encryptedDataBuff = CustomCrypto.base64Decode(ciphertext);

      // extract salt from encrypted data
      const salt = encryptedDataBuff.slice(0, CustomCrypto.saltLength);

      // extract iv from encrypted data
      const iv = encryptedDataBuff.slice(
        CustomCrypto.saltLength,
        CustomCrypto.saltLength + CustomCrypto.ivLength,
      );

      // extract encrypted text from encrypted data
      const data = encryptedDataBuff.slice(
        CustomCrypto.saltLength + CustomCrypto.ivLength,
      );

      // create master key from secretKey
      const passwordKey = await CustomCrypto.getPasswordKey(secretKey);

      // to derive a secret key from a master key for decryption
      const aesKey = await CustomCrypto.deriveKey(
        passwordKey,
        salt,
        CustomCrypto.iteration,
        CustomCrypto.digest,
        CustomCrypto.encryptionAlgorithm,
        ['decrypt'],
      );

      // Return the buffer containing the value of cipher object.
      // Decrypt the input data using the AES-GCM key and the iv from the ArrayBuffer.
      const decryptedContent = await window.crypto.subtle.decrypt(
        {
          name: CustomCrypto.encryptionAlgorithm,
          iv,
        },
        aesKey,
        data,
      );

      // Returns the result of running encoding's decoder.
      return CustomCrypto.decoder.decode(decryptedContent);
    } catch (error) {
      console.error(`Error: ${error}`);
      return '';
    }
  }
}
