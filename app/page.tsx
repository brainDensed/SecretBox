"use client";
import { AliceComponent, BobComponent } from "./components/users";
import { useState } from "react";

export type secretKey = {
  sharedSecret: CryptoKey;
  exportedSharedSecret: string;
};

export type structuredKeyPair = {
  publicKey: string;
  privateKey: string;
  keyPair: CryptoKeyPair;
  sharedSecret?: secretKey;
};

export type secret = {
  sender: string;
  message: ArrayBuffer;
  hashed: string;
}

export default function Home() {
  const [aliceKey, setAliceKey] = useState<structuredKeyPair | null>(null);
  const [bobKey, setBobKey] = useState<structuredKeyPair | null>(null);
  const [secret, setSecret] = useState<secret | null>(null);
  return (
    <div className="container mx-auto p-4 min-h-screen">
      <header className="mb-8 text-center pt-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
          SecretBox
        </h1>
        <p className="text-zinc-400 mt-2">Secure P2P Messaging</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AliceComponent
          userKey={aliceKey}
          setUserKey={setAliceKey}
          publicKey={bobKey?.keyPair.publicKey}
          secret={secret}
          setSecret={setSecret}
        />
        <BobComponent
          userKey={bobKey}
          setUserKey={setBobKey}
          publicKey={aliceKey?.keyPair.publicKey}
          secret={secret}
          setSecret={setSecret}
        />
      </div>
    </div>
  );
}
