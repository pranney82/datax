/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      // ... other domains if any
      'www.builtwithlovellc.com',
      'maps.googleapis.com',
      'www.shadcnblocks.com',
      'www.shadcn.com',
      'firebasestorage.googleapis.com'
    ],
  },
  // ... rest of your config
}

export default nextConfig;
