// services/keyService.js
// Higher-level client routines for device registration and key recovery.

import {
  deriveKey,
  generateIdentityKeyPair,
  encryptPrivateKey,
  decryptPrivateKey
} from './cryptoUtils';

export async function registerDevice(username, password) {
  // Register a new device: generate identity key, encrypt it, and upload.

  // 1. Generate the device’s identity key pair (ECDH X25519).
  const keyPair = await generateIdentityKeyPair();

  // 2. Derive an AES key from the user’s password.
  const passwordKey = await deriveKey(password);

  // 3. Encrypt the private key under the password-derived key.
  const encryptedKey = await encryptPrivateKey(keyPair.privateKey, passwordKey);

  // 4. Export the public key as JWK for server storage.
  const publicJwk = await crypto.subtle.exportKey('jwk', keyPair.publicKey);

  // 5. Send the username, public key, and encrypted private key to the server.
  await fetch('/api/devices/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, publicJwk, encryptedKey })
  });
}

export async function recoverDeviceKey(username, password) {
  // Recover this device’s private key after login using password.

  // 1. Derive the AES key from the user’s password.
  const passwordKey = await deriveKey(password);

  // 2. Fetch all encrypted-key blobs for this username.
  const res = await fetch(`/api/devices/blob?username=${username}`);
  const { blobs } = await res.json();

  // 3. Decrypt each blob to retrieve the private key(s).
  //    Here you may choose the relevant blob for this device.
  return decryptPrivateKey(blobs[0].encryptedKey, passwordKey);
}
