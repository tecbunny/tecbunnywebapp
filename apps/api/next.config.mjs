/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['pdfkit', 'fontkit', 'sharp', '@aws-sdk/client-s3', 'nodemailer', 'bullmq'],
  experimental: {
    instrumentationHook: true
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push(({ context, request }, callback) => {
        if (['pdfkit', 'fontkit', 'sharp', '@aws-sdk/client-s3', 'nodemailer', 'bullmq'].includes(request)) {
          return callback(null, 'commonjs ' + request);
        }
        callback();
      });
    }
    return config;
  }
};

export default nextConfig;
