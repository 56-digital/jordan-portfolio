/** @type {import('next').NextConfig} */
const isStaticExport = process.env.NEXT_STATIC_EXPORT === '1';

const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['sanity', 'next-sanity', '@sanity/client', '@sanity/vision'],
  ...(isStaticExport
    ? {
        output: 'export',
        images: {
          unoptimized: true
        }
      }
    : {})
};

export default nextConfig;
