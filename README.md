<h1 align="center">zkDrop</h1>
<h3 align="center">Secure, temporary, and minimal file sharing with zero-knowledge encryption</h3>

<h1 align="center">
<a href="https://github.com/zedxihan/zkdrop">
<img src="https://img.shields.io/github/stars/zedxihan/zkdrop?style=for-the-badge&logo=github&labelColor=11140F&color=BBE9AA">
</a>
<a href="https://github.com/zedxihan/zkdrop/blob/main/LICENSE">
<img src="https://img.shields.io/github/license/zedxihan/zkdrop?style=for-the-badge&logo=gnu&labelColor=11140F&color=BBE9AA">
</a>
<a href="https://github.com/zedxihan/zkdrop/commits">
<img src="https://img.shields.io/github/last-commit/zedxihan/zkdrop?style=for-the-badge&logo=git&labelColor=11140F&color=BBE9AA">
</a>
<br>
<img src="https://skillicons.dev/icons?i=bun,ts,vite,react,tailwind,cloudflare">
</h1>

> [!WARNING]  
> **Privacy First:** zkDrop is a temporary file-sharing platform. While files are encrypted, the developer is not responsible for data loss due to link expiration or server-side purges.
>
> **Self-Destruction:** All uploaded files and their associated metadata are automatically purged after 24 hours. Once a link expires, the data is unrecoverable.

## 💖 Support Us

[![Patreon](https://img.shields.io/badge/Patreon-F96854?style=for-the-badge&logo=patreon&logoColor=white)](https://patreon.com/zedxihan)

> [!TIP]
> ⭐ **Star This Repository To Support The Developer And Encourage The Development Of CryptoLens!**

## Description

`zkDrop` provides a streamlined way to share files with true **Zero-Knowledge** end-to-end encryption. Every byte is encrypted locally in your browser using **AES-GCM** before reaching the server. Your private keys never leave your machine—they are stored only in the URL fragment (#), ensuring total privacy.

## Preview

**Live:** https://zkdrop.org

<img width="1560" height="936" alt="preview" src="https://github.com/user-attachments/assets/03a3294d-6f22-4210-8d22-4d37c5c65387" />

## Features

- **Zero-Knowledge:** Local AES-GCM encryption ensures your data stays private from everyone.
- **Off-Thread Crypto:** Web Workers keep the UI smooth during encryption/decryption.
- **Secure Sharing:** Private keys stay exclusively in the URL `#` fragment.
- **Frictionless:** No accounts, no logins, no tracking—just drop and share.
- **Self-Destructing:** Automatic 24-hour purging of all files and metadata.
- **Granular Progress:** Byte-level real-time feedback powered by **Axios**.
- **Modern UI:** Interactive aesthetic featuring `sketchbook-ui` and GSAP.
- **Serverless Stack:** High-performance architecture on **Cloudflare (Workers, D1, R2)**.
- **100MB Limit:** Optimized for quick, high-capacity secure transfers.

## 🚀 Quick Start (Development & Contribution)

### 1. Setup & Configuration

1. Clone and install project dependencies:
   ```bash
   git clone https://github.com/zedxihan/zkdrop.git
   cd zkdrop
   bun install && bun install --cwd backend
   ```
2. Create a **D1 Database** and **R2 Bucket** in your Cloudflare Dashboard, then update `backend/wrangler.toml` with your own D1 database and R2 bucket information:
   ```toml
   bucket_name = "your-bucket"
   database_id = "your-d1-id"
   ```
3. Initialize the D1 database schema for local development:
   ```bash
   bun --cwd backend wrangler d1 execute zkdrop-db --local --file=schema.sql
   ```
4. Create a `.env.local` file in the root directory to define your local API endpoint:
   ```env
   VITE_API_URL=http://localhost:8787
   ```

### 2. Local Development

To run the application locally, start both the backend worker and the frontend development server:

1. Start the Hono backend worker (Terminal 1):
   ```bash
   cd backend
   bun run dev
   ```
2. Start the Vite frontend server (Terminal 2):
   ```bash
   bun run dev
   ```

### 3. Deployment

To manually build the frontend and deploy the unified worker from your local machine:

```bash
bun run deploy
```

> [!IMPORTANT]
> Never use the default `database_id` in the repo; it belongs to the production instance and you will not have access to it.

## 🗺 Roadmap

- [x] Progress notifications for large files
- [ ] Password-protected links
- [ ] Custom expiration timers (1h, 12h, 24h)
- [ ] Multiple file uploads (ZIP creation)
- [ ] One-time download links (Burn after reading)

## Hacking

Contributions are welcome! If you have ideas for improving the encryption flow or the UI, feel free to submit a Pull Request.

## License

This repository is licensed under the GNU Affero General Public License v3.0.

Made with ❤️ by **zedxihan**
