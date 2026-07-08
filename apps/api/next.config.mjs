/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['pdfkit', 'fontkit', 'sharp', '@aws-sdk/client-s3'],
  transpilePackages: ["@tecbunny/core", "@tecbunny/domain", "@tecbunny/infra", "@tecbunny/rpc", "@tecbunny/types"],
  experimental: {
    instrumentationHook: true,
    optimizePackageImports: ["@tecbunny/core"]
  },
};

export default nextConfig;
