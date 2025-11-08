export async function generateECDHKeyPair() {
  return await window.crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveKey", "deriveBits"]
  );
}

export async function exportPublicKey(pubKey) {
  const spki = await window.crypto.subtle.exportKey("spki", pubKey);
  return btoa(String.fromCharCode(...new Uint8Array(spki)));
}

export async function importPeerPublicKey(base64) {
  console.log("peer public key", base64)
  const binary = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  return await window.crypto.subtle.importKey(
    "spki",
    binary,
    { name: "ECDH", namedCurve: "P-256" },
    true,
    []
  );
}

export async function deriveConversationKey(myPrivateKey, theirPublicKey) {
  return await window.crypto.subtle.deriveKey(
    {
      name: "ECDH",
      public: theirPublicKey
    },
    myPrivateKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function encryptMessage(key, plaintext) {
  console.log(key)
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();
  const ciphertext = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(plaintext)
  );
  return {
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(ciphertext))),
    iv: btoa(String.fromCharCode(...iv))
  };
}

var tracker = []

export async function decryptMessage(key, ciphertextB64, ivB64) {
  console.log(await hashAESKeyToHex(key))
  const ciphertext = Uint8Array.from(atob(ciphertextB64), c => c.charCodeAt(0));
  const iv = Uint8Array.from(atob(ivB64), c => c.charCodeAt(0));
  const dec = new TextDecoder();
  const plaintext = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );
  return dec.decode(plaintext);
}

export async function cryptoToJWKKeyPair(keyPair) {
  const publicKey = await window.crypto.subtle.exportKey("jwk", keyPair.publicKey);
  const privateKey = await window.crypto.subtle.exportKey("jwk", keyPair.privateKey);
  return { publicKey, privateKey }
}


export async function jwkToCryptoKeyPair(jwkPair) {
  const privateKey = await crypto.subtle.importKey(
    "jwk",
    jwkPair.privateKey,
    {
      name: "ECDH",
      namedCurve: jwkPair.privateKey.crv // "P-256"
    },
    true,                // extractable
    ["deriveKey", "deriveBits"] // matches key_ops
  );

  const publicKey = await crypto.subtle.importKey(
    "jwk",
    jwkPair.publicKey,
    {
      name: "ECDH",
      namedCurve: jwkPair.publicKey.crv // "P-256"
    },
    true,                // extractable
    []                   // matches key_ops
  )

  return { publicKey, privateKey };
}



export async function storeKeyPair(conversationId, keyPair) {
  const publicKeyJwk = await window.crypto.subtle.exportKey("jwk", keyPair.publicKey);
  const privateKeyJwk = await window.crypto.subtle.exportKey("jwk", keyPair.privateKey);
  localStorage.setItem("myKeyPair_" + conversationId, JSON.stringify({ publicKeyJwk, privateKeyJwk }));
}


export async function loadKeyPair(conversationId) {
  const keyPairJson = localStorage.getItem("myKeyPair_" + conversationId);
  if (!keyPairJson) return null;
  const { publicKeyJwk, privateKeyJwk } = JSON.parse(keyPairJson);

  const publicKey = await window.crypto.subtle.importKey(
    "jwk",
    publicKeyJwk,
    { name: "ECDH", namedCurve: "P-256" },
    true,
    []
  );

  const privateKey = await window.crypto.subtle.importKey(
    "jwk",
    privateKeyJwk,
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveKey", "deriveBits"]
  );

  return { publicKey, privateKey };
}


// Stores an AES-GCM CryptoKey in localStorage (for development only)
export async function storeAESKey(conversationId, aesKey) {
  const jwk = await window.crypto.subtle.exportKey("jwk", aesKey);
  localStorage.setItem("aesKey_" + conversationId, JSON.stringify(jwk));
}

// Loads an AES-GCM CryptoKey from localStorage (for development only)
export async function loadAESKey(conversationId) {
  const jwkStr = localStorage.getItem("aesKey_" + conversationId);
  if (!jwkStr) return null;
  const jwk = JSON.parse(jwkStr);
  return await window.crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "AES-GCM" },
    true,
    ["encrypt", "decrypt"]
  );
}



