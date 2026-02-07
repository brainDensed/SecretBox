export async function generateKey() {
  const keyPair = (await crypto.subtle.generateKey(
    {
      name: "X25519",
    },
    true,
    ["deriveKey"],
  )) as CryptoKeyPair;
  const exportedPublicKey = await crypto.subtle.exportKey(
    "raw",
    keyPair.publicKey,
  );
  const exportedPrivateKey = await crypto.subtle.exportKey(
    "pkcs8",
    keyPair.privateKey,
  );

  return {
    publicKey: btoa(String.fromCharCode(...new Uint8Array(exportedPublicKey))),
    privateKey: btoa(
      String.fromCharCode(...new Uint8Array(exportedPrivateKey)),
    ),
    keyPair,
  };
}

export async function deriveSharedSecret(
  sendersPrivateKey: CryptoKey,
  recipientsPublicKey: CryptoKey,
) {
  const sharedSecret = await crypto.subtle.deriveKey(
    {
      name: "X25519",
      public: recipientsPublicKey,
    },
    sendersPrivateKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
  const exportedSharedSecret = await crypto.subtle.exportKey(
    "raw",
    sharedSecret,
  );
  return {
    sharedSecret,
    exportedSharedSecret: btoa(
      String.fromCharCode(...new Uint8Array(exportedSharedSecret)),
    ),
  };
}

export async function encryptMessage(message: string, key: CryptoKey) {
  const enc = new TextEncoder();
  const encodedMessage = enc.encode(message);

  const iv = new Uint8Array(12);

  const encryptedMessage = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encodedMessage,
  );

  const exportedMessage = btoa(
    String.fromCharCode(...new Uint8Array(encryptedMessage)),
  );

  return {
    msg: encryptedMessage,
    exportedMsg: exportedMessage,
  };
}

export async function decryptMessage(secretKey: CryptoKey, ciphertext: ArrayBuffer) {
  const iv = new Uint8Array(12);
  const decryptedMsg = await crypto.subtle.decrypt({name: "AES-GCM", iv }, secretKey, ciphertext);
  const text = new TextDecoder().decode(decryptedMsg);
  return text;
}