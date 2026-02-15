# 🎂 WishVault

**WishVault** is a premium, interactive birthday experience that transforms a standard greeting into an immersive digital journey. Instead of a static card, recipients participate in a story-driven "unlock" sequence to reveal their birthday surprises.

![Project Preview](https://via.placeholder.com/800x450.png?text=WishVault+Preview)

## ✨ Features

-   **Memory Unlock Gameplay**: A story-driven interactive sequence where recipients "unlock" specific memories (images) to progress.
-   **Zero-Backend Privacy**: Employs a unique privacy-first architecture where all personal data (names, photos, messages) is compressed with **LZ-String** and encoded directly into the URL hash. **No data ever touches a server.**
-   **Intelligent Image Pipeline**: Client-side image processing that optimizes and compresses high-resolution photos (up to 93% reduction) for efficient URL-based sharing.
-   **Dynamic Themes**: Multiple visual aesthetics (Vibrant, Dreamy, Starry, Retro) that adapt the entire experience—from typography and palettes to animation styles.
-   **Responsive & Animated**: Built with **Framer Motion** and **Tailwind CSS** for a butter-smooth, mobile-first experience.

## 🛠️ Tech Stack

-   **Frontend**: React 18, TypeScript, Vite
-   **Animations**: Framer Motion
-   **Styling**: Tailwind CSS
-   **Utilities**: LZ-String (Compression), Howler.js (Audio)
-   **Deployment**: Vercel / Netlify (Static Hosting)

## 🔐 Privacy & Security

WishVault was designed with a "Private by Design" philosophy. 
-   **No Database**: No user data is stored on any server.
-   **Client-Side Only**: Image compression and encoding happen entirely within the user's browser.
-   **Ephemeral & Secure**: The "Vault" is only accessible to those with the unique, encoded URL.

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/WishVault.git

# Install dependencies
npm install

# Run the development server
npm run dev
```

## 📜 License

MIT
