/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['pdfkit', 'fontkit', 'sharp', '@aws-sdk/client-s3', 'nodemailer', 'bullmq'],
  experimental: {
    instrumentationHook: true
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push(({ context, request }, callback) => {
        const externalModules = ['pdfkit', 'fontkit', 'sharp', '@aws-sdk/client-s3', 'nodemailer', 'bullmq'];
        
        // Match explicit module names
        if (externalModules.includes(request)) {
          return callback(null, 'commonjs ' + request);
        }
        
        // Match absolute paths containing node_modules/module_name
        for (const mod of externalModules) {
          if (request && typeof request === 'string' && request.includes(`node_modules/${mod}`)) {
            return callback(null, 'commonjs ' + mod);
          }
        }
        
        callback();
      });
    }
    return config;
  }
};

export default nextConfig;
