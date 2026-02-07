"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  deriveSharedSecret,
  encryptMessage,
  generateKey,
} from "../utils/crypto";
import { secret, secretKey, structuredKeyPair } from "../page";
import { SecretBox } from "./Modal";

type userKeyPair = {
  userKey: structuredKeyPair | null;
  setUserKey: ({ publicKey, privateKey, keyPair }: structuredKeyPair) => void;
  publicKey: CryptoKey | undefined;
  secret: secret | null;
  setSecret: Dispatch<SetStateAction<secret | null>>;
};

type encryptedMessage = {
  state: boolean;
  data: { msg: ArrayBuffer; exportedMsg: string } | null;
};

async function generate() {
  try {
    const cryptoKeys = await generateKey();
    return cryptoKeys;
  } catch (error) {
    console.error("Error generating key:", error);
  }
}

async function derive(privatekey: CryptoKey, publicKey: CryptoKey) {
  try {
    const sharedSecret = await deriveSharedSecret(privatekey, publicKey);
    return sharedSecret;
  } catch (error) {
    console.error("Error generating key:", error);
  }
}

async function encMessage(message: string, key: CryptoKey) {
  try {
    const encryptedMessage = await encryptMessage(message, key);
    return encryptedMessage;
  } catch (error) {
    console.error("Error encrypting message", error);
  }
}

export function AliceComponent({
  userKey,
  setUserKey,
  publicKey,
  secret,
  setSecret,
}: userKeyPair) {
  const [message, setMessage] = useState("");
  const [encrypted, setEncrypted] = useState<encryptedMessage>({
    state: false,
    data: null,
  });

  useEffect(() => {
    const keys = async () => {
      const generatedKeys = await generate();
      setUserKey({ ...generatedKeys! });
    };
    keys();
  }, []);

  async function getDerivedKey() {
    const derivedSecret: secretKey = (await derive(
      userKey!.keyPair.privateKey,
      publicKey!,
    )) as secretKey;
    setUserKey({
      ...userKey,
      sharedSecret: derivedSecret,
    } as structuredKeyPair);
  }

  useEffect(() => {
    if (userKey?.keyPair && publicKey && !userKey.sharedSecret) {
      getDerivedKey();
    }
  }, [userKey, publicKey]);

  async function encrypt() {
    if (userKey?.sharedSecret?.sharedSecret!) {
      const msg = await encMessage(
        message,
        userKey?.sharedSecret?.sharedSecret!,
      );
      setEncrypted({ state: true, data: msg! });
    }
  }

  function send() {
    setSecret({
      sender: "Alice",
      message: encrypted.data?.msg!,
      hashed: encrypted.data?.exportedMsg!,
    });
    setEncrypted({ state: false, data: null });
    setMessage("");
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></span>
          Alice
        </h2>
        <span className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
          Client A
        </span>
      </div>

      <div className="space-y-4 mb-8">
        <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800/50">
          <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">
            Public Key
          </label>
          <p className="font-mono text-xs text-zinc-400 break-all leading-relaxed">
            {userKey?.publicKey ? (
              userKey.publicKey
            ) : (
              <span className="text-zinc-700 italic">
                Waiting for key generation...
              </span>
            )}
          </p>
        </div>

        <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800/50">
          <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">
            Shared Secret
          </label>
          <p className="font-mono text-xs text-emerald-500 break-all leading-relaxed">
            {userKey?.sharedSecret?.exportedSharedSecret ? (
              userKey.sharedSecret.exportedSharedSecret
            ) : (
              <span className="text-zinc-700 italic">
                Pending connection...
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <input
          className="flex-1 bg-zinc-950 border border-zinc-700 text-zinc-200 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all placeholder:text-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={encrypted.state}
          placeholder="Type a secret message..."
          value={encrypted.state ? encrypted.data?.exportedMsg : message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-sm px-6 py-2.5 rounded-lg transition-colors shadow-lg shadow-cyan-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={encrypted.state ? send : encrypt}
        >
          {encrypted.state ? "Send" : "Encrypt"}
        </button>
      </div>
      {secret?.sender === "Bob" && (
        <SecretBox
          secretKey={userKey?.sharedSecret?.sharedSecret!}
          secret={secret}
          setSecret={setSecret}
        />
      )}
    </div>
  );
}

export function BobComponent({
  userKey,
  setUserKey,
  publicKey,
  secret,
  setSecret,
}: userKeyPair) {
  const [message, setMessage] = useState("");
  const [encrypted, setEncrypted] = useState<encryptedMessage>({
    state: false,
    data: null,
  });

  useEffect(() => {
    const keys = async () => {
      const generatedKeys = await generate();
      setUserKey({ ...generatedKeys! });
    };
    keys();
  }, []);

  async function getDerivedKey() {
    const derivedSecret: secretKey = (await derive(
      userKey!.keyPair.privateKey,
      publicKey!,
    )) as secretKey;
    setUserKey({
      ...userKey,
      sharedSecret: derivedSecret,
    } as structuredKeyPair);
  }

  useEffect(() => {
    if (userKey?.keyPair && publicKey && !userKey.sharedSecret) {
      getDerivedKey();
    }
  }, [userKey, publicKey]);

  async function encrypt() {
    if (userKey?.sharedSecret?.sharedSecret!) {
      const msg = await encMessage(
        message,
        userKey?.sharedSecret?.sharedSecret!,
      );
      setEncrypted({ state: true, data: msg! });
    }
  }

  function send() {
    setSecret({
      sender: "Bob",
      message: encrypted.data?.msg!,
      hashed: encrypted.data?.exportedMsg!,
    });
    setEncrypted({ state: false, data: null });
    setMessage("");
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></span>
          Bob
        </h2>
        <span className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
          Client B
        </span>
      </div>

      <div className="space-y-4 mb-8">
        <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800/50">
          <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">
            Public Key
          </label>
          <p className="font-mono text-xs text-zinc-400 break-all leading-relaxed">
            {userKey?.publicKey ? (
              userKey.publicKey
            ) : (
              <span className="text-zinc-700 italic">
                Waiting for key generation...
              </span>
            )}
          </p>
        </div>

        <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800/50">
          <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">
            Shared Secret
          </label>
          <p className="font-mono text-xs text-emerald-500 break-all leading-relaxed">
            {userKey?.sharedSecret?.exportedSharedSecret ? (
              userKey.sharedSecret.exportedSharedSecret
            ) : (
              <span className="text-zinc-700 italic">
                Pending connection...
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <input
          className="flex-1 bg-zinc-950 border border-zinc-700 text-zinc-200 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={encrypted.state}
          placeholder="Type a secret message..."
          value={encrypted.state ? encrypted.data?.exportedMsg : message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm px-6 py-2.5 rounded-lg transition-colors shadow-lg shadow-indigo-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={encrypted.state ? send : encrypt}
        >
          {encrypted.state ? "Send" : "Encrypt"}
        </button>
      </div>
      {secret?.sender === "Alice" && (
        <SecretBox
          secretKey={userKey?.sharedSecret?.sharedSecret!}
          secret={secret}
          setSecret={setSecret}
        />
      )}
    </div>
  );
}
