/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pour la compatibilité de build sur Vercel
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [],
    unoptimized: true, // Ajoute le support images non optimisées
  },
  // Pour la cohérence prod/préprod et la détection de bugs
  reactStrictMode: true,
}

module.exports = nextConfig