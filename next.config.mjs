/** @type {import('next').NextConfig} */
const isStaticExport = process.env.NEXT_STATIC_EXPORT === '1';

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['next-sanity'],
  serverExternalPackages: ['sanity', '@sanity/client', '@sanity/vision'],
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
