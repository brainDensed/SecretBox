import { Dispatch, SetStateAction, useState } from "react";
import {
  Transition,
} from "@headlessui/react";
import { secret } from "../page";
import { decryptMessage } from "../utils/crypto";

type secretBox = {
  secretKey: CryptoKey;
  secret: secret | null;
  setSecret: Dispatch<SetStateAction<secret | null>>;
};

export function SecretBox({ secretKey, secret, setSecret }: secretBox) {
  const [message, setMessage] = useState("");
  const [isDecrypting, setIsDecrypting] = useState(false);

  async function decrypt() {
    setIsDecrypting(true);
    // Add artificial delay for effect if needed, but for now just await
    try {
      const decrypted = await decryptMessage(secretKey, secret?.message!);
      setMessage(decrypted);
    } catch (e) {
      console.error("Decryption failed", e);
    } finally {
      setIsDecrypting(false);
    }
  }

  return (
    <Transition
      show={secret?.message ? true : false}
      enter="transition-all duration-300 ease-out"
      enterFrom="opacity-0 -translate-y-4 scale-95"
      enterTo="opacity-100 translate-y-0 scale-100"
      leave="transition-all duration-200 ease-in"
      leaveFrom="opacity-100 translate-y-0 scale-100"
      leaveTo="opacity-0 -translate-y-4 scale-95"
    >
      <div className="mt-6 w-full transform overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-800/50 p-6 text-left shadow-inner transition-all">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold leading-6 text-white">
              Secure Message
            </h3>
            <p className="mt-2 text-sm text-zinc-400">
              Received detailed encrypted payload from <span className="text-zinc-200 font-semibold">{secret?.sender}</span>
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-black/40 rounded-xl border border-zinc-800/50 overflow-hidden">
          <p className="text-xs font-semibold text-zinc-500 mb-3 uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
            Encrypted Payload
          </p>
          <div className="font-mono text-xs text-zinc-500 break-all leading-relaxed max-h-32 overflow-y-auto pr-2 custom-scrollbar">
            {secret?.hashed || "..."}
          </div>
        </div>

        {message && (
          <div className="mt-4 p-5 bg-emerald-950/20 rounded-xl border border-emerald-900/30 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="text-xs font-semibold text-emerald-500 mb-3 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Decrypted Message
            </p>
            <p className="text-emerald-100 text-sm leading-relaxed font-medium">
              {message}
            </p>
          </div>
        )}

        <div className="mt-8 flex gap-3 justify-end items-center">
          <button
            onClick={() => {
              setSecret(null);
              setMessage("");
              setIsDecrypting(false);
            }}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            Close
          </button>
          <button
            onClick={decrypt}
            disabled={!!message || isDecrypting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isDecrypting ? (
              "Decrypting..."
            ) : message ? (
              "Decrypted"
            ) : (
              "Decrypt Message"
            )}
          </button>
        </div>
      </div>
    </Transition>
  );
}