// Hash an AES CryptoKey and return a hex string
export async function hashAESKeyToHex(aesKey) {
  // Export the key as raw bytes
  const rawKey = await window.crypto.subtle.exportKey("raw", aesKey);
  // Hash the raw key bytes
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", rawKey);
  // Convert hash buffer to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}


// Hash ArrayBuffer -> hex
export async function digestHex(arrayBuffer) {
  const buf = await window.crypto.subtle.digest("SHA-256", arrayBuffer);
  const arr = Array.from(new Uint8Array(buf));
  return arr.map(b => b.toString(16).padStart(2, "0")).join("");
}

// Hash public ECDH key (SPKI DER) -> hex, canonical across export/import
export async function hashPublicKeySpkiHex(pubKey) {
  const spki = await window.crypto.subtle.exportKey("spki", pubKey);
  return await digestHex(spki);
}



export async function generateAndStorePrekeys() {
  const prekeys = []
  const stored_prekeys = {}

  for (let i = 0; i < 10; i++) {
    const keypair = await generateECDHKeyPair()
    const prekey = await exportPublicKey(keypair.publicKey)
    prekeys.push(prekey)
    // to be stored locally
    stored_prekeys[prekey] = await cryptoToJWKKeyPair(keypair)
  }

  localStorage.setItem("preKeys", JSON.stringify(stored_prekeys))
  return prekeys
}



// --- tiny helpers
function assertEqual(a, b, msg) {
  if (a !== b) {
    console.error("ASSERT FAIL:", msg, { a, b });
    throw new Error(msg + ` (a=${a}, b=${b})`);
  } else {
    console.log("ASSERT OK:", msg);
  }
}

async function hashHex(key) {
  return await hashAESKeyToHex(key); // uses your provided function
}

// --- test 1: ECDH must derive identical AES keys on both ends
async function testECDHProducesSameAES() {
  console.log("Test 1: ECDH derives identical AES-GCM keys on both sides");

  // Simulate two users: Alice and Bob
  const alice = await generateECDHKeyPair();
  const bob = await generateECDHKeyPair();

  // Exchange public keys
  const alicePubB64 = await exportPublicKey(alice.publicKey);
  const bobPubB64 = await exportPublicKey(bob.publicKey);

  const bobPubForAlice = await importPeerPublicKey(bobPubB64);
  const alicePubForBob = await importPeerPublicKey(alicePubB64);

  // Derive AES keys at both ends
  const aliceAES = await deriveConversationKey(alice.privateKey, bobPubForAlice);
  const bobAES = await deriveConversationKey(bob.privateKey, alicePubForBob);

  // Hash and compare
  const aliceHash = await hashHex(aliceAES);
  const bobHash = await hashHex(bobAES);

  console.log("Alice AES hash:", aliceHash);
  console.log("Bob   AES hash:", bobHash);

  assertEqual(aliceHash, bobHash, "ECDH-derived AES keys must match");
  console.log("PASS: Test 1 OK");
}

// --- test 2: Store/Load AES key round-trip must preserve AES key exactly
async function testStoreLoadAESKey(conversationId = "conv_test_store_load_1") {
  console.log("Test 2: storeAESKey/loadAESKey preserves AES-GCM key exactly");

  // Fresh key derivation
  const a = await generateECDHKeyPair();
  const b = await generateECDHKeyPair();

  const aPubB64 = await exportPublicKey(a.publicKey);
  const bPubB64 = await exportPublicKey(b.publicKey);

  const bPubForA = await importPeerPublicKey(bPubB64);
  const aPubForB = await importPeerPublicKey(aPubB64);

  const aAES = await deriveConversationKey(a.privateKey, bPubForA);
  const bAES = await deriveConversationKey(b.privateKey, aPubForB);

  const aHash = await hashHex(aAES);
  const bHash = await hashHex(bAES);
  assertEqual(aHash, bHash, "Pre-store: derived AES keys should match");

  await storeAESKey(conversationId, aAES);
  const reloadedAES = await loadAESKey(conversationId);
  if (!reloadedAES) throw new Error("Reloaded AES key is null/undefined");

  const reloadHash = await hashHex(reloadedAES);
  console.log("Original hash:", aHash);
  console.log("Reloaded hash:", reloadHash);

  assertEqual(aHash, reloadHash, "Stored/reloaded AES key must match original");
  console.log("PASS: Test 2 OK");
}

// --- test 3: Different pairs should not match
async function testDifferentPairsProduceDifferentKeys() {
  console.log("Test 3: different ECDH pairs should not match AES key");

  const u1 = await generateECDHKeyPair();
  const v1 = await generateECDHKeyPair();

  const u2 = await generateECDHKeyPair();
  const v2 = await generateECDHKeyPair();

  const u1Pub = await exportPublicKey(u1.publicKey);
  const v1Pub = await exportPublicKey(v1.publicKey);
  const u2Pub = await exportPublicKey(u2.publicKey);
  const v2Pub = await exportPublicKey(v2.publicKey);

  const v1ForU1 = await importPeerPublicKey(v1Pub);
  const u1ForV1 = await importPeerPublicKey(u1Pub);
  const v2ForU2 = await importPeerPublicKey(v2Pub);
  const u2ForV2 = await importPeerPublicKey(u2Pub);

  const aes1a = await deriveConversationKey(u1.privateKey, v1ForU1);
  const aes1b = await deriveConversationKey(v1.privateKey, u1ForV1);
  const aes2a = await deriveConversationKey(u2.privateKey, v2ForU2);
  const aes2b = await deriveConversationKey(v2.privateKey, u2ForV2);

  const h1a = await hashHex(aes1a);
  const h1b = await hashHex(aes1b);
  const h2a = await hashHex(aes2a);
  const h2b = await hashHex(aes2b);

  assertEqual(h1a, h1b, "Pair 1 keys must match");
  assertEqual(h2a, h2b, "Pair 2 keys must match");

  if (h1a === h2a) {
    throw new Error("Unexpected: different ECDH pairs produced same AES key");
  }
  console.log("PASS: Test 3 OK");
}

// --- test 4: Store/Load ECDH KeyPair round-trip and derive AES equivalence
async function testStoreLoadKeyPairRoundTrip(conversationIdAlice = "conv_kp_alice", conversationIdBob = "conv_kp_bob") {
  console.log("Test 4: storeKeyPair/loadKeyPair round-trip preserves ECDH keys for derivation equivalence");

  // Generate Alice and Bob ECDH pairs
  const alice = await generateECDHKeyPair();
  const bob = await generateECDHKeyPair();

  // Save both to storage
  await storeKeyPair(conversationIdAlice, alice);
  await storeKeyPair(conversationIdBob, bob);

  // Reload both pairs
  const aliceReload = await loadKeyPair(conversationIdAlice);
  const bobReload = await loadKeyPair(conversationIdBob);

  if (!aliceReload || !bobReload) throw new Error("Failed to reload one or both key pairs");

  // Exchange public keys using reloads
  const alicePubB64 = await exportPublicKey(aliceReload.publicKey);
  const bobPubB64 = await exportPublicKey(bobReload.publicKey);

  const bobPubForAlice = await importPeerPublicKey(bobPubB64);
  const alicePubForBob = await importPeerPublicKey(alicePubB64);

  // Derive AES keys using reloaded pairs
  const aliceAES = await deriveConversationKey(aliceReload.privateKey, bobPubForAlice);
  const bobAES = await deriveConversationKey(bobReload.privateKey, alicePubForBob);

  // Compare hashes
  const aliceHash = await hashHex(aliceAES);
  const bobHash = await hashHex(bobAES);

  console.log("Alice(reloaded) AES hash:", aliceHash);
  console.log("Bob(reloaded)   AES hash:", bobHash);

  assertEqual(aliceHash, bobHash, "ECDH-derived AES must match with reloaded key pairs");
  console.log("PASS: Test 4 OK");
}

// --- run all
(async () => {
  try {
    await testECDHProducesSameAES();                 // equality via ECDH
    await testStoreLoadAESKey("conv_demo_aes_round"); // AES store/load
    await testDifferentPairsProduceDifferentKeys();   // negative control
    await testStoreLoadKeyPairRoundTrip("conv_kp_alice_1", "conv_kp_bob_1"); // keypair round-trip
    console.log("All tests passed.");
  } catch (e) {
    console.error("Test failure:", e);
  }
})();




