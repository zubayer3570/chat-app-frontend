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
