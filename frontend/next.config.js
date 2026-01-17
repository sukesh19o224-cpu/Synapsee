/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  
  // Environment variables available to the client
  env: {
    NEXT_PUBLIC_APPWRITE_ENDPOINT: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
    NEXT_PUBLIC_APPWRITE_PROJECT_ID: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  },

  // Rewrites for service proxying
  async rewrites() {
    return [
      {
        source: '/api/elabftw/:path*',
        destination: 'http://elabftw:443/:path*',
      },
      {
        source: '/api/onlyoffice/:path*',
        destination: 'http://onlyoffice:80/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
