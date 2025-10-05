// utils/cryptoUtils.js
// Provides low-level cryptographic utilities: key derivation, key generation, encryption/decryption.

import { subtle } from 'crypto';  
// Import Web Crypto SubtleCrypto from the browser (polyfilled via node crypto for server-side).

const KDF_SALT = new Uint8Array([/* 16 random bytes here for PBKDF2 salt */]);
// A fixed salt value for PBKDF2. In production, use a per-user salt stored alongside the encrypted blob.

export async function deriveKey(password) {
  // Derive a symmetric AES-GCM key from the user’s password using PBKDF2.
  const enc = new TextEncoder();
  // TextEncoder to convert string to Uint8Array.
  const baseKey = await subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  // Import the raw password bytes as a key for PBKDF2 derivation.
  return subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: KDF_SALT,
      iterations: 200000,
      hash: 'SHA-256'
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
  // Derive a 256-bit AES-GCM key, usable for both encryption and decryption.
}

export async function generateIdentityKeyPair() {
  // Generate an X25519 key pair for ECDH (device identity key).
  return subtle.generateKey(
    { name: 'ECDH', namedCurve: 'X25519' },
    true,
    ['deriveKey']
  );
  // Returns { publicKey, privateKey }.
}

export async function encryptPrivateKey(privateKey, passwordKey) {
  // Encrypt the device’s private key JWK under the password-derived AES key.
  const jwk = await subtle.exportKey('jwk', privateKey);
  // Export the privateKey as JWK JSON.
  const iv = crypto.getRandomValues(new Uint8Array(12));
  // Generate a unique 12-byte IV for AES-GCM.
  const ciphertext = await subtle.encrypt(
    { name: 'AES-GCM', iv },
    passwordKey,
    new TextEncoder().encode(JSON.stringify(jwk))
  );
  // Encrypt the JWK JSON bytes.
  return { iv: Array.from(iv), blob: Array.from(new Uint8Array(ciphertext)) };
  // Return IV and ciphertext as arrays of numbers for JSON transport.
}

export async function decryptPrivateKey(encrypted, passwordKey) {
  // Decrypt the encrypted private-key blob using the password-derived AES key.
  const iv = new Uint8Array(encrypted.iv);
  // Reconstruct IV Uint8Array.
  const data = new Uint8Array(encrypted.blob);
  // Reconstruct ciphertext Uint8Array.
  const decrypted = await subtle.decrypt(
    { name: 'AES-GCM', iv },
    passwordKey,
    data
  );
  // Decrypt to obtain JWK JSON bytes.
  const jwk = JSON.parse(new TextDecoder().decode(decrypted));
  // Parse JWK JSON.
  return subtle.importKey(
    'jwk',
    jwk,
    { name: 'ECDH', namedCurve: 'X25519' },
    true,
    ['deriveKey']
  );
  // Re-import and return the privateKey object.
}

export async function deriveSharedSecret(privateKey, publicKey) {
  // Perform ECDH to derive a shared AES-GCM key for session encryption.
  return subtle.deriveKey(
    { name: 'ECDH', public: publicKey },
    privateKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
  // Returns a CryptoKey for symmetric AES-GCM operations.
}
