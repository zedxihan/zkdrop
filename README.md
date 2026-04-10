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
> **Self-Destruction:** All uploaded files and their associated metadata are automatically purged after 6 hours. Once a link expires, the data is unrecoverable.

## 💖 Support Us

[![Patreon](https://img.shields.io/badge/Patreon-F96854?style=for-the-badge&logo=patreon&logoColor=white)](https://patreon.com/zedxihan)

> [!TIP]
> ⭐ **Star This Repository To Support The Developer And Encourage The Development Of CryptoLens!**

## Description

`zkDrop` provides a streamlined way to share files with true **Zero-Knowledge** end-to-end encryption. Every byte is encrypted locally in your browser using **AES-256-GCM** before reaching the server. Your private keys never leave your machine—they are stored only in the URL fragment (#), ensuring total privacy.

## Preview

**Live:** https://zkdrop.pages.dev

<img width="1730" height="936" alt="gg" src="https://github.com/user-attachments/assets/669938bf-430a-4fef-87e9-e91bbfb1de23" />

## Features

- **End-to-End Encryption:** Local AES-256-GCM encryption layers applied in the browser runtime.
- **Zero-Knowledge Architecture:** No login, no tracking, and no server-side access to your decryption keys.
- **Auto-Purge System:** Integrated Supabase Edge Functions automatically delete files after 6 hours.
- **Size Restricted:** Optimized for quick sharing with a 30MB file size limit.
- **Sketchy Aesthetic:** A unique UI built with `sketchbook-ui` featuring handwritten fonts and decorative elements.
- **Responsive Design:** Mobile-first approach using Tailwind CSS for seamless sharing on any device.

## Quick Start

Clone the project and run it locally with Bun.

```bash
# Clone the repository
git clone https://github.com/zedxihan/zkdrop.git
cd zkdrop

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
