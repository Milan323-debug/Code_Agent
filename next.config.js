/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['archive.org'],
  },
  env: {
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    NEXT_PUBLIC_GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY: process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': '.',
      '@/components': './components',
      '@/data': './data',
      '@/context': './context',
      '@/convex': './convex',
    };
    return config;
  },
}

module.exports = nextConfig 