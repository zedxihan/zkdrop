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

Powered by **Cloudflare Workers**, **D1** (SQL storage), and **R2** (Object storage), with granular byte-level progress tracking via **Axios**.

## Preview

**Live:** https://zkdrop.pages.dev

<img width="1650" height="936" alt="preview" src="https://github.com/user-attachments/assets/ea44a95a-6cd4-474d-9958-e68c7e2ce972" />

## Features

- **True Zero-Knowledge:** Local AES-GCM encryption hides data and metadata before it ever leaves the browser.
- **Off-Thread Crypto:** Encryption/decryption handled in Web Workers to keep the UI responsive.
- **Secure Sharing:** Private keys stay exclusively in the URL `#` fragment, ensuring no one (not even the server) can read your files.
- **Frictionless Experience:** No accounts, no logins, no tracking.
- **Self-Destructing:** Automated background cleanup for both R2 objects and D1 records every 24 hours.
- **Granular Progress:** Byte-level tracking for uploads and downloads, providing real-time feedback even for small files.
- **Interactive Aesthetic:** A sleek, playful UI featuring `sketchbook-ui`, animated dot-grids, and GSAP interactions.
- **Modern Performance:** Built on Vite, React 19, and Bun for a lightning-fast experience.
- **High Capacity:** Mobile-first design optimized for quick drops with a **100MB** file size limit.

## Quick Start

### Frontend Setup
Clone the project and run it locally with Bun.

```bash
# Clone the repository
git clone https://github.com/zedxihan/zkdrop.git
cd zkdrop

# Install dependencies
bun install

# Create a branch for your feature
git switch -c feat/my-awesome-feature

# Start the development server
bun run dev
```

### Backend Deployment (Cloudflare)
Navigate to the `backend` directory to deploy the Worker and Database.

```bash
cd backend
# Create D1 database and R2 bucket in Cloudflare dashboard first
# Then run migrations:
npx wrangler d1 execute zkdrop-db --remote --file=schema.sql

# Deploy the worker
npx wrangler deploy
```

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
