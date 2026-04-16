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
<img src="https://skillicons.dev/icons?i=bun,ts,vite,react,tailwind,supabase">
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

`zkDrop` provides a streamlined way to share files with true **Zero-Knowledge** end-to-end encryption. Every byte is encrypted locally in your browser using **AES-256-GCM** before reaching the server. Your private keys never leave your machine—they are stored only in the URL fragment (#), ensuring total privacy.

## Preview

**Live:** https://zkdrop.pages.dev

<img width="1650" height="936" alt="preview" src="https://github.com/user-attachments/assets/ea44a95a-6cd4-474d-9958-e68c7e2ce972" />

## Features

- **True Zero-Knowledge:** Local AES-256-GCM encryption hides data and metadata before it ever leaves the browser.
- **Secure Sharing:** Private keys stay exclusively in the URL `#` fragment, paired with a dedicated UI for seamless downloads.
- **Frictionless Experience:** Absolutely no accounts, logins, or tracking required—just drop a file and get a link.
- **Self-Destructing:** Files remain strictly temporary and are automatically purged after 24 hours.
- **Interactive Aesthetic:** A sleek, playful UI featuring `sketchbook-ui`, animated dot-grids, and GSAP interactions.
- **Modern Performance:** Built on Vite, React 19, and Bun to deliver a lightning-fast frontend.
- **Fast & Responsive:** A mobile-first design optimized for quick drops with a 30MB file size limit.

## Quick Start

Clone the project and run it locally with Bun.

```bash
# Clone the repository
git clone https://github.com/zedxihan/zkdrop.git
cd zkdrop

# Create & switch to your branch
git switch -c feature/awsome-feature

# Install dependencies
bun install

# Start the development server
bun run dev
```

Open: http://localhost:5173

> [!NOTE]
> You'll need to configure your own `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your environment variables.

## 🗺 Roadmap

- Password-protected links
- Custom expiration timers (1h, 12h, 24h)
- Multiple file uploads (ZIP creation)
- One-time download links (Burn after reading)
- Progress notifications for large files

## Hacking

Contributions are welcome! If you have ideas for improving the encryption flow or the UI, feel free to submit a Pull Request.

## License

This repository is licensed under the GNU Affero General Public License v3.0.

Made with ❤️ by **zedxihan**
