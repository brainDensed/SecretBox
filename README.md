# SecretBox

SecretBox is a secure Peer-to-Peer (P2P) messaging application that demonstrates client-side encryption using the Web Crypto API. It allows two simulated users (Alice and Bob) to exchange encrypted messages within a single browser session.

## Features

-   **Zero-Knowledge Architecture:** All encryption and decryption happen client-side. The server (if there were one persisting data) would only see encrypted payloads.
-   **Elliptic Curve Cryptography:** Uses X25519 for key exchange to derive a shared secret.
-   **AES-GCM Encryption:** Messages are encrypted using AES-GCM with a 256-bit derived key and a unique IV.
-   **Live Simulation:** Visualizes the entire process of key generation, secret derivation, encryption, and decryption between two parties in real-time.
-   **Modern UI:** Built with Next.js 14 and Tailwind CSS for a sleek, responsive dark-mode interface.

## Tech Stack

-   **Framework:** [Next.js](https://nextjs.org/) (React)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Cryptography:** [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
-   **UI Components:** [Headless UI](https://headlessui.com/)

## Getting Started

### Prerequisites

-   Node.js 18+ installed on your machine.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/brainDensed/secretbox.git
    cd secretbox
    ```


2.  Install dependencies:
    ```bash
    pnpm install
    ```

3.  Run the development server:
    ```bash
    pnpm dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1.  **Key Generation:** Upon loading the page, both Alice and Bob automatically generate their public/private key pairs.
2.  **Shared Secret:** They automatically exchange public keys to derive a shared secret (ECDH).
3.  **Sending a Message:**
    -   Type a message in Alice's input box.
    -   Click **Encrypt** to see the encrypted payload state.
    -   Click **Send** to transmit the encrypted payload to Bob.
4.  **Receiving & Decrypting:**
    -   Bob receives a "Secure Message" notification listing the encrypted payload.
    -   Click **Decrypt Message** to use the shared secret to reveal the original text.
5.  **Reverse Flow:** The process works identically from Bob to Alice.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
