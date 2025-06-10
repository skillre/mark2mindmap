/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_KEY: process.env.API_KEY || "default-api-key-for-development",
  },
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export default nextConfig; 