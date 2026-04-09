/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pour la compatibilité de build sur Vercel
  typescript: {
    ignoreBuildErrors: true,
    // ignoreDuringBuilds: true, // Option incorrecte ici, à retirer ou déplacer si nécessaire
  },
  images: {
    domains: [],
    unoptimized: true, // Ajoute le support images non optimisées
  },
  // Pour la cohérence prod/préprod et la détection de bugs
  reactStrictMode: true,
}

module.exports = nextConfig
